# KYING.IN - Component Specifications & Code Mappings

## Overview

Each component has:
1. **Design Spec** (from Stitch)
2. **Liquid Code** (snippets/component-*.liquid)
3. **CSS** (inline or external)
4. **Usage Examples**

---

## Component 1: Button

### Design Spec

| Property | Value | Notes |
|----------|-------|-------|
| **Type** | Primary, Secondary, Ghost | Three variants |
| **Padding** | 12px (V) × 24px (H) | Vertical × Horizontal |
| **Font Size** | 14px | --font-size-sm |
| **Font Weight** | 600 | Semi-bold |
| **Border Radius** | 4px | --radius-md |
| **States** | Default, Hover, Active | See below |

### Primary Button State Details

```
DEFAULT:
- Background: #000000 (--color-black)
- Text: #FFFFFF (--color-white)
- Border: None
- Box Shadow: None

HOVER:
- Background: #1a1a1a (slightly darker)
- Transform: scale(1.02)
- Transition: 0.2s ease-in-out (--transition-fast)

ACTIVE:
- Background: #0d0d0d (even darker)
- Transform: scale(0.98)
```

### Secondary Button State Details

```
DEFAULT:
- Background: #FAFAFA (--color-gray-light)
- Text: #000000 (--color-black)
- Border: 1px solid #CCCCCC (--color-gray-medium)

HOVER:
- Background: #F3F3F3
- Border: 1px solid #999999 (--color-gray-dark)
```

### Ghost Button State Details

```
DEFAULT:
- Background: transparent
- Text: #000000 (--color-black)
- Border: None
- Text Decoration: Underline

HOVER:
- Opacity: 0.7
```

### Liquid Code

**File:** `snippets/component-button.liquid`

```liquid
{% comment %}
  Button Component
  
  Params:
  - text (required): Button text
  - type: 'primary' | 'secondary' | 'ghost' (default: 'primary')
  - url: Link destination (default: '#')
  - class: Additional CSS classes
  - disabled: true/false
  
  Usage:
  {% include 'component-button', text: 'Add to Cart', type: 'primary', url: '/cart' %}
{% endcomment %}

{% assign type = include.type | default: 'primary' %}
{% assign text = include.text | default: 'Button' %}
{% assign url = include.url | default: '#' %}
{% assign disabled = include.disabled | default: false %}

<a 
  href="{% if disabled %}#{% else %}{{ url }}{% endif %}"
  class="btn btn--{{ type }} {{ include.class }}"
  {% if disabled %}aria-disabled="true" role="button"{% endif %}>
  {{ text }}
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
    font-family: inherit;
  }

  .btn:focus {
    outline: 2px solid #000000;
    outline-offset: 2px;
  }

  /* PRIMARY */
  .btn--primary {
    background-color: #000000;
    color: #FFFFFF;
  }

  .btn--primary:hover {
    background-color: #1a1a1a;
    transform: scale(1.02);
  }

  .btn--primary:active {
    background-color: #0d0d0d;
    transform: scale(0.98);
  }

  /* SECONDARY */
  .btn--secondary {
    background-color: #FAFAFA;
    color: #000000;
    border: 1px solid #CCCCCC;
  }

  .btn--secondary:hover {
    background-color: #F3F3F3;
    border-color: #999999;
  }

  /* GHOST */
  .btn--ghost {
    background-color: transparent;
    color: #000000;
    border: none;
    text-decoration: underline;
  }

  .btn--ghost:hover {
    opacity: 0.7;
  }

  /* DISABLED */
  .btn[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* RESPONSIVE */
  @media (max-width: 640px) {
    .btn {
      padding: 10px 16px;
      font-size: 14px;
    }
  }
</style>
```

### Usage Examples

```liquid
{%- include 'component-button', text: 'Shop Now', type: 'primary', url: '/collections/all' -%}

{%- include 'component-button', text: 'Learn More', type: 'secondary', url: '/pages/about' -%}

{%- include 'component-button', text: 'View Details', type: 'ghost', url: '/products/example' -%}
```

---

## Component 2: Product Card

### Design Spec

```
Layout (Mobile → Desktop):
┌─────────────────────┐
│   Product Image     │  1:1 aspect ratio
│     (500×500)       │
├─────────────────────┤
│ Product Title       │  16px, font-weight: 600
├─────────────────────┤
│ ⭐ 4.8 (540 reviews)│  12px, gray
├─────────────────────┤
│ ₹899 ₹1,499 (old)   │  Prices: 16px semi-bold
│ Regular • Sale      │  Sale in red/coral
├─────────────────────┤
│  [Quick Add Button]  │  Full width button
└─────────────────────┘
```

| Property | Value | Notes |
|----------|-------|-------|
| **Card Padding** | 0 | Image full-bleed, padding on content |
| **Content Padding** | 16px | Inside bottom section |
| **Gap between sections** | 8px | Between title, rating, price |
| **Image Aspect** | 1:1 (square) | 500×500 ideal |
| **Border** | 1px solid #EEEEEE | Light gray |
| **Border Radius** | 4px | --radius-md |
| **Hover Effect** | Lift + shadow | scale(1.02) + shadow |
| **Responsive** | 4 cols (desktop) → 2 cols (tablet) → 1 col (mobile) | See grid component |

### Liquid Code

**File:** `snippets/component-product-card.liquid`

```liquid
{% comment %}
  Product Card Component
  
  Params:
  - product (required): Shopify product object
  - show_rating: true/false (default: true)
  - show_quick_add: true/false (default: true)
  
  Usage:
  {% include 'component-product-card', product: product %}
{% endcomment %}

{% assign product = include.product %}
{% assign show_rating = include.show_rating | default: true %}
{% assign show_quick_add = include.show_quick_add | default: true %}

<article class="product-card">
  
  {%- if product.featured_image -%}
    <div class="product-card__image-wrapper">
      <img 
        class="product-card__image"
        src="{{ product.featured_image | image_url: width: 500 }}"
        srcset="
          {{ product.featured_image | image_url: width: 300 }} 300w,
          {{ product.featured_image | image_url: width: 500 }} 500w,
          {{ product.featured_image | image_url: width: 800 }} 800w"
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
        alt="{{ product.featured_image.alt | escape }}"
        loading="lazy"
        width="500"
        height="500">
    </div>
  {%- endif -%}

  <div class="product-card__content">
    
    <h3 class="product-card__title">{{ product.title }}</h3>
    
    {%- if show_rating and product.metafields.reviews.rating.value -%}
      <div class="product-card__rating">
        <span class="product-card__stars">⭐ {{ product.metafields.reviews.rating.value }}</span>
        <span class="product-card__review-count">({{ product.metafields.reviews.rating_count }})</span>
      </div>
    {%- endif -%}

    <div class="product-card__pricing">
      {%- if product.compare_at_price and product.compare_at_price > product.price -%}
        <span class="product-card__price product-card__price--sale">
          ₹{{ product.price | money_without_currency }}
        </span>
        <span class="product-card__price product-card__price--original">
          ₹{{ product.compare_at_price | money_without_currency }}
        </span>
      {%- else -%}
        <span class="product-card__price">
          ₹{{ product.price | money_without_currency }}
        </span>
      {%- endif -%}
    </div>

    {%- if show_quick_add -%}
      <div class="product-card__cta">
        {% include 'component-button', text: 'Quick Add', type: 'primary' %}
      </div>
    {%- endif -%}

  </div>

</article>

<style>
  .product-card {
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
    border: 1px solid #EEEEEE;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    height: 100%;
  }

  .product-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  /* Image */
  .product-card__image-wrapper {
    width: 100%;
    overflow: hidden;
    background-color: #F9F8F6;
    aspect-ratio: 1;
  }

  .product-card__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
  }

  .product-card:hover .product-card__image {
    transform: scale(1.05);
  }

  /* Content */
  .product-card__content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  /* Title */
  .product-card__title {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    line-height: 1.4;
    color: #000000;
  }

  /* Rating */
  .product-card__rating {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #999999;
  }

  .product-card__stars {
    font-weight: 600;
  }

  /* Pricing */
  .product-card__pricing {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }

  .product-card__price {
    font-size: 16px;
    font-weight: 600;
    color: #000000;
  }

  .product-card__price--sale {
    color: #E07856;
  }

  .product-card__price--original {
    font-size: 14px;
    color: #999999;
    text-decoration: line-through;
    font-weight: 400;
  }

  /* CTA */
  .product-card__cta {
    margin-top: 12px;
  }

  .product-card__cta .btn {
    width: 100%;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .product-card__title {
      font-size: 15px;
    }

    .product-card__content {
      padding: 12px;
      gap: 6px;
    }
  }
</style>
```

### Usage in a Section

**File:** `sections/featured-products.liquid`

```liquid
<section class="featured-products">
  <div class="container">
    <h2>Best Sellers</h2>
    
    <div class="grid grid--4">
      {%- for product in collection.products limit: 4 -%}
        {% include 'component-product-card', product: product %}
      {%- endfor -%}
    </div>
  </div>
</section>
```

---

## Component 3: Generic Card

### Design Spec

```
┌──────────────────────┐
│                      │
│    Card Content      │  White background
│    Padding: 20px     │  1px border #EEEEEE
│                      │  Subtle shadow
└──────────────────────┘
```

| Property | Value |
|----------|-------|
| **Background** | #FFFFFF |
| **Border** | 1px solid #EEEEEE |
| **Padding** | 20px |
| **Border Radius** | 4px |
| **Box Shadow** | 0 2px 8px rgba(0,0,0,0.05) |
| **Transition** | 0.3s ease-in-out |

### Liquid Code

**File:** `snippets/component-card.liquid`

```liquid
{% comment %}
  Generic Card Wrapper
  
  Params:
  - class: Additional CSS classes
  
  Content: Inner HTML/Liquid
  
  Usage:
  {% include 'component-card' %}
    <h3>Card Title</h3>
    <p>Card content here</p>
  {% endinclude %}
{% endcomment %}

<div class="card {{ include.class }}">
  {{ include.content }}
</div>

<style>
  .card {
    background-color: #FFFFFF;
    border: 1px solid #EEEEEE;
    border-radius: 4px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease-in-out;
  }

  .card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
</style>
```

### Usage

```liquid
{% include 'component-card' %}
  <h3>Testimonial</h3>
  <p>"Amazing product! Changed my skin completely."</p>
  <p>- Riya Menon</p>
{% endinclude %}
```

---

## Component 4: Form Input

### Design Spec

```
Text Input:
┌────────────────────────┐
│ Placeholder text       │  Height: 44px
└────────────────────────┘  Padding: 8px 12px
                            Border: 1px #CCCCCC
                            Font: 16px
                            Focus: Border black
```

| Property | Value |
|----------|-------|
| **Height** | 44px |
| **Padding** | 8px 12px |
| **Border** | 1px solid #CCCCCC |
| **Border Radius** | 4px |
| **Font Size** | 16px (prevents zoom on iOS) |
| **Focus Border** | 2px solid #000000 |
| **Focus Shadow** | 0 0 0 3px rgba(0,0,0,0.1) |

### Liquid Code

**File:** `snippets/component-form-input.liquid`

```liquid
{% comment %}
  Form Input Component
  
  Params:
  - name (required): Input name
  - type: 'text' | 'email' | 'password' | 'tel' | 'number' (default: 'text')
  - label: Label text
  - placeholder: Placeholder text
  - value: Pre-filled value
  - required: true/false
  - class: Additional CSS classes
  
  Usage:
  {% include 'component-form-input', 
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'you@example.com',
    required: true
  %}
{% endcomment %}

{% assign name = include.name %}
{% assign type = include.type | default: 'text' %}
{% assign label = include.label %}
{% assign placeholder = include.placeholder | default: '' %}
{% assign required = include.required | default: false %}

<div class="form-input-wrapper">
  {%- if label -%}
    <label for="{{ name }}" class="form-input__label">
      {{ label }}
      {%- if required %}<span class="form-input__required">*</span>{%- endif -%}
    </label>
  {%- endif -%}

  <input 
    class="form-input {{ include.class }}"
    type="{{ type }}"
    name="{{ name }}"
    id="{{ name }}"
    placeholder="{{ placeholder }}"
    {% if include.value %}value="{{ include.value }}"{% endif %}
    {% if required %}required{% endif %}>
</div>

<style>
  .form-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 16px;
  }

  .form-input__label {
    font-size: 14px;
    font-weight: 600;
    color: #000000;
  }

  .form-input__required {
    color: #E07856;
  }

  .form-input {
    height: 44px;
    padding: 8px 12px;
    border: 1px solid #CCCCCC;
    border-radius: 4px;
    font-size: 16px;
    font-family: inherit;
    transition: all 0.2s ease-in-out;
    color: #000000;
  }

  .form-input::placeholder {
    color: #999999;
    opacity: 0.7;
  }

  .form-input:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  .form-input:disabled {
    background-color: #F3F3F3;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    .form-input {
      font-size: 16px; /* Prevent iOS zoom */
    }
  }
</style>
```

### Usage

```liquid
{% include 'component-form-input', 
  name: 'email',
  type: 'email',
  label: 'Email Address',
  placeholder: 'you@example.com',
  required: true
%}

{% include 'component-form-input', 
  name: 'message',
  label: 'Message',
  placeholder: 'Type your message...'
%}
```

---

## Component 5: Grid (Responsive)

### Design Spec

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| Desktop (1200px+) | 4 | 24px |
| Tablet (768-1023px) | 2-3 | 16px |
| Mobile (320-767px) | 1 | 16px |

### Liquid Code

**File:** `snippets/component-grid.liquid`

```liquid
{% comment %}
  Responsive Grid Component
  
  Params:
  - columns: 'auto' | '2' | '3' | '4' (default: 'auto')
  - gap: spacing size (default: 'md')
  - class: Additional CSS classes
  
  Usage:
  {% include 'component-grid', columns: '4' %}
    <!-- Grid items here -->
  {% endinclude %}
{% endcomment %}

<div class="grid grid--{{ include.columns | default: 'auto' }} grid--gap-{{ include.gap | default: 'md' }} {{ include.class }}">
  {{ include.content }}
</div>

<style>
  .grid {
    display: grid;
    width: 100%;
  }

  /* Column Variants */
  .grid--auto {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

  /* Gap Variants */
  .grid--gap-sm {
    gap: 8px;
  }

  .grid--gap-md {
    gap: 16px;
  }

  .grid--gap-lg {
    gap: 24px;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .grid--4 {
      grid-template-columns: repeat(3, 1fr);
    }
    .grid--3 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .grid--4,
    .grid--3,
    .grid--2 {
      grid-template-columns: 1fr;
    }

    .grid--gap-lg {
      gap: 16px;
    }
  }
</style>
```

### Usage

```liquid
<section class="featured-products">
  <div class="container">
    <h2>Best Sellers 🚀</h2>
    
    {% include 'component-grid', columns: '4', gap: 'lg' %}
      {%- for product in collection.products limit: 8 -%}
        {% include 'component-product-card', product: product %}
      {%- endfor -%}
    {% endinclude %}
  </div>
</section>
```

---

## Quick Reference Table

| Component | File | States | Responsive |
|-----------|------|--------|------------|
| Button | `component-button.liquid` | Primary, Secondary, Ghost, Hover, Active, Disabled | Same across breakpoints |
| Product Card | `component-product-card.liquid` | Default, Hover (image zoom), with/without rating | Reflows with grid |
| Card | `component-card.liquid` | Default, Hover (shadow lift) | Fixed width, adapts with grid |
| Form Input | `component-form-input.liquid` | Default, Focus, Disabled, Error | Full width on mobile |
| Grid | `component-grid.liquid` | 4 cols, 3 cols, 2 cols, auto | Responsive breakpoints |

---

## Implementation Checklist

- [ ] Create all 5 component `.liquid` files in `snippets/`
- [ ] Copy CSS into each file (or link external CSS)
- [ ] Test each component locally: `shopify theme dev`
- [ ] Match Stitch designs to coded components
- [ ] Document component usage in comments
- [ ] Create example sections using components
- [ ] Test responsive behavior on mobile/tablet
- [ ] Update Stitch with screenshot of rendered code
- [ ] Deploy to development store for QA

---

**Next:** Start coding these components! 🚀
