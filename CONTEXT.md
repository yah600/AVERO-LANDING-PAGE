# CONTEXT

## Project
Avero Landing Page frontend (`AVERO-LANDING-PAGE`)

## Last Updated
February 10, 2026

## Summary Of Work Completed
This iteration transformed the project from a starter Vite shell into a conversion-oriented, multi-page landing experience for Avero with premium styling, refined UX behavior, and structured marketing copy grounded in product context.

### 1) Foundation And Stack
- Set up React + TypeScript + Vite app structure.
- Integrated Konsta UI theme tokens.
- Integrated `@paper-design/shaders-react` for branded visual layers.
- Established shared layout primitives and global styles in `src/index.css`.

### 2) Branding And Visual System
- Implemented liquid Avero logos:
  - Wordmark component (`LiquidWordmarkLogo`).
  - Icon component (`LiquidIconLogo`).
- Integrated Paper shader-based global background (`GrainGradient`) via `GlobalGrainBackground`.
- Shifted from flat black background to branded grain gradient surface.
- Preserved black/white high-contrast visual direction while maintaining premium texture.

### 3) Site Architecture And Pages
- Built/expanded primary routes:
  - Home
  - Features
  - Integrations
  - About
  - Login
  - Signup (progressive flow UI)
  - Privacy
  - Terms
  - Cookies
  - Not Found
- Added route-level metadata handling and page analytics hooks.

### 4) Copywriting And Narrative Rework
- Rebuilt homepage narrative flow for conversion:
  - Hook/value promise
  - Problem framing (without generic “problem” label)
  - Solution framing
  - “Data chaos to clear decisions” transition
  - Role alignment, proof framework, CTA closure
- Reworked features and integrations pages with:
  - Technical + plain-language dual explanations
  - Clear module/integration matrices
  - Reduced text dump and improved scannability
- Enforced terminology updates:
  - Replaced “Syngine” with “SYN Engine” everywhere user-facing.

### 5) Header And Navigation UX
- Converted header into a sticky pill-based top bar.
- Added dynamic compact mode on scroll:
  - Large full header at top
  - Smoothly compresses into small pill when scrolling
  - Compact state shows icon + quick-access hamburger
- Fixed sticky behavior bug caused by shell-level positioning override.
- Improved transition smoothness by animating:
  - Width/height/padding
  - Logo crossfade (wordmark -> icon)
  - Nav/CTA collapse
  - Hamburger reveal

### 6) Footer Improvements
- Simplified footer branding and legal copy.
- Added external Synergair link in footer:
  - https://synergair.ai/

### 7) Chat Assistant (Ava)
- Added global floating bottom-right chat launcher with Avero icon.
- Built in-page assistant panel with:
  - Message thread
  - Prompt chips
  - Input/send flow
  - Typing feedback
- Added domain-aware response logic for:
  - Product definition
  - Features/modules
  - Integrations
  - Compliance
  - Pricing structure
  - Access/login flows
- Renamed assistant to **Ava**.

### 8) Accessibility And UX Details
- Maintained skip link support.
- Added/retained ARIA labels on interactive elements (menus, chat actions).
- Added top scroll progress indicator.
- Reduced reveal animation latency for snappier perceived responsiveness.

### 9) Instrumentation And Tracking
- Added event tracking utility and CTA instrumentation.
- Tracked key user interactions for:
  - Header/footer/page CTAs
  - Chat widget open/question/reply events

### 10) Verification Performed
- Repeatedly validated with:
  - `npm run lint`
  - `npm run build`
  - HTTP checks against local preview (`127.0.0.1:3436`)
- Current status: build and lint passing.

## Important Messaging Constraints Applied
- Positioning: Avero as an all-in-one marketing command center.
- Avoided “AI agent” framing.
- Used “SYN Engine” language where relevant.
- Included “powered by Synergair” messaging.

## Known Next Steps (Optional)
1. Wire chat panel to a real backend/chat API for dynamic answers.
2. Replace all image placeholders with final transparent PNG assets.
3. Add visual regression snapshots for header transition states.
4. Add end-to-end tests for responsive header/chat behavior.
5. Final copy polish after legal/compliance review.
