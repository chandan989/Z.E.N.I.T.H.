# Z.E.N.I.T.H. - Project Design & Architectural Plan

**Project Name:** Z.E.N.I.T.H. (Zero-latency Exchange Network for Intelligent Trading & Hedging)
**Version:** 1.0 (Hackathon MVP)
**Date:** September 10, 2025

---

## 1.0 Executive Summary & Vision

Z.E.N.I.T.H. is a decentralized protocol designed to serve as the foundational financial layer for the entire domain asset class. Our vision is to build the definitive "Bloomberg Terminal for DomainFi." We will achieve this by creating a self-reinforcing ecosystem that (1) provides a frictionless on-ramp for any Web2 domain to become a liquid on-chain asset via our **Genesis Engine**, and (2) offers institutional-grade financial instruments for these new assets on our **Exchange Exchange**.

This project is built natively on the **Doma Protocol**, leveraging its infrastructure for asset tokenization, fractionalization, and on-chain settlement.

## 2.0 Overall Design Philosophy & Brand Identity

Our design philosophy is **"Celestial Precision."** The interface will be inspired by the clean, data-rich UIs of astronomical observatories and professional trading terminals. It must feel fast, precise, and powerful.

### 2.1 Personas
* **Anjali (The Asset Owner):** A business owner in Lucknow. She needs a secure, trustworthy, and guided experience to unlock the value of her domain. The UI must inspire confidence.
* **Rohan (The Pro Trader):** A DeFi native. He demands speed, data density, and advanced tooling. The UI must be a high-performance instrument for capital allocation.

### 2.2 Visual Identity
* **Color Palette (Dark Mode Native):**
    * `#0C0A09` (Void Black): Primary background.
    * `#18181B` (Dark Matter): Container/Card backgrounds.
    * `#FBBF24` (Orion Gold): Primary CTAs, active states, key data highlights.
    * `#06B6D4` (Cosmic Teal): Secondary actions, links, informational icons.
    * `#22C55E` (Supernova Green): Positive price action.
    * `#DC2626` (Red Giant): Negative price action.
    * `#FFFFFF` (Bright White): Headings.
    * `#A1A1AA` (Stardust Grey): Body text.
* **Typography:**
    * **UI & Headings:** `Inter` (for its unparalleled clarity).
    * **Numerical Data:** `Fira Code` (a clean monospace font with ligatures to reinforce precision).

## 3.0 Core Technology: Doma Protocol Integration

Z.E.N.I.T.H. is not just built *on* Doma; it is a native extension of its capabilities. We will leverage Doma in the following specific ways:

* **As the Core Ledger:** Z.E.N.I.T.H. will be deployed as a suite of smart contracts on the Doma blockchain, benefiting from its EVM compatibility, low transaction fees, and fast settlement times.
* **For Asset Tokenization:** The Genesis Engine will call Doma's native or a custom-built ERC-721 contract to mint a unique NFT representing the verified Web2 domain. This NFT serves as the on-chain "deed" of ownership.
* **For Asset Fractionalization:** Upon minting, we will immediately utilize a fractionalization protocol (like a custom vault contract) to lock the ERC-721 and issue a predetermined supply of fungible ERC-20 tokens. These tokens represent liquid, tradable shares of the underlying domain.
* **For On-chain Settlement:** All trades of fractionalized shares, options contracts, and index tokens will be settled on the Doma Protocol's blockchain, ensuring transparency and security.

## 4.0 Component-by-Component Design Breakdown

### 4.1 Mission Control (Landing Page & Main Dashboard)

* **Objective:** To establish the Z.E.N.I.T.H. brand and provide clear, dual entry points for our two primary personas.
* **User Persona Focus:** Anjali & Rohan.
* **UX Flow:**
    1.  A new user is greeted with a powerful headline and a central search bar.
    2.  They can either enter a domain to begin the onboarding process or click to enter the exchange.
    3.  A logged-in user sees a customizable dashboard with widgets for their portfolio, watchlists, and key market stats.
* **UI & Key Elements:**
    * **Header:** A persistent, slim header containing the Z.E.N.I.T.H. logo, navigation links, and the "Connect Wallet" button.
    * **Hero Section:** A subtle, slowly animating starfield background.
        * `H1:` The Apex of Domain Finance.
        * `H2:` Onboard any Web2 asset. Trade the future of digital real estate.
        * **Primary Input:** A large, glowing input field: `[ Enter Your Domain to Begin its Ascent ]`.
    * **Market Indicators Bar:** A live-updating data bar below the hero:
        * **ZVI (Zenith Volatility Index):** A single, bold number.
        * **TVO (Total Value Onboarded):** A running dollar amount.
        * **24h Volume:** Total exchange volume.
* **Doma Protocol Interaction:** None on this page. It is the gateway.
* **Key Differentiator:** The professional, "command center" feel, reinforced by the live market stats, sets a serious tone immediately.

### 4.2 The Genesis Engine (The "Ascent" Flow)

This is the multi-stage onboarding process for Anjali.

#### 4.2.1 Stage 1: Ownership Verification

* **Objective:** To create a secure, cryptographically verifiable link between the user's wallet and their off-chain domain.
* **UX Flow:** The user is guided through a single, focused task. Real-time feedback is provided to reduce uncertainty.
* **UI & Key Elements:**
    * A modal or dedicated page with a progress indicator: `Stage 1/3: Ownership Verification`.
    * A clear instruction: `To verify you own [domain.com], add the following TXT record to your DNS settings.`
    * A display box with the unique verification string (e.g., `zenith-verify=0x123...abc`), rendered in `Fira Code`.
    * A "Copy Value" button.
    * A primary "Verify Ownership" button that enters a loading state with messages like `Scanning DNS records...`, `Record found, confirming...`.
* **Doma Protocol Interaction:** None. This is a critical off-chain security step.

#### 4.2.2 Stage 2: The DomaScore AI Valuation (The "Apogee" Moment)

* **Objective:** To reveal the AI-generated valuation in a way that builds trust and excitement.
* **UX Flow:** A moment of "magic." The user sees the system working, then the result is presented clearly and transparently.
* **UI & Key Elements:**
    * An interstitial animation: data points and lines converge into a central "constellation."
    * **The Astrolabe:** A circular, data-rich UI element displaying the final **DomaScore** (e.g., `875/1000`).
    * The primary valuation is displayed below in a large font: `$12,500.00 USD`.
    * **The Valuation Constellation:** A scrollable data visualization. Each factor (SEO Authority, Traffic, Brandability) is a "star." Hovering over a star reveals its specific contribution (e.g., `SEO Authority: +$3,500`).
    * **CTA:** A single, glowing Orion Gold button: `Initiate Tokenization`.
* **Doma Protocol Interaction:** None. This is the final off-chain analysis before the on-chain action.

#### 4.2.3 Stage 3: Tokenization & Fractionalization

* **Objective:** To execute the on-chain minting process with maximum clarity and security.
* **UX Flow:** The user reviews the final parameters and signs a single transaction.
* **UI & Key Elements:**
    * A final confirmation screen: `Stage 3/3: On-chain Genesis`.
    * **Summary Box:**
        * `Asset:` [domain.com]
        * `Valuation:` $12,500.00
        * `Token Supply:` [Input field, defaults to 1 token per dollar, e.g., 12,500]
        * `Ticker:` [Input field, e.g., $MDC]
    * A clear breakdown of estimated Doma network fees.
    * **CTA:** `Confirm & Mint Genesis NFT`. This will trigger the user's wallet (MetaMask, etc.).
    * **Success Screen:** A celebratory "Launch Successful!" message with links to view the transaction on the Doma block explorer and view the new asset page on Z.E.N.I.T.H.
* **Doma Protocol Interaction:** This is the core interaction. The frontend calls the `onboardNewAsset()` function in our `GenesisEngine.sol` contract, which in turn:
    1.  Mints the ERC-721 NFT to the user's address.
    2.  Locks the NFT in a vault.
    3.  Mints the corresponding ERC-20 shares to the user's address.

### 4.3 The Z.E.N.I.T.H. Exchange (The "Exchange" View)

This is the high-performance trading terminal for Rohan.

* **Objective:** To provide a dense, fast, and powerful interface for trading all onboarded assets.
* **User Persona Focus:** Rohan.
* **UI & Key Elements:**
    * **Three-Column Layout:**
        * **Left (Asset Navigator):** A searchable list of assets. Tabs for `All Assets`, `Options`, and `Constellations` (our AI-curated indices).
        * **Center (Skychart):** A professional-grade candlestick chart (powered by a library like TradingView) with a faint star-map grid background.
        * **Right (Command Module):** The order book and trade terminal. All numerical inputs use `Fira Code`.
    * **Constellations:** AI-curated indices will have thematic names (e.g., `Orion-AI-10`, `Cygnus-eCom-5`) and a unique constellation icon. They are traded just like any other asset.
* **Doma Protocol Interaction:** Every trade executed in the Command Module signs and sends a transaction to our `Exchange.sol` contract for on-chain settlement on the Doma network.
* **Key Differentiator:** The thematic, AI-curated **"Constellations"** are a unique, on-brand feature that provides genuine value beyond a simple watchlist.

### 4.4 Stellar Report (Asset Detail Page)

* **Objective:** To be the single source of truth for any asset, combining its on-chain financial data with its off-chain health metrics.
* **User Persona Focus:** Anjali & Rohan.
* **UI & Key Elements:**
    * **Header:** The domain name, its ticker, and its live DomaScore displayed in the signature Astrolabe UI element.
    * **Main Content:** The Skychart for the asset's price history.
    * **Data Panels:** A grid of cards for key financial data (Market Cap, Volume) and key off-chain data (Live SEO Score, Traffic Estimate).
    * **The "Sentiment Nebula":** A dynamic, amorphous blob of color that shifts between Supernova Green, Stardust Grey, and Red Giant based on real-time social media sentiment analysis. It's a beautiful, at-a-glance indicator of public perception.
* **Doma Protocol Interaction:** The financial data (price, volume) is pulled directly from our on-chain exchange contracts deployed on Doma.
* **Key Differentiator:** The **"Sentiment Nebula"** is a stunning and unique data visualization that directly connects messy real-world data to financial value.