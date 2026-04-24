import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-sub-03',
  title: 'Subcommands — Help Text',
  category: 'Projects',
  subcategory: 'Subcommands',
  difficulty: 'intermediate',
  order: 36,
  projectId: 'proj-sub',
  step: 3,
  totalSteps: 5,
  description: `A CLI is only as friendly as its help output. In this step, generate usage text for a set
of registered subcommands.

**Requirements:**
- Define \`Command\` with three exported fields: \`Name string\`, \`Summary string\`, \`Usage string\`.
- Implement \`App\` with:
  - \`Name string\` — the program name (e.g. \`"mytool"\`).
  - \`Register(cmd Command)\` — add a command. Duplicates overwrite.
  - \`TopHelp() string\` — build the top-level help text.
  - \`CommandHelp(name string) (string, bool)\` — build help for one command; second return is
    \`false\` if the name isn't registered.

**TopHelp format (exact):**

\`\`\`
Usage: <AppName> <command> [flags]

Commands:
  <name>    <summary>
  <name>    <summary>
\`\`\`

- Commands must be listed in **alphabetical order** by name.
- Each command line starts with two spaces, then the name, then enough spaces so every
  summary starts at the same column: \`(longestName + 4)\` characters from the start of the name.
  (So if the longest name is 6 chars, summaries start 10 chars in.)

**CommandHelp format (exact):**

\`\`\`
<AppName> <Name> — <Summary>

Usage:
  <Usage>
\`\`\`

Use an em dash (\`—\`, U+2014) between name and summary.`,
  code: `package main

import "strings"

var _ = strings.Repeat

// Command describes a single subcommand for help purposes.
type Command struct {
	Name    string
	Summary string
	Usage   string
}

// App is the top-level CLI. It knows its own name and the commands registered against it.
type App struct {
	Name string
	// TODO: add a field to hold registered commands
}

// NewApp returns an App with the given program name.
func NewApp(name string) *App {
	// TODO
	return &App{Name: name}
}

// Register adds (or replaces) a command.
func (a *App) Register(cmd Command) {
	// TODO
}

// TopHelp builds the top-level help string. See the exercise description for the exact format.
func (a *App) TopHelp() string {
	// TODO:
	// 1. Collect command names and sort them.
	// 2. Find the longest name.
	// 3. Build "Usage: <App> <command> [flags]\\n\\nCommands:\\n"
	// 4. For each name in order: "  <name><padding><summary>\\n"
	//    padding = spaces so column starts at longest+4 chars after line start
	//    (line starts with two spaces, then the name, then spaces up to col 2+longest+2).
	return ""
}

// CommandHelp returns help for a single command, or ("", false) if it is unknown.
func (a *App) CommandHelp(name string) (string, bool) {
	// TODO
	return "", false
}

func main() {}
`,
  testCode: `package main

import (
	"strings"
	"testing"
)

func TestTopHelpFormat(t *testing.T) {
	app := NewApp("mytool")
	app.Register(Command{Name: "add", Summary: "Add an item", Usage: "mytool add -name=X"})
	app.Register(Command{Name: "remove", Summary: "Remove an item", Usage: "mytool remove -id=X"})
	app.Register(Command{Name: "list", Summary: "List items", Usage: "mytool list"})

	got := app.TopHelp()

	wantHeader := "Usage: mytool <command> [flags]"
	if !strings.HasPrefix(got, wantHeader+"\n") {
		t.Errorf("missing header %q at start:\n%s", wantHeader, got)
	}

	if !strings.Contains(got, "\nCommands:\n") {
		t.Errorf("missing 'Commands:' section:\n%s", got)
	}

	// Alphabetical order: add, list, remove
	addIdx := strings.Index(got, "add")
	listIdx := strings.Index(got, "list")
	removeIdx := strings.Index(got, "remove")
	if !(addIdx < listIdx && listIdx < removeIdx) {
		t.Errorf("commands not in alphabetical order (add=%d list=%d remove=%d):\n%s",
			addIdx, listIdx, removeIdx, got)
	}
}

func TestTopHelpAlignment(t *testing.T) {
	app := NewApp("mytool")
	app.Register(Command{Name: "add", Summary: "Add an item"})
	app.Register(Command{Name: "remove", Summary: "Remove an item"})

	got := app.TopHelp()
	// longest name = "remove" (6), column = 6+4 = 10
	// "  add" + 7 spaces + "Add an item"
	// "  remove" + 4 spaces + "Remove an item"
	wantAdd := "  add" + strings.Repeat(" ", 10-len("add")-2) + "Add an item"
	wantRem := "  remove" + strings.Repeat(" ", 10-len("remove")-2) + "Remove an item"
	if !strings.Contains(got, wantAdd) {
		t.Errorf("missing aligned add line %q in:\n%s", wantAdd, got)
	}
	if !strings.Contains(got, wantRem) {
		t.Errorf("missing aligned remove line %q in:\n%s", wantRem, got)
	}
}

func TestCommandHelpKnown(t *testing.T) {
	app := NewApp("mytool")
	app.Register(Command{Name: "add", Summary: "Add an item", Usage: "mytool add -name=X -qty=N"})

	got, ok := app.CommandHelp("add")
	if !ok {
		t.Fatal("CommandHelp(add) returned ok=false, want true")
	}
	if !strings.Contains(got, "mytool add — Add an item") {
		t.Errorf("missing title line with em dash:\n%s", got)
	}
	if !strings.Contains(got, "Usage:\n  mytool add -name=X -qty=N") {
		t.Errorf("missing usage block:\n%s", got)
	}
}

func TestCommandHelpUnknown(t *testing.T) {
	app := NewApp("mytool")
	app.Register(Command{Name: "add", Summary: "x", Usage: "y"})
	got, ok := app.CommandHelp("nope")
	if ok {
		t.Error("expected ok=false for unknown command")
	}
	if got != "" {
		t.Errorf("expected empty string, got %q", got)
	}
}

func TestRegisterOverwrites(t *testing.T) {
	app := NewApp("mytool")
	app.Register(Command{Name: "x", Summary: "first", Usage: "u1"})
	app.Register(Command{Name: "x", Summary: "second", Usage: "u2"})
	got, _ := app.CommandHelp("x")
	if !strings.Contains(got, "second") || strings.Contains(got, "first") {
		t.Errorf("overwrite failed, got:\n%s", got)
	}
}
`,
  solution: `package main

import (
	"sort"
	"strings"
)

type Command struct {
	Name    string
	Summary string
	Usage   string
}

type App struct {
	Name string
	cmds map[string]Command
}

func NewApp(name string) *App {
	return &App{Name: name, cmds: make(map[string]Command)}
}

func (a *App) Register(cmd Command) {
	a.cmds[cmd.Name] = cmd
}

func (a *App) TopHelp() string {
	names := make([]string, 0, len(a.cmds))
	longest := 0
	for n := range a.cmds {
		names = append(names, n)
		if len(n) > longest {
			longest = len(n)
		}
	}
	sort.Strings(names)

	var b strings.Builder
	b.WriteString("Usage: ")
	b.WriteString(a.Name)
	b.WriteString(" <command> [flags]\n\n")
	b.WriteString("Commands:\n")
	col := longest + 4 // spaces from start of line to start of summary
	for _, n := range names {
		c := a.cmds[n]
		b.WriteString("  ")
		b.WriteString(n)
		pad := col - 2 - len(n)
		if pad < 1 {
			pad = 1
		}
		b.WriteString(strings.Repeat(" ", pad))
		b.WriteString(c.Summary)
		b.WriteString("\n")
	}
	return b.String()
}

func (a *App) CommandHelp(name string) (string, bool) {
	c, ok := a.cmds[name]
	if !ok {
		return "", false
	}
	var b strings.Builder
	b.WriteString(a.Name)
	b.WriteString(" ")
	b.WriteString(c.Name)
	b.WriteString(" \u2014 ")
	b.WriteString(c.Summary)
	b.WriteString("\n\nUsage:\n  ")
	b.WriteString(c.Usage)
	b.WriteString("\n")
	return b.String(), true
}

func main() {}
`,
  hints: [
    'Collect command names into a slice and sort.Strings them before printing.',
    'Track the longest name while iterating; summary column = longest + 4.',
    'strings.Builder plus strings.Repeat(" ", n) keeps the formatting code compact.',
  ],
}

export default exercise
