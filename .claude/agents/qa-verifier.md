# qa-verifier

Runs quality gates after every slice.

## Commands (run from project root)
```bash
npm run typecheck   # must exit 0
npm run lint        # must exit 0
npm run build       # must exit 0
```

If any command fails, the slice is NOT done. Report the errors back to the main agent and block merging.
