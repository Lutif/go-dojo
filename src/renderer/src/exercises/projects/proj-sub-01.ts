import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-sub-01',
  title: 'Subcommands — Command Registry',
  category: 'Projects',
  subcategory: 'Subcommands',
  difficulty: 'intermediate',
  order: 34,
  projectId: 'proj-sub',
  projectTitle: 'Subcommands CLI',
  step: 1,
  totalSteps: 5,
  description: `Many CLIs (git, go, kubectl) dispatch on a first positional argument — the *subcommand*.
In this step, build the foundation: a registry that maps subcommand names to handler functions
and a dispatcher that routes calls through it.

**Requirements:**
- Define \`Handler\` as \`func(args []string) int\` (returns an exit code).
- Implement \`Registry\` with:
  - \`Register(name string, h Handler)\` — store a handler under a name.
  - \`Dispatch(argv []string) int\` — take raw argv (like \`os.Args[1:]\`), pull the first element as
    the subcommand name, and invoke the matching handler with the remaining args.
- If \`argv\` is empty, return exit code \`2\`.
- If the subcommand is unknown, return exit code \`2\`.
- Otherwise, return whatever the handler returns.

**Example:**

\`\`\`go
r := NewRegistry()
r.Register("hello", func(args []string) int {
    fmt.Println("hi", args)
    return 0
})
code := r.Dispatch([]string{"hello", "world"}) // prints "hi [world]", code == 0
\`\`\``,
  code: `package main

// Handler is the signature every subcommand implements.
// args are the arguments that follow the subcommand name on the command line.
// The returned int is the process exit code (0 = success).
type Handler func(args []string) int

// Registry holds named subcommand handlers and dispatches calls to them.
type Registry struct {
	// TODO: add a field to store name -> Handler
}

// NewRegistry returns a ready-to-use Registry.
func NewRegistry() *Registry {
	// TODO: initialize the map
	return &Registry{}
}

// Register adds a handler under the given name. Later registrations overwrite earlier ones.
func (r *Registry) Register(name string, h Handler) {
	// TODO
}

// Dispatch pulls the first argument as the subcommand name and calls its handler
// with the remaining arguments. Returns exit code 2 when argv is empty or the
// subcommand is not registered.
func (r *Registry) Dispatch(argv []string) int {
	// TODO: handle empty argv
	// TODO: look up handler by argv[0]
	// TODO: call handler with argv[1:]
	return 0
}

func main() {}
`,
  testCode: `package main

import "testing"

func TestDispatchCallsHandler(t *testing.T) {
	r := NewRegistry()
	called := false
	var gotArgs []string
	r.Register("greet", func(args []string) int {
		called = true
		gotArgs = args
		return 0
	})
	code := r.Dispatch([]string{"greet", "alice", "bob"})
	if code != 0 {
		t.Errorf("expected exit 0, got %d", code)
	}
	if !called {
		t.Fatal("handler was not called")
	}
	if len(gotArgs) != 2 || gotArgs[0] != "alice" || gotArgs[1] != "bob" {
		t.Errorf("expected [alice bob], got %v", gotArgs)
	}
}

func TestDispatchReturnsHandlerCode(t *testing.T) {
	r := NewRegistry()
	r.Register("fail", func(args []string) int { return 7 })
	if code := r.Dispatch([]string{"fail"}); code != 7 {
		t.Errorf("expected 7, got %d", code)
	}
}

func TestDispatchEmptyArgv(t *testing.T) {
	r := NewRegistry()
	if code := r.Dispatch([]string{}); code != 2 {
		t.Errorf("expected 2 for empty argv, got %d", code)
	}
}

func TestDispatchUnknown(t *testing.T) {
	r := NewRegistry()
	r.Register("known", func(args []string) int { return 0 })
	if code := r.Dispatch([]string{"nope"}); code != 2 {
		t.Errorf("expected 2 for unknown subcommand, got %d", code)
	}
}

func TestRegisterOverwrites(t *testing.T) {
	r := NewRegistry()
	r.Register("x", func(args []string) int { return 1 })
	r.Register("x", func(args []string) int { return 2 })
	if code := r.Dispatch([]string{"x"}); code != 2 {
		t.Errorf("expected overwrite to win (2), got %d", code)
	}
}

func TestMultipleSubcommands(t *testing.T) {
	r := NewRegistry()
	r.Register("a", func(args []string) int { return 10 })
	r.Register("b", func(args []string) int { return 20 })
	if code := r.Dispatch([]string{"a"}); code != 10 {
		t.Errorf("a: expected 10, got %d", code)
	}
	if code := r.Dispatch([]string{"b"}); code != 20 {
		t.Errorf("b: expected 20, got %d", code)
	}
}
`,
  solution: `package main

type Handler func(args []string) int

type Registry struct {
	handlers map[string]Handler
}

func NewRegistry() *Registry {
	return &Registry{handlers: make(map[string]Handler)}
}

func (r *Registry) Register(name string, h Handler) {
	r.handlers[name] = h
}

func (r *Registry) Dispatch(argv []string) int {
	if len(argv) == 0 {
		return 2
	}
	name := argv[0]
	h, ok := r.handlers[name]
	if !ok {
		return 2
	}
	return h(argv[1:])
}

func main() {}
`,
  hints: [
    'Store handlers in a map[string]Handler inside Registry.',
    'Guard against len(argv) == 0 before indexing argv[0].',
    'Use the comma-ok idiom on the map lookup to detect unknown subcommands.',
  ],
}

export default exercise
