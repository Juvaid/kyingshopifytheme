# KYING.IN REDESIGN - DOCUMENTATION INDEX & QUICK START

## 📚 Your Documentation Files (In Your Root Directory)

```
docs/
├── kying-design-system.md          ← Colors, typography, spacing, components
├── 01-shopify-setup-guide.md       ← Theme structure, CLI commands, file org
├── 02-stitch-structure-guide.md    ← How to organize design files
└── 03-component-specs.md           ← Ready-to-use Liquid component code

START-HERE.md                        ← THIS IS YOUR MAIN PROMPT (start here!)
```

---

## 🎯 WHAT TO DO RIGHT NOW

**Open `START-HERE.md` and follow it step-by-step.**

It has:
- ✅ Phase 1: Environment setup (verify everything works)
- ✅ Phase 2: Launch local dev server
- ✅ Phase 3: Create CSS design tokens
- ✅ Phase 4: Build first component (button)
- ✅ Phase 5: Move to Stitch & design
- ✅ Phase 6-7: Build 2 more components
- ✅ Phase 8: Establish the pattern you'll repeat
- ✅ Daily checklist, git workflow, troubleshooting

---

## 🚀 TL;DR - FASTEST PATH

```bash
# Terminal 1: Start dev server (keep running)
shopify theme dev

# Terminal 2: Create feature branch
git checkout -b feature/redesign-v2-dawn

# Create CSS tokens file
touch assets/design-tokens.css

# Paste CSS variables from START-HERE.md > PHASE 3.2

# Create button component
touch snippets/component-button.liquid

# Paste button code from START-HERE.md > PHASE 4.2

# Commit
git add .
git commit -m "feat: init redesign with design tokens and button component"

# Open browser to http://localhost:9292
# Test button appears correctly

# Design button in Stitch matching your code
# Compare design vs code
# Update CSS until they match exactly

# Move to next component (card)
# Repeat workflow
```

That's it. Parallel design + code from day 1.

---

## 📖 DOCUMENT PURPOSE & WHEN TO USE

### `kying-design-system.md`
**When:** You need to understand the overall design system
**Use for:**
- Color palette reference
- Typography scale
- Spacing rules
- Component overview
- Accessibility guidelines

**Example:**
> "What's the correct padding for a button?"
> → Open kying-design-system.md > Look up button spacing (12px × 24px)

---

### `01-shopify-setup-guide.md`
**When:** You need help with Shopify theme structure & setup
**Use for:**
- Understanding theme file organization
- Creating component snippets
- CSS file structure
- Shopify CLI commands
- Component examples with Liquid

**Example:**
> "How do I create a reusable component?"
> → See section "Part 2: Component-Based Architecture"

---

### `02-stitch-structure-guide.md`
**When:** You're setting up your design files in Stitch
**Use for:**
- How to organize Stitch folders
- Component mapping (Stitch → Shopify code)
- Design handoff documentation
- Color & token management in Stitch

**Example:**
> "How should I structure my Stitch project?"
> → Follow the folder structure in this doc exactly

---

### `03-component-specs.md`
**When:** You're ready to code a component
**Use for:**
- Design specs for each component
- Complete Liquid code (copy-paste ready)
- CSS styles
- Usage examples

**Example:**
> "I need to code the product card. What's the design?"
> → Find "Component 2: Product Card" → copy all code

---

### `START-HERE.md`
**When:** You're ready to START the build
**Use for:**
- Step-by-step execution instructions
- Verification checklist (is everything set up?)
- Commands to run in order
- Expected outputs at each stage
- Daily workflow pattern
- Troubleshooting quick reference

**Example:**
> "I'm ready to code. What's the first thing to do?"
> → Open START-HERE.md and follow Phase 1

---

## 🔄 YOUR WORKFLOW EACH DAY

```
Morning:
1. Open START-HERE.md Daily Checklist
2. Run: git status
3. Run: shopify theme dev (if not already running)
4. Open http://localhost:9292 in browser
5. Open Stitch in another window

Midday:
1. Design 1 component in Stitch
2. Create snippets/component-*.liquid file
3. Copy code from docs/03-component-specs.md
4. Test in browser (http://localhost:9292)
5. Compare Stitch design vs. live code
6. Adjust CSS to match exactly
7. Take screenshot of final result

Evening:
1. Git commit with descriptive message
2. Update Stitch component notes with "✅ Complete"
3. Run: git log --oneline
4. Review commits (should see 1-2 per day)
5. Keep shopify theme dev running for tomorrow
```

---

## 📋 COMPONENT BUILD ORDER

Build in this order (each builds on previous knowledge):

```
1. Button
   └─ Easiest
   └─ No Shopify data
   └─ Pure CSS + HTML

2. Card
   └─ Simple wrapper
   └─ Basic CSS
   └─ Reusable

3. Product Card
   └─ Uses Shopify product data
   └─ More complex HTML
   └─ Loops through products

4. Form Input
   └─ Accessibility focus
   └─ Form validation prep

5. Grid
   └─ Layout helper
   └─ Responsive breakpoints

6. Testimonial
   └─ Combines other components
   └─ Content-focused

7. Badge / Label
   └─ Small, simple

8. Navigation
   └─ Most complex
   └─ Mobile/desktop variants
```

By component #3, you'll be very fast. By #5, it's muscle memory.

---

## 🎨 PARALLEL DESIGN + CODE FLOW

```
                    Stitch (Design)              Shopify (Code)
                          ↓                             ↓
        Monday:     Design Button            Code Button in Liquid
                    Screenshot               Screenshot of code
                    Annotations              Git commit
                          ↓                         ↓
                    Compare & Iterate (Code screenshot → Stitch)
                          ↓
        Tuesday:    Design Card              Code Card in Liquid
                    (Use button as ref)      (Use button as template)
                          ↓                         ↓
                    Compare & Iterate
                          ↓
        Wednesday:  Design Product Card      Code Product Card
                    Design Homepage          (Use real Shopify data)
                          ↓                         ↓
                    Compare & Iterate
                          ↓
        By Friday:  5-6 components done
                    Homepage designed & coded
                    Ready for staging test
```

---

## ✅ SUCCESS MILESTONES

### End of Day 1:
- [ ] Shopify theme dev running
- [ ] Design tokens CSS created
- [ ] Button component coded
- [ ] Button tested in browser
- [ ] Button designed in Stitch
- [ ] Git feature branch with 1-2 commits

### End of Day 2:
- [ ] Card component coded
- [ ] Product Card component coded
- [ ] All 3 components tested
- [ ] All 3 designed in Stitch
- [ ] Design vs Code compared for each
- [ ] 3-4 git commits

### End of Day 3:
- [ ] Form Input component coded
- [ ] Grid component coded
- [ ] Components integrated into actual sections
- [ ] Homepage layout started in Stitch
- [ ] 5+ git commits

### End of Week 1:
- [ ] 6-8 components complete
- [ ] Homepage fully designed in Stitch
- [ ] Homepage coded in Liquid
- [ ] Mobile responsive version complete
- [ ] Ready for staging Shopify deploy
- [ ] Feature branch ready for merge

---

## 🔗 CROSS-REFERENCE GUIDE

| Question | Answer Location |
|----------|-----------------|
| "What colors should I use?" | kying-design-system.md > Color Palette |
| "How should buttons be sized?" | kying-design-system.md > Components > Buttons |
| "What's the Shopify theme structure?" | 01-shopify-setup-guide.md > Part 3 |
| "How do I organize Stitch files?" | 02-stitch-structure-guide.md > Workspace Setup |
| "Give me ready-to-use component code" | 03-component-specs.md > All components |
| "Step-by-step execution instructions" | START-HERE.md > All phases |
| "What do I do tomorrow morning?" | START-HERE.md > Daily Build Checklist |
| "My button isn't rendering" | START-HERE.md > Troubleshooting |
| "How do I commit changes?" | START-HERE.md > Git Workflow Reference |
| "What component should I build next?" | This file > Component Build Order |

---

## 🛠️ TOOLS YOU'RE USING

```
Stitch              → Design components & pages
                   → https://stitch.withgoogle.com/

Shopify CLI         → Theme development & testing
                   → shopify theme dev
                   → http://localhost:9292

Git                 → Version control & collaboration
                   → git commit, git push, git log

Browser DevTools    → CSS debugging & inspection
                   → F12 or Cmd+Option+I
                   → Inspect elements, check computed styles

Text Editor         → Write Liquid code
                   → (VS Code recommended)
```

---

## 💬 HOW TO ASK FOR HELP

When you're stuck, be specific:

**Bad:** "The button doesn't work"
**Good:** "Button hover state isn't applying. I added `transform: scale(1.02)` in CSS but nothing happens in browser."

**Bad:** "Stitch is confusing"
**Good:** "I created a button component in Stitch but I'm not sure how to add hover state variants."

**Bad:** "Git isn't working"
**Good:** "When I run `git commit`, I get error: 'nothing to commit, working tree clean'. What's wrong?"

---

## 📞 QUICK HELP REFERENCE

```
Problem: "shopify theme dev" won't start
Solution: 
  - Check you're in theme directory: pwd
  - Check CLI version: shopify --version
  - Check logged into store: shopify list

Problem: http://localhost:9292 shows old version
Solution:
  - Hard refresh: Cmd+Shift+R
  - Clear cache in DevTools
  - Restart: Ctrl+C in terminal, then shopify theme dev again

Problem: CSS changes not showing
Solution:
  - Verify file saved
  - Check design-tokens.css is imported in base.css
  - Inspect element → check computed styles
  - Hard refresh browser

Problem: Liquid syntax error
Solution:
  - Check for unclosed tags: {% include %} without closing
  - Look at dev server logs for error message
  - Copy your code back from docs/03-component-specs.md

Problem: Git won't commit
Solution:
  - Verify changes: git status
  - Stage changes: git add .
  - Make sure you're on feature branch: git branch
  - Try again: git commit -m "message"

Problem: Stitch file sync
Solution:
  - Stitch doesn't auto-sync to GitHub (manual process)
  - Screenshot your Stitch design
  - Paste screenshot into git commit OR Stitch notes
  - Use Stitch comments to link to GitHub code
```

---

## 🎓 LEARNING OUTCOMES

By end of this build, you'll know:

✅ Shopify theme structure inside & out  
✅ How to create reusable Liquid components  
✅ CSS variables and design token systems  
✅ Responsive design patterns  
✅ Git workflow for theme development  
✅ Design-to-code translation  
✅ Testing & QA in browser  
✅ Component composition (building from smaller pieces)  
✅ How to work in parallel (design + code simultaneously)  

---

## 🚀 FINAL INSTRUCTION

**Open `START-HERE.md` now.**

Follow it exactly. Don't skip steps. Each phase builds on the last.

By the end of Phase 4, you'll have:
- ✅ Working local dev environment
- ✅ Design tokens in CSS
- ✅ Your first component coded
- ✅ Component tested in browser
- ✅ Component designed in Stitch
- ✅ Design vs code compared

That's your foundation. Everything else is repetition from there.

---

**You have everything you need. You're ready to build.**

**Let's ship.** 🎯

---

*Documentation Version: 1.0*  
*Updated: March 20, 2026*  
*Status: ✅ READY TO EXECUTE*
