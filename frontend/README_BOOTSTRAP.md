# Oath Bootstrap

- Expo + expo-router
- Tokens-only styling
- Ionicons only
- TOKENS_OK screen at /tokens-ok

AFTER WRITING FILES:
- From /app/frontend:
  1) Run npm install
  2) Run npm run web
- Return the Preview URL.
- Attach two screenshots:
  1) home-light.png: Home screen in light mode with mic icon and "Open TOKENS_OK Self-Test" button visible.
  2) tokens-ok.png: TOKENS_OK screen showing labeled color swatches.

QA (report pass/fail):
- Boots & builds with no TypeScript or Metro errors; preview URL loads.
- Theme flip (system light/dark) changes background and text colors appropriately.
- Tokens-only: Home and TOKENS_OK screens derive colors from src/design/tokens.ts (no raw hex in components).
- Ionicons only: Mic icon renders from Ionicons; no other icon packs present.
- Routing: Link to /tokens-ok works; back nav returns to Home.
- No stray deps: Only declared dependencies are installed.

ON FAILURE:
- Return the exact error text and the first stack frame (file:line). Do not modify more files.