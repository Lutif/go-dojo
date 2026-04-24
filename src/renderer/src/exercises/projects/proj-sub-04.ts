import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-sub-04',
  title: 'Subcommands — Nested Commands',
  category: 'Projects',
  subcategory: 'Subcommands',
  difficulty: 'advanced',
  order: 37,
  projectId: 'proj-sub',
  step: 4,
  totalSteps: 5,
  description: `Real CLIs like \`git\`, \`kubectl\`, and \`docker\` support **nested** subcommands — a tree of commands where each node can have its own handler or further children. For example:

\`\`\`
app user create --name alice
app user delete --id 42
app repo add --url https://example.com
\`\`\`

In this step you'll build a tiny command tree that can dispatch \`app <group> <action> [--flag value ...]\` to the right handler.

**Requirements:**

Define a \`Command\` struct:

\`\`\`go
type Command struct {
    Name     string
    Children map[string]*Command
    Run      func(flags map[string]string) (string, error)
}
\`\`\`

Implement two functions:

- \`ParseFlags(args []string) map[string]string\` — parse \`--key value\` pairs from the remaining args into a map. Ignore tokens that don't start with \`--\`.
- \`Dispatch(root *Command, args []string) (string, error)\` — walk the tree following \`args[0]\`, \`args[1]\`, ... until you reach a command with a non-nil \`Run\`. Pass the remaining args (parsed as flags) to \`Run\`. Return an error if the path is unknown or the final command has no handler.

Errors should mention the offending token (for example \`"unknown command: user"\`).`,
  code: `package main

import "fmt"

// Command is a node in the command tree.
type Command struct {
	Name     string
	Children map[string]*Command
	Run      func(flags map[string]string) (string, error)
}

// ParseFlags turns --key value pairs into a map.
func ParseFlags(args []string) map[string]string {
	// TODO:
	// 1. Walk args with an index so you can consume two tokens at a time.
	// 2. When you see a token that starts with "--", the next token is its value.
	// 3. Skip anything else.
	_ = fmt.Sprintf
	return nil
}

// Dispatch walks the command tree and runs the matching handler.
func Dispatch(root *Command, args []string) (string, error) {
	// TODO:
	// 1. Starting from root, consume args while the next token matches a child name.
	// 2. Once the token isn't a child (or args is empty), the remaining args are flags.
	// 3. If the current node has no Run, return an error.
	// 4. Call Run with ParseFlags(remaining).
	return "", nil
}

func main() {}
`,
  testCode: `package main

import (
	"strings"
	"testing"
)

func buildRoot() *Command {
	return &Command{
		Name: "app",
		Children: map[string]*Command{
			"user": {
				Name: "user",
				Children: map[string]*Command{
					"create": {
						Name: "create",
						Run: func(flags map[string]string) (string, error) {
							return "created " + flags["name"], nil
						},
					},
					"delete": {
						Name: "delete",
						Run: func(flags map[string]string) (string, error) {
							return "deleted " + flags["id"], nil
						},
					},
				},
			},
			"repo": {
				Name: "repo",
				Children: map[string]*Command{
					"add": {
						Name: "add",
						Run: func(flags map[string]string) (string, error) {
							return "added " + flags["url"], nil
						},
					},
				},
			},
		},
	}
}

func TestParseFlagsBasic(t *testing.T) {
	got := ParseFlags([]string{"--name", "alice", "--age", "30"})
	if got["name"] != "alice" {
		t.Errorf("name: got %q", got["name"])
	}
	if got["age"] != "30" {
		t.Errorf("age: got %q", got["age"])
	}
}

func TestParseFlagsEmpty(t *testing.T) {
	got := ParseFlags([]string{})
	if len(got) != 0 {
		t.Errorf("expected empty map, got %v", got)
	}
}

func TestParseFlagsIgnoresNonFlags(t *testing.T) {
	got := ParseFlags([]string{"stray", "--name", "bob", "junk"})
	if got["name"] != "bob" {
		t.Errorf("name: got %q", got["name"])
	}
	if _, ok := got["stray"]; ok {
		t.Errorf("should not contain 'stray'")
	}
}

func TestDispatchNested(t *testing.T) {
	out, err := Dispatch(buildRoot(), []string{"user", "create", "--name", "alice"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if out != "created alice" {
		t.Errorf("got %q", out)
	}
}

func TestDispatchOtherBranch(t *testing.T) {
	out, err := Dispatch(buildRoot(), []string{"repo", "add", "--url", "https://x.io"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if out != "added https://x.io" {
		t.Errorf("got %q", out)
	}
}

func TestDispatchUnknownChild(t *testing.T) {
	_, err := Dispatch(buildRoot(), []string{"nope", "create"})
	if err == nil {
		t.Fatal("expected error for unknown command")
	}
	if !strings.Contains(err.Error(), "nope") {
		t.Errorf("error should mention token: %v", err)
	}
}

func TestDispatchNoHandler(t *testing.T) {
	// "user" is a group with no Run of its own.
	_, err := Dispatch(buildRoot(), []string{"user"})
	if err == nil {
		t.Fatal("expected error for command with no handler")
	}
}

func TestDispatchMultipleFlags(t *testing.T) {
	out, err := Dispatch(buildRoot(), []string{"user", "delete", "--id", "42"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if out != "deleted 42" {
		t.Errorf("got %q", out)
	}
}
`,
  solution: `package main

import "fmt"

// Command is a node in the command tree.
type Command struct {
	Name     string
	Children map[string]*Command
	Run      func(flags map[string]string) (string, error)
}

// ParseFlags turns --key value pairs into a map.
func ParseFlags(args []string) map[string]string {
	out := make(map[string]string)
	for i := 0; i < len(args); i++ {
		tok := args[i]
		if len(tok) > 2 && tok[:2] == "--" {
			key := tok[2:]
			if i+1 < len(args) {
				out[key] = args[i+1]
				i++
			} else {
				out[key] = ""
			}
		}
	}
	return out
}

// Dispatch walks the command tree and runs the matching handler.
func Dispatch(root *Command, args []string) (string, error) {
	node := root
	i := 0
	for i < len(args) {
		tok := args[i]
		if len(tok) >= 2 && tok[:2] == "--" {
			break
		}
		child, ok := node.Children[tok]
		if !ok {
			return "", fmt.Errorf("unknown command: %s", tok)
		}
		node = child
		i++
	}
	if node.Run == nil {
		return "", fmt.Errorf("command %q has no handler", node.Name)
	}
	return node.Run(ParseFlags(args[i:]))
}

func main() {}
`,
  hints: [
    'Advance two tokens at a time when a token starts with "--"',
    'Stop descending as soon as the next arg is not a known child',
    'Groups like "user" without a Run should produce a clear error',
  ],
}

export default exercise
