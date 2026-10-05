---
name: Industrial Safety AR System
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#d8c3ad'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#a08e7a'
  outline-variant: '#534434'
  surface-tint: '#ffb95f'
  primary: '#ffc174'
  on-primary: '#472a00'
  primary-container: '#f59e0b'
  on-primary-container: '#613b00'
  inverse-primary: '#855300'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffbcb7'
  on-tertiary: '#68000a'
  tertiary-container: '#ff938c'
  on-tertiary-container: '#8d0012'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffddb8'
  primary-fixed-dim: '#ffb95f'
  on-primary-fixed: '#2a1700'
  on-primary-fixed-variant: '#653e00'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  touch-target-min: 3rem
---

## Brand & Style

The visual identity is rooted in heavy industrial resilience, high-hazard operational awareness, and field-grade utility. The interface is engineered explicitly for plant operators, mining personnel, and shop-floor technicians operating in demanding physical environments where clarity, speed of comprehension, and unambiguous action are critical.

The design movement combines **Industrial Tactical Modernism** with **High-Contrast Utilitarianism**:
- Deep slate and carbon foundational surfaces that minimize glare under harsh factory overhead lighting or direct outdoor sunlight.
- High-visibility hazard gold and safety amber as focal beacons, directing user focus directly to life-critical simulation prompts, competency certifications, and interactive AR triggers.
- Rugged, tactile containment structures using technical chamfers, precision boundary borders, and micro-grid textures that mirror physical industrial safety consoles and ruggedized field tablets.
- Uncompromising multilingual equity, giving equal typographic weight and ergonomic access to English, Hindi, and regional scripts (e.g., Santali) via persistent, easily tappable language pills.

## Colors

The system employs an authoritative dark-mode safety hierarchy calibrated for high situational contrast:

- **Primary (`#F59E0B` - Safety Amber):** The signature alert and interaction color. Reserved strictly for primary simulation calls-to-action, active progress bars, interactive AR anchor points, and primary highlights. An auxiliary gold (`#EAB308`) is used for micro-gradients and competency score highlights.
- **Secondary (`#10B981` - Verified Green):** Indicates safety compliance, certified competencies, correct task execution in AR, and successful environment scans.
- **Tertiary (`#EF4444` - Hazard Red):** Restricted to active hazards (e.g., electrical fire alerts, explosive limits, failure warnings, and mandatory retraining flags).
- **Neutral Foundation (`#0F172A` to `#1E293B`):** 
  - Canvas base: `#0B1120` (pitch field black)
  - Card/Module background: `#1E293B` (slate surface)
  - Interactive chip and secondary card fill: `#334155` (tactile slate)
  - Border/Gutter separators: `#475569` (for high structural containment)
  - High-visibility text: `#F8FAFC` (pure readability off-slate)
  - Secondary metadata: `#94A3B8` (crisp technical readouts)

## Typography

The type system pairs **Space Grotesk** for display titles, badges, and technical readouts with **Work Sans** for UI instruction, body copy, and accessibility markers:

- **Space Grotesk** provides an engineered, technical cadence reminiscent of instrumentation, industrial consoles, and safety manuals. Used in uppercase for tactical status chips, numeric indicators, and action triggers.
- **Work Sans** delivers neutral, highly legible glyphs with generous aperture, ensuring instant scanability for plant technicians even in low-light conditions, movement, or small viewports.
- Regional language strings (Devanagari/Hindi, Ol Chiki/Santali) dynamically fall back to native script engines while maintaining identical proportional leading to avoid vertical layout jitter when switching languages on the fly.

## Elevation & Depth

Visual depth is achieved through structural layering and razor-sharp perimeter lines rather than heavy blur shadows, preventing muddy interfaces on low-brightness mobile devices:

- **Level 0 (Canvas Base):** Solid deep blue-black `#0B1120`.
- **Level 1 (Card & Module Surfaces):** Solid `#1E293B` elevated by a 1px solid perimeter boundary in `#334155`. No ambient drop-shadow.
- **Level 2 (Active Focus & Modal Sheets):** `#1E293B` combined with a 1.5px high-contrast border in `#F59E0B` (amber) or `#38BDF8` (guidance). Paired with an inner inset glow: `box-shadow: inset 0 0 12px rgba(245, 158, 11, 0.1)`.
- **Level 3 (HUD Floating Overlays / AR Badges):** Semi-opaque `#0F172A` at 90% opacity with `backdrop-filter: blur(8px)` and a 1px safety amber accent border, visually separating tactical guidance from the live camera feed.

## Shapes

The shape language reflects ruggedized safety hardware—balanced between physical durability and modern precision:

- Standard module cards, input fields, and simulation panels utilize an 8px (`rounded-md` to `0.5rem`) radius, providing structural firmness without sharp corners.
- Action buttons and interactive language pills use higher rounding (up to 12px or full pill forms for language selection toggles) to distinctly communicate touch affordance.
- Metric meters, camera focus reticles, and hazard warning chips incorporate chamfer-inspired geometric cutaways and crisp 1px inner boundaries.

## Components

### Buttons
- **Primary Industrial CTA:** Full-width, 48px minimum height. Solid `#F59E0B` fill, `#0F172A` uppercase bold text in Space Grotesk. Hover/active states shift to `#D97706`.
- **Secondary Action Button:** `#1E293B` background with a 1px `#475569` border and `#F8FAFC` label.
- **Emergency / Hazard Button:** High-visibility `#EF4444` background with pure white text and tactile pulse keyframes.

### Multilingual Pills
- Segmented multi-tab switchers with 32px height.
- Inactive items feature `#1E293B` background with `#94A3B8` label.
- Active language pill features a solid `#F59E0B` fill with bold `#0F172A` typography, instantly confirming the current locale (e.g., English / हिन्दी / ᱥᱟᱱᱛᱟᱲᱤ).

### Safety Training Cards
- Encased in `#1E293B` with `#334155` 1px borders.
- Header incorporates an industry-standard pictograph badge (fire hazard, gas leak, high voltage) set inside an amber/dark circular medallion.
- Body displays training module title, estimated duration, difficulty rating badge, and a high-contrast segmented linear progress meter.

### Competency Circular Gauges
- Dual-track radial indicator with a `#334155` background ring and an animated `#F59E0B` or `#10B981` progress stroke.
- Central numeric readout in Space Grotesk Bold, accompanied by a status chip below: "Passed", "Needs Retraining", or "In Progress".

### AR Overlay & HUD Badges
- Floating reticle components with corner brackets (`#F59E0B`) to indicate surface detection and ground plane locking.
- Hazard banners with emergency chevron striping (amber/black diagonal patterns) at the top of the AR viewport when live hazards are simulated.
- Numbered sequential step badges (1, 2, 3) featuring filled circles with checkmark indicators upon correct physical procedure execution (e.g., Pull Pin, Aim at Base, Squeeze, Sweep).