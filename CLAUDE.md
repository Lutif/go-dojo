# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Go Dojo is an Electron desktop app (React + TypeScript) that provides an interactive Go learning environment with 250+ exercises. Users write Go code in a Monaco editor; the app executes `go test` in a temp directory and shows results.

Go 1.21+ must be installed on the host machine for exercise execution to work.

## Commands

```bash
npm run dev        # Start Electron dev server (hot reload)
npm run build      # Production build → out/
npm run preview    # Preview the production build
```

No Makefile — all commands go through npm scripts.

## Architecture

### Process Boundary

- **Main process** (`src/main/index.ts`): IPC handlers that write Go files to `/tmp/go-dojo-{timestamp}/`, run `go test -v -count=1 -timeout 10s ./...`, parse output, and clean up.
- **Renderer** (`src/renderer/src/`): React app with Monaco editor. Communicates with main via `window.api` (preload bridge at `src/preload/`).

### Exercise Data

Exercises live in `src/renderer/src/exercises/` split by category (basics, type-system, error-handling, concurrency, stdlib, patterns, internals, networking, data-storage, projects). Each file exports an array; `exercises/index.ts` aggregates all of them.

Each exercise has: `id`, `title`, `code` (starter), `testCode` (Go test file), `solution`, `hints[]`, optional `goMod`, and optional project step metadata (`projectId`, `step`, `totalSteps`).

### Dependency Graph

`src/renderer/src/data/dependencies.ts` (47KB) maps every exercise ID to its prerequisites. Exercises are locked until all `requires` are completed.

### Progress Persistence

Stored in `~/.go-dojo-progress.json` with keys: `completed`, `drafts` (auto-saved), `submitted` (on pass), `bookmarks`, and `exerciseUi` (panel collapse state).

### Key Components

- `App.tsx` — top-level state, `runCode()` flow, keyboard shortcuts (Cmd+Enter = run, Cmd+R = reset)
- `Sidebar.tsx` — exercise list, search, category filter, bookmarks
- `EditorPanel.tsx` — Monaco editor wrapper
- `ExerciseInfo.tsx` — description, hints, test output
- `SkillTreeFlow.tsx` — prerequisite graph visualization (uses `@xyflow/react` + `dagre`)

## Adding Exercises

Follow the `Exercise` interface in `src/renderer/src/types.ts`. For project exercises, set `projectId`, `step`, `totalSteps`. Add the ID and its prerequisites to `dependencies.ts`. Register in the appropriate category file and verify it appears in `exercises/index.ts`.

## In-Progress / Planned Work

Per `PROJECT_EXPANSION_ANALYSIS.md`: five projects are defined in dependencies but lack exercises — `proj-kv`, `proj-log`, `proj-watcher`, `proj-git`, `proj-container`. `MONKEY_INTERPRETER_PROJECT_PLAN.md` has a detailed 22-step plan for the Monkey interpreter project (`proj-monkey`).
