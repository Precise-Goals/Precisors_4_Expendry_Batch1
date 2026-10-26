# Changelog

All notable changes to the Expendry platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-27

### Sprint Final — Accessibility Audit, Performance Optimisation, Security Hardening & Monorepo Release

#### Added
- **Accessibility Enhancements**:
  - Semantic heading hierarchy (`h1`-`h3`) and unified ARIA landmark roles across all App Router pages (`a11y(web)`).
  - High-contrast visual palette achieving WCAG 2.1 AA (10.08:1 on `#0a0a0a`) documented in [`harness/artifacts/07-qa.md`](harness/artifacts/07-qa.md).
  - Accessible focus trap in profile setup wizard with Tab cycling and Escape key support (`useFocusTrap`).
  - Feed keyboard navigation, skip links, and ARIA live regions for real-time streaming agent responses.
  - Keyboard rotation controls for Three.js 3D model viewer (Arrow keys rotate in 15° increments).
- **Performance Optimisations**:
  - Partial Pre-rendering (`◐`) enabled for `/community` and `/marketplace` pages via Suspense and Next.js 16 cache components.
  - Next.js Image optimisation across all product listings with responsive `sizes`, `priority`, and blur placeholders.
  - Dynamic code-splitting for heavy dependencies (`PostComposer`, `ModelViewer`) using `next/dynamic`.
  - In-memory Stale-While-Revalidate (SWR) caching layer with 60-second TTL in `useCommunityFeed`.
- **Security & Reliability**:
  - In-memory Token-Bucket rate-limiting middleware on `/api/posts` (10 req/min) and `/api/agent` (20 req/min).
  - Server-side HTML stripping and XSS sanitisation via `isomorphic-dompurify` prior to Firestore write.
  - EXPEN smart contract source code verified on MSTScan testnet ([`deployments.json`](deployments.json)).
  - HTTP Content-Security-Policy (CSP), strict `Referrer-Policy`, and clickjacking protection (`X-Frame-Options: DENY`) via Next.js middleware.
  - OWASP Top 10 security audit and remediation documented in [`harness/artifacts/06b-security.md`](harness/artifacts/06b-security.md).
  - Explicit prototype pollution guards on all public API endpoints.
- **Documentation**:
  - Root [`README.md`](README.md) containing architecture map, one-command setup, env vars, and 5 demo walkthroughs.
  - Root [`CHANGELOG.md`](CHANGELOG.md) in Conventional Changelog format.

---

## [0.3.0] - 2026-10-26

### Sprint 2 — Multilingual Sarvam AI RAG Agent, Marketplace & 3D Interactive Tooling Showcase

#### Added
- **Sarvam AI RAG Assistant**:
  - Native client wrapper integrating Sarvam AI `sarvam-m` LLM, STT (transcribe), and TTS (synthesise).
  - Multilingual support for English, Hindi (`hi`), and Marathi (`mr`) with automatic language detection and code normalization.
  - RAG context injection pipeline querying community posts to augment LLM answers with real machinist expertise.
  - Real-time Server-Sent Events (SSE) streaming chat interface with voice recording and audio playback.
- **Precision Tooling Marketplace & 3D Showcase**:
  - Catalog of 10 precision CNC tools with category filtering, price sliders, and instant search.
  - Interactive WebGL 3D model viewer powered by React Three Fiber and Drei (Carbide Endmill, Lathe Turning Insert, Collet Chuck).
  - Accessible canvas with loading fallback skeleton and arcball orbit controls.

---

## [0.2.0] - 2026-10-26

### Sprint 1 — Design Tokens, Onboarding, Community Feed & Token Mint Loop

#### Added
- **Design System & Theme**:
  - Tailwind CSS 4 industrial dark theme with CSS custom properties (`--color-accent: #26d464`).
  - Reusable accessible UI primitives: `Button`, `Card`, `Badge`, `Input`.
- **Wallet Onboarding & Cryptographic Authentication**:
  - Dual wallet detection supporting BridgeKey (preferred) and MetaMask with automated MST Testnet chain switching.
  - Cryptographic EIP-191 challenge-response signing (`/api/auth/nonce` and `/api/auth/verify`).
  - Single-use nonce tracking with replay attack protection and Firebase custom token session issuance.
- **Machinist Community Feed & EXPEN Token Rewards**:
  - Community feed supporting three post types: "Setup Tip", "Machining Blueprint", and "Tribal Experience".
  - Operator reward minting service distributing 10 EXPEN tokens per post directly to the author's MST wallet.
  - Strict daily reward cap of 50 EXPEN enforced both in smart contract and off-chain service.

---

## [0.1.0] - 2026-10-26

### Sprint 0 — Monorepo Bootstrap, Autonomous Harness & Smart Contracts

#### Added
- Monorepo structure using Bun workspaces (`packages/contracts`, `packages/shared`, `packages/web`).
- OpenZeppelin-based `EXPEN.sol` ERC-20 smart contract with operator-controlled minting, 50 EXPEN daily cap, and emergency pause mechanism.
- Autonomous multi-agent coordination harness with stages, pipeline gates G0-G5, and circuit breakers.
- Hardhat deployment script targeting MST Testnet (Chain ID `91562037`).
- Initial contract test suite covering unit tests, mathematical precision, overflow resistance, and access control.
