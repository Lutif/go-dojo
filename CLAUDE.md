# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Go Dojo is an Electron desktop app (React + TypeScript) that provides an interactive Go learning environment with ~240 exercises across 10 categories. Users write Go code in a Monaco editor; the app executes `go test` in a temp directory and shows results.

Go 1.21+ must be installed on the host for exercise execution.

## Commands

```bash
npm run dev        # Start Electron dev server (hot reload)
npm run build      # Production build → out/
npm run dist:mac   # Build, sign, and notarize a macOS .dmg/.zip → release/
npm run dist:win   # Windows installer
npm run dist:linux # Linux AppImage
```

No Makefile — all commands go through npm scripts.

## Architecture

### Process boundary

- **Main** (`src/main/index.ts`): IPC handlers that write Go files to `/tmp/go-dojo-{timestamp}/`, run `go test -v -count=1 -timeout 10s ./...`, parse output, and clean up. Augments `process.env.PATH` at startup via `fixPath()` so GUI-launched apps can find Go (Finder-launched apps inherit a bare PATH that excludes Homebrew and `/usr/local/go/bin`).
- **Renderer** (`src/renderer/src/`): React + Monaco. Communicates with main via `window.api` (preload bridge at `src/preload/`).

### Exercise data

Exercises live in `src/renderer/src/exercises/{basics,type-system,error-handling,concurrency,stdlib,patterns,internals,networking,data-storage,projects}/`. Each file exports a single `Exercise` (defined in `types.ts`); `exercises/index.ts` aggregates all of them.

**Sidebar grouping for project series** (proj-cli, proj-lex, proj-rest, proj-queue, proj-sub, proj-monkey): `groupByProject` in `Sidebar.tsx` only groups exercises that have `projectId` set. Without it, a step shows as a standalone item. Set `projectTitle` on the **first** step to give the group a human-readable header (otherwise it falls back to the raw `projectId`).

### Dependency graph

`src/renderer/src/data/dependencies.ts` (47KB) maps every exercise ID to its prerequisites. Exercises are locked until all `requires` are completed. Adding an exercise without registering it here means it's reachable but ungated.

### Progress persistence

Stored in `~/.go-dojo-progress.json` with keys: `completed`, `drafts` (auto-saved), `submitted` (saved on pass), `bookmarks`, `exerciseUi` (panel collapse state).

### Theming

CSS variables in `styles.css` drive the `go-*` Tailwind colors (mapped via `tailwind.config.js` using `rgb(var(--color-X) / <alpha-value>)`). Theme switching = toggling body classes:
- `theme-paper` — light cream theme (vs default dark)
- `font-dyslexic` — swaps `--font-sans` to Lexend with relaxed tracking

Monaco lives outside the Tailwind tree and gets two registered themes (`go-dojo`, `go-dojo-paper`) in `EditorPanel.tsx`. A `MutationObserver` on `document.body` keeps Monaco in sync when toggles flip.

### Key components

- `App.tsx` — top-level state, `runCode()` flow, keyboard shortcuts (Cmd+Enter = run, Cmd+R = reset)
- `Sidebar.tsx` — exercise list, search, category filter, bookmarks, project grouping
- `EditorPanel.tsx` — Monaco wrapper with theme/font sync
- `ExerciseInfo.tsx` — description, hints, test output
- `SkillTreeFlow.tsx` — prerequisite graph (`@xyflow/react` + `dagre`)

## Adding exercises

Follow the `Exercise` interface in `src/renderer/src/types.ts`. For project series, set `projectId`, `step`, `totalSteps`, plus `projectTitle` on step 1. Add the ID and its prerequisites to `dependencies.ts`. Register in the appropriate category file and verify it appears in `exercises/index.ts`.

### TS → Go escaping (easy to get wrong)

`code`, `testCode`, and `solution` are JS template literals containing Go source. JS evaluates escapes before Go ever sees the string, so:

| You want in Go        | Write in TS template literal |
|-----------------------|------------------------------|
| `"a\nb"` (literal `\n`) | `"a\\nb"`                    |
| `\"hi\"`              | `\\"hi\\"`                   |
| Backtick (raw string) | `` ` + '`' + ` `` (concat — closes template, embeds backtick string, reopens) |
| `${`                  | `\${`                        |

A `"foo\nbar"` written in the template becomes a real newline in the Go source, which Go rejects as an unterminated string literal.

### Verifying exercises pass their own tests

The simplest approach uses Bun to evaluate the TS file (handles the backtick-concat trick that simple regex extractors break on):

```bash
mkdir -p /tmp/gtest && cd /tmp/gtest && go mod init t

cat > /tmp/extract.ts <<'EOF'
const path = Bun.argv[2]
const src = await Bun.file(path).text()
const stripped = src.replace(/^import.*$/m, '').replace(/:\s*Exercise\s*=/, '=').replace(/export default.*$/m, '')
const ex = new Function(stripped + '; return exercise;')()
await Bun.write('/tmp/gtest/solution.go', ex.solution)
await Bun.write('/tmp/gtest/main_test.go', ex.testCode)
EOF

bun /tmp/extract.ts src/renderer/src/exercises/<cat>/<file>.ts
(cd /tmp/gtest && go test ./...)
```

`go vet` (run automatically by `go test`) flags non-constant format strings — e.g. `newError("foo: " + x)` fails when `newError` takes a format string. Use `newError("foo: %s", x)`.

## macOS packaging

`build.mac` in `package.json` is configured for hardened-runtime + notarization. To sign & notarize, set these env vars before `npm run dist:mac`:

- `APPLE_ID` — your Apple ID email
- `APPLE_APP_SPECIFIC_PASSWORD` — generated at appleid.apple.com → Sign-In and Security
- `APPLE_TEAM_ID` — 10-char Team ID from developer.apple.com → Membership

The "Developer ID Application" cert must be in the login keychain (`security find-identity -v -p codesigning` to verify). Entitlements are in `build/entitlements.mac.plist` (allows JIT and unsigned executable memory — required for V8 under hardened runtime).

For unsigned local builds, downloaded `.app` bundles get the `com.apple.quarantine` xattr and macOS reports them as "damaged." Strip with `xattr -cr "/Applications/Go Dojo.app"`.

## In-progress / planned work

Per `PROJECT_EXPANSION_ANALYSIS.md`: five projects are defined in dependencies but lack exercises — `proj-kv`, `proj-log`, `proj-watcher`, `proj-git`, `proj-container`. `MONKEY_INTERPRETER_PROJECT_PLAN.md` documents the 22-step Monkey interpreter project (now fully built).
