# Coding Standards — Expendry

## 1. Principles
- **Minimal Change Principle**: Modify only what is strictly necessary to satisfy the requirements or fix a bug. Do not perform unrelated refactoring.
- **Genuine Logic Only**: Never hardcode test outputs or create mock facade implementations. Real state, real network calls, real logic.
- **Preserve Comments**: Never delete existing code comments unless the comment itself is the explicit subject of modification.

## 2. Technology Stack Standards

### 2.1 Web Frontend (`packages/web`)
- **JavaScript**: Pure modern JavaScript (ES Modules, JSX). No TypeScript.
- **Framework**: Next.js 16 App Router with Turbopack.
- **Cache Components**: Use Next.js 16 `'use cache'` directives and `cacheLife()` / `cacheTag()` semantics. Route-level `export const dynamic` is superseded by Cache Components.
- **Styling**: Tailwind CSS v4 CSS-first engine. Use Expendry design tokens:
  - Base background: `#0a0a0a`
  - Accent green: `#26d464`
  - Typography: Poppins for body copy, Montserrat for display headings.
- **3D Visualization**: React Three Fiber + Drei wrapped in dynamic import (`ssr: false`) to avoid SSR hydration mismatches.

### 2.2 Smart Contracts (`packages/contracts`)
- **Solidity Version**: `^0.8.20`.
- **Libraries**: OpenZeppelin Contracts `v5` (`ERC20`, `Ownable`, `Pausable`).
- **Constructor Parameters**: OpenZeppelin v5 requires passing `initialOwner` to `Ownable(initialOwner)`.
- **Access Control**: Operator-controlled functions must use `onlyOwner` modifier.
- **Safety Guards**: State-mutating functions must implement `whenNotPaused`.

### 2.3 Shared Package (`packages/shared`)
- Canonical source of truth for contract ABIs, testnet chain IDs, RPC endpoints, and reward constants.
- Export standard ES module constants.

## 3. Formatting & Linting
- Formatting via Prettier (`.prettierrc`).
- Linting via ESLint 9 (`eslint.config.mjs`). Run `bun run lint` before committing.
