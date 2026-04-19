# Go Dojo

A comprehensive, interactive Go learning platform built with Electron, React, and TypeScript. Go Dojo provides an integrated development environment with 250+ exercises across 10 categories, real-time code execution, and progress tracking.

## Features

- **250+ Interactive Exercises** - Organized across 10 categories from basics to advanced projects
- **Real-Time Code Execution** - Write Go code and run tests instantly in a sandboxed environment
- **Test-Driven Learning** - Each exercise includes tests that guide your implementation
- **Progress Tracking** - Automatically saves your work and tracks completion across all exercises
- **Dependency Graph** - Visual skill tree showing exercise prerequisites and learning paths
- **Monaco Editor** - Professional code editor with syntax highlighting and Go language support
- **Dark Theme** - Eye-friendly interface optimized for long study sessions

## Exercise Categories

1. **Basics** - Variables, functions, control flow, data types
2. **Type System** - Interfaces, type assertions, generics, methods
3. **Error Handling** - Error creation, wrapping, custom error types
4. **Concurrency** - Goroutines, channels, synchronization primitives
5. **Standard Library** - fmt, encoding/json, http, file I/O, and more
6. **Patterns** - Design patterns, functional options, builders, factories
7. **Internals** - Memory layout, interfaces, escape analysis, reflection
8. **Networking** - TCP, HTTP, WebSockets, middleware, load balancing
9. **Data & Storage** - KV stores, caching, bloom filters, data structures
10. **Projects** - Multi-step projects: REST API, CLI, Lexer, Monkey Interpreter

## Requirements

- **Node.js** 16+ and npm
- **Go** 1.21+ (installed on your machine for exercise execution)
- **macOS, Windows, or Linux**

## Installation

```bash
# Clone the repository
git clone https://github.com/lutif/go-dojo.git
cd go-dojo

# Install dependencies
npm install

# Start development server
npm run dev
```

## Available Commands

```bash
npm run dev       # Start Electron dev server with hot reload
npm run build     # Build production binaries (outputs to out/)
npm run preview   # Preview the production build
```

## Architecture

### Process Boundary

- **Main Process** (`src/main/index.ts`) - Handles file I/O, Go test execution, and IPC
  - Creates temporary directories for exercise code
  - Executes `go test -v -count=1 -timeout 10s`
  - Parses and returns test output to renderer
  - Cleans up temporary files

- **Renderer** (`src/renderer/src/`) - React application with Monaco editor
  - Exercise listing and search
  - Code editor with syntax highlighting
  - Test output display
  - Progress dashboard and skill tree visualization
  - Communicates with main via IPC bridge

### Project Structure

```
go-dojo/
├── src/
│   ├── main/              # Electron main process
│   │   └── index.ts       # IPC handlers, Go execution
│   ├── preload/           # IPC preload bridge
│   ├── renderer/
│   │   ├── src/
│   │   │   ├── exercises/ # Exercise definitions by category
│   │   │   │   ├── basics/
│   │   │   │   ├── type-system/
│   │   │   │   ├── error-handling/
│   │   │   │   ├── concurrency/
│   │   │   │   ├── stdlib/
│   │   │   │   ├── patterns/
│   │   │   │   ├── internals/
│   │   │   │   ├── networking/
│   │   │   │   ├── data-storage/
│   │   │   │   └── projects/
│   │   │   ├── components/
│   │   │   │   ├── App.tsx
│   │   │   │   ├── EditorPanel.tsx
│   │   │   │   ├── ExerciseInfo.tsx
│   │   │   │   ├── ProgressDashboard.tsx
│   │   │   │   └── SkillTreeFlow.tsx
│   │   │   ├── data/
│   │   │   │   └── dependencies.ts # Prerequisite graph
│   │   │   ├── types.ts
│   │   │   └── index.css
│   │   └── index.html
├── package.json
├── tsconfig.json
└── electron.vite.config.ts
```

### Exercise Definition Format

Each exercise is a TypeScript file exporting an `Exercise` object:

```typescript
const exercise: Exercise = {
  id: 'basics_01_hello',
  title: 'Hello World',
  category: 'Basics',
  subcategory: 'Getting Started',
  difficulty: 'beginner',
  order: 1,
  
  // Markdown description shown to user
  description: `## Your Task\n\nWrite a function that returns...`,
  
  // Starter code
  code: `package main\n\nfunc Hello() string {\n  return ""\n}`,
  
  // Test file content
  testCode: `package main\n\nimport "testing"\n\nfunc TestHello(t *testing.T) {...}`,
  
  // Solution
  solution: `package main\n\nfunc Hello() string {\n  return "Hello, World!"\n}`,
  
  // Hints shown when user is stuck
  hints: ['Use double quotes for strings', 'Replace the empty string with your answer'],
  
  // Optional: Go module content for multi-file exercises
  goMod?: `module example.com/hello\n\ngo 1.21`,
  
  // Optional: For multi-step projects
  projectId?: 'proj-rest',
  step?: 1,
  totalSteps?: 5
}
```

## Data Persistence

User progress is stored in `~/.go-dojo-progress.json`:

```json
{
  "completed": {
    "basics_01_hello": true
  },
  "drafts": {
    "basics_02_variables": "package main..."
  },
  "submitted": {
    "basics_01_hello": "package main..."
  },
  "bookmarks": {
    "concurrency_01_goroutines": true
  }
}
```

## Dependency Management

The `src/renderer/src/data/dependencies.ts` file defines prerequisites for each exercise. Exercises are locked until their `requires` are completed. This creates a guided learning path.

## Keyboard Shortcuts

- **Cmd/Ctrl + Enter** - Run exercise tests
- **Cmd/Ctrl + R** - Reset to starter code
- **Cmd/Ctrl + S** - Save current code (auto-saved)

## Contributing

Contributions are welcome! Areas for enhancement:

- [ ] Additional exercises and projects
- [ ] More comprehensive hints and educational content
- [ ] Performance optimizations
- [ ] Additional language features support
- [ ] Web-based version using WebAssembly Go

## License

MIT License - See LICENSE file for details

## Acknowledgments

- **Go Team** for the excellent Go language and comprehensive standard library
- **Monaco Editor** for the powerful code editor
- **Electron** for cross-platform desktop framework
- **React** and **TypeScript** for building maintainable UIs

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Learning!** 🚀
