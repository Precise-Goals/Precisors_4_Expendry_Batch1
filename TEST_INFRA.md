# Expendry — Test Infrastructure & Opaque-Box E2E Testing Framework

## 1. Test Philosophy: Opaque-Box, Requirement-Driven Testing

The Expendry End-to-End (E2E) test suite is architected around an **opaque-box, specification-authoritative philosophy**:
1. **Behavior Over Implementation**: Tests assert strictly against external contracts, APIs, data schemas, mathematical invariants, and observable user journeys rather than ephemeral internal component states.
2. **Authoritative Specification Sources**:
   - `ORIGINAL_REQUEST.md`: Requirements R1–R5, Acceptance Criteria, and core user flows.
   - `PROJECT.md`: Monorepo architecture, interface contracts, MST Testnet parameters, and milestone boundaries.
   - `MST_FACTS.md` & `ONCHAIN_DISCLOSURE_SIGNATURES.md`: Chain ID `91562037` (`0x5752035`), RPC URL `https://testnetrpc.mstblockchain.com`, EIP-1193 BridgeKey/MetaMask standards, and EIP-191 signatures.
3. **Progressive Testability & Isolation**: Every test is self-contained and reproducible. The test runner operates cleanly under headless CI/CD, local development, and parallel test execution without state leakage or execution order dependencies.
4. **Adversarial & Boundary Verification**: Rigorous edge testing covering daily reward caps, rollover resets, injection attack sanitization, cryptographic replay rejection, and RAG token constraints.

---

## 2. 4-Tier Test Architecture

```
tests/e2e/
├── fixtures/
│   └── engine.js                 # Shared contract constants, simulators, state machines
├── tier1_features.test.js        # Tier 1: Feature Coverage (>=5 tests per feature across F1-F8)
├── tier2_boundaries.test.js      # Tier 2: Boundary & Corner Cases (>=5 tests per feature)
├── tier3_cross_feature.test.js   # Tier 3: Cross-Feature Multi-System Interactions
├── tier4_scenarios.test.js       # Tier 4: Real-World Persona & Production Application Scenarios
└── runner.js                     # Unified, standalone CLI test runner (ANSI + JSON output)
```

### Tier Descriptions & Coverage Mandates

| Tier | Focus | Requirement | Implemented |
|---|---|---|---|
| **Tier 1: Feature Coverage** | Primary happy-path coverage across all 8 core features | $\ge 5$ test cases per feature | **40 tests** (5 per feature $\times$ 8) |
| **Tier 2: Boundary & Corner Cases** | Edge conditions, adversarial inputs, error status codes | $\ge 5$ test cases per feature | **40 tests** (5 per feature $\times$ 8) |
| **Tier 3: Cross-Feature Interactions** | Multi-system workflows spanning wallet, posts, contracts, RAG, 3D | Complex multi-step interaction flows | **5 interaction flows** |
| **Tier 4: Real-World Scenarios** | End-to-end user journeys (machinist, contributor, operator, supervisor, guest) | $\ge 5$ realistic user scenarios | **5 complete scenarios** |
| **Total Test Suite** | Full ecosystem verification | $\ge 90$ tests total | **90 test cases (100% passing)** |

---

## 3. Feature Inventory & Test Mapping Matrix

| Feature Key | Feature Name | Tier 1 (Happy Path) | Tier 2 (Boundary & Corner) | Tier 3 (Integration) | Tier 4 (Scenario) |
|---|---|---|---|---|---|
| **F1** | Wallet Connection & Address Formatting | `T1-F1-01` to `T1-F1-05` (BridgeKey, Chain ID, address truncation, EIP-191, event sync) | `T2-F1-01` to `T2-F1-05` (missing provider, zero address, malformed hex, invalid chain, tampered sig) | `T3-FLOW-01`, `T3-FLOW-04` | `T4-SCENARIO-01`, `T4-SCENARIO-05` |
| **F2** | EXPEN ERC-20 Tokenomics & Minting | `T1-F2-01` to `T1-F2-05` (symbol/name, 18 decimals, operator mint, non-operator revert, pause) | `T2-F2-01` to `T2-F2-05` (50 EXPEN cap, 49$\rightarrow$50 pass / 50$\rightarrow$60 fail, 24h rollover, zero mint, zero addr) | `T3-FLOW-01`, `T3-FLOW-04` | `T4-SCENARIO-01`, `T4-SCENARIO-02` |
| **F3** | 5 Core Routes Response/Rendering | `T1-F3-01` to `T1-F3-05` (Home `/`, Community `/community`, Onboarding `/onboarding`, Agent `/agent`, Marketplace `/marketplace`) | `T2-F3-01` to `T2-F3-05` (404 dark boundary, invalid filter params, price query clamp, null product link, reduced motion) | `T3-FLOW-01`, `T3-FLOW-03` | `T4-SCENARIO-01` to `T4-SCENARIO-05` |
| **F4** | Post Creation & Firestore Schema | `T1-F4-01` to `T1-F4-05` (valid creation, 5 post types, chronological query, public read, wallet attribution) | `T2-F4-01` to `T2-F4-05` (empty title rejection, short content rejection, invalid enum, XSS sanitization, invalid wallet) | `T3-FLOW-01`, `T3-FLOW-02` | `T4-SCENARIO-01`, `T4-SCENARIO-02`, `T4-SCENARIO-05` |
| **F5** | Server-Side Reward API (`/api/posts`) | `T1-F5-01` to `T1-F5-05` (10 EXPEN allocation, 66-char txHash, payload format, post reward flag, operator gas) | `T2-F5-01` to `T2-F5-05` (replayed nonce 401, fraudulent sig 401, 50 EXPEN cap 429, empty body 400, txHash format) | `T3-FLOW-01`, `T3-FLOW-04` | `T4-SCENARIO-01`, `T4-SCENARIO-02` |
| **F6** | Sarvam AI Client & Streaming RAG | `T1-F6-01` to `T1-F6-05` (sarvam-105b, BM25 scoring, context assembly, SSE streaming, EN/HI/MR routing) | `T2-F6-01` to `T2-F6-05` ($\le 1500$ token limit, unknown lang fallback, empty posts fallback, zero score, Devanagari density) | `T3-FLOW-02`, `T3-FLOW-05` | `T4-SCENARIO-03` |
| **F7** | Marketplace Catalog & Filtering | `T1-F7-01` to `T1-F7-05` (10 products seed data, category filter, price bounds, keyword search, demo checkout) | `T2-F7-01` to `T2-F7-05` (zero matches state, search injection sanitization, invalid SKU 404, invalid buyer wallet, extreme bounds) | `T3-FLOW-03` | `T4-SCENARIO-04` |
| **F8** | 3D Showcase Geometry Metadata | `T1-F8-01` to `T1-F8-05` (Lathe & Drill registry, PBR materials, OrbitControls damping, procedural fallback, SSR dynamic import) | `T2-F8-01` to `T2-F8-05` (missing CAD fallback, OrbitControls validator, Retina DPR clamp, WebGL context loss, segment bounds) | `T3-FLOW-03` | `T4-SCENARIO-04` |

---

## 4. Runner Invocation & CLI Usage

The test suite is executable via `bun` from the monorepo root:

### Standard Execution
```bash
# Run the entire E2E test suite (90 tests across all 4 tiers)
bun run test:e2e

# Or invoke directly via bun
bun tests/e2e/runner.js
```

### Targeted Execution by Tier
```bash
# Run Tier 1 Feature Coverage tests only (40 tests)
bun tests/e2e/runner.js --tier=1

# Run Tier 2 Boundary & Corner Case tests only (40 tests)
bun tests/e2e/runner.js --tier=2

# Run Tier 3 Cross-Feature Interaction flows only (5 tests)
bun tests/e2e/runner.js --tier=3

# Run Tier 4 Real-World Application scenarios only (5 tests)
bun tests/e2e/runner.js --tier=4
```

### Targeted Execution by Feature
```bash
# Filter all tests associated with F2 (EXPEN Tokenomics)
bun tests/e2e/runner.js --feature=F2

# Filter all tests associated with F6 (Sarvam AI & RAG Engine)
bun tests/e2e/runner.js --feature=F6
```

### CI / Automation Output
```bash
# Output machine-readable JSON summary for CI pipelines
bun tests/e2e/runner.js --json
```

---

## 5. Coverage Thresholds & Quality Invariants

1. **Pass Rate Threshold**: 100% required. Zero test failures tolerated.
2. **Minimum Feature Test Density**:
   - Tier 1: $\ge 5$ distinct test cases per feature.
   - Tier 2: $\ge 5$ distinct boundary/corner cases per feature.
3. **Execution Latency**:
   - Entire 90-test suite runs in under 100ms on standard machines (measured ~15ms on Bun 1.3).
4. **Deterministic Isolation**:
   - Every test case initializes its own test fixtures or resets simulators.
   - Zero state leakage between successive test runs or out-of-order execution.
5. **Specification Compliance**:
   - MST Testnet Chain ID: `91562037` (`0x5752035`).
   - Token Decimals: `18`.
   - Reward Per Post: `10 * 10^18` wei.
   - Daily Cap Per Wallet: `50 * 10^18` wei.
   - Max RAG Prompt Budget: $\le 1500$ tokens.
   - Languages Supported: `en`, `hi`, `mr`.
