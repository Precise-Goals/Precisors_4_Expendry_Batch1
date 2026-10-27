\# Expendry — Raw Project Brief



> Working name: \*\*Expendry\*\* (E-X-P-E-N-D-R-Y)

> Status: Pre-build / architecture phase

> Source: Hackathon Problem 2 (Manufacturing) + founder's product vision



\---



\## 1. Hackathon Context



\*\*Problem 2 (Manufacturing): When experience walks out the door\*\*



Much of what makes a machined part come out right lives in experienced operators' heads: setup tricks, small adjustments, the sound of a tool about to fail. When they leave or retire, that knowledge goes with them, and new operators take months to catch up.



\*\*Core question:\*\* How might a factory capture and pass on this know-how?



\*\*Suggested lanes:\*\* capturing knowledge via video / voice / notes; searchable assistants built on that knowledge; step-by-step guidance for new operators.



\### Judging Criteria



| Criterion | Points | What judges look for |

|---|---|---|

| Problem understanding and user insight | 25 | Who is affected and why; learned from real people |

| Originality of the solution | 20 | A fresh approach, not the obvious first idea |

| Fit and feasibility | 20 | Why this is the best option and how it works in real life |

| Prototype | 20 | A working version of the most important part |

| Presentation and Q\&A | 15 | Clear, on time, confident answers |



\*\*Implication:\*\* the prototype must demo the \*most important part\* end-to-end (experience post → token reward → discoverable knowledge), not every page at full depth.



\---



\## 2. Product Vision



\*\*Expendry\*\* is a community-driven marketplace ecosystem where \*\*experience is an asset that doesn't get discarded\*\*. When senior workers retire or are let go, their knowledge shouldn't be wasted.



Three pillars:



1\. \*\*Marketplace\*\* — an e-commerce style store for products sold in the manufacturing / machining industry (host, list, buy).

2\. \*\*Experience Community\*\* — a LinkedIn-style feed where veteran operators share knowledge, blueprints, ideas, and setup tricks, and are \*\*rewarded with tokens\*\*.

3\. \*\*3D Showcase\*\* — a page that presents the \*\*top two best-selling products\*\* as interactive 3D models.



Plus a cross-cutting layer:



4\. \*\*AI Agent\*\* — a voice-capable guide that helps users navigate the platform and understand the marketplace and community.



\*\*Tagline idea:\*\* \*Where experience is never retired.\*



\---



\## 3. Tokenomics (Experience → Value)



\- \*\*Token:\*\* `EXPEN` (Expend token)

\- \*\*Reference value:\*\* 1 EXPEN ≈ \*\*0.001 ETH\*\* (minimal / indicative)

\- \*\*Network:\*\* \*\*MST blockchain\*\*, currently on \*\*testnet\*\* only

\- \*\*Earning mechanism:\*\* veteran employees publish posts (knowledge, blueprints, ideas, experiences) and receive EXPEN as a reward

\- \*\*Post model:\*\* LinkedIn-like, with multiple post types (see §5.2)

\- \*\*Goal:\*\* tokenize experience so sharing know-how has a tangible, recorded reward



> Note: since it's testnet, tokens carry no real monetary value yet. The 0.001 ETH figure is a design reference for later.



\---



\## 4. Tech Stack \& Project Setup



| Item | Decision |

|---|---|

| Framework | Next.js (App Router implied) |

| Language | \*\*JavaScript only — no TypeScript\*\* |

| React Compiler | \*\*No\*\* |

| Cache Components | \*\*Yes\*\* |

| Import alias | \*\*No\*\* |

| `AGENTS.md` | \*\*Yes\*\* |

| Styling | Tailwind CSS |

| UI libraries | High-quality, performant, open-source (navbar included) |

| 3D | Performant 3D UI library (e.g., Three.js ecosystem) — TBD |

| Blockchain | MST testnet |

| MCP | Scan all available MCP servers and record them in the existing `mcp.md` (do \*\*not\*\* create it — it already exists in the directory) |



\---



\## 5. Information Architecture



\### 5.1 Navbar (5 pages)



Assumed mapping (confirm in questions):



1\. \*\*Home\*\*

2\. \*\*About\*\*

3\. \*\*Marketplace\*\*

4\. \*\*Community\*\*

5\. \*\*3D Showcase\*\* (top two products in 3D)



The \*\*Agent\*\* is assumed to be a global floating assistant rather than a navbar page.



\### 5.2 Page Details



\*\*Home\*\*

\- Hero explaining the "experience walks out the door" problem and Expendry's answer

\- Entry points to Marketplace, Community, 3D Showcase

\- Agent introduction



\*\*About\*\*

\- Mission, problem story, how tokenized experience works, team



\*\*Marketplace\*\*

\- Hosts industry products (machined parts / tools / manufacturing-related goods) — products are defined by the team; the marketplace is self-built

\- Normal e-commerce: browse, product detail, buy

\- \*\*No ratings/reviews for now\*\*

\- Cart / checkout scope: TBD (see questions)



\*\*Community (blockchain-based)\*\*

\- LinkedIn-style feed

\- Post types (proposed): Experience story, Blueprint share, Idea, Setup tip / troubleshooting, Video / voice note

\- Veteran employees post → earn EXPEN

\- Wallet connection to MST testnet

\- Aligns with hackathon lanes: capture via video / voice / notes



\*\*3D Showcase\*\*

\- Interactive 3D viewer for the \*\*top two selling products\*\*

\- Rotate / zoom / inspect; links to purchase

\- "Models are simple; we'll declare them later"



\*\*Agent (global)\*\*

\- Conversational + \*\*voice\*\* (speech in/out)

\- Explains the platform, the marketplace, the community, and tokens

\- Navigates users to the right page

\- Future: searchable assistant over community knowledge (hackathon lane 2)



\---



\## 6. Design System



\*\*Theme:\*\* dark mode primary



\*\*Palette\*\*

\- Black (base)

\- Green (primary accent)

\- White (text / contrast)

\- Dark / ocean blue (secondary accent, used sparingly)

\- Subtle \*\*grain / noise texture\*\* overlay



\*\*UI principles\*\*

\- Minimal yet "maximalistic" in detail — clean surface, rich micro-details

\- \*\*Centered layout\*\* throughout

\- Generous spacing / whitespace

\- \*\*Accessibility first\*\* (contrast, focus states, keyboard nav, ARIA, reduced motion)

\- Navbar and components built on open-source libraries



\---



\## 7. Hackathon Alignment Map



| Hackathon lane | Expendry feature |

|---|---|

| Capture knowledge via video / voice / notes | Community posts (text, video, voice notes, blueprints) |

| Searchable assistants on that knowledge | Agent (voice + chat) over community content |

| Step-by-step guidance for new operators | Future: guided walkthroughs derived from veteran posts |

| User insight (25 pts) | Interviews with operators / retirees — \*\*needed\*\* |

| Originality (20 pts) | Tokenized experience + marketplace + 3D, not just a wiki |

| Prototype (20 pts) | Working post → reward loop + agent demo |



\---



\## 8. Open Questions



\### Product \& Scope

1\. \*\*Navbar:\*\* is my mapping right — Home, About, Marketplace, Community, 3D Showcase — with the Agent as a floating widget? Or is the Agent one of the five?

2\. \*\*"Industry" page:\*\* you mentioned "like industry which we are defining some of the products." Is that a separate page/section, or just the category structure inside Marketplace?

3\. \*\*Prototype focus:\*\* which single flow should be the \*working\* demo for judges — (a) veteran posts → earns EXPEN, (b) agent answers from community knowledge, or (c) marketplace purchase?

4\. \*\*Target user:\*\* is the primary user the retiring operator (contributor), the new operator (learner), the factory owner (buyer), or all equally?

5\. \*\*Who sells in the marketplace?\*\* Only Expendry, or can veterans / factories list their own products?



\### Blockchain \& Tokens

6\. \*\*"MST blockchain":\*\* can you confirm the exact chain name (e.g., Mantle? something else?), testnet RPC URL, chain ID, and faucet?

7\. \*\*Token contract:\*\* do we deploy an ERC-20 `EXPEN` contract ourselves, or is one already deployed? Who holds the minting authority?

8\. \*\*Reward rules:\*\* fixed tokens per post, or based on post type, quality, upvotes, or peer validation? Any anti-spam / anti-farming limits?

9\. \*\*Wallet:\*\* which wallet connection (MetaMask / WalletConnect / embedded wallet)? Do users need a wallet to \*read\* the community?

10\. \*\*On-chain vs off-chain:\*\* are posts stored on-chain (hash / IPFS pointer) or only the reward transaction?

11\. \*\*Spending EXPEN:\*\* can tokens be used in the Marketplace (discounts / payment), or only earned and displayed for now?



\### Data \& Backend

12\. \*\*Backend / database:\*\* which one (Supabase, Firebase, MongoDB, Postgres)? Auth method (wallet-only, email, social)?

13\. \*\*Media storage:\*\* where do videos / voice notes / blueprints live (Cloudinary, S3, IPFS, UploadThing)?

14\. \*\*Product data:\*\* do you have the product list, images, and prices, or should I seed mock data?



\### Marketplace

15\. \*\*Checkout depth:\*\* cart + checkout form with mock payment, or just a "Buy" button for now? Any payment gateway (Stripe / Razorpay) planned?

16\. \*\*Which two products\*\* are the "top sellers" for the 3D page, and do you have GLB/GLTF models, or should we use placeholders?



\### Agent

17\. \*\*LLM provider\*\* for the Agent (Claude API, OpenAI, etc.) and \*\*voice stack\*\* (browser Web Speech API vs. ElevenLabs / OpenAI TTS-STT)?

18\. \*\*Agent knowledge:\*\* only platform FAQs for now, or retrieval over community posts (RAG) in the prototype?

19\. \*\*Languages:\*\* English only, or multilingual (e.g., Hindi / Marathi) for shop-floor operators?



\### Design \& Tech

20\. \*\*UI libraries:\*\* any preferences (shadcn/ui, Aceternity UI, Magic UI, Framer Motion / Motion, React Three Fiber + drei)? Otherwise I'll propose a set.

21\. \*\*Fonts / logo:\*\* do you have brand assets, or should I propose a direction?

22\. \*\*Deployment:\*\* Vercel? Any demo-day constraints (offline fallback, time limit)?

23\. \*\*User research:\*\* have you spoken to real operators / retirees yet? The judging gives 25 points for this, so we should plan quotes or interview insights for the presentation.



\---



\## 9. Next Steps (once questions are answered)



1\. Finalize the architecture doc (routes, data models, contract interface)

2\. Update `mcp.md` with the scanned MCP servers (file already exists)

3\. Scaffold the Next.js app (JS, Tailwind, Cache Components, `AGENTS.md`)

4\. Build design tokens (palette, grain, typography)

5\. Build the prototype's critical path first, then the remaining pages

