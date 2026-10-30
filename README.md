# Expendry

> **Where Machining Experience is Never Retired.**  
> A decentralized manufacturing tacit knowledge retention ecosystem connecting veteran machinists to earn EXPEN tokens on the MST blockchain, consult a multilingual Sarvam AI RAG assistant, and inspect certified 3D surgical and orthopedic implants in real time.

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.1%20Turbopack-black.svg)](https://nextjs.org/)
[![Bun](https://img.shields.io/badge/Bun-1.3.14-orange.svg)](https://bun.sh/)
[![MST Testnet](https://img.shields.io/badge/MST%20Testnet-Chain%20ID%2091562037-blue.svg)](https://testnet.mstscan.com/)
[![Sarvam AI](https://img.shields.io/badge/Sarvam%20AI-105B%20%7C%20Bulbul%20TTS-green.svg)](https://sarvam.ai/)
[![WCAG](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success.svg)](docs/Impeccable.md)

---

## Table of Contents

1. [Executive Summary & The Problem](#executive-summary--the-problem)
2. [Architecture & Monorepo Structure](#architecture--monorepo-structure)
3. [Documentation Matrix (`docs/` Deep-Dive Reference)](#documentation-matrix-docs-deep-dive-reference)
4. [Core Platform Features & Journeys](#core-platform-features--journeys)
5. [Smart Contract & MST Blockchain Integration](#smart-contract--mst-blockchain-integration)
6. [Quickstart & Development Setup](#quickstart--development-setup)
7. [Environment Variables](#environment-variables)
8. [Quality Gates & Automated Test Verification](#quality-gates--automated-test-verification)
9. [Home / Hero Section Layout Map](#home--hero-section-layout-map)
10. [License](#license)

---

## Executive Summary & The Problem

When seasoned CNC machinists, tool & die makers, and precision manufacturing operators retire, decades of **tacit knowledge** walk out the factory door:
- Spindle vibration dampening on extended boring bars.
- Acoustic pitch harmonics indicating microscopic insert flank wear.
- Customized thermal expansion fixture offsets for sub-micron medical implants.

New operators take months or years to learn these unwritten nuances, costing factories millions in scrap parts, machine tool damage, and production downtime.

**Expendry solves this by turning tacit machining experience into a liquid, tokenized asset:**
- Veteran machinists author calibration notes, blueprints, and setup tricks.
- Every verified post mints **10 EXPEN utility tokens** directly to their Web3 wallet on MST Testnet (gasless operator model).
- A multilingual **Sarvam AI Agent** indexes all community knowledge using BM25-lite Retrieval-Augmented Generation (RAG) to provide real-time shop-floor guidance in English, Hindi (हिन्दी), and Marathi (मराठी).
- 9 certified orthopedic knee and hip implants from Biorad Medisys Pune can be inspected in interactive WebGL 3D with digital CAD caliper leader lines and acoustic resonance notes.

---

## Architecture & Monorepo Structure

Expendry is architected as an enterprise-grade Bun workspace monorepo:

```
ethosh-project/
├── packages/
│   ├── contracts/          # Hardhat ERC-20 EXPEN token contract, test suite & MSTScan verification
│   ├── shared/             # Zero-dependency constants, network definitions, and compiled contract ABIs
│   └── web/                # Next.js 16 App Router (Turbopack, Tailwind 4, React Three Fiber, Sarvam AI SDK)
├── harness/                # Autonomous agent orchestration, gates G0-G5, audit logs, and state machine
├── tests/                  # Monorepo E2E suite, harness unit tests, and cross-package verifications
├── docs/                   # Architecture blueprints, ADRs, memory transcripts, and commit plan
└── scripts/                # Gate runners, circuit breakers, and environment sync utilities
```

---

## Documentation Matrix (`docs/` Deep-Dive Reference)

The [`docs/`](docs/) directory contains comprehensive architectural blueprints, protocol specifications, transcripts, and implementation guides. Every document is indexed below:

### 1. Architecture, Harness & Implementation Specifications
| Document | Focus & Content Summary |
|---|---|
| [`docs/harness.md`](docs/harness.md) | **Primary Architecture Specification**: Defines autonomous agent harness, gates G0–G5, circuit breakers, 152-commit execution history across Sprints 0–6, and system-wide design requirements. |
| [`docs/commit-plan.md`](docs/commit-plan.md) | **Atomic Commit Ledger**: Step-by-step commit progression tracking red-first TDD stages, role locks, and verification checkpoints. |
| [`docs/USER_MANUAL.md`](docs/USER_MANUAL.md) | **End-User Operations Manual**: Step-by-step user guide covering wallet onboarding, community post authoring, EXPEN token accrual, Sarvam AI voice assistance, and 3D tooling inspection. |
| [`docs/Impeccable.md`](docs/Impeccable.md) | **Design System & Aesthetic Guidelines**: Defines the Minimalist White/Green/Black aesthetic (`#ffffff` canvas, `#16a34a` accent, `#09090b` ink), Poppins and Montserrat typography, liquid glass styling, and WCAG AA contrast ratios. |
| [`docs/prompt.md`](docs/prompt.md) | **Harness Boot Sequences & Circuit Breakers**: Pipeline safety rules, role path allow-lists, 8 circuit breaker triggers, and gate contracts. |

### 2. Blockchain & MST Protocol Reference
| Document | Focus & Content Summary |
|---|---|
| [`docs/MST_FACTS.md`](docs/MST_FACTS.md) | **MST Blockchain Reference**: Verified technical facts for MST Testnet (Chain ID `91562037` / `0x5752035`), RPC endpoints, BridgeKey Chrome Web Store configuration, and testnet explorer. |
| [`docs/SOLIDITY.MD`](docs/SOLIDITY.MD) | **Smart Contract Best Practices**: Pre-deployment checklist covering gas optimization, storage slot packing, reentrancy guards, and access control patterns. |
| [`docs/JAVASCRIPTMSTSDK.MD`](docs/JAVASCRIPTMSTSDK.MD) | **MST JavaScript SDK Reference**: Protocol guidelines for interacting with MST contracts, event listening, and provider instantiation. |
| [`docs/ONCHAIN_DISCLOSURE_SIGNATURES.md`](docs/ONCHAIN_DISCLOSURE_SIGNATURES.md) | **Cryptographic Authentication Spec**: EIP-191 challenge-response message formatting, replay protection, and signature verification on the MST testnet. |

### 3. AI & Model Context Protocol (MCP)
| Document | Focus & Content Summary |
|---|---|
| [`docs/mcp.md`](docs/mcp.md) | **Model Context Protocol Architecture**: Server-Sent Events (SSE) agent endpoint specification for querying MST on-chain state and knowledge tools. |
| [`docs/mcpguide.md`](docs/mcpguide.md) | **MCP Developer Integration Guide**: Step-by-step guide for hooking AI agent tool calls into external databases and blockchain indexers. |
| [`docs/mcpcheck.md`](docs/mcpcheck.md) | **MCP Health & Verification Check**: Automated health-checking test procedures for validating Model Context Protocol servers. |
| [`docs/RESOURCES.MD`](docs/RESOURCES.MD) | **Hackathon Resource Directory**: Upstream hackathon portals, faucet links, repository guides, and documentation links. |
| [`docs/raw.md`](docs/raw.md) | **Original Problem Statement**: Raw hackathon challenge brief for Manufacturing Problem 2 (Retaining Shop-Floor Tacit Knowledge). |

### 4. Architectural Decision Records (ADRs)
| Record | Architecture Decision |
|---|---|
| [`docs/adr/ADR-0001-monorepo-structure.md`](docs/adr/ADR-0001-monorepo-structure.md) | **Turborepo Monorepo Architecture**: Adoption of Bun workspaces isolating `packages/contracts`, `packages/shared`, and `packages/web` to eliminate dependency pollution and ABI drift. |
| [`docs/adr/ADR-0002-firebase-auth-wallet-mapping.md`](docs/adr/ADR-0002-firebase-auth-wallet-mapping.md) | **EIP-191 Wallet-to-Firebase Authentication**: Verifying ECDSA wallet signatures on the server to mint secure Firebase Custom Auth Tokens without storing private keys. |
| [`docs/adr/ADR-0003-offchain-posts-onchain-rewards.md`](docs/adr/ADR-0003-offchain-posts-onchain-rewards.md) | **Hybrid Persistence Architecture**: Storing rich knowledge posts in Firestore while executing gasless operator minting of 10 EXPEN on MST Testnet. |

### 5. Project Memory, Assumptions & Lessons
| Document | Focus & Content Summary |
|---|---|
| [`docs/memory/assumptions.md`](docs/memory/assumptions.md) | **Technical Assumptions**: Validated assumptions regarding operator gas sponsorship, daily 50 EXPEN reward caps, and BridgeKey provider detection. |
| [`docs/memory/lessons.md`](docs/memory/lessons.md) | **Engineering Post-Mortem & Lessons Learned**: Root cause analysis of React 19 SSR hydration mismatches, Sarvam TTS language code validation, and cross-browser glassmorphism. |
| [`docs/memory/glossary.md`](docs/memory/glossary.md) | **Manufacturing & Metrology Glossary**: Definitions of GD&T, CMM inspection, electro-polishing, Ra surface roughness, CoCrMo alloy, and Ti-6Al-4V ELI. |
| [`docs/memory/interview.md`](docs/memory/interview.md) | **Machinist Domain Transcript**: Comprehensive interview with veteran operators Rameshwar Kulkarni and Devendra Patil informing the platform's persona design. |

---

## Core Platform Features & Journeys

### 1. Home & Tacit Knowledge Retention Portal (`/`)
- Explores the manufacturing "silver tsunami" crisis through real-time telemetry metrics.
- High-resolution hero display with active CMM optical comparator reticles and interactive specular sheen.
- DRO Monthly Yield Calculator allowing machinists to calculate their projected EXPEN token earnings.
- 3D cascading EXPEN token stage powered by React Three Fiber.

### 2. Streamlined Onboarding & Cryptographic Sign-In (`/login` & `/onboarding`)
- **Login Options**: Google Sign-In or email/password authentication.
- **Three-Step Profile Wizard**:
  1. *Profile Setup*: Workshop facility, role designation, and operator name.
  2. *Wallet Detection*: Automatic BridgeKey Web3 wallet connection (with direct install assistance).
  3. *EIP-191 Auth Challenge*: Gasless cryptographic sign-in verifying wallet ownership.

### 3. Community Knowledge Hub & On-Chain Rewards (`/community`)
- Machinists share setup tips, blueprints, and troubleshooting stories across 5 structured post categories.
- Every verified post automatically triggers an on-chain operator mint of **10 EXPEN** tokens to the author's wallet.
- Strict safety limits: Daily cap of **50 EXPEN per day per wallet** enforced both on-chain and off-chain.

### 4. Multilingual Sarvam AI Assistant (`/chat` & `/agent`)
- Consult a specialized machining assistant powered by **Sarvam AI** (`sarvam-m` model).
- Real-time Server-Sent Events (SSE) streaming chat with full support for **English**, **Hindi (हिन्दी)**, and **Marathi (मराठी)**.
- Voice-enabled: Transcribes audio via Sarvam Saaras STT and speaks responses using Sarvam Shubh TTS (`bulbul:v3`).
- **Retrieval-Augmented Generation (RAG)**: Automatically searches and injects relevant Machinist Community posts as context into queries to provide shop-floor-accurate advice.

### 5. CAD/CAM 3D Precision Implants Showcase (`/showcase`)
- Real-time WebGL PBR 3D viewport powered by Three.js and OrbitControls.
- Features **strictly the 9 certified precision medical implants** manufactured by Biorad Medisys Pune:
  1. *Excel Medial Pivot Knee (MPK)* (`prod-001`)
  2. *Genius Cruciate Retaining (CR) Knee* (`prod-002`)
  3. *Genius Posterior Stabilized (PS) Knee* (`prod-003`)
  4. *Ouro Asian-Fit High-Flexion Knee* (`prod-004`)
  5. *Signature Porous Titanium Hip Stem* (`prod-005`)
  6. *Signature Duo Dual-Mobility Acetabular Cup* (`prod-006`)
  7. *Signature NX Cup with BIOLOX Delta Ceramic Head* (`prod-007`)
  8. *Hydrophilic Double-J Ureteral Stent* (`prod-008`)
  9. *Indoscope Sleek Semi-Rigid Endoscope* (`prod-009`)
- Includes real-time digital caliper leader lines, Ra surface roughness telemetry (< 0.02 µm), wireframe toggles, and 9-station turret controls.

### 6. Blueprints & Web Audio API Acoustic Resonance Analyzer (`/blueprints`)
- Technical engineering drawings with ISO tolerance limits and material specifications.
- **Synthesized Machining Sound Notes**: Uses the Web Audio API to play authentic machine resonance frequencies directly in the browser:
  - 440 Hz Vise Clamping Resonance (Sine)
  - 2,400 Hz Boring Bar Chatter Harmonic Scream (Triangle)
  - 1,200 Hz High-Pressure Coolant Venturi Jet Whistle (Sawtooth)
  - 650 Hz Pie Jaw 3,500 RPM Spindle Dynamic Note (Sine)
  - 880 Hz 5-Axis Meehanite Tombstone Modal Resonance (Square)

### 7. Heritage & Biorad Medisys Pune Evolution (`/heritage`)
- Interactive historical timeline celebrating Pune's journey to becoming an indigenous medical device manufacturing powerhouse.

---

## Smart Contract & MST Blockchain Integration

Expendry operates on the **MST Testnet**, a high-throughput EVM-compatible chain designed for enterprise logistics and supply chains:

- **Network Name**: MST Testnet
- **Chain ID**: `91562037` (`0x5752035`)
- **RPC URL**: `https://testnetrpc.mstblockchain.com`
- **Currency Symbol**: `tMSTC` / `MST`
- **Block Explorer**: [https://testnet.mstscan.com](https://testnet.mstscan.com)
- **Official Faucet**: [https://faucet.masterstroke.academy](https://faucet.masterstroke.academy)
- **Verified EXPEN Token Contract**: [`0x59CB0de255eC111ff7959FE6889c8C521836e7d5`](https://testnet.mstscan.com/address/0x59CB0de255eC111ff7959FE6889c8C521836e7d5#code)

### Smart Contract Invariants (`EXPEN.sol`)
1. **Decimals**: Standard 18 decimals (`1 EXPEN = 10^18 wei`).
2. **Fixed Daily Cap**: 50 EXPEN per wallet every 24 hours (`block.timestamp / 1 days`).
3. **Operator Control**: Only the authorized operator address can mint reward tokens (`rewardAuthor` modifier).
4. **Emergency Stop**: Operator can pause and unpause contract transfers and minting via OpenZeppelin `Pausable`.

---

## Quickstart & Development Setup

Expendry uses [Bun](https://bun.sh) as the package manager and runner.

### Prerequisites
- [Bun](https://bun.sh) v1.1.0 or higher
- [Node.js](https://nodejs.org) v20+ (for Next.js / Hardhat compatibility)
- [BridgeKey Wallet](https://bridgekey.io) or MetaMask browser extension

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/Precise-Goals/Precisors_4_Expendry_Batch1.git
cd Precisors_4_Expendry_Batch1

# 2. Install workspace dependencies
bun install

# 3. Synchronize environment variables to Next.js client bundle
python scripts/sync_env.py

# 4. Start the development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Copy `.env.example` to `.env` in the repository root:

| Variable | Description | Required |
|---|---|---|
| `MST_TESTNET_RPC` | RPC URL for MST Blockchain Testnet | Yes |
| `NEXT_PUBLIC_MST_CHAIN_ID` | MST Testnet chain identifier (`91562037`) | Yes |
| `NEXT_PUBLIC_MST_RPC_URL` | Client-accessible MST RPC endpoint | Yes |
| `EXPEN_CONTRACT_ADDRESS` | Deployed EXPEN ERC-20 contract address | Yes |
| `OPERATOR_PRIVATE_KEY` | Operator wallet private key for gasless reward minting | For on-chain rewards |
| `SARVAM_API_KEY` | API Key for Sarvam AI LLM, STT & TTS | For AI Assistant |
| `FIREBASE_PROJECT_ID` | Google Cloud / Firebase project ID | For persistence |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin SDK service account email | For Firestore Admin |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin SDK service account private key | For Firestore Admin |

---

## Quality Gates & Automated Test Verification

Expendry enforces a strict 5-gate pipeline (G0–G4):

| Gate | Check | Command | Target / Scope |
|---|---|---|---|
| **G0** | Harness Health | `python scripts/check_harness.py` | Role locks, path allow-lists, no circular references |
| **G0** | Harness Tests | `pytest tests/harness` | 50 unit tests for circuit breakers and state machine |
| **G1** | Web Unit Tests | `bun test --cwd packages/web` | 179 React 19 component, API route & utility tests |
| **G1** | ESLint Sanity | `bun run lint` | Next.js 16 linting pass (0 errors) |
| **G2** | Smart Contract Tests | `bun run test --filter=contracts` | 32 Hardhat adversarial, mathematical fuzzing & cap tests |
| **G3** | Opaque-Box E2E | `bun run test:e2e` | 100 comprehensive cross-feature scenario tests |
| **G4** | Next.js Production Build | `bun run build --filter=web` | 36 App Router routes compiled static/dynamic with Turbopack |

---

## Home / Hero Section Layout Map

For developers maintaining or customizing the Home and Hero experience, the code is structured in the following locations:

- **Root Layout Shell**: [`packages/web/src/app/layout.js`](packages/web/src/app/layout.js)  
  Wraps all pages with the `<AmbientCanvas>` mesh background, floating `<Navbar>`, `<PageTransition>`, and `<Footer>`.
- **Home Page Main Entrypoint**: [`packages/web/src/app/page.js`](packages/web/src/app/page.js)  
  - **Lines 100–240**: Hero section container, headline (*"Where Machining Experience is Never Retired"*), mission statement, magnetic CTA buttons (*"Explore Community Knowledge"* & *"Inspect 3D Implants"*), and optical inspection frame.
  - **Lines 250–1025**: Ecosystem metrics ticker, Tacit Knowledge Vault, Interactive Feature Grid, Machinist Persona Testimonials, Interactive DRO Yield Calculator, and EXPEN Token Specification Stage.
- **Hero Picture Component**: [`packages/web/src/components/home/HeroPicture.jsx`](packages/web/src/components/home/HeroPicture.jsx)  
  Displays the high-resolution 5-axis CNC machined titanium implant photograph (`/images/h.png`), CMM optical comparator corner marks, CMM-CAM active pulse badge, and floating telemetry chips with spring-physics motion.
- **3D Hero Token Stage**: [`packages/web/src/components/home/HeroTokenStage.jsx`](packages/web/src/components/home/HeroTokenStage.jsx)  
  WebGL Three.js / React Three Fiber interactive viewport featuring the chamfered octagonal titanium nut and cascading silver EXPEN tokens with realistic specular reflections.
- **Magnetic Button Physics Wrapper**: [`packages/web/src/components/ui/MagneticTrack.jsx`](packages/web/src/components/ui/MagneticTrack.jsx)  
  Emil Kowalski spring-physics magnetic cursor attraction wrapper used around the Hero CTA buttons.

---

## License

This project is licensed under the **MIT License**.

```text
MIT License

Copyright (c) 2026 Precise-Goals / Expendry Contributors (https://github.com/Precise-Goals/Precisors_4_Expendry_Batch1)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

See the full [`LICENSE`](LICENSE) file in the root of the repository.
