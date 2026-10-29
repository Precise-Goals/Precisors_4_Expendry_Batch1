# DESIGN.md — Expendry Design System & Tokens
> Luxury Precision Industrial Workstation Architecture — White Main Palette, Green, Black, and Calibrated Orange

```yaml
system:
  name: Expendry Machine Tool UI
  density: compact-industrial
  theme: white-main-precision
colors:
  base: "#ffffff"
  surface: "#ffffff"
  surface-hover: "#f4f4f5"
  secondary: "#f4f4f5"
  primary: "#16a34a"
  primary-hover: "#15803d"
  primary-dim: "rgba(22, 163, 74, 0.12)"
  orange: "#ea580c"
  orange-hover: "#c2410c"
  orange-dim: "rgba(234, 88, 12, 0.12)"
  border: "#e4e4e7"
  border-bright: "#d4d4d8"
  text-primary: "#09090b"
  text-dim: "#52525b"
  text-muted: "#71717a"
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
   - Dynamic radial specular lighting (`specular-interactive`) projecting green (`#26d464`) and calibrated safety orange (`#f97316`) reflections based on relative pointer coordinates.

3. **Lenis-Inspired Smooth Scroll Engine (`SmoothScrollProvider.jsx`)**:
   - Client-side requestAnimationFrame inertial lerp scroll engine (0.09 easing factor).
   - Graceful fallback and preservation of native momentum scrolling on mobile touchscreens and `prefers-reduced-motion`.

4. **Draco 3D Asset Compression & WebGL Optimization**:
   - Three.js 60fps rendering pipeline with Google Draco WASM decoder hooks (`initDracoLoader()`).
   - Anti-aliased PBR metallic/roughness shaders with dynamic caliper overlays (±0.005mm).

---

## 2. Color Palette & Lighting (White Main, Green, Black & Orange)

The Expendry palette is an austere, high-contrast industrial spectrum engineered with **White as the main canvas color**:

- **Pure White (`#ffffff`) — The Main Color**: The dominant background, main viewport surface, and primary container foundation. Delivers crisp clarity and high daylight visibility.
- **Surface & Secondary Layer (`#f4f4f5` / `#ffffff`)**: Elevated chassis, card containers, inputs, and interactive bays with hairline milled borders (`#e4e4e7`).
- **Precision Machining Green (`#16a34a` / `#26d464`)**: The signature phosphor indicator lamp for operational status, valid token mints, primary action buttons, active tabs, and live beacons.
- **Deep Precision Black (`#09090b` / `#000000`)**: High-contrast typography, headings, contrast badges, structural dividers, datum markers, and engineering callouts.
- **Calibrated Tactile Orange (`#ea580c` / `#f97316`)**: Precision industrial accent for laser alignment reticles (532nm), ISO-2768 datum callouts, tolerance calipers, warning badges, and tactile hover highlights ("a little bit of orange").
- **Milled Zinc Grey (`#52525b` / `#71717a`)**: Secondary readouts meeting strict WCAG contrast ratios against the white background.

### Palette Architecture
- **White as Main Palette**: Per operator directive, the website adopts **White as the main color**, with **Green** as the primary accent, **Black** for high-contrast typography and structural definition, and **Orange** as the precise secondary accent.

---

## 3. Typography Architecture

- **Headings & Display**: Montserrat (bold, uppercase tracking, mechanical weight, rendered in crisp `#ffffff`).
- **Body & Paragraphs**: Poppins (geometric, clear, humanized technical reading).
- **Telemetry & DRO Numeral Readouts**: JetBrains Mono / monospace (tabular numbers `font-variant-numeric: tabular-nums` to prevent layout jitter during live value changes).
