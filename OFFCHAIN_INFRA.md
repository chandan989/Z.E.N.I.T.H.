# Z.E.N.I.T.H. Off-Chain Infrastructure with Supabase

This document outlines a fully functional off-chain architecture for Z.E.N.I.T.H. using Supabase. This approach leverages Supabase for its integrated PostgreSQL database, authentication, serverless functions, and real-time capabilities.

---

## 1. Supabase Architecture Overview

-   **Database**: A managed PostgreSQL instance, which we will structure for our specific needs.
-   **Authentication**: Supabase Auth, integrated with a "Sign-In with Ethereum" (SIWE) flow for passwordless, wallet-based user accounts.
-   **Edge Functions**: Serverless Deno functions for handling custom logic, such as SIWE, and for running our blockchain indexer.
-   **Realtime**: A service that broadcasts database changes to authorized clients, perfect for live data on the frontend (e.g., order books, trade history).
-   **Auto-Generated API**: Supabase provides a PostgREST API out-of-the-box, allowing secure data access directly from the frontend via the `supabase-js` client library, governed by Row-Level Security policies.

---

## 2. Authentication: Sign-In with Ethereum (SIWE)

We will use Supabase Auth to manage users. The user's wallet address will be their primary identifier.

#### **Auth Flow:**

1.  **Frontend -> Get Nonce**: The frontend calls a Supabase Edge Function (`get-nonce`) to retrieve a unique, secure message (a nonce) for the user to sign.
2.  **User -> Sign Message**: The user signs the nonce with their MetaMask wallet.
3.  **Frontend -> Verify Signature**: The frontend sends the signature and the user's address to another Edge Function (`verify-signature`).
4.  **Edge Function -> Create User & JWT**: This function:
    a.  Verifies the signature against the nonce.
    b.  If valid, it uses the Supabase Service Role client to either find an existing user with that wallet address or create a new one in `auth.users`.
    c.  It generates a JWT (JSON Web Token) for the user and returns it to the frontend.
5.  **Frontend -> Set Session**: The `supabase-js` client uses this JWT to establish a secure user session.

---

## 3. Expanded PostgreSQL Schema

This schema includes tables for core data, user management, and application features. All tables should have **Row-Level Security (RLS)** enabled.

### Table: `profiles`

Links Supabase's `auth.users` to a user's wallet address and other public information.

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    username TEXT, -- Optional, user-can-set
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `onboarding_requests`

Tracks the status of domains being onboarded, mirroring the on-chain contract state.

```sql
CREATE TABLE onboarding_requests (
    id BIGINT PRIMARY KEY, -- The request ID from the GenesisEngine contract
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    domain_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- e.g., 'pending', 'verified', 'fulfilled', 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `assets`

Stores information about each fractionalized domain asset.

```sql
CREATE TABLE assets (
    token_id BIGINT PRIMARY KEY,                      -- The original ERC-721 token ID
    fraction_contract_address VARCHAR(42) UNIQUE NOT NULL,
    domain_name TEXT NOT NULL,
    token_symbol VARCHAR(10) NOT NULL,
    doma_score INT,
    total_supply NUMERIC(78, 0) NOT NULL,
    mint_date TIMESTAMPTZ NOT NULL,
    onboarding_tx_hash VARCHAR(66) NOT NULL
);
```

### Table: `trades`

Logs every individual trade from the `Exchange.sol` contract.

```sql
CREATE TABLE trades (
    id SERIAL PRIMARY KEY,
    fraction_contract_address VARCHAR(42) REFERENCES public.assets(fraction_contract_address),
    amount NUMERIC(78, 0) NOT NULL,
    price NUMERIC(78, 0) NOT NULL,
    trade_timestamp TIMESTAMPTZ NOT NULL,
    tx_hash VARCHAR(66) UNIQUE NOT NULL
);
```

### Table: `market_summary`

Stores aggregated OHLCV data for charts.

```sql
CREATE TABLE market_summary (
    id SERIAL PRIMARY KEY,
    fraction_contract_address VARCHAR(42) REFERENCES public.assets(fraction_contract_address),
    summary_timestamp TIMESTAMPTZ NOT NULL,
    period VARCHAR(10) NOT NULL, -- 'HOURLY', 'DAILY'
    open_price NUMERIC, high_price NUMERIC, low_price NUMERIC, close_price NUMERIC, volume NUMERIC,
    UNIQUE(fraction_contract_address, summary_timestamp, period)
);
```

### Table: `watchlists`

Allows users to create and manage personal watchlists (the "Constellations" feature).

```sql
CREATE TABLE watchlists (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `watchlist_items`

Associates assets with user watchlists.

```sql
CREATE TABLE watchlist_items (
    id SERIAL PRIMARY KEY,
    watchlist_id INT REFERENCES public.watchlists(id) ON DELETE CASCADE,
    fraction_contract_address VARCHAR(42) REFERENCES public.assets(fraction_contract_address),
    UNIQUE(watchlist_id, fraction_contract_address)
);
```

---

## 4. Row-Level Security (RLS) Policies

RLS is critical for securing data. The following policies are examples.

-   **On `profiles`**: Users can see all profiles, but only edit their own.
    ```sql
    CREATE POLICY "Allow public read access" ON public.profiles FOR SELECT USING (true);
    CREATE POLICY "Allow user to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
    ```

-   **On `onboarding_requests`**: Users can only see and manage their own requests.
    ```sql
    CREATE POLICY "Allow user to manage own requests" ON public.onboarding_requests FOR ALL USING (auth.uid() = user_id);
    ```

-   **On `watchlists` and `watchlist_items`**: Users can only manage their own watchlists.
    ```sql
    CREATE POLICY "Allow user to manage own watchlists" ON public.watchlists FOR ALL USING (auth.uid() = user_id);
    CREATE POLICY "Allow user to manage own watchlist items" ON public.watchlist_items FOR ALL USING (auth.uid() = (SELECT user_id FROM watchlists WHERE id = watchlist_id));
    ```

-   **On `assets`, `trades`, `market_summary`**: These tables can be public-read.
    ```sql
    CREATE POLICY "Allow public read access" ON public.assets FOR SELECT USING (true);
    CREATE POLICY "Allow public read access" ON public.trades FOR SELECT USING (true);
    CREATE POLICY "Allow public read access" ON public.market_summary FOR SELECT USING (true);
    ```

---

## 5. Indexer & API Logic with Supabase

### Indexer Service (Edge Function)

-   Create a Supabase Edge Function (e.g., `blockchain-indexer`).
-   This function runs on a schedule (using a cron job trigger) or via a webhook.
-   It uses `ethers.js` to connect to a public RPC node for the Doma Protocol blockchain.
-   It queries for new events (`AssetOnboarded`, `OrderFilled`, `Transfer`) since its last run.
-   For each event, it uses the Supabase service role client to `upsert` data into the appropriate tables (`assets`, `trades`, etc.).

### Frontend Data Fetching & Realtime

Your frontend will use the `supabase-js` client library. This replaces the need for a separate API server.

-   **For `Exchange.tsx` (Live Order Book & Trades)**:
    -   Instead of fetching via a REST API, subscribe to changes in real-time.
    ```javascript
    // Listen for all new trades for a specific asset
    const tradeListener = supabase
      .channel('public:trades')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trades', filter: `fraction_contract_address=eq.${asset.address}` }, payload => {
        console.log('New trade!', payload.new);
        // Update the UI
      })
      .subscribe();
    ```

-   **For `Constellation.tsx` (User Portfolio)**:
    -   The frontend queries the `assets` table, but the actual portfolio data (balances) must still be fetched directly from the blockchain, as this is the ultimate source of truth.
    -   The `watchlists` and `watchlist_items` tables can be queried directly via Supabase to show the user's saved constellations.
    ```javascript
    // Fetch the user's watchlists
    const { data: watchlists, error } = await supabase
      .from('watchlists')
      .select(`
        name,
        watchlist_items (
          assets (*)
        )
      `);
    ```

-   **For `StellarReport.tsx` (Chart Data)**:
    -   Fetch historical market data with a simple query.
    ```javascript
    // Fetch daily chart data for an asset
    const { data: chartData, error } = await supabase
      .from('market_summary')
      .select('*')
      .eq('fraction_contract_address', asset.address)
      .eq('period', 'DAILY')
      .order('summary_timestamp', { ascending: true });
    ```
