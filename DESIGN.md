# DESIGN.md — Expendry Design System & Tokens
> Luxury Precision Industrial Workstation Architecture

```yaml
system:
  name: Expendry Machine Tool UI
  density: compact-industrial
  theme: dark-monochrome-precision
colors:
  base: "#0a0a0a"
  surface: "#121212"
  surface-hover: "#1c1c1c"
  secondary: "#161616"
  primary: "#26d464"
  primary-hover: "#21b856"
  primary-dim: "rgba(38, 212, 100, 0.15)"
  tech-blue: "#38bdf8"
  tech-blue-hover: "#0284c7"
  tech-blue-dim: "rgba(56, 189, 248, 0.15)"
  border: "#262626"
  border-bright: "#383838"
  text-primary: "#ededed"
  text-dim: "#a1a1aa"
  text-muted: "#a1a1aa"
  metal-steel: "#4a5568"
  metal-titanium: "#718096"
  carbide-dark: "#1a202c"
typography:
  headings: "Montserrat, -apple-system, sans-serif"
  body: "Poppins, -apple-system, sans-serif"
  code-readout: "JetBrains Mono, SF Mono, monospace"
motion:
  physics: "spring(stiffness: 380, damping: 30, mass: 0.8)"
  smooth-scroll: "inertial lerp (0.09 easing factor)"
```

---

## 1. Design Engineering Core Principles

Expendry brings software craftsmanship to high-precision heavy industry. It is designed for seasoned machinists, aerospace toolmakers, and industrial investors who value tactile restraint, mechanical truth, and zero generic fluff.

### Key Motion & Interaction Disciplines
1. **Emil Kowalski Micro-Feedback Refinement**:
   - Tactile button spring compression (`active:scale-[0.97]` with rapid spring release).
   - Fluid spring physics using Framer Motion (`stiffness: 380`, `damping: 30`, `mass: 0.8`).
   - Context-aware layout morphs with shared `layoutId` pill indicators.

2. **Magnetic Element Tracking (`MagneticTrack.jsx`)**:
   - Buttons, hero CTAs, and interactive cards track the user's cursor with subtle magnetic attraction.
   - Dynamic radial specular lighting (`specular-interactive`) projecting green (`#26d464`) and technical blue (`#38bdf8`) reflections based on relative pointer coordinates.

3. **Lenis-Inspired Smooth Scroll Engine (`SmoothScrollProvider.jsx`)**:
   - Client-side requestAnimationFrame inertial lerp scroll engine (0.09 easing factor).
   - Graceful fallback and preservation of native momentum scrolling on mobile touchscreens and `prefers-reduced-motion`.

4. **Draco 3D Asset Compression & WebGL Optimization**:
   - Three.js 60fps rendering pipeline with Google Draco WASM decoder hooks (`initDracoLoader()`).
   - Anti-aliased PBR metallic/roughness shaders with dynamic caliper overlays (±0.005mm).

---

## 2. Color Palette & Lighting

The Expendry palette is an austere, high-contrast industrial spectrum engineered to simulate CNC lathe optical consoles:

- **Deep Obsidian Black (`#0a0a0a`)**: The base void canvas.
- **Surface Layer (`#121212`)**: Elevated chassis and card containers with milled hairline specular highlights (`specular-card`).
- **Precision Machining Green (`#26d464`)**: The primary phosphor indicator lamp for operational status, valid token mints, and active controls.
- **Technical Precision Blue (`#38bdf8`)**: A restrained technical accent for laser alignment reticles (532nm), ISO-2768 datum callouts, and telemetry indicators.
- **Crisp Silver-White (`#ededed`)**: High-contrast, non-glare text for toolroom legibility.
- **Milled Zinc Grey (`#a1a1aa`)**: Secondary readouts meeting strict WCAG 5.8:1 contrast ratios.

---

## 3. Typography Architecture

- **Headings & Display**: Montserrat (bold, uppercase tracking, mechanical weight).
- **Body & Paragraphs**: Poppins (geometric, clear, humanized technical reading).
- **Telemetry & DRO Numeral Readouts**: JetBrains Mono / monospace (tabular numbers `font-variant-numeric: tabular-nums` to prevent layout jitter during live value changes).
