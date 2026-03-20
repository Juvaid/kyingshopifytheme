# AGENT MANAGEMENT SYSTEM

How to control agents and prevent deletion disasters.

---

## SETUP: Make gemini.md Your Global Guard

**In EVERY project root:**

1. Copy `gemini.md` to root
2. Create `AGENT-MANAGEMENT.md` (this doc)
3. Create `goals.md` with clear tasks
4. Create `SAFETY-LOCKS.md` (template below)

**When delegating to agent:**

```
Start with:
"Follow gemini.md FIRST.

Then read:
- goals.md
- AGENT-RULES.md (if exists)
- SAFETY-LOCKS.md

Confirm you understand all rules.
Ask clarifying questions.
Show your work before proceeding."
```

---

## SAFETY LOCKS - File Permissions Guide

Create `SAFETY-LOCKS.md`:

```markdown
# SAFETY LOCKS - What Agents Can/Cannot Do

## READ-ONLY (Agents cannot modify)
- tasks/ folder
- documentation/ folder  
- README.md
- goals.md (can only UPDATE status)

## WRITE (Agents can create/modify)
- snippets/component-*.liquid
- assets/design-tokens.css
- sections/*.liquid

## FORBIDDEN (Agents cannot touch)
- .git (no direct git commands beyond commit/push/pull)
- package.json (no npm changes)
- config files
- Any file starting with "."

## DANGEROUS (Requires confirmation)
- Deleting any file
- Renaming any file
- Moving any file
- Modifying documentation

## APPROVAL REQUIRED
Before these actions, agent must ask:
- "Delete [filename]? Confirm YES"
- "Refactor [component]? Show diff first"
- "Update [config]? Explain changes"
```

---

## SUMMARY

**To prevent deletion disasters:**

1. ✅ Give agents gemini.md (global rules)
2. ✅ Create SAFETY-LOCKS.md per project
3. ✅ Use git as safety net
4. ✅ Monitor closely first 10 tasks
5. ✅ Require confirmation on destructive actions
6. ✅ Review daily (git log, git status)
7. ✅ Have recovery protocol ready
8. ✅ Ask before delegating
