# Expendry

> **Where machining experience is never retired.**  
> A community-driven manufacturing ecosystem connecting veteran machinists to earn EXPEN tokens on MST Testnet, consult a multilingual Sarvam AI RAG assistant, and inspect precision 3D tooling.

---

## Architecture Overview

Expendry is structured as an enterprise-grade Bun monorepo composed of three core packages and an autonomous agent harness:

```
ethosh-project/
├── packages/
│   ├── contracts/          # Hardhat ERC-20 EXPEN token contract, deployment & verification scripts
│   ├── shared/             # Shared constants, ERC-20 ABI, network definitions, and types
│   └── web/                # Next.js 16 App Router frontend, Tailwind 4, Three.js R3F, Sarvam AI SDK
├── harness/                # Autonomous agent orchestration, gates G0-G5, audit logs, and state machine
├── tests/                  # Monorepo E2E suite, harness unit tests, and cross-package verifications
└── docs/                   # Architecture blueprints, ADRs, memory transcripts, and commit plan
```

---

## Quickstart (One Command)

Expendry uses [Bun](https://bun.sh) as the package manager and test runner.

```bash
# 1. Install dependencies across all workspaces
bun install

# 2. Run the development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Core Verification Commands

| Command | Target | Purpose | Gate |
|---|---|---|---|
| `bun run build --filter=web` | `packages/web` | Next.js 16 production build with Partial Prerendering (Turbopack) | G1/G4 |
| `bun test --cwd packages/web` | `packages/web` | Unit and integration test suites (104 tests) | G1 |
| `bun run test --filter=contracts` | `packages/contracts` | Hardhat adversarial, fuzzing, and unit tests (32 tests) | G1/G2 |
| `bun run test:e2e` | Monorepo | End-to-end integration and smoke runner (90 tests) | G3 |
| `python scripts/check_harness.py` | Harness | Fast zero-dependency integrity and path-lock verification | G0 |
| `pytest tests/harness` | Harness | Harness gate, state machine, and circuit breaker tests | G0 |
| `bun run lint` | `packages/web` | Code quality and Next.js ESLint pass | G1 |

---

## Environment Variables

Copy `.env.example` to `.env` in the repository root:

| Variable | Description | Required / Default |
|---|---|---|
| `MST_TESTNET_RPC` | RPC URL for MST Blockchain Testnet | `https://testnetrpc.mstblockchain.com` |
| `NEXT_PUBLIC_MST_CHAIN_ID` | MST Testnet chain identifier (decimal) | `91562037` |
| `NEXT_PUBLIC_MST_RPC_URL` | Client-accessible MST RPC endpoint | `https://testnetrpc.mstblockchain.com` |
| `EXPEN_CONTRACT_ADDRESS` | Deployed EXPEN ERC-20 contract address | `0x59CB0de255eC111ff7959FE6889c8C521836e7d5` |
| `OPERATOR_PRIVATE_KEY` | Deployer/Operator wallet private key for reward minting | Required for on-chain rewards |
| `SARVAM_API_KEY` | API Key for Sarvam AI LLM, Speech-to-Text & Text-to-Speech | Required for AI Agent |
| `FIREBASE_PROJECT_ID` | Google Cloud / Firebase project ID | Required for persistence |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin SDK service account email | Required for Firestore Admin |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin SDK service account private key | Required for Firestore Admin |

---

## Blockchain Configuration (MST Testnet)

Expendry operates on the **MST Testnet**, a high-throughput EVM-compatible chain designed for enterprise manufacturing and supply-chain logistics.

- **Network Name**: MST Testnet
- **Chain ID**: `91562037` (`0x5752eb5`)
- **RPC URL**: `https://testnetrpc.mstblockchain.com`
- **Currency Symbol**: `MST`
- **Block Explorer**: [https://testnet.mstscan.com](https://testnet.mstscan.com)
- **Faucet**: [https://faucet.mstblockchain.com](https://faucet.mstblockchain.com)
- **EXPEN Token Address**: [`0x59CB0de255eC111ff7959FE6889c8C521836e7d5`](https://testnet.mstscan.com/address/0x59CB0de255eC111ff7959FE6889c8C521836e7d5#code)

### Wallet Setup (BridgeKey / MetaMask)
1. Install the **BridgeKey** browser extension (recommended) or **MetaMask**.
2. Add the MST Testnet network using the parameters above.
3. Fund your account with testnet MST via the official faucet.
4. Import the custom EXPEN token contract address (`0x59CB0de255eC111ff7959FE6889c8C521836e7d5`).

---

## 5 Core User Flow Walkthroughs

### 1. Home & Knowledge Retention Portal (`/`)
- Explores the manufacturing "silver tsunami" — the critical loss of tribal machining knowledge as veteran machinists retire.
- Real-time animated token metrics, veteran operator personas, and CTAs directing users to Onboarding, Community, and Tooling.

### 2. Wallet Onboarding Wizard (`/onboarding`)
- **Step 1 — Connect Wallet**: Auto-detects BridgeKey with fallback to MetaMask; automatically requests network switch to MST Testnet.
- **Step 2 — Profile Setup**: Collects username, designation, and manufacturing facility within an accessible, focus-trapped dialog.
- **Step 3 — EIP-191 Auth**: Signs a cryptographic challenge verifying wallet ownership, issuing a secure Firebase custom auth token.

### 3. Community Feed & EXPEN Token Rewards (`/community`)
- Machinists share machining blueprints, setup tips, and tribal experiences.
- Every valid post automatically triggers an on-chain operator mint of **10 EXPEN** tokens to the author's wallet (daily cap of 50 EXPEN enforced both on-chain and off-chain).
- Filter posts by category with stale-while-revalidate (SWR) caching and background revalidation.

### 4. Sarvam AI Multilingual CNC Assistant (`/agent`)
- Consult a specialised machining assistant powered by **Sarvam AI** (`sarvam-m` model).
- Full support for **English**, **Hindi (हिन्दी)**, and **Marathi (मराठी)**.
- Voice-enabled: speaks responses using Sarvam TTS and transcribes microphone input via Sarvam STT.
- **RAG Context Injection**: Automatically injects relevant Machinist Community posts as context into queries to provide shop-floor-accurate advice.

### 5. 3D Interactive Tooling Showcase & Marketplace (`/showcase` & `/marketplace`)
- Interactive WebGL 3D tool models (Carbide Endmill, CNC Lathe Turning Insert, Precision Collet Chuck) rendered using React Three Fiber.
- Accessible keyboard rotation controls (Arrow keys rotate in 15° increments) and responsive mouse arcball orbit controls.
- Marketplace catalog with live price filtering, category toggles, and direct links to inspect tooling in 3D.

---

## Security & Reliability Standards

- **OWASP Top 10 Hardened**: Zero `eval()`, zero unescaped `innerHTML`, server-side DOMPurify sanitisation on all user submissions.
- **Prototype Pollution Guards**: Explicitly rejects request payloads attempting to mutate `__proto__`, `constructor`, or `prototype`.
- **Content Security Policy (CSP)**: Strict headers restrict network connectivity to MST RPC, Sarvam AI, and Firebase; `X-Frame-Options: DENY` protects against clickjacking.
- **Token-Bucket Rate Limiting**: In-memory token bucket rate limiters prevent API abuse (10 req/min for posts, 20 req/min for agent chat).
- **Accessibility**: Full WCAG 2.1 AA compliance across all pages, 10.08:1 contrast ratios on dark theme, ARIA live regions for streaming text, and focus-trapped modal dialogs.
