import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-sub-02',
  title: 'Subcommands — Per-Command Flags',
  category: 'Projects',
  subcategory: 'Subcommands',
  difficulty: 'intermediate',
  order: 35,
  projectId: 'proj-sub',
  step: 2,
  totalSteps: 5,
  description: `Each subcommand usually has its own flags — \`git commit -m\`, \`go test -v\`, etc. The standard
\`flag\` package supports this via \`flag.NewFlagSet\`: you create an independent \`FlagSet\` per
subcommand, parse the arguments *after* the subcommand name with it, and leftovers become
positional args.

**Requirements:**
- Implement \`RunAdd(args []string) (name string, qty int, positional []string, err error)\`
  using a \`*flag.FlagSet\` named \`"add"\`:
  - \`-name string\` (default \`""\`) — item name.
  - \`-qty int\` (default \`1\`) — quantity.
  - After parsing, return \`fs.Args()\` as the positional slice.
  - Return the error from \`fs.Parse\` unchanged if parsing fails.
- Implement \`RunRemove(args []string) (id string, force bool, err error)\` using a \`FlagSet\`
  named \`"remove"\`:
  - \`-id string\` (required — if empty after parsing, return an error whose message contains \`"id is required"\`).
  - \`-force bool\` (default \`false\`).
- Set each FlagSet's error handling to \`flag.ContinueOnError\` so parse failures return errors
  instead of calling \`os.Exit\`.
- Silence the default usage/error output by calling \`fs.SetOutput(io.Discard)\` (keeps test logs clean).`,
  code: `package main

import (
	"flag"
	"io"
)

var _ = flag.ContinueOnError
var _ = io.Discard

// RunAdd parses the "add" subcommand's flags from args (which should NOT include the
// subcommand name itself — just what follows it). It returns the parsed -name, -qty,
// any positional arguments left over, and any parse error.
func RunAdd(args []string) (string, int, []string, error) {
	// TODO:
	// 1. fs := flag.NewFlagSet("add", flag.ContinueOnError)
	// 2. fs.SetOutput(io.Discard)
	// 3. define -name and -qty
	// 4. fs.Parse(args)
	// 5. return values + fs.Args()
	return "", 0, nil, nil
}

// RunRemove parses the "remove" subcommand's flags.
// If -id ends up empty, it returns an error mentioning "id is required".
func RunRemove(args []string) (string, bool, error) {
	// TODO
	return "", false, nil
}

func main() {}
`,
  testCode: `package main

import (
	"strings"
	"testing"
)

func TestRunAddBasic(t *testing.T) {
	name, qty, pos, err := RunAdd([]string{"-name=apple", "-qty=5"})
	if err != nil {
		t.Fatalf("unexpected err: %v", err)
	}
	if name != "apple" {
		t.Errorf("name: want apple, got %q", name)
	}
	if qty != 5 {
		t.Errorf("qty: want 5, got %d", qty)
	}
	if len(pos) != 0 {
		t.Errorf("positional: want empty, got %v", pos)
	}
}

func TestRunAddDefaults(t *testing.T) {
	name, qty, _, err := RunAdd([]string{})
	if err != nil {
		t.Fatalf("unexpected err: %v", err)
	}
	if name != "" {
		t.Errorf("name default: want empty, got %q", name)
	}
	if qty != 1 {
		t.Errorf("qty default: want 1, got %d", qty)
	}
}

func TestRunAddPositional(t *testing.T) {
	_, _, pos, err := RunAdd([]string{"-name=x", "alpha", "beta"})
	if err != nil {
		t.Fatalf("unexpected err: %v", err)
	}
	if len(pos) != 2 || pos[0] != "alpha" || pos[1] != "beta" {
		t.Errorf("positional: want [alpha beta], got %v", pos)
	}
}

func TestRunAddBadFlag(t *testing.T) {
	_, _, _, err := RunAdd([]string{"-qty=notanumber"})
	if err == nil {
		t.Fatal("expected parse error for non-int -qty, got nil")
	}
}

func TestRunRemoveOK(t *testing.T) {
	id, force, err := RunRemove([]string{"-id=abc123", "-force"})
	if err != nil {
		t.Fatalf("unexpected err: %v", err)
	}
	if id != "abc123" {
		t.Errorf("id: want abc123, got %q", id)
	}
	if !force {
		t.Error("force: want true, got false")
	}
}

func TestRunRemoveMissingID(t *testing.T) {
	_, _, err := RunRemove([]string{})
	if err == nil {
		t.Fatal("expected error when -id missing, got nil")
	}
	if !strings.Contains(err.Error(), "id is required") {
		t.Errorf("error should mention 'id is required', got: %v", err)
	}
}

func TestRunRemoveForceDefault(t *testing.T) {
	_, force, err := RunRemove([]string{"-id=x"})
	if err != nil {
		t.Fatalf("unexpected err: %v", err)
	}
	if force {
		t.Error("force default: want false, got true")
	}
}
`,
  solution: `package main

import (
	"errors"
	"flag"
	"io"
)

func RunAdd(args []string) (string, int, []string, error) {
	fs := flag.NewFlagSet("add", flag.ContinueOnError)
	fs.SetOutput(io.Discard)
	name := fs.String("name", "", "item name")
	qty := fs.Int("qty", 1, "quantity")
	if err := fs.Parse(args); err != nil {
		return "", 0, nil, err
	}
	return *name, *qty, fs.Args(), nil
}

func RunRemove(args []string) (string, bool, error) {
	fs := flag.NewFlagSet("remove", flag.ContinueOnError)
	fs.SetOutput(io.Discard)
	id := fs.String("id", "", "item id")
	force := fs.Bool("force", false, "skip confirmation")
	if err := fs.Parse(args); err != nil {
		return "", false, err
	}
	if *id == "" {
		return "", false, errors.New("id is required")
	}
	return *id, *force, nil
}

func main() {}
`,
  hints: [
    'flag.NewFlagSet("name", flag.ContinueOnError) gives you an isolated parser per subcommand.',
    'Call fs.SetOutput(io.Discard) to prevent flag errors from printing during tests.',
    'After fs.Parse(args), fs.Args() returns the non-flag positional arguments.',
  ],
}

export default exercise
