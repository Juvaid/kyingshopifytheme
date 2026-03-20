# 🚀 KYING.IN THEME REDESIGN - START ENGINE PROMPT

## PRE-FLIGHT CHECKLIST ✅

Before running this prompt, verify:

```bash
# Check 1: Git is initialized
git status
# Expected output: "On branch main" or "On branch develop"

# Check 2: Theme directory structure exists
ls -la | grep -E "(snippets|sections|assets|layout|templates|config)"
# Expected output: All directories listed

# Check 3: Shopify CLI installed and working
shopify --version
# Expected output: shopify version X.X.X

# Check 4: Documentation files present in root
ls | grep -E "\.md$"
# Expected output: All 4 markdown files visible
```

---

## PHASE 1: ENVIRONMENT SETUP (10 mins)

### Step 1.1: Verify Theme Base (Dawn)

```bash
# Confirm Dawn theme is properly initialized
cat package.json | grep -A2 '"name"'
# Should show theme name

# Check Git status
git status
# Should show clean working directory or list files you've added
```

**Expected Output:**
```
On branch main
nothing to commit, working tree clean
(or: Untracked files: documentation files)
```

### Step 1.2: Create Project Directories for Organization

Since all docs are in root, create a working structure:

```bash
# Create a docs folder to keep reference files organized
mkdir -p docs
mv *.md docs/

# Verify structure
ls -la docs/
# Should show: kying-design-system.md, 01-shopify-setup-guide.md, etc.

# Add to git
git add docs/
git commit -m "docs: add design system and setup documentation"
```

### Step 1.3: Set Up Your Working Environment

```bash
# Create a local development log file (for tracking your work)
touch BUILD.log

# Create a branch for this redesign work
git checkout -b feature/redesign-v2-dawn

# Push branch to remote (if you have GitHub)
git push -u origin feature/redesign-v2-dawn

# Verify you're on the right branch
git branch
# Should show: * feature/redesign-v2-dawn
```

**What you just did:**
- ✅ Organized documentation
- ✅ Created a feature branch (so main stays clean)
- ✅ Ready to commit code changes as you build

---

## PHASE 2: LAUNCH LOCAL DEV SERVER (5 mins)

### Step 2.1: Start Shopify Theme Development Server

```bash
# Terminal Tab 1: Start the dev server
shopify theme dev

# Expected output after ~30 seconds:
# ✓ Building...
# ✓ Uploaded...
# 
# Preview your theme:
# http://localhost:9292
#
# Edit the theme:
# files/...
```

**IMPORTANT:** This terminal tab stays RUNNING. Don't close it.

### Step 2.2: Verify Server is Live

Open a **new terminal tab** (Cmd+T or Ctrl+Shift+T):

```bash
# Test if server is accessible
curl -s http://localhost:9292 | head -20

# Expected: You'll see HTML output (no error)

# Or just visit in browser:
# http://localhost:9292
```

**You should see:**
- Kying.in homepage (live from your local theme)
- Hot reload enabled (changes refresh automatically)
- No errors in dev server tab

---

## PHASE 3: COMPONENT BASELINE SETUP (15 mins)

### Step 3.1: Create Component Snippets Directory Structure

```bash
# Verify snippets directory exists
ls -la snippets/

# Create organized subdirectory for new components (optional but clean)
mkdir -p snippets/_components
```

### Step 3.2: Create Base CSS Variables File

You'll update this once with all design tokens, then reference it everywhere.

**File:** `assets/design-tokens.css`

```bash
# Create the file
touch assets/design-tokens.css
```

**Add this content to `assets/design-tokens.css`:**

```css
/* ==============================================
   KYING.IN - DESIGN SYSTEM CSS TOKENS
   Reference: docs/kying-design-system.md
   ============================================== */

:root {
  /* ---- COLORS ---- */
  --color-white: #FFFFFF;
  --color-black: #000000;
  --color-gray-light: #FAFAFA;
  --color-gray-50: #F9F8F6;
  --color-gray-medium: #CCCCCC;
  --color-gray-dark: #999999;
  --color-accent-gold: #D4AF37;
  --color-accent-green: #7CB342;
  --color-accent-red: #E07856;

  /* ---- TYPOGRAPHY ---- */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 36px;
  --font-size-4xl: 48px;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.2;
  --line-height-normal: 1.4;
  --line-height-relaxed: 1.6;

  /* ---- SPACING ---- */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;

  /* ---- BORDERS & RADIUS ---- */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;

  --border-width-sm: 1px;
  --border-width-md: 2px;

  /* ---- TRANSITIONS & ANIMATIONS ---- */
  --transition-fast: 0.2s ease-in-out;
  --transition-standard: 0.3s ease-in-out;

  /* ---- SHADOWS ---- */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

  /* ---- CONTAINER ---- */
  --container-max-width: 1200px;
  --container-padding: var(--spacing-md);
}

@media (max-width: 768px) {
  :root {
    --container-padding: var(--spacing-sm);
  }
}
```

**Save the file**, then verify it's there:

```bash
cat assets/design-tokens.css | head -20
# Should show the CSS variables
```

### Step 3.3: Import Design Tokens into Main CSS

**File:** `assets/base.css`

Find the beginning of this file and add:

```bash
# View the first 10 lines of base.css
head -10 assets/base.css
```

**Edit the file:** Add this as the FIRST line:

```css
@import url('./design-tokens.css');
```

Or, if base.css already has imports, add it at the very top.

**Verify it's linked:**

```bash
grep -n "@import.*design-tokens" assets/base.css
# Should show: 1:@import url('./design-tokens.css');
```

**Why?** Now all CSS variables are globally available. Any component can use `var(--color-black)` etc.

### Step 3.4: Commit This Baseline

```bash
git add assets/design-tokens.css assets/base.css
git commit -m "feat: add design system CSS tokens for all components"

# Verify commit
git log --oneline -3
```

---

## PHASE 4: CREATE FIRST COMPONENT - BUTTON (20 mins)

**This is where code meets design!**

### Step 4.1: Create Button Component File

```bash
# Create the button snippet
touch snippets/component-button.liquid
```

### Step 4.2: Copy Button Code

**File:** `snippets/component-button.liquid`

Open the file and paste this complete code:

```liquid
{% comment %}
  BUTTON COMPONENT
  
  Design Reference: docs/kying-design-system.md > Components > Buttons
  
  Params:
  - text (required): Button label text
  - type: 'primary' | 'secondary' | 'ghost' (default: 'primary')
  - url: Link destination (default: '#')
  - class: Additional CSS classes for customization
  - disabled: true to disable (default: false)
  
  Usage Examples:
  {% include 'component-button', text: 'Shop Now', type: 'primary', url: '/collections/all' %}
  {% include 'component-button', text: 'Learn More', type: 'secondary' %}
  {% include 'component-button', text: 'View', type: 'ghost', url: '/about' %}
  
  Liquid Logic:
  - If disabled=true, href becomes '#' and ARIA is set
  - Supports all accessibility standards (WCAG AA)
  - Responsive: Touch target 44px minimum on mobile
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
  /* ============================================
     BUTTON COMPONENT STYLES
     Design Token Reference: design-tokens.css
     ============================================ */

  .btn {
    /* Layout */
    display: inline-block;
    padding: 12px 24px;
    border-radius: var(--radius-md);
    
    /* Typography */
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-sm);
    font-family: inherit;
    text-decoration: none;
    text-align: center;
    
    /* Interactive */
    cursor: pointer;
    border: none;
    transition: all var(--transition-fast);
    
    /* Accessibility */
    min-height: 44px;
    min-width: 44px;
  }

  .btn:focus {
    outline: var(--border-width-md) solid var(--color-black);
    outline-offset: 2px;
  }

  /* PRIMARY VARIANT */
  .btn--primary {
    background-color: var(--color-black);
    color: var(--color-white);
  }

  .btn--primary:hover:not([aria-disabled="true"]) {
    background-color: #1a1a1a;
    transform: scale(1.02);
  }

  .btn--primary:active:not([aria-disabled="true"]) {
    background-color: #0d0d0d;
    transform: scale(0.98);
  }

  /* SECONDARY VARIANT */
  .btn--secondary {
    background-color: var(--color-gray-light);
    color: var(--color-black);
    border: var(--border-width-sm) solid var(--color-gray-medium);
  }

  .btn--secondary:hover:not([aria-disabled="true"]) {
    background-color: #F3F3F3;
    border-color: var(--color-gray-dark);
  }

  /* GHOST VARIANT */
  .btn--ghost {
    background-color: transparent;
    color: var(--color-black);
    border: none;
    text-decoration: underline;
  }

  .btn--ghost:hover:not([aria-disabled="true"]) {
    opacity: 0.7;
  }

  /* DISABLED STATE */
  .btn[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* RESPONSIVE ADJUSTMENTS */
  @media (max-width: 640px) {
    .btn {
      padding: 10px 16px;
      font-size: var(--font-size-xs);
    }
  }
</style>
```

**Save the file.** Verify:

```bash
# Check file exists
ls -la snippets/component-button.liquid

# Check content is there
grep "component-button" snippets/component-button.liquid
```

### Step 4.3: Test Button in Browser

Go back to **http://localhost:9292** in your browser.

Find any `.liquid` file that uses the button (e.g., `sections/featured-collection.liquid`), and add a test:

**File:** `sections/featured-collection.liquid`

Find a good place (maybe after a heading) and add:

```liquid
<!-- TESTING BUTTON COMPONENT -->
<div style="padding: 20px; background: #f9f8f6; margin: 20px;">
  <h3>Button Component Test</h3>
  <div style="display: flex; gap: 10px; flex-wrap: wrap;">
    {% include 'component-button', text: 'Primary Button', type: 'primary', url: '/collections/all' %}
    {% include 'component-button', text: 'Secondary Button', type: 'secondary' %}
    {% include 'component-button', text: 'Ghost Button', type: 'ghost' %}
  </div>
</div>
<!-- END TEST -->
```

**Refresh browser (should auto-reload).** You should see **three buttons** with different styles.

### Step 4.4: Open Browser DevTools and Compare to Design

```
Press F12 (or Cmd+Option+I on Mac)
```

**Inspect the button:**
- Right-click on button
- Click "Inspect"
- Check computed styles match design system:
  - Color: Black background, white text ✓
  - Padding: 12px vertical, 24px horizontal ✓
  - Font: Semi-bold, 14px ✓
  - Border-radius: 4px ✓

**If anything's off**, edit the CSS in the `.liquid` file, save, and refresh.

### Step 4.5: Commit Button Component

```bash
git add snippets/component-button.liquid sections/featured-collection.liquid
git commit -m "feat: add button component with primary/secondary/ghost variants

- Supports all 3 button types (primary, secondary, ghost)
- Includes hover and active states
- Accessible keyboard focus states
- Responsive touch targets (min 44px)
- Uses design system CSS tokens
- Tested in featured-collection section"

# Verify
git log --oneline -1
```

---

## PHASE 5: MOVE TO STITCH & DESIGN (15 mins)

### Step 5.1: Screenshot Your Button

In browser (http://localhost:9292):
1. Find your test buttons
2. Take a screenshot (Cmd+Shift+4 or PrintScreen)
3. Save as `button-coded.png`

### Step 5.2: Open Stitch & Start Designing

Go to **[stitch.withgoogle.com](https://stitch.withgoogle.com/)**

1. Create new project: **"KYING.IN - Redesign"**
2. Create a board: **"01 - Design System"**
3. Create a frame: **"Button Component"**
4. Design the button in Stitch:
   - Black background, white text (use hex from design-tokens.css)
   - Padding 12px × 24px
   - 4px border radius
   - Create 3 variants: primary, secondary, ghost

5. **Add annotation to design:**
   ```
   Coded component: snippets/component-button.liquid
   CSS tokens: assets/design-tokens.css
   Test location: http://localhost:9292 (featured collection section)
   ```

6. Paste your screenshot of the coded button next to the design
   - Compare them
   - Tweak CSS in Liquid file if they don't match exactly

### Step 5.3: Update Stitch with Finalized Spec

Once they match perfectly:
- Take final screenshot of both (design + code side-by-side)
- Add note in Stitch: "✅ BUTTON: Design & Code Match - Ready for Production"

---

## PHASE 6: CREATE SECOND COMPONENT - CARD (15 mins)

**Same workflow as button, but simpler!**

### Step 6.1: Create Card Component

```bash
touch snippets/component-card.liquid
```

### Step 6.2: Add Card Code

**File:** `snippets/component-card.liquid`

```liquid
{% comment %}
  GENERIC CARD COMPONENT
  
  A reusable card wrapper for testimonials, feature blocks, etc.
  
  Design Reference: docs/kying-design-system.md > Components > Cards
  
  Params:
  - class: Additional CSS classes
  
  Usage:
  {% include 'component-card', class: 'testimonial-card' %}
    <h3>Testimonial</h3>
    <p>"Amazing product!"</p>
  {% endinclude %}
{% endcomment %}

<div class="card {{ include.class }}">
  {{ include.content }}
</div>

<style>
  .card {
    background-color: var(--color-white);
    border: var(--border-width-sm) solid #EEEEEE;
    border-radius: var(--radius-md);
    padding: 20px;
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-standard);
  }

  .card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  @media (max-width: 640px) {
    .card {
      padding: 16px;
    }
  }
</style>
```

### Step 6.3: Test in Browser

Find a testimonials section and add:

```liquid
<!-- TESTING CARD COMPONENT -->
<div style="max-width: 400px; margin: 20px;">
  {% include 'component-card' %}
    <h3>Test Testimonial</h3>
    <p>"This product changed my life!" - Customer</p>
  {% endinclude %}
</div>
<!-- END TEST -->
```

Verify in browser → should see card with shadow.

### Step 6.4: Commit

```bash
git add snippets/component-card.liquid
git commit -m "feat: add card component with hover effects

- Reusable wrapper for testimonials, features, etc.
- Subtle shadow and hover lift effect
- Responsive padding (20px desktop, 16px mobile)
- Uses design system tokens"
```

---

## PHASE 7: CREATE THIRD COMPONENT - PRODUCT CARD (20 mins)

This one uses Shopify product data.

### Step 7.1: Create Product Card

```bash
touch snippets/component-product-card.liquid
```

### Step 7.2: Add Product Card Code

**File:** `snippets/component-product-card.liquid`

Paste the **full code from `docs/03-component-specs.md`** under "Component 2: Product Card"

(It's too long to paste here, but it's ready in your docs folder.)

### Step 7.3: Use in a Section

**File:** `sections/featured-collection.liquid` (or similar)

Replace your test buttons with:

```liquid
<!-- TESTING PRODUCT CARD COMPONENT -->
<div style="margin: 20px 0;">
  <h3>Product Card Test</h3>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
    {%- for product in collection.products limit: 4 -%}
      {% include 'component-product-card', product: product %}
    {%- endfor -%}
  </div>
</div>
<!-- END TEST -->
```

### Step 7.4: Test & Refine

- Refresh browser
- See product cards render with real Shopify data
- Check prices, images, rating display
- Adjust CSS if needed

### Step 7.5: Commit

```bash
git add snippets/component-product-card.liquid
git commit -m "feat: add product card component with Shopify integration

- Displays product image, title, rating, price
- Shows sale price with strikethrough
- Includes quick add button
- Responsive grid layout
- Image zoom on hover"
```

---

## PHASE 8: ESTABLISH THE PATTERN (Ongoing)

You've now created the **repeatable workflow:**

```
COMPONENT WORKFLOW:

1. Design in Stitch
   └─ Create component frame
   └─ Add design spec annotations

2. Code in Shopify
   └─ Create snippets/component-*.liquid
   └─ Add CSS with design tokens
   └─ Test in browser

3. QA & Compare
   └─ Screenshot code vs design
   └─ Make tweaks
   └─ Verify pixel-perfect match

4. Document & Commit
   └─ git add + git commit
   └─ Update Stitch with "✅ Complete" note
   └─ Move to next component

5. Integrate into Sections
   └─ Use component in larger sections
   └─ Build full pages from components
   └─ Test responsive behavior
```

---

## DAILY BUILD CHECKLIST

### Each Morning:

- [ ] `git status` — verify clean working directory
- [ ] `shopify theme dev` is running in one terminal tab
- [ ] Browser is open to http://localhost:9292
- [ ] Stitch workspace is open in another window

### Each Coding Session:

- [ ] Design component/screen in Stitch
- [ ] Create `snippets/component-*.liquid` file
- [ ] Copy code from docs or write new code
- [ ] Test in browser (should auto-reload)
- [ ] DevTools inspect → verify styles match design system tokens
- [ ] Take screenshot of final result
- [ ] Compare to Stitch design
- [ ] Make CSS tweaks if needed
- [ ] Git commit with descriptive message
- [ ] Update Stitch component notes with "✅ Complete" + screenshot

### Each Day End:

- [ ] All components tested
- [ ] `git log --oneline` shows today's commits
- [ ] `shopify theme dev` still running (leave it)
- [ ] Stitch project updated with progress

---

## NEXT COMPONENTS TO BUILD (In Order)

**After you finish button, card, product-card:**

1. ✅ Button (done)
2. ✅ Card (done)
3. ✅ Product Card (done)
4. → Form Input (complex)
5. → Grid (layout helper)
6. → Testimonial (design + code)
7. → Badge/Label (simple)
8. → Navigation (complex)

Each component adds to your library. By component #5, you'll be very fast.

---

## GIT WORKFLOW REFERENCE

```bash
# Start of day
git checkout feature/redesign-v2-dawn
git pull origin feature/redesign-v2-dawn

# After coding a component
git add snippets/component-*.liquid assets/design-*.css
git commit -m "feat: add [component-name] component with [key features]"
git push origin feature/redesign-v2-dawn

# Check your progress
git log --oneline --graph
# Shows all your commits

# When ready to test on staging Shopify:
shopify theme push --development
# Creates a draft theme on your Shopify store

# View all themes
shopify theme list

# Publish live (when ready)
shopify theme publish --theme-id 123456789
```

---

## TROUBLESHOOTING QUICK REFERENCE

### Browser shows old version:

```bash
# Hard refresh
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# Or clear browser cache
DevTools → Settings → Clear site data
```

### Liquid error in browser:

```bash
# Check syntax in file
grep -n "{% include" snippets/component-*.liquid

# Check dev server logs (first terminal)
# Look for red error messages
# Fix file → save → refresh browser
```

### CSS not applying:

```bash
# Verify design-tokens.css is imported in base.css
grep "@import.*design-tokens" assets/base.css

# Verify CSS variables used in component
grep "var(--" snippets/component-*.liquid

# Check DevTools > Styles tab for actual computed values
```

### Git merge conflicts:

```bash
# Pull latest changes
git pull origin feature/redesign-v2-dawn

# If conflicts, open file and resolve
# Mark as resolved
git add .
git commit -m "fix: resolve merge conflict in [file]"
```

---

## SUCCESS CRITERIA

By end of today, you should have:

✅ 3 components coded (button, card, product-card)
✅ All components tested in browser (http://localhost:9292)
✅ Design tokens CSS imported globally
✅ Git commits for each component
✅ Stitch designs created to match code
✅ 3 feature branch commits with descriptions
✅ Screenshots comparing design vs code for each component

---

## LET'S GO! 🚀

### **RIGHT NOW - RUN THIS:**

```bash
# Terminal Tab 1: Start dev server
shopify theme dev

# Terminal Tab 2: Create and add baseline
git checkout -b feature/redesign-v2-dawn
touch assets/design-tokens.css
echo '@import url("./design-tokens.css");' >> assets/base.css
touch snippets/component-button.liquid

# Then follow PHASE 4 above to add button code

# Then commit:
git add .
git commit -m "feat: init redesign branch with design tokens and button component"
git push -u origin feature/redesign-v2-dawn

# Open browser
open http://localhost:9292
# or
firefox http://localhost:9292
# or
google-chrome http://localhost:9292
```

---

**You're live in 5 minutes. Start with the button. Build from there.**

**Questions?** Ask as you code. Document everything in commits. Iterate fast.

**Time to ship.** 🎯

---

*Last Updated: March 20, 2026*  
*Status: READY TO EXECUTE*  
*Next Phase: Build out homepage from components*
