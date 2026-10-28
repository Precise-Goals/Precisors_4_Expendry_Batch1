# Product

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Veteran machinists and retiring toolroom operators (contributors sharing setup tricks, tooling advice, blueprints, and tacit troubleshooting knowledge), new CNC/lathe operators (learners seeking discoverable, searchable shop-floor know-how), and factory tooling buyers inspecting machined components.

## Product Purpose
Expendry is a community-driven manufacturing ecosystem connecting veteran machinists to tokenize hard-earned operational knowledge into EXPEN tokens on MST testnet, consult a Sarvam AI RAG assistant in multiple languages (English, Hindi, Marathi), and inspect 3D tooling models interactively.

## Positioning
Unlike static wikis or corporate intranets, Expendry recognizes veteran machinist intuition as a durable economic asset that never gets discarded when workers retire. Community knowledge posts trigger on-chain ERC-20 rewards and feed an AI assistant grounded in authentic shop-floor problem solving.

## Operating Context
Machine shops, factory floors, CNC tool rooms, and web browsers. Often accessed in industrial environments under ambient fluorescent lighting, where high contrast, legible typography, and calm, honest indicators are essential.

## Capabilities and Constraints
- Community feed with 5 distinct post types: Experience Story, Blueprint Share, Idea, Setup Tip, and Video/Voice Note.
- On-chain 10 EXPEN token reward minted per post via operator backend, strictly capped at 50 EXPEN/day per wallet.
- Nonce-based cryptographic wallet authentication (EIP-191 personal_sign) mapped to Firebase custom tokens.
- Multilingual RAG assistant powered by Sarvam AI (`sarvam-105b-conversations`) with STT/TTS support.
- Tooling marketplace with seed machining tools and interactive Three.js 3D lathe/drill inspector.
- Monorepo stack: Next.js 16 App Router (JavaScript), Tailwind CSS 4, Hardhat Solidity.

## Brand Commitments
- Name: Expendry ("Where experience is never retired").
- Palette: Precision Industrial Dark — Obsidian base (`#0a0a0a`), High-contrast elevated surface (`#121212`), Precision Machining Green accent (`#22c55e` / `#26d464`), Silver/White typography (`#ededed`), Muted slate (`#a1a1aa`).
- Typography: Montserrat for confident headings; Poppins for legible body copy.
- Aesthetic: Minimal yet detailed, tactile manufacturing feel, ambient subtle noise texture, zero AI-slop cliches (no side-tab borders, no generic purple gradients, no nested card traps).

## Evidence on Hand
- Seed catalog of 10 authentic machining products in `packages/web/src/data/products.js`.
- Seed machinist knowledge posts in `packages/web/src/data/seed-posts.js`.
- Hardhat ERC-20 EXPEN contract deployed on MST Testnet.

## Product Principles
1. Experience is an asset: every machinist contribution deserves tangible, visible recognition.
2. Shop-floor clarity: prioritize high contrast, generous touch targets, and instant scanability.
3. Authentic craft: reject generic SaaS templates and AI tells; every surface must feel machined, precise, and purposeful.
4. Multilingual inclusivity: respect the linguistic diversity of manufacturing operators with native Hindi and Marathi support.

## Accessibility & Inclusion
WCAG 2.1 AA compliant contrast (≥4.5:1 text contrast), logical tab order, `prefers-reduced-motion` suppression of ambient grain and transitions, explicit focus rings, and screen-reader accessible form controls.

