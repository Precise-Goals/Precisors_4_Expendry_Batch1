# docs/memory/interview.md — Discovery Q&A
<!-- generated-by: harness v1 | source: prompt.md | hash: interview-round1-3 -->

Session: 2026-10-27 | Mode A→B | Orchestrator

---

## Round 1 — Scope & Prototype

**Q1: Navbar mapping — is this right: Home · About · Marketplace · Community · 3D Showcase (5 pages), with the AI Agent as a global floating widget?**
A1: Agent IS one of the 5 navbar pages (replaces About). About info goes inside Home hero.

**Q2: Prototype priority — which single flow must be WORKING end-to-end for the hackathon demo?**
A2: All three, maximally reliable, including RAG pipelines using several RAG JS frameworks:
  1. Veteran posts → earns EXPEN (deep + reliable)
  2. Agent answers via RAG over posts (shallow working)
  3. Marketplace browse (each at shallow but working depth)

**Q3: EXPEN token — current state?**
A3: No contract deployed yet — we deploy an ERC-20 EXPEN ourselves on MST testnet. Operator address already in `.env`.

**Q4: Backend / database?**
A4: Firebase (Firestore + Auth, no Storage). Map wallet addresses to Firebase Auth so users can sign in effectively. Wallet abstracted with login + strict onboarding (Discord-like fading-up animations, asking username, email, phone, designation, company, etc.)

**Q5: Checkout depth?**
A5: Browse + product detail + mock "Buy" button (no real payment) — sufficient for hackathon demo.

---

## Round 2 — Agent, UI, Stack

**Q1: Agent as navbar page — which page does it replace?**
A1: Replace "About" with "Agent" in navbar. About content goes inside Home hero.

**Q2: Demo priority order?**
A2: All three work for demo, order: 1) veteran posts → EXPEN, 2) agent RAG over posts, 3) marketplace browse.

**Q3: Agent AI stack?**
A3: Sarvam AI (API key already in `.env`). Models: `sarvam-105b-conversations`.

**Q4: UI libraries?**
A4: shadcn/ui (base) + Aceternity UI (hero/card effects) + React Three Fiber + drei (3D) + Framer Motion (page transitions).

**Q5: Agent language support?**
A5: English + Hindi + Marathi (multilingual for shop-floor operators).

---

## Round 3 — Blockchain & Data

**Q1: EXPEN reward rules?**
A1: Fixed 10 EXPEN per post, with 50 EXPEN/day per-wallet cap to prevent farming.

**Q2: Wallet connection method?**
A2: BridgeKey wallet (EIP-1193 compatible, Chrome extension ID `bfjojdcfenehemjgjlepdjomkpginlkg`). MetaMask as EVM fallback if BridgeKey not detected. MST Testnet: Chain ID `91562037`, RPC `https://testnetrpc.mstblockchain.com`.

**Q3: Wallet requirement for reading the feed?**
A3: Read feed is open (no wallet required). Wallet required to POST and earn EXPEN.

**Q4: Posts data architecture?**
A4: Posts stored in Firestore (off-chain). Only the EXPEN reward transaction is on-chain (mint call to ERC-20 EXPEN contract).

**Q5: Deployment target?**
A5: Turborepo monorepo, deployed on Vercel.

---

## Round 4 — Brand & Structure

**Q1: BridgeKey wallet — is it MetaMask-compatible?**
A1: See `docs/MST_FACTS.md` — BridgeKey uses EIP-1193 (`window.ethereum` or `window.bridgekey`). MetaMask is fully supported as EVM fallback.

**Q2: Project structure?**
A2: Monorepo with multiple packages (web app + contracts packages).

**Q3: Marketplace product data?**
A3: Seed mock machining/manufacturing products (team was pasting medical devices by mistake — use CNC tools, fixtures, etc.). Team defines real products later.

**Q4: 3D models?**
A4: Placeholder GLB/GLTF files (CNC lathe + drill bit). Team replaces later.

**Q5: Brand assets?**
A5: Fonts: Poppins + Montserrat. No AI-slop design. Dark theme, green accent, grain texture.
