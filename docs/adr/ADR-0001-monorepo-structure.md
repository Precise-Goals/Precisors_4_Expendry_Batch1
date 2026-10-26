# ADR-0001: Turborepo Monorepo Architecture with Isolated Packages

## Status
Accepted

## Context
Expendry encompasses three tightly coupled but technologically distinct domains:
1. **Frontend & AI Application**: Next.js 16 App Router (pure JavaScript, Tailwind 4, Turbopack, React Three Fiber, Sarvam AI RAG client).
2. **Blockchain Smart Contracts**: Hardhat with Solidity ^0.8.20 and OpenZeppelin v5 targeting MST Testnet (Chain ID 91562037).
3. **Shared Infrastructure**: Shared constants (network endpoints, chain IDs, reward caps) and compiled contract ABIs.

We evaluated architectural options to optimize developer velocity, maintain strict boundary isolation, and ensure clean CI/CD validation.

## Decision
We adopted a **Turborepo monorepo managed via Bun workspaces**, partitioned into three distinct packages:
- `packages/contracts`: Hardhat development environment for the `EXPEN.sol` ERC-20 contract, deployment scripts, unit tests, and Slither security auditing.
- `packages/shared`: Zero-dependency ES module package publishing network constants (`CHAIN_ID`, `RPC_URL`, `EXPLORER_URL`, `POST_TYPES`) and auto-generated contract deployment artifacts (`EXPEN_ADDRESS`, `EXPEN_ABI`).
- `packages/web`: Modern Next.js 16 frontend consuming `@expendry/shared` / `shared/*` to communicate with the smart contracts on MST Testnet and Firebase services.

## Rationale
- **Single Source of Truth for ABIs**: Deploying contracts directly writes the address and ABI to `packages/shared/src/contracts.js`, ensuring the frontend and backend API routes never suffer from ABI drift or out-of-sync contract addresses.
- **Strict Boundary Isolation**: Solidity tooling, Hardhat plugins, and Slither remain isolated within `packages/contracts`, preventing dependency contamination with Next.js and React 19.
- **Fast Turborepo Pipeline**: Enables independent caching and parallel execution of contract testing (`bun run test --filter=contracts`) and web compilation (`bun run build --filter=web`).
- **Unified Tooling**: Unified dependency management and script execution from the root using Bun (`bun.lock`, root scripts).

## Alternatives Considered
1. **Single Monolithic Next.js Project**: Placing contract files and Hardhat inside `packages/web/contracts` causes compilation conflicts between Next.js Turbopack and Hardhat's Node.js toolchain, and pollutes client bundles with Hardhat dependencies.
2. **Multiple Independent Git Repositories**: Managing separate repos for frontend and contracts creates high coordination friction, requiring manual releases or copy-pasting of ABI files and contract addresses between repos.

## Consequences
- **Positive**:
  - Predictable, deterministic builds across the entire stack.
  - Type and constant synchronization across web client and API routes.
  - Disjoint lane execution and clear path allow-lists in development harness.
- **Negative**:
  - Requires workspace configuration (`jsconfig.json` paths and workspace packages) in package managers.
