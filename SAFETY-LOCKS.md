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
