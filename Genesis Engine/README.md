# Genesis Engine — Z.E.N.I.T.H.

The Genesis Engine is the onboarding and tokenization frontend for Z.E.N.I.T.H. It guides a Web2 domain owner through ownership verification, AI valuation (DomaScore), and on-chain minting/fractionalization via the Doma Protocol.

Key goals

- Provide a clear, step-by-step UX for domain owners to convert a domain into an on-chain asset.
- Surface the DomaScore AI valuation and supporting data.
- Trigger the on-chain flow that mints an ERC-721 (Genesis NFT), locks it in a vault, and mints ERC-20 fractional shares via Doma-compatible contracts.

What’s in this folder

- public/ — static assets and HTML shell.
- src/ — React app source code (UI components, flows, wallet integration).
- package.json — scripts and dependencies.

Important architecture notes

- Off-chain steps (DNS TXT verification, AI valuation) are performed by backend services or third-party APIs; this frontend orchestrates those calls and presents results.
- On-chain actions call our smart contracts on the Doma network. The primary contract entrypoint used by this UI is `onboardNewAsset()` exposed by GenesisEngine.sol (deployed on Doma).
- Wallet integration: MetaMask / WalletConnect. Users sign transactions to mint the Genesis NFT and receive fractional ERC-20 tokens.

Environment variables
Create a .env file in this folder (not committed) with the following values as needed:

- REACT_APP_API_BASE_URL — Backend API URL for verification & valuation endpoints.
- REACT_APP_DOMA_RPC — JSON-RPC endpoint for the Doma network (optional if using an injected provider).
- REACT_APP_GENESIS_CONTRACT_ADDRESS — Deployed GenesisEngine contract address on Doma.
- REACT_APP_ETHERSCAN_BASE_URL — (optional) Explorer base URL for transaction links.

Local development

1. Install dependencies

   npm install

2. Start the dev server

   npm start

Open http://localhost:3000 to view the app. The UI will reload on changes.

Build for production

   npm run build

This outputs a production-ready bundle to the `build/` directory.

Testing

- Unit and integration tests are runnable with:

   npm test

Contribution notes

- Follow the existing component structure in src/. Keep UI logic separated from API/wallet layers.
- Use the Fira Code font for numerical displays and Inter for headings where possible.
- Keep network calls and signing flows clearly auditable; show explicit confirmation screens before any on-chain transaction.

Further reading & links

- Doma Protocol (internal docs) — add link here when available.
- Z.E.N.I.T.H. project plan — see top-level plan.md for product definitions and UX flows.

License

- Internal project for Elykid Private Limited. Handle secrets and contract addresses with care.
