---
name: Expendry Design System
description: Precision Industrial Dark — A tactile, high-contrast design system tailored for veteran machinists and tooling engineers.
colors:
  base: "#0a0a0a"
  surface: "#121212"
  secondary: "#161616"
  surface-hover: "#1c1c1c"
  primary: "#26d464"
  primary-hover: "#21b856"
  primary-dim: "rgba(38, 212, 100, 0.15)"
  border: "#262626"
  border-bright: "#383838"
  text-primary: "#ededed"
  text-dim: "#a1a1aa"
  text-muted: "#a1a1aa"
  metal-steel: "#4a5568"
  metal-dark: "#1a202c"
typography:
  display:
    fontFamily: "Montserrat, -apple-system, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Montserrat, -apple-system, sans-serif"
    fontWeight: 600
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Poppins, -apple-system, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  telemetry:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontWeight: 500
    letterSpacing: "0.05em"
rounded:
  xs: "2px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "72px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#0a0a0a"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  telemetry-chip:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.text-dim}"
    rounded: "{rounded.xs}"
    padding: "2px 8px"
  card-container:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Expendry

## Overview

**Creative North Star: "The Veteran Toolroom Workstation"**

Expendry evokes the tactile, high-precision aesthetic of heavy CNC machining centers, aerospace inspection granite surface plates, digital readout (DRO) consoles, and technical blueprint drafting. Designed specifically for veteran machinists and tooling engineers, the interface eliminates SaaS visual noise, decorative AI gradients, and whimsical emojis in favor of purposeful contrast, authentic state telemetry, and tactile feedback.

Every surface is built to withstand real shop-floor operating environments: low-glare obsidian backdrops for ambient factory lighting, crisp hairline divisions simulating precision ground tool steel, high-visibility indicator green inspired by calibrated industrial control panels, and tabular digital readouts that present critical measurements without jitter.

**Key Characteristics:**
- **Zero-Emoji Mathematical Vector Iconography**: Pure 1.75px stroke geometric SVG glyphs representing machining tools, acoustic sensors, and coordinate geometry.
- **CAD/CAM 3D Workstation HUD**: Real-time inspection viewport complete with datum crosshairs, dynamic dimensional calipers, and telemetry overlays.
- **Machinist Acoustic Spectrum & Multilingual Telemetry**: Audio feedback rings, acoustic spectrograms, and live state monitoring for voice consultation in English, Hindi, and Marathi.
- **Strict High-Contrast Industrial Palette**: Calibrated charcoal and obsidian base layers anchored by `#26d464` machining green.
- **Fluid Typography with Tabular DRO Numerals**: Balanced Montserrat headings, highly legible Poppins body copy, and monospace tabular numerals for zero-jitter readouts.

---

## Colors

The Expendry palette is an austere, high-contrast industrial spectrum engineered for maximum optical legibility under shop-floor fluorescent lighting. Bright accents are treated like calibrated warning and indicator lamps on a machine tool: used sparingly to command immediate attention.

### Primary
- **Machining Green Accent (`#26d464`)**: The primary signal color. Used for active confirmations, on-chain EXPEN token figures, live telemetry status dots, dimensional caliper lines, and focused interactive states. High visibility with 11.2:1 contrast against `#0a0a0a`.
- **Machining Green Hover (`#21b856`)**: Darkened emerald tone for button hover and active press states.
- **Machining Green Dim (`rgba(38, 212, 100, 0.15)`)**: Low-luminance emerald wash for selection highlights, active badge backgrounds, and subtle field focus halos.

### Secondary & Surface
- **Surface Layer (`#121212`)**: Elevated container and card surface. Provides physical separation from the base canvas without harsh dividing borders.
- **Secondary Recessed (`#161616`)**: Recessed chassis tone used for toolbars, dropdown containers, input fields, and telemetry badge backgrounds.
- **Surface Hover (`#1c1c1c`)**: Subtle highlight for interactive list items, table rows, and clickable cards.

### Neutral & Structural
- **Base Canvas (`#0a0a0a`)**: The deepest obsidian backdrop. Simulates anti-glare CNC monitors and reduces eye strain during prolonged inspection sessions.
- **Structural Border (`#262626`)**: Standard 1px precision border separating functional zones without adding visual weight.
- **Bright Border Highlight (`#383838`)**: Enhanced border for active cards, hovered inputs, and focused modal dialogs.
- **Text Primary (`#ededed`)**: High-contrast silver-white text maintaining an exceptional 14.5:1 contrast ratio against `#0a0a0a`.
- **Text Dim & Muted (`#a1a1aa`)**: Calibrated slate neutral for secondary labels, telemetry timestamps, and captions. Comfortably exceeds WCAG 2.1 AA with a 5.8:1 contrast ratio.

### Tooling Materials (Shaders & Accents)
- **Tool Steel (`#4a5568`)**: Physical shader color for machined carbide, toolholders, and chuck jaws.
- **Carbide Dark (`#1a202c`)**: Cast iron chassis and deep recess shader tone.

### Named Rules
**The Indicator Lamp Rule.** The `#26d464` green accent must never exceed 10% of any given screen's total visual area. When everything glows green, nothing commands attention.

**The No-Faux-White Rule.** Never use pure white (`#ffffff`) for body text or large background surfaces. `#ededed` prevents retina fatigue in low-light shop environments while preserving crisp readability.

---

## Typography

Expendry pairs a bold, technical geometric display face with an open, friendly sans-serif body, underpinned by a strict monospace tabular numeral system for measurements and telemetry.

**Display Font:** `Montserrat` (bold 700, semi-bold 600), fallback: `-apple-system, sans-serif`  
**Body Font:** `Poppins` (regular 400, medium 500), fallback: `-apple-system, sans-serif`  
**Telemetry / DRO Font:** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`  

**Character:** Technical authority meets shop-floor clarity. Headlines command respect with tight tracking and balanced wraps; body copy maintains effortless legibility even on grease-smeared mobile screens.

### Hierarchy & Fluid Type Scale
Expendry employs CSS `clamp()` fluid typography to ensure seamless transitions between mobile devices, workshop tablets, and wide workstation monitors without breakpoint snapping:

- **Hero Display** (`clamp(2.5rem, 2.1rem + 2vw, 3.75rem)`, weight 700, line-height 1.1): Hero banners and primary landing titles. Tracking `-0.02em`, `text-wrap: balance`.
- **Display 4XL** (`clamp(2.25rem, 1.95rem + 1.5vw, 3rem)`, weight 700, line-height 1.15): Major section headlines.
- **Display 3XL** (`clamp(1.875rem, 1.65rem + 1.1vw, 2.25rem)`, weight 600, line-height 1.2): Modal titles, tool showcase titles.
- **Headline 2XL** (`clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem)`, weight 600, line-height 1.25): Card headers, tool catalog names.
- **Title XL** (`clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)`, weight 600, line-height 1.3): Subsections, filter sidebar headers.
- **Body Large LG** (`clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem)`, weight 400, line-height 1.6): Introductory lead paragraphs.
- **Body Base** (`clamp(0.9375rem, 0.9rem + 0.2vw, 1rem)`, weight 400, line-height 1.6): Standard reading copy, forum posts, chat messages. Clamped to 65–75 characters per line (`text-wrap: pretty`).
- **Body Small SM** (`clamp(0.8125rem, 0.78rem + 0.2vw, 0.875rem)`, weight 400, line-height 1.5): Metadata, table cells, secondary hints.
- **Telemetry XS** (`clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem)`, weight 500, letter-spacing `0.05em`, uppercase): Badges, DRO values, coordinate meters, ISO tolerance fits, token amounts.

### Tabular DRO Numerals (Digital Readout)
All numerical telemetry, coordinate meters, token balances, timestamps, and physical tolerances mandate:
```css
font-variant-numeric: tabular-nums;
```
By enforcing monospaced numeral glyphs across all font families, real-time counters, FPS gauges, spindle RPM tachometers, and live balance tallies update smoothly without causing surrounding layout elements to shake or dance.

### Named Rules
**The Tabular DRO Rule.** Any numeric value that changes dynamically (balances, coordinates, tolerances, FPS, countdowns) MUST use `font-variant-numeric: tabular-nums`. Proportional numbers during live data updates are strictly forbidden.

**The 12px Floor Rule.** No text carrying essential operational information may render below 12px (0.75rem). Interactive touch targets must maintain at least 14px body text.

---

## Layout

Expendry layouts mirror the disciplined spatial grids of engineering blueprints and CAD viewports.

- **Hairline Blueprint Grid (`.bg-blueprint-grid`)**: A subtle 48px × 48px coordinate background pattern (`rgba(255, 255, 255, 0.035)`) grounding hero and showcase regions.
- **Corner Datum Crosshairs (`.corner-crosshair`)**: Subtle `+` marks positioned at `[00,00]` and `[100,100]` viewport corners, reinforcing the feeling of an active engineering drafting table.
- **Reading Measure**: Narrative body copy is clamped strictly between 65 and 75 characters (`max-w-prose` or `max-w-3xl`) to eliminate line-tracking fatigue.
- **Spatial Padding Scale**:
  - `xs` (4px), `sm` (8px), `md` (16px), `lg` (24px), `xl` (32px), `2xl` (48px), `3xl` (72px).
  - Containers maintain a minimum internal padding of 16px on mobile and 24px–32px on desktop to ensure content never abuts borders.
- **Breakpoints**: Standardized responsive progression (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`).

---

## Elevation & Depth

Expendry rejects heavy Drop Shadows and blurry neon glows. Depth is expressed through structural tonal layering, precision-milled hairline highlights, and tactile ambient lighting.

- **Tonal Layering Stack**:
  1. Base Canvas (`#0a0a0a`)
  2. Recessed Slots & Toolbars (`#161616`)
  3. Elevated Workstation Panels & Cards (`#121212`)
  4. Interactive Hover Elevation (`#1c1c1c`)
- **Specular Top-Milled Hairline (`.specular-card`)**: Simulates the light reflection along the chamfered edge of a freshly milled block of tool steel:
  ```css
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.07), 0 8px 24px -4px rgba(0, 0, 0, 0.6);
  ```
- **Machinist Glow Elevation (`.glow-card`)**: On hover, interactive cards elevate with a restrained 2px rise and an ambient dark shadow bounded by an emerald edge highlight:
  ```css
  border-color: rgba(38, 212, 100, 0.4);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  transform: translateY(-2px);
  ```
- **HUD Glassmorphism (`.glass-panel`)**: Used exclusively for floating CAD overlays and camera control docks:
  ```css
  background: rgba(18, 18, 18, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid #262626;
  ```
- **Organic Grain Overlay (`.grain`)**: A 3.5% opacity fractal noise overlay across the canvas that provides tactile tooth and eliminates digital gradient banding. Automatically disabled when `prefers-reduced-motion: reduce` is active.

### Named Rules
**The Milled Edge Rule.** Every elevated card must feature a 1px top specular highlight (`inset 0 1px 0 0 rgba(255, 255, 255, 0.07)`) to define its physical top plane against the dark canvas.

**The Honest Depth Rule.** Shadows only exist to convey physical spatial layering or direct user interaction. Never apply decorative floating shadows to static inline text.

---

## Shapes

Expendry form language is defined by machined industrial radii and crisp geometry.

- **Corner Radii**:
  - `rounded-xs` (2px): Telemetry chips, DRO tags, tolerance indicators.
  - `rounded-sm` (4px): Badges, tooltips, segmented switches.
  - `rounded-md` (8px): Action buttons, input fields, dropdown menus.
  - `rounded-lg` (12px): Standard cards, forum post containers, chat bubbles.
  - `rounded-2xl` (16px): 3D CAD viewport workstation frames.
  - `rounded-full` (9999px): Strictly reserved for circular status indicator pips and the primary microphone voice trigger button.
- **Border Architecture**: All borders are strictly 1px (`border` with `#262626` or `#383838`). Heavy 2px, 3px, or 4px colored accent stripes (such as side-tab borders on cards) are strictly banned as AI-generated anti-patterns.

---

## Components

### Buttons
- **Primary Button**: Solid machining green (`#26d464`) with dark obsidian text (`#0a0a0a`), font-weight 600, radius 8px (`rounded-md`), padding `10px 20px`. Hover: `#21b856`. Focus-visible: 2px solid `#26d464` outline with 2px offset.
- **Secondary Button**: Elevated dark background (`#121212`), border 1px (`#262626`), high-contrast text (`#ededed`), radius 8px. Hover: `#1c1c1c` with border `#383838`.
- **Ghost Action**: Transparent background with muted text (`#a1a1aa`). Hover: text `#ededed` with background `rgba(255,255,255,0.05)`.

### Cards & Workstation Containers
- **Standard Card**: `#121212` background, 1px `#262626` border, 12px radius, 24px internal padding.
- **Specular Card**: Incorporates the top milled hairline highlight (`inset 0 1px 0 0 rgba(255, 255, 255, 0.07)`).
- **Glow Card**: Transitions smoothly on hover with `translateY(-2px)` and emerald border glow.

### Mathematical Vector Iconography System
Expendry features a bespoke mathematical vector iconography library designed from first principles for precision tooling:
- **Uniform Stroke Architecture**: Every icon is rendered with a strict 1.75px stroke width (`strokeWidth="1.75"`), rounded caps (`strokeLinecap="round"`), and rounded joins (`strokeLinejoin="round"`).
- **Normalized Viewport**: Standardized `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `aria-hidden="true"`.
- **Zero-Emoji Doctrine**: Emojis are strictly banned across the entire Expendry application. All tool categories, post classifications, state alerts, and status indicators must use uniform vector SVG icons.
- **Icon Catalog**:
  - `IconSpindle`: CNC 4-jaw chuck and spindle rotation geometry.
  - `IconLathe`: Lathe bed, headstock, and tailstock assembly.
  - `IconAcoustics`: Acoustic spectrogram frequency bars.
  - `IconToken`: Hexagonal faceted EXPEN cryptocurrency token with currency bar.
  - `IconBrain`: Neural network RAG knowledge topology.
  - `IconBlueprint`: Engineering grid layout with dimension datum marks.
  - `IconCaliper`: Vernier caliper jaw and depth gauge.
  - `IconWrench`: Combination open-end and box wrench.
  - `IconThermal`: Thermocouple probe and temperature bulb.
  - `IconBolt`: High-voltage electrical and feed-rate spark.
  - `IconClamp`: Heavy-duty machinist workholding clamp.
  - `IconCube3D`: Isometric CAD wireframe bounding box.
  - `IconAlert`: Machined equilateral warning triangle.
  - `IconCheck`: Geometric verification mark with uniform stroke.
  - `IconMic`: Broadcast-grade dynamic transducer microphone.
  - `IconSend`: Precision directional vector projectile.

### CAD/CAM 3D Workstation HUD & Dimensional Calipers System
The 3D Tooling Inspector (`ModelViewer.jsx`) provides a professional CAD/CAM inspection workstation:
- **Viewport Telemetry HUD**:
  - Header telemetry bar with gradient darkening from `#0a0a0a`/90 to transparent.
  - Tool ID & Name: e.g. `T-01: LATHE-BODY` in bold `#26d464`.
  - Geometry Telemetry: Segments and mesh classification (`SEGMENTS: 32 // CYLINDER`).
  - Real-Time Performance Gauge: Green pulsing 60 FPS monitor and PBR metallic index (`PBR METALLIC: 0.85`).
- **CAD Coordinate Ticks**: Four corner crosshair datum coordinates (`+ [00,00]`, `+ [100,00]`, `+ [00,100]`, `+ [100,100]`) in monospace `text-white/20`.
- **Dimensional Caliper Dynamic HUD Lines**:
  - Longitudinal caliper measurement line across model span with 1px `#26d464`/40 hairline and vertical end brackets.
  - Floating tolerance readout badge: `OVERALL LENGTH: 125.00 mm (±0.005)` in `#26d464` with `#0c0c0c`/90 backdrop and 1px border.
  - Transverse caliper line with rotated shank dimension readout: `SHANK: 25.00 h6` adhering to ISO shaft fit standards.
- **Interactive Workstation Controls**:
  - Bottom docked control bar with frosted glass backdrop (`#121212`/90 with backdrop blur).
  - Tactile switches for Auto-Rotation (`ON/OFF`), Wireframe mode (`ON/OFF`), Caliper HUD (`ON/OFF`), and Lighting Presets (`toolroom`, `studio`, `laser`).
  - Reset View button to smoothly recalibrate the camera position.
  - Keyboard navigation: Arrow keys rotate the model along X/Y axes in calibrated 15-degree steps (`(15 * Math.PI) / 180`).
- **GPU Performance & Rendering Safeguards**:
  - Device Pixel Ratio clamped strictly to `dpr={[1, 2]}` to prevent high-DPI GPU memory exhaustion.
  - OrbitControls with physics damping (`dampingFactor: 0.05`).
  - Three-point HDR lighting rig simulating industrial toolroom task illumination.
  - WASM Google Draco loader configured for lightweight GLB mesh asset streaming.

### Tactile Machinist Acoustic Spectrum & Telemetry Standards
Expendry integrates Sarvam AI voice capabilities designed for noisy machine shop environments:
- **Acoustic Pulse Feedback**:
  - When recording, the microphone button activates dual concentric pulse rings: an outer expanding ping ring (`bg-[#26d464]/30 animate-ping`) and an inner resonant ring (`border-[#26d464]/50 animate-pulse`).
  - Both animations strictly respect `prefers-reduced-motion` with `motion-reduce:animate-none`.
- **Tactile Recording State Machine**:
  - **Idle**: 44px circular trigger button (`w-11 h-11 rounded-full`) in `#171717` with `#26d464` microphone vector icon and emerald hover ring.
  - **Recording**: Active danger red state (`#ef4444`) with high-contrast white square stop icon and red drop shadow glow.
  - **Processing**: Dark neutral state (`bg-neutral-800 text-neutral-400 cursor-wait`) with spinning circular loader.
- **Multilingual Support Telemetry**:
  - Supports English (`en`), Hindi (`hi`), and Marathi (`mr`).
  - Native language selector switch with 1px border and active emerald badge indicator.
- **Acoustic Spectrogram & Telemetry Badges (`.telemetry-chip`)**:
  - Micro-metric badges (`text-[10px] font-mono tracking-wider uppercase`) displaying real-time audio sample rates (16kHz), transcription latencies, and token rewards.

---

## Do's and Don'ts

### Do:
- **Do** use uniform 1.75px geometric SVG vector icons for all visual indicators and actions.
- **Do** enforce `font-variant-numeric: tabular-nums` on all coordinates, balances, timers, and live gauges.
- **Do** include real shop-floor tolerances (e.g., `±0.005mm`, `h6`, `H7`) when displaying machining dimensions.
- **Do** respect `prefers-reduced-motion` on all animations, ambient noise shaders, and acoustic pulse rings.
- **Do** maintain a strict 14:1+ contrast ratio for primary text (`#ededed`) and 5.8:1+ for muted text (`#a1a1aa`).
- **Do** clamp reading copy to 65–75 characters per line (`max-w-prose`) with `text-wrap: pretty`.
- **Do** use `text-wrap: balance` on all headings and card titles.
- **Do** clamp 3D Canvas device pixel ratios to `[1, 2]` to protect mobile GPUs.

### Don't:
- **Don't** use emojis anywhere in the user interface or code (no 🚀, 🤖, 💡, 🔧 emojis). Use mathematical vector icons.
- **Don't** use thick colored left borders on cards (`border-l-2`, `border-l-4`). All cards use uniform 1px borders.
- **Don't** use bouncing, elastic, or playful spring animations (`animate-bounce`). Machining tools move with hydraulic precision.
- **Don't** use generic SaaS purple or blue gradients. Ground the palette in calibrated obsidian and machining green.
- **Don't** allow numeric layouts to jitter or jump during real-time data streaming.
- **Don't** nest cards inside cards or wrap every piece of text in an unnecessary bordered box.
- **Don't** use pure white (`#ffffff`) for large text areas or canvas backgrounds.
