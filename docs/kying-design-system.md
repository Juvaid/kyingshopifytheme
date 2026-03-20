# KYING.IN - Design System Audit & Guidelines

## Brand Overview
- **Brand Name**: KYING - "Know Your Ingredients"
- **Category**: Skincare & Personal Care (B2C)
- **Positioning**: Conscious, ingredient-focused, transparent personal care
- **Market**: India (INR pricing)

---

## 1. COLOR PALETTE

### Primary Colors
| Color | Hex | Usage | Notes |
|-------|-----|-------|-------|
| White | #FFFFFF | Background, cards, clean space | Primary background |
| Black/Near Black | #000000 or #1a1a1a | Text, borders | Main text color |
| Cream/Off-white | #F9F8F6 or #FAFAFA | Subtle backgrounds | Minimal contrast |

### Accent Colors
| Color | Hex | Usage | Notes |
|-------|-----|-------|-------|
| Warm Gold/Orange | #D4AF37 or #E8B84E | Highlights, badges | Premium feel |
| Soft Green | #7CB342 (approx) | Success states, some product CTAs | Natural/organic feel |
| Soft Red/Rose | #E74C3C (muted) | Sale tags, discounts | Attention-grabbing |
| Gray | #999999 / #CCCCCC | Secondary text, dividers, disabled states | Hierarchy |

### Semantic Colors
- **Sale/Discount**: Muted red or coral (#E07856)
- **Success**: Soft green (#7CB342)
- **Warning**: Warm orange (#F39C12)
- **Error**: Red (#E74C3C)
- **Link**: Black with underline or subtle blue (#1E90FF)

---

## 2. TYPOGRAPHY

### Font Family
- **Primary Font**: Sans-serif (likely -apple-system, Segoe UI, or custom modern sans)
- **Fallback Stack**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

### Font Sizes & Hierarchy
| Component | Size | Weight | Line Height | Usage |
|-----------|------|--------|------------|-------|
| **H1** (Page Title) | 48px | 600 or 700 | 1.2 | Main page headers, hero |
| **H2** (Section Title) | 36px | 600 | 1.3 | Section headers |
| **H3** (Subsection) | 24px | 600 | 1.4 | Card titles, subsections |
| **H4** (Minor Heading) | 20px | 600 | 1.4 | Product names, callouts |
| **Body Large** | 18px | 400 | 1.6 | Prominent body text |
| **Body Regular** | 16px | 400 | 1.6 | Main body text, product descriptions |
| **Body Small** | 14px | 400 | 1.5 | Secondary text, captions |
| **Label/Button** | 14px | 600 | 1.5 | Button text, labels |
| **Caption** | 12px | 400 | 1.4 | Timestamps, fine print |

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semi-Bold**: 600
- **Bold**: 700

---

## 3. SPACING & GRID

### Base Unit
- **Base spacing unit**: 8px (scales by multiples)
- **12-column grid** for responsive layout

### Spacing Scale
| Level | Pixels | Rem (base 16px) | Usage |
|-------|--------|-----------------|-------|
| xs | 4px | 0.25rem | Tight spacing |
| sm | 8px | 0.5rem | Small padding/margins |
| md | 16px | 1rem | Standard padding |
| lg | 24px | 1.5rem | Larger padding |
| xl | 32px | 2rem | Section spacing |
| 2xl | 48px | 3rem | Major section spacing |
| 3xl | 64px | 4rem | Page-level spacing |

### Padding & Margins
- **Card padding**: 16px - 24px
- **Button padding**: 12px 24px (vertical × horizontal)
- **Section margin**: 48px - 64px
- **Container max-width**: 1200px (desktop)

---

## 4. COMPONENTS

### Buttons
```
Primary Button:
- Background: #000000 (black)
- Text: #FFFFFF (white)
- Padding: 12px 24px
- Border radius: 2px - 4px (subtle, almost square)
- Font weight: 600
- Hover: Slightly darker or opacity change
- Active: Darker state

Secondary Button:
- Background: #FAFAFA (light gray)
- Text: #000000 (black)
- Border: 1px #CCCCCC
- Same padding & radius as primary

Ghost/Tertiary:
- Background: transparent
- Text: #000000
- Border: optional 1px solid
- Underline on hover
```

### Cards
- **Background**: White (#FFFFFF)
- **Border**: Subtle 1px #EEEEEE or none (light shadow instead)
- **Border-radius**: 2px - 8px
- **Box-shadow**: 0 2px 8px rgba(0, 0, 0, 0.08) (minimal)
- **Padding**: 20px - 24px

### Product Card Structure
```
[Product Image - Full width]
[Product Name - H4 weight]
[Star Rating] [# Reviews]
[Regular Price] [Sale Price if applicable]
[Quick Add Button]
```

### Forms & Inputs
- **Input height**: 40px - 44px
- **Border**: 1px solid #CCCCCC
- **Border-radius**: 2px - 4px
- **Padding**: 8px 12px
- **Focus state**: Border color to black, slight shadow
- **Font**: 16px, body regular
- **Placeholder**: #999999, opacity 0.7

### Navigation
- **Desktop nav**: Horizontal, clean spacing
- **Mobile nav**: Hamburger menu
- **Active state**: Bold text or underline
- **Hover**: Color shift or underline
- **Spacing**: 24px between items

---

## 5. IMAGERY & PHOTOGRAPHY STYLE

### Product Images
- **Format**: High-res JPG/PNG with transparent backgrounds preferred
- **Aspect ratio**: Square (1:1) for grid displays, 16:9 for hero
- **Style**: Clean, minimal white background or lifestyle context
- **Composition**: Product centered, well-lit, minimal shadows

### Photography Style
- **Tone**: Bright, clean, aspirational
- **Lighting**: Soft, natural-looking
- **Backgrounds**: Minimal (white, soft gradients)
- **People/Lifestyle**: Diverse, authentic, relatable

### Iconography
- **Style**: Outline or minimal filled icons
- **Weight**: 1.5px - 2px stroke
- **Size**: 16px, 24px, 32px increments
- **Color**: Match text hierarchy

---

## 6. KEY UI PATTERNS

### Hero Banner
- Full width
- Height: 400px - 600px (desktop)
- Text overlay or clean section below
- CTA button clearly visible
- Background: Image or gradient

### Product Grid
- **Desktop**: 4 columns
- **Tablet**: 2-3 columns
- **Mobile**: 1-2 columns
- **Gap**: 16px - 24px between cards
- **Responsive**: Adjust column count, maintain gap

### Testimonials/Reviews Section
- **Card layout**: 3+ cards in a row (carousel on mobile)
- **Avatar**: 40px - 60px circular image
- **Name + title**: 14px, semi-bold
- **Quote**: 16px, regular, italic optional
- **Stars**: 5-star rating

### CTAs & Banners
- **Announcement banner**: Full-width, contrasting background
- **Text**: Clear, centered or left-aligned
- **Button**: High contrast, clear action
- **Urgency**: "Buy 2 Get 4 Sale is Live" style text

### Search & Filters
- **Search bar**: Full-width mobile, sidebar desktop
- **Filter tags**: Pill-shaped buttons, togglable
- **Selected state**: Bold, different background
- **Results count**: Clear, above products

---

## 7. RESPONSIVE BREAKPOINTS

| Device | Width | Columns | Notes |
|--------|-------|---------|-------|
| **Mobile** | 320px - 640px | 1-2 | Single column primary |
| **Tablet** | 641px - 1024px | 2-3 | Medium grid |
| **Desktop** | 1025px+ | 4+ | Full grid layout |
| **XL Desktop** | 1440px+ | 4-6 | May need 5-6 columns |

---

## 8. INTERACTIVE ELEMENTS

### Hover States
- **Links**: Underline, color change, or slight opacity
- **Buttons**: Darker background, shadow, or scale (1.02x)
- **Cards**: Subtle lift (shadow increase), scale (1.02x)
- **Images**: Zoom slightly (1.05x) or change opacity

### Animations & Transitions
- **Duration**: 200ms - 300ms (standard)
- **Easing**: ease-in-out (cubic-bezier(0.4, 0, 0.2, 1))
- **Properties**: color, background, transform, opacity (avoid heavy animations)
- **Page load**: Fade-in or subtle slide animations

### Loading States
- **Skeleton screens**: Placeholder cards with animation
- **Spinners**: Minimal circular loader
- **Duration**: Quick feedback (< 1s ideal)

---

## 9. ACCESSIBILITY

### Color Contrast
- **AA Standard**: 4.5:1 for normal text, 3:1 for large text
- **AAA Standard**: 7:1 for normal text, 4.5:1 for large text
- Ensure black text on white meets AA minimum

### Focus States
- **Keyboard navigation**: Clear, visible focus ring (2px, contrasting color)
- **Tab order**: Logical, follows visual flow
- **Skip links**: For keyboard users

### Alt Text & Labels
- **Images**: Descriptive alt text for all product/hero images
- **Icons**: ARIA labels or semantic HTML
- **Form inputs**: Linked labels with `<label>` tags
- **Buttons**: Clear button text (avoid icon-only without labels)

### Mobile & Touch
- **Touch targets**: Minimum 44px × 44px
- **Spacing**: Adequate space between clickable elements
- **Font sizing**: No text smaller than 12px (consider readability)

---

## 10. CURRENT STRENGTHS TO MAINTAIN

✅ Clean, minimal aesthetic  
✅ Strong product grid layout  
✅ Clear pricing & discount messaging  
✅ Social proof (reviews, testimonials)  
✅ Mobile-friendly baseline  
✅ Good use of whitespace  

---

## 11. IMPROVEMENT OPPORTUNITIES

🔄 **Performance**:
- Optimize image sizes & lazy load
- Reduce JS bundle (if using heavy plugins)
- Minify CSS/JS

🔄 **UX/UI**:
- More prominent product filtering & search
- Improved mobile navigation
- Consistent button styling
- Better visual hierarchy on collection pages
- Clearer category separation

🔄 **Engagement**:
- More interactive elements (size guides, quizzes)
- Better CTA placement above fold
- Promo banners with stronger visual design
- Video testimonials or product demos

---

## 12. NEXT STEPS FOR DESIGN

1. **Create color swatches** in Figma
2. **Set up typography styles** (heading presets, body styles)
3. **Build base components** (buttons, cards, forms, icons)
4. **Create page templates** (homepage, PDP, collection, checkout)
5. **Design mobile screens** (responsive breakpoints)
6. **Create interaction specs** (hover, focus, loading states)
7. **Document patterns** (hero, grid, testimonials, etc.)

---

## Tools & Resources

- **Design Tool**: Figma (or Sketch/Stitch)
- **Icon Library**: Feather Icons, Heroicons, or custom
- **Font Resources**: Google Fonts, Inter, Poppins (modern sans options)
- **Accessibility Checker**: WebAIM, Lighthouse, Axe DevTools

---

**Last Updated**: March 2026  
**Owner**: [Your Name/Team]  
**Version**: 1.0
