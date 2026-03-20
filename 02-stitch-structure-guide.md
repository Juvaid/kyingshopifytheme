# KYING.IN - Stitch Project Structure & Parallel Design Guide

## Why Structure Matters

Your Stitch file organization should **mirror your Shopify code structure**. This makes it trivial to map designs → Liquid code.

```
Shopify Theme Code          ←→  Stitch Design Files
snippets/component-*.liquid ←→  Stitch: Components project
sections/                   ←→  Stitch: Sections project  
templates/                  ←→  Stitch: Pages project
```

---

## Stitch Workspace Setup

### Recommended Folder Structure in Stitch

```
KYING.IN Design System (Main Project)
│
├── 📁 01 - Design System
│   ├── 🎨 Colors & Tokens
│   │   └── Color swatches (export as JSON for CSS variables)
│   ├── 🔤 Typography Styles
│   │   └── All font sizes, weights, line heights
│   ├── 📐 Spacing & Grid
│   │   └── Spacing scale visualization
│   └── 🧩 Component Library
│       ├── Buttons (primary, secondary, ghost)
│       ├── Cards (generic, product card)
│       ├── Forms (input, select, checkbox)
│       ├── Navigation (desktop, mobile)
│       ├── Badges/Labels
│       └── Testimonial Block
│
├── 📁 02 - Components (Ready for Shopify Snippets)
│   ├── component-button
│   │   ├── Desktop view
│   │   └── Mobile view
│   ├── component-product-card
│   │   ├── Desktop view
│   │   └── Mobile view
│   ├── component-card
│   ├── component-form-input
│   ├── component-grid
│   ├── component-testimonial
│   └── component-badge
│
├── 📁 03 - Page Templates
│   ├── Homepage
│   │   ├── Desktop full page
│   │   ├── Mobile full page
│   │   └── Annotated (notes on structure)
│   ├── Product Detail Page (PDP)
│   │   ├── Desktop
│   │   ├── Mobile
│   │   └── Notes
│   ├── Collection/Category Page
│   │   ├── Desktop
│   │   ├── Mobile
│   │   └── Notes
│   ├── Cart Page
│   ├── Checkout Flow
│   └── 404 / Search Results
│
├── 📁 04 - Design Specs & Documentation
│   ├── Design System (link to doc)
│   ├── Component Specs (link to Shopify setup guide)
│   ├── Responsive Breakpoints (reference)
│   ├── Color Palette (exported tokens)
│   └── Typography Scale
│
└── 📁 05 - Iterations & Archive
    ├── v0.1 explorations
    └── A/B test variants
```

---

## How to Set Up in Stitch

### Step 1: Create Main Project
1. Go to **[stitch.withgoogle.com](https://stitch.withgoogle.com/)**
2. Click **"Create new project"**
3. Name it: **"KYING.IN - Redesign"**
4. Set up shared **Team Library** (optional but helpful for components)

### Step 2: Create Sub-Projects for Each Section

Within the main project, create separate **"artboards" or "frames"** for:

**Stitch terminology:**
- **Board** = A single design canvas (like a Figma board)
- **Components** = Reusable symbols/elements
- **Team Library** = Shared components accessible across projects

### Step 3: Create Reusable Components in Stitch

In the **"01 - Design System"** board, create:

#### Button Component
- Create a **component** called `Button/Primary`
- Variants: default, hover, active
- Document the corresponding Liquid: `snippets/component-button.liquid`

#### Product Card Component
- Create a **component** called `ProductCard`
- Variants: default, hover, sale-badge
- Link to Liquid: `snippets/component-product-card.liquid`

#### Form Input Component
- Create a **component** called `FormInput`
- Variants: default, focused, error, disabled
- Link to Liquid: `snippets/component-form-input.liquid`

---

## Color & Token Management in Stitch

### Export Design Tokens for CSS

**Goal:** Design tokens from Stitch → CSS variables in Shopify theme

#### Option 1: Manual Mapping (Fastest)
1. Create a "Colors" board in Stitch
2. Design your color swatches (use your design system doc)
3. Take screenshot or export color values
4. Manually copy into `assets/base.css` CSS variables

**Example Mapping:**
```
Stitch Design    →    CSS Variable Name           →    CSS File
[Swatch: Black]  →    --color-black: #000000     →    assets/base.css
[Swatch: Gold]   →    --color-accent-gold: #D4AF37 →  assets/base.css
```

#### Option 2: Token Export (Advanced)
If Stitch has export features:
1. Export design tokens as JSON
2. Parse into CSS variables automatically
3. (Check Stitch's export options - may require plugin)

---

## Component Mapping: Stitch → Shopify Liquid

Create a **"Component Specs"** document that maps each design to code:

### Template (Use for each component):

```markdown
## Component: Button

### Stitch Location
📂 Path: 01 - Design System > Components > Buttons > Primary

### Shopify Location
📂 Path: snippets/component-button.liquid

### Design Notes
- Default state: Black background, white text
- Hover: Darker black, slight scale (1.02x)
- Size: 12px vertical padding × 24px horizontal
- Border radius: 4px
- Font weight: 600

### Liquid Code
```liquid
{% include 'component-button', text: 'Add to Cart', type: 'primary' %}
```

### CSS Variables Used
- --color-black
- --color-white
- --spacing-md
- --radius-md
- --transition-fast

### Responsive Notes
- Same styling across mobile/desktop
- Touch target: 44px minimum height
```

---

## Parallel Workflow: Stitch ↔️ Shopify Dev

### Your Daily Loop:

```
Morning: Design Sprint in Stitch
├─ Sketch new component or page
├─ Screenshot design
└─ Note down specs

↓

Afternoon: Code Sprint in Shopify
├─ Create/update Liquid snippet
├─ Add CSS to match design
├─ Run `shopify theme dev`
└─ Test locally at http://localhost:9292

↓

Late Afternoon: QA & Iterate
├─ Compare design (Stitch) vs. live (local theme)
├─ Note discrepancies
├─ Adjust CSS or Liquid
├─ Screenshot updated code
└─ Update Stitch if needed

↓

Next Morning: Repeat for next component
```

### Real Example: Product Card

**Monday Morning - Design:**
1. Open Stitch
2. Create "component-product-card" board
3. Design the card layout:
   - Image on top (1:1 aspect)
   - Title below
   - Stars + review count
   - Regular price (strikethrough)
   - Sale price (red)
   - "Quick Add" button
4. Export/screenshot for reference

**Monday Afternoon - Code:**
1. Create `snippets/component-product-card.liquid`
2. Add HTML structure matching design
3. Copy CSS from design spec
4. Run `shopify theme dev`
5. See it render live
6. Tweak spacing/colors to match Stitch

**Monday Evening - QA:**
1. Compare Stitch design side-by-side with local theme
2. Adjust CSS for perfect match
3. Screenshot updated code
4. Paste into Stitch component notes
5. Mark as "Ready for implementation"

---

## Responsive Design in Stitch

### Create Breakpoint Boards

For each major component, create multiple boards:

```
component-product-card (folder)
├─ Desktop (1200px+)
├─ Tablet (768px-1024px)
└─ Mobile (320px-640px)
```

**In each board:**
- Show how component adapts to screen size
- Annotate changes (e.g., "Column count: 4 → 2 → 1")
- Note CSS media queries used

**Example Annotations:**
```
Desktop: grid-template-columns: repeat(4, 1fr)
Tablet: grid-template-columns: repeat(2, 1fr)
Mobile: grid-template-columns: 1fr
```

---

## Documentation Template for Stitch Boards

Create a **"README"** board in your project with:

### Board 1: Overview
```markdown
# KYING.IN Design System

## How to Use This Project
1. Components are in [link to Components folder]
2. Full pages are in [link to Pages folder]
3. Shopify code is at [GitHub repo link]
4. Latest updates: [Date]

## Quick Links
- Design System Doc: [link]
- Shopify Setup Guide: [link]
- Component Spec Template: [link]
```

### Board 2: Color Palette
```markdown
# Colors

## Primary
- White: #FFFFFF
- Black: #000000

## Accents
- Gold: #D4AF37
- Green: #7CB342
- Red: #E07856

All colors map to CSS variables in assets/base.css
```

### Board 3: Typography Scale
```markdown
# Typography

H1: 48px / 600 weight
H2: 36px / 600 weight
Body: 16px / 400 weight
...

All fonts use CSS vars: --font-size-*, --font-weight-*
```

---

## Team Collaboration Tips (If You Add Team Members Later)

1. **Shared Library**: Set up Team Library for components
2. **Version Control**: Use Stitch's version history
3. **Comments**: Use Stitch comments to leave code notes
4. **Handoff**: Export specs with annotations for developers
5. **Link to Code**: Always reference Shopify GitHub in Stitch comments

**Comment Format Example:**
```
Design Review: Product Card

✅ Spacing matches spacing scale (16px gaps)
✅ Button follows component specs
⚠️ Image aspect ratio - confirm with dev
🔗 Liquid code: github.com/.../snippets/component-product-card.liquid
🔗 CSS: github.com/.../assets/component-product-card.css
```

---

## Exporting from Stitch for Handoff

When you're ready to share designs with someone:

1. **Export component as image** (for documentation)
2. **Export page as PDF** (for review)
3. **Share Stitch link** (for live collaboration)
4. **Document specs** (attach as markdown or PDF)

---

## Quick Checklist: First Setup

- [ ] Create Stitch project: "KYING.IN - Redesign"
- [ ] Create folders: Design System, Components, Pages, Specs, Archive
- [ ] Create color/typography reference boards
- [ ] Start with 3-5 core components (button, card, product card)
- [ ] Create first page design (homepage)
- [ ] Run `shopify theme dev` locally
- [ ] Build first component in Liquid
- [ ] Compare Stitch design ↔️ Local theme
- [ ] Document mapping in specs
- [ ] Iterate & refine

---

## File Sync Between Stitch & Shopify

Since Stitch doesn't directly connect to GitHub/Shopify:

### Manual Sync Workflow:
1. **Design in Stitch** → Screenshot or export
2. **Code in Shopify CLI locally** → See live at localhost:9292
3. **Screenshot code** → Paste back into Stitch for QA
4. **Push to GitHub** → `git commit` + `git push`
5. **Deploy to Shopify** → `shopify theme push`

### Git Workflow Example:
```bash
# After coding a component
git add snippets/component-product-card.liquid
git commit -m "feat: product card component with design system styles"
git push origin main

# When ready to test on Shopify:
shopify theme push --development
```

---

## Next Actions

1. ✅ Set up Stitch workspace (use structure above)
2. ✅ Create design system board with colors + typography
3. ✅ Design 3 core components (button, card, product card)
4. ✅ Run `shopify theme init` locally (see setup guide)
5. ✅ Code first component (button) in Liquid
6. ✅ Compare design vs. code → iterate
7. ✅ Repeat for remaining components
8. ✅ Design + code first full page (homepage)
9. ✅ Deploy to staging Shopify store for testing

---

**You're now ready to design & code in parallel!** 🚀
