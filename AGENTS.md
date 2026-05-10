# AGENTS.md

## Cursor Cloud specific instructions

This is a personal portfolio/blog site with interactive WebGL visualizations ("sketches") using regl. There is no backend, no database, no linting, and no automated test suite.

### Key architecture

- **Source code** lives in `/workspace/src/` (with its own `package.json`).
- **Individual sketches** are in `/workspace/src/src/<project-name>/` — each is independent.
- **Built output** is committed at the repo root for GitHub Pages serving.

### Development commands (run from `/workspace/src`)

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Dev server | `npm start <project-name>` (serves on `localhost:9966` with live-reload via budo) |
| Build one | `npm run build <project-name>` |
| Build all | `npm run build-all` |

### Gotchas

- Node v22 works fine despite deprecated-package warnings. No `.nvmrc` exists.
- The `open: true` flag in budo will try to open a browser — in headless environments this is harmless (it just logs an error) and the server still runs.
- The root `package-lock.json` is a stub; all real dependencies are in `src/package.json`.
- There is no lint or test configuration — correctness is verified by running the dev server and checking the browser output.
- Each sketch is fully independent; there is no shared build graph between projects.
