# ADR-0003: Off-Chain Posts with On-Chain Token Rewards

## Status
Accepted

## Context
Expendry enables veteran manufacturing machinists to document and share tacit shop-floor knowledge (CNC setups, tooling blueprints, troubleshooting experiences). Each valid post awards the author 10 EXPEN tokens on the MST blockchain testnet up to a strict per-wallet daily cap of 50 EXPEN (5 posts/day).

We evaluated whether community posts should be stored entirely on-chain, via decentralized storage (e.g. IPFS/Arweave with on-chain pointers), or in an off-chain document database (Firestore) with on-chain reward distribution.

## Decision
We store all post content, author metadata, tags, and comments off-chain in Firebase Firestore. Token reward issuance is handled on-chain via the operator-controlled `EXPEN.mint(recipient, amount)` function on the MST Testnet (Chain ID 91562037).

### Architecture
1. **Frontend**: Author drafts and signs/submits post via `/api/posts`.
2. **Backend**:
   - Authenticates wallet session.
   - Validates the author's daily reward cap.
   - Writes the sanitized post document to Firestore.
   - Invokes `EXPEN.mint()` on MST Testnet via the server-side operator wallet.
   - Persists the returned MST transaction hash (`txHash`) on the post record.
3. **Client Feeds**: Display real-time posts from Firestore with live verifiable on-chain transaction links.

## Rationale
- **Latency & User Experience**: Posting and feed retrieval must feel instantaneous to machinists. On-chain content writes introduce block-confirmation latency and gas fees for writers.
- **Search & RAG Retrieval**: The multilingual Sarvam AI assistant requires fast, structured document querying via BM25-lite keyword scoring. Firestore provides instant cursor-based pagination and indexing.
- **Gas Efficiency**: Storing kilobytes of rich text and blueprint diagrams on-chain is cost-prohibitive. Minting 10 EXPEN costs standard ERC-20 transfer gas (~50,000 gas), fully sponsored by the ecosystem operator wallet.
- **Double-Cap Protection**: The 50 EXPEN/day limit is checked both at the server API layer and on-chain in `EXPEN.sol`, guaranteeing tamper-resistant tokenomics.

## Alternatives Considered
1. **Full On-Chain Content Storage**: Storing strings in contract storage. Rejected due to extreme gas costs and inability to efficiently perform full-text search.
2. **IPFS + Smart Contract Registry**: Storing IPFS hashes in contract mappings. Rejected for hackathon prototype due to gateway pinning latency and added complexity without UX benefit.
3. **Pure Web2 Database Without Tokens**: Rejected as it eliminates token incentives and fails core competition requirements.

## Consequences
- **Positive**:
  - Sub-second feed queries and smooth responsive UI.
  - Machinists never need testnet gas to publish knowledge; operator wallet funds mint transactions.
  - High resilience and offline-safe AI RAG indexing.
- **Negative**:
  - Requires maintaining the server-side operator private key securely in environment variables.
  - Temporary blockchain RPC downtime does not block post reads, but delays token reward issuance.
