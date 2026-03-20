# KYING.IN - Shopify Theme Setup Guide (Parallel Build)

## Part 1: Initial Setup with Shopify CLI

### Step 1: Choose Your Base Theme
Pick one of these solid, customizable themes:
- **Dawn** (Official Shopify - clean, minimal, great for customization)
- **Sense** (Minimal, modern, good for cosmetics)
- **Prestige** (Premium feel, product-focused)
- **Studio** (Flexible, modular sections)

```bash
# Go to your Shopify store directory
cd ~/your-shopify-projects

# Create a new theme based on Dawn (recommended for Kying's style)
shopify theme init kying-redesign --clone https://github.com/shopify/dawn

# Or, if you want to modify the CURRENT theme:
shopify theme pull  # Downloads current live theme to local

# Navigate to theme
cd kying-redesign
```

### Step 2: Start Local Development Server
```bash
shopify theme dev

# Output will show:
# Opened your store in your browser
# http://localhost:9292
```

This gives you **live reload** — any file changes appear instantly.

### Step 3: Understand the Theme Structure

```
kying-redesign/
├── assets/
│   ├── base.css          ← Main CSS (update with design system colors)
│   ├── component-*.css   ← Component-specific styles
│   └── tailwind.css      ← If using Tailwind
├── layout/
│   └── theme.liquid      ← Main HTML wrapper (DON'T change much)
├── sections/
│   ├── header.liquid
│   ├── hero.liquid
│   ├── featured-products.liquid
│   └── footer.liquid
├── snippets/
│   ├── button.liquid     ← Reusable components go here
│   ├── product-card.liquid
│   ├── card.liquid
│   └── form-input.liquid
├── templates/
│   ├── index.json        ← Homepage config
│   ├── product.json      ← Product page config
│   └── collection.json   ← Collection page config
└── config/
    └── settings_schema.json  ← Theme settings
```

---

## Part 2: Component-Based Architecture

### Philosophy
Instead of modifying huge section files, create **small, reusable snippets**. This mirrors best practice from React (which you're familiar with from Next.js).

### File Naming Convention
```
snippets/
├── component-button.liquid        (button styles & behavior)
├── component-card.liquid          (card wrapper)
├── component-product-card.liquid  (product card with image, price, etc.)
├── component-form-input.liquid    (form inputs)
├── component-testimonial.liquid   (testimonial card)
├── component-grid.liquid          (responsive grid wrapper)
└── component-badge.liquid         (badges/labels)
```

---

## Part 3: CSS Strategy

### Option A: Use Existing Theme CSS (Faster)
- Most Shopify themes use **CSS variables** for colors
- Modify `assets/base.css` to update brand colors
- Update `assets/component-*.css` for your component styles

### Option B: Add Tailwind CSS (Recommended for Parallel Build)
```bash
# Install Tailwind (optional but makes parallel design → code easy)
npm install -D tailwindcss

# Create tailwind config matching design system
npx tailwindcss init
```

**tailwind.config.js example:**
```javascript
module.exports = {
  content: [
    './layout/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './templates/**/*.liquid',
  ],
  theme: {
    colors: {
      white: '#FFFFFF',
      black: '#000000',
      gray: {
        50: '#FAFAFA',
        100: '#F3F3F3',
        300: '#E0E0E0',
        600: '#999999',
      },
      gold: '#D4AF37',
      green: '#7CB342',
      red: '#E07856',
    },
    spacing: {
      0: '0',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      6: '24px',
      8: '32px',
      12: '48px',
      16: '64px',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '36px',
      '4xl': '48px',
    },
  },
};
```

---

## Part 4: Quick Component Examples

### 1. Button Component
**File: `snippets/component-button.liquid`**

```liquid
{% comment %}
  Reusable Button Component
  Usage: {% include 'component-button', text: 'Add to Cart', type: 'primary', url: '/shop' %}
{% endcomment %}

{% assign button_type = include.type | default: 'primary' %}
{% assign button_text = include.text | default: 'Button' %}
{% assign button_url = include.url | default: '#' %}
{% assign button_class = include.class | default: '' %}

<a href="{{ button_url }}" 
   class="btn btn--{{ button_type }} {{ button_class }}"
   role="button"
   aria-label="{{ button_text }}">
  {{ button_text }}
</a>

<style>
  .btn {
    display: inline-block;
    padding: 12px 24px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    border: none;
    text-align: center;
  }

  .btn--primary {
    background-color: #000000;
    color: #FFFFFF;
  }

  .btn--primary:hover {
    background-color: #1a1a1a;
    transform: scale(1.02);
  }

  .btn--secondary {
    background-color: #FAFAFA;
    color: #000000;
    border: 1px solid #CCCCCC;
  }

  .btn--secondary:hover {
    background-color: #F3F3F3;
  }

  .btn--ghost {
    background-color: transparent;
    color: #000000;
    text-decoration: underline;
  }

  .btn--ghost:hover {
    opacity: 0.8;
  }
</style>
```

**Usage in a section:**
```liquid
{% include 'component-button', text: 'Shop Now', type: 'primary', url: '/collections/all' %}
```

---

### 2. Product Card Component
**File: `snippets/component-product-card.liquid`**

```liquid
{% comment %}
  Reusable Product Card
  Usage: {% include 'component-product-card', product: product %}
{% endcomment %}

{% assign product = include.product %}
{% assign show_rating = include.show_rating | default: true %}

<div class="product-card">
  <!-- Product Image -->
  <div class="product-card__image">
    {% if product.featured_image %}
      <img 
        src="{{ product.featured_image | image_url: width: 500 }}"
        alt="{{ product.featured_image.alt | escape }}"
        loading="lazy"
        width="500"
        height="500">
    {% endif %}
  </div>

  <!-- Product Info -->
  <div class="product-card__content">
    <h3 class="product-card__title">{{ product.title }}</h3>

    <!-- Rating -->
    {% if show_rating and product.metafields.reviews.rating %}
      <div class="product-card__rating">
        <span class="stars">⭐ {{ product.metafields.reviews.rating.value }}</span>
        <span class="review-count">({{ product.metafields.reviews.rating_count }})</span>
      </div>
    {% endif %}

    <!-- Pricing -->
    <div class="product-card__pricing">
      {% if product.compare_at_price > product.price %}
        <span class="price price--sale">₹{{ product.price | money_without_currency }}</span>
        <span class="price price--regular">₹{{ product.compare_at_price | money_without_currency }}</span>
      {% else %}
        <span class="price">₹{{ product.price | money_without_currency }}</span>
      {% endif %}
    </div>

    <!-- Quick Add Button -->
    <div class="product-card__cta">
      {% include 'component-button', text: 'Quick Add', type: 'primary' %}
    </div>
  </div>
</div>

<style>
  .product-card {
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #EEEEEE;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
  }

  .product-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .product-card__image {
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    background: #F9F8F6;
  }

  .product-card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-card__content {
    padding: 16px;
  }

  .product-card__title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 8px 0;
    line-height: 1.4;
  }

  .product-card__rating {
    font-size: 12px;
    margin: 8px 0;
    color: #666;
  }

  .product-card__pricing {
    margin: 12px 0;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .price {
    font-size: 16px;
    font-weight: 600;
  }

  .price--sale {
    color: #E07856;
  }

  .price--regular {
    font-size: 14px;
    color: #999;
    text-decoration: line-through;
  }

  .product-card__cta {
    margin-top: 12px;
  }
</style>
```

---

### 3. Simple Card Component
**File: `snippets/component-card.liquid`**

```liquid
{% comment %}
  Generic Card Wrapper
  Usage: {% include 'component-card', class: 'my-card' %}...content...{% endinclude %}
{% endcomment %}

<div class="card {{ include.class }}">
  {{ include.content }}
</div>

<style>
  .card {
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #EEEEEE;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
</style>
```

---

## Part 5: CSS File Organization

### Main CSS File: `assets/base.css`

```css
/* ============================================
   DESIGN SYSTEM VARIABLES
   ============================================ */

:root {
  /* Colors */
  --color-white: #FFFFFF;
  --color-black: #000000;
  --color-gray-light: #FAFAFA;
  --color-gray-medium: #CCCCCC;
  --color-gray-dark: #999999;
  --color-accent-gold: #D4AF37;
  --color-accent-green: #7CB342;
  --color-accent-red: #E07856;

  /* Typography */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-base: 16px;
  --font-size-sm: 14px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 36px;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Transitions */
  --transition-fast: 0.2s ease-in-out;
  --transition-standard: 0.3s ease-in-out;
}

/* ============================================
   GLOBAL STYLES
   ============================================ */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-black);
  background-color: var(--color-white);
}

/* ============================================
   TYPOGRAPHY
   ============================================ */

h1 {
  font-size: var(--font-size-3xl);
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: var(--spacing-lg);
}

h2 {
  font-size: 32px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: var(--spacing-lg);
}

h3 {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

h4 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

p {
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

a {
  color: var(--color-black);
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

a:hover {
  opacity: 0.7;
}

/* ============================================
   CONTAINERS & LAYOUT
   ============================================ */

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

@media (max-width: 768px) {
  .container {
    padding: 0 var(--spacing-sm);
  }
}

/* ============================================
   RESPONSIVE GRID
   ============================================ */

.grid {
  display: grid;
  gap: var(--spacing-md);
}

.grid--2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid--3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid--4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 1024px) {
  .grid--4 {
    grid-template-columns: repeat(3, 1fr);
  }
  .grid--3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid--4,
  .grid--3,
  .grid--2 {
    grid-template-columns: 1fr;
  }
}
```

---

## Part 6: Workflow Integration

### The Loop You'll Repeat:

```
1. Design component in Stitch
   ↓
2. Create .liquid snippet file in `snippets/`
3. Add CSS to `assets/component-*.css` OR inline in snippet
   ↓
4. Test locally: shopify theme dev (live at http://localhost:9292)
   ↓
5. Refine design in Stitch based on how it looks
   ↓
6. Tweak Liquid/CSS and refresh browser
   ↓
7. Repeat until perfect
```

### File Changes Live-Reload?
✅ **YES** - Shopify CLI watches for changes and reloads automatically

---

## Part 7: Deploy to Staging/Live

```bash
# When ready to test on actual Shopify store:
shopify theme push

# Upload to specific store and create as DRAFT theme:
shopify theme push --development

# See all your themes:
shopify theme list

# Activate a theme to live:
shopify theme publish --theme-id 123456789
```

---

## Part 8: Common Tasks

### Update All Brand Colors
1. Edit `/assets/base.css` CSS variables
2. All components using `var(--color-*)` update instantly

### Add a New Component
1. Create `snippets/component-name.liquid`
2. Add styles (inline or linked CSS file)
3. Include in sections: `{% include 'component-name' %}`

### Modify a Section
1. Find in `sections/`
2. Edit HTML/Liquid
3. Save → browser auto-refreshes

### Test Responsive
1. `shopify theme dev` shows http://localhost:9292
2. Open DevTools (F12)
3. Resize browser or toggle device mode
4. CSS media queries trigger automatically

---

## Next Steps

1. ✅ Run `shopify theme init kying-redesign --clone https://github.com/shopify/dawn`
2. ✅ Run `shopify theme dev`
3. ✅ Start designing in Stitch (mirroring component structure)
4. ✅ Create snippets for each component as you design them
5. ✅ Test locally, iterate

**You're now ready for parallel design + code build!** 🚀
