# Expendry User Manual

Welcome to **Expendry** ("Where experience is never retired"), the community-driven manufacturing ecosystem connecting veteran machinists to tokenize hard-earned operational knowledge into EXPEN tokens on MST testnet, consult a Sarvam AI RAG assistant in multiple languages (English, Hindi, Marathi), and inspect 3D tooling models interactively.

---

## 1. Getting Started & Wallet Onboarding
1. **Connect Web3 Wallet**: Connect BridgeKey or MetaMask to MST Testnet (Chain ID `91562037`).
2. **Cryptographic Identity Verification**: Sign an EIP-191 authentication challenge (`personal_sign`) to verify wallet ownership without gas fees.
3. **Machinist Profile Setup**: Enter your name, designation, and workshop organization. For hackathon evaluation and testing, you can use the one-click quick presets for *Rameshwar Kulkarni* (Aerospace Turning Specialist) or *Devendra Patil* (Tool & Die Master).

---

## 2. Community Knowledge Feed & Token Rewards
- **Browse Tacit Knowledge**: Explore shop-floor calibration tricks, chatter dampening techniques, and fixturing advice across 5 structured post categories:
  - `Experience Story`: Long-form troubleshooting narratives from decades of machining.
  - `Blueprint Share`: Technical drawings, CAD parameters, and dimension tolerances.
  - `Setup Tip`: Spindle speed, feed rate, and tool flank coolant advice.
  - `Idea`: Innovative fixturing jigs, scrap reduction concepts, and tool wear solutions.
  - `Video / Voice Note`: Tacit voice calibrations and operational notes.
- **Earn EXPEN On-Chain**:
  - Every verified post mints **10 EXPEN tokens** directly to your connected wallet.
  - Gasless operator smart contract minting on MST Testnet.
  - Enforced daily safety cap of **50 EXPEN per day per wallet** (resets automatically at 00:00 UTC).

---

## 3. Tooling Marketplace
- **Industrial Tooling Catalog**: High-precision carbide inserts, end mills, face mills, drill bits, toolholders, and metrology instruments.
- **Dual Currency Pricing**: View prices transparently in USD and EXPEN token equivalent (`1 USD = 2 EXPEN`).
- **Metallurgical Matrix**: Inspect substrate chemistry (WC-Co Sub-micron Grain 0.6μm), hardness (HV30), thermal oxidation limits, and ISO 2768-mK tolerances.
- **3D Inspection Ready**: Click the `[3D INSPECTION READY]` badge on any eligible product to immediately load that tool geometry into the CAD/CAM 3D viewer.

---

## 4. CAD/CAM 3D Tooling Inspector (`/showcase`)
- **Interactive 3D Workstation**: Real-time WebGL PBR rendering with Three.js and OrbitControls.
- **4-Station CNC Tool Turret**:
  - `[1] T-01`: Indexable Lathe Turning Tool (CNMG 432 TiN insert & clamping wedge).
  - `[2] T-02`: Precision Carbide Twist Drill Bit (Helical dual-spiral flutes with 140° split point).
  - `[3] T-03`: 4-Flute Solid Carbide Square End Mill (AlTiN nano-composite, 38° helix flutes).
  - `[4] T-04`: Indexable 45° Face Milling Shell Cutter (42CrMo4 disc shell, FMA22 arbor mount, 4 SEET 12T3 inserts).
- **Inspection Tools**:
  - *Dimensional Calipers HUD*: Real-time digital leader lines showing overall length (125.00mm ±0.005) and shank tolerance (25.00mm h6).
  - *Lighting Environment Presets*: Switch between `Toolroom (5000K)`, `Studio Rim`, and `Laser Inspection (532nm)`.
  - *Controls*: Left-click to orbit, scroll to zoom, arrow keys for ±15° step rotation, and wireframe toggle.

---

## 5. Sarvam AI Machining Assistant (`/agent`)
- **Multilingual Operator Consultation**: Ask complex machining questions in **English**, **Hindi (हिन्दी)**, or **Marathi (मराठी)**.
- **Voice Input (STT)**: Click the microphone to dictate queries directly from noisy shop floors with visual acoustic pulse indicators.
- **BM25 RAG Grounding**: The assistant retrieves exact quotes, tolerances, and blueprints from verified community posts, displaying author attribution and MSTScan blockchain transaction links.
- **Quick Diagnostic Chips**: Instant access to common shop-floor queries (*Inconel 718 Chatter*, *D2 Die Thermal Drift*, *Carbide Notch Wear*, *Titanium Tapping Pressure*).

---

## 6. Network & Blockchain Verification
- **Network**: MST Testnet
- **Chain ID**: `91562037`
- **EXPEN Token Address**: `0x56F0f0688a5A7Ce5063065b778C202078696283a`
- **Block Explorer**: [MSTScan Testnet Explorer](https://scan.mstblockchain.com)
