import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-sub-05',
  title: 'Subcommands — Todo CLI Capstone',
  category: 'Projects',
  subcategory: 'Subcommands',
  difficulty: 'expert',
  order: 38,
  projectId: 'proj-sub',
  step: 5,
  totalSteps: 5,
  description: `This is the capstone for the subcommands project. You'll tie together argument parsing, flag handling, dispatch, and state management to build a complete **todo CLI**.

**Target UX:**

\`\`\`
todo add --title "buy milk"        -> "added #1: buy milk"
todo add --title "write post"      -> "added #2: write post"
todo list                          -> "#1 [ ] buy milk\\n#2 [ ] write post"
todo done --id 1                   -> "done #1"
todo list                          -> "#1 [x] buy milk\\n#2 [ ] write post"
todo delete --id 2                 -> "deleted #2"
todo list                          -> "#1 [x] buy milk"
todo list                          -> (empty store prints "no todos")
\`\`\`

**Requirements:**

Define a \`Todo\` struct with \`ID int\`, \`Title string\`, and \`Done bool\`.

Implement a \`Store\` type with these methods (IDs are assigned sequentially starting at 1; deleted IDs are **not** reused):

- \`Add(title string) Todo\`
- \`List() []Todo\` — returned slice must be sorted by ID ascending
- \`MarkDone(id int) error\` — error if id does not exist
- \`Delete(id int) error\` — error if id does not exist

Implement \`Run(store *Store, args []string) (string, error)\` that dispatches the first arg to the right subcommand:

- \`add --title "..."\` → adds; returns \`"added #N: <title>"\`. Error if \`--title\` is missing or empty.
- \`list\` → returns each todo on its own line: \`"#<id> [x] <title>"\` if done, \`"#<id> [ ] <title>"\` otherwise. If the store is empty return \`"no todos"\`.
- \`done --id N\` → marks that id done; returns \`"done #N"\`. Error if \`--id\` missing, not a number, or unknown.
- \`delete --id N\` → removes that id; returns \`"deleted #N"\`. Error if \`--id\` missing, not a number, or unknown.
- Any other first arg → error mentioning the unknown command.
- Empty args → error \`"no command given"\`.

You have freedom in how you structure helpers, but keep \`Run\` the single entry point tested.`,
  code: `package main

import "fmt"

// Todo is a single task.
type Todo struct {
	ID    int
	Title string
	Done  bool
}

// Store holds todos and assigns sequential IDs.
type Store struct {
	// TODO: choose a representation (map[int]Todo works well).
	// Track the next ID to hand out so deleted IDs are not reused.
}

// NewStore returns an empty Store.
func NewStore() *Store {
	// TODO
	return &Store{}
}

// Add creates a new todo with the next ID.
func (s *Store) Add(title string) Todo {
	// TODO
	return Todo{}
}

// List returns todos sorted by ID ascending.
func (s *Store) List() []Todo {
	// TODO
	return nil
}

// MarkDone sets Done=true on the todo with the given id.
func (s *Store) MarkDone(id int) error {
	// TODO
	return nil
}

// Delete removes the todo with the given id.
func (s *Store) Delete(id int) error {
	// TODO
	return nil
}

// Run dispatches args to the right subcommand.
// args[0] is the subcommand name; the rest are its flags.
func Run(store *Store, args []string) (string, error) {
	// TODO:
	// 1. Guard against empty args.
	// 2. Parse remaining args as --key value flags.
	// 3. Switch on args[0]: "add", "list", "done", "delete".
	// 4. Validate required flags before calling the store.
	_ = fmt.Sprintf
	return "", nil
}

func main() {}
`,
  testCode: `package main

import (
	"strings"
	"testing"
)

func TestAddAssignsSequentialIDs(t *testing.T) {
	s := NewStore()
	a := s.Add("one")
	b := s.Add("two")
	if a.ID != 1 || b.ID != 2 {
		t.Fatalf("expected ids 1,2 got %d,%d", a.ID, b.ID)
	}
}

func TestAddDoesNotReuseIDs(t *testing.T) {
	s := NewStore()
	s.Add("one")
	s.Add("two")
	if err := s.Delete(2); err != nil {
		t.Fatal(err)
	}
	c := s.Add("three")
	if c.ID != 3 {
		t.Errorf("expected id 3 after delete, got %d", c.ID)
	}
}

func TestListSorted(t *testing.T) {
	s := NewStore()
	s.Add("a")
	s.Add("b")
	s.Add("c")
	list := s.List()
	if len(list) != 3 {
		t.Fatalf("len=%d", len(list))
	}
	for i, todo := range list {
		if todo.ID != i+1 {
			t.Errorf("position %d: id=%d", i, todo.ID)
		}
	}
}

func TestMarkDoneUnknown(t *testing.T) {
	s := NewStore()
	if err := s.MarkDone(99); err == nil {
		t.Fatal("expected error for unknown id")
	}
}

func TestDeleteUnknown(t *testing.T) {
	s := NewStore()
	if err := s.Delete(99); err == nil {
		t.Fatal("expected error for unknown id")
	}
}

func TestRunNoArgs(t *testing.T) {
	_, err := Run(NewStore(), []string{})
	if err == nil {
		t.Fatal("expected error for empty args")
	}
}

func TestRunUnknownCommand(t *testing.T) {
	_, err := Run(NewStore(), []string{"frobnicate"})
	if err == nil {
		t.Fatal("expected error for unknown command")
	}
	if !strings.Contains(err.Error(), "frobnicate") {
		t.Errorf("error should mention the unknown command: %v", err)
	}
}

func TestRunAdd(t *testing.T) {
	s := NewStore()
	out, err := Run(s, []string{"add", "--title", "buy milk"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if out != "added #1: buy milk" {
		t.Errorf("got %q", out)
	}
}

func TestRunAddMissingTitle(t *testing.T) {
	_, err := Run(NewStore(), []string{"add"})
	if err == nil {
		t.Fatal("expected error for missing --title")
	}
}

func TestRunListEmpty(t *testing.T) {
	out, err := Run(NewStore(), []string{"list"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if out != "no todos" {
		t.Errorf("got %q", out)
	}
}

func TestRunListFormatting(t *testing.T) {
	s := NewStore()
	Run(s, []string{"add", "--title", "one"})
	Run(s, []string{"add", "--title", "two"})
	Run(s, []string{"done", "--id", "1"})
	out, err := Run(s, []string{"list"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	want := "#1 [x] one\n#2 [ ] two"
	if out != want {
		t.Errorf("got %q want %q", out, want)
	}
}

func TestRunDone(t *testing.T) {
	s := NewStore()
	Run(s, []string{"add", "--title", "x"})
	out, err := Run(s, []string{"done", "--id", "1"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if out != "done #1" {
		t.Errorf("got %q", out)
	}
}

func TestRunDoneBadID(t *testing.T) {
	_, err := Run(NewStore(), []string{"done", "--id", "abc"})
	if err == nil {
		t.Fatal("expected error for non-numeric id")
	}
}

func TestRunDoneUnknown(t *testing.T) {
	_, err := Run(NewStore(), []string{"done", "--id", "5"})
	if err == nil {
		t.Fatal("expected error for unknown id")
	}
}

func TestRunDelete(t *testing.T) {
	s := NewStore()
	Run(s, []string{"add", "--title", "x"})
	Run(s, []string{"add", "--title", "y"})
	out, err := Run(s, []string{"delete", "--id", "2"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if out != "deleted #2" {
		t.Errorf("got %q", out)
	}
	list, _ := Run(s, []string{"list"})
	if list != "#1 [ ] x" {
		t.Errorf("list after delete: %q", list)
	}
}

func TestRunFullWorkflow(t *testing.T) {
	s := NewStore()
	steps := [][]string{
		{"add", "--title", "buy milk"},
		{"add", "--title", "write post"},
		{"done", "--id", "1"},
		{"delete", "--id", "2"},
		{"add", "--title", "ship it"},
	}
	for _, step := range steps {
		if _, err := Run(s, step); err != nil {
			t.Fatalf("step %v: %v", step, err)
		}
	}
	out, _ := Run(s, []string{"list"})
	want := "#1 [x] buy milk\n#3 [ ] ship it"
	if out != want {
		t.Errorf("got %q want %q", out, want)
	}
}
`,
  solution: `package main

import (
	"fmt"
	"sort"
	"strconv"
)

// Todo is a single task.
type Todo struct {
	ID    int
	Title string
	Done  bool
}

// Store holds todos keyed by ID.
type Store struct {
	items  map[int]Todo
	nextID int
}

// NewStore returns an empty Store.
func NewStore() *Store {
	return &Store{items: make(map[int]Todo), nextID: 1}
}

// Add creates a new todo with the next ID.
func (s *Store) Add(title string) Todo {
	t := Todo{ID: s.nextID, Title: title}
	s.items[t.ID] = t
	s.nextID++
	return t
}

// List returns todos sorted by ID ascending.
func (s *Store) List() []Todo {
	out := make([]Todo, 0, len(s.items))
	for _, t := range s.items {
		out = append(out, t)
	}
	sort.Slice(out, func(i, j int) bool { return out[i].ID < out[j].ID })
	return out
}

// MarkDone sets Done=true on the todo with the given id.
func (s *Store) MarkDone(id int) error {
	t, ok := s.items[id]
	if !ok {
		return fmt.Errorf("no todo with id %d", id)
	}
	t.Done = true
	s.items[id] = t
	return nil
}

// Delete removes the todo with the given id.
func (s *Store) Delete(id int) error {
	if _, ok := s.items[id]; !ok {
		return fmt.Errorf("no todo with id %d", id)
	}
	delete(s.items, id)
	return nil
}

func parseFlags(args []string) map[string]string {
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

// Run dispatches args to the right subcommand.
func Run(store *Store, args []string) (string, error) {
	if len(args) == 0 {
		return "", fmt.Errorf("no command given")
	}
	cmd := args[0]
	flags := parseFlags(args[1:])

	switch cmd {
	case "add":
		title, ok := flags["title"]
		if !ok || title == "" {
			return "", fmt.Errorf("add: --title is required")
		}
		t := store.Add(title)
		return fmt.Sprintf("added #%d: %s", t.ID, t.Title), nil

	case "list":
		items := store.List()
		if len(items) == 0 {
			return "no todos", nil
		}
		lines := make([]string, 0, len(items))
		for _, t := range items {
			mark := " "
			if t.Done {
				mark = "x"
			}
			lines = append(lines, fmt.Sprintf("#%d [%s] %s", t.ID, mark, t.Title))
		}
		result := lines[0]
		for _, l := range lines[1:] {
			result += "\n" + l
		}
		return result, nil

	case "done":
		raw, ok := flags["id"]
		if !ok {
			return "", fmt.Errorf("done: --id is required")
		}
		id, err := strconv.Atoi(raw)
		if err != nil {
			return "", fmt.Errorf("done: --id must be a number: %w", err)
		}
		if err := store.MarkDone(id); err != nil {
			return "", err
		}
		return fmt.Sprintf("done #%d", id), nil

	case "delete":
		raw, ok := flags["id"]
		if !ok {
			return "", fmt.Errorf("delete: --id is required")
		}
		id, err := strconv.Atoi(raw)
		if err != nil {
			return "", fmt.Errorf("delete: --id must be a number: %w", err)
		}
		if err := store.Delete(id); err != nil {
			return "", err
		}
		return fmt.Sprintf("deleted #%d", id), nil

	default:
		return "", fmt.Errorf("unknown command: %s", cmd)
	}
}

func main() {}
`,
  hints: [
    'Keep a nextID counter separate from len(items) so deletes do not reuse IDs',
    'Parse flags once at the top of Run, then each case pulls what it needs',
    'For list output, build the lines and join with "\\n" — no trailing newline',
  ],
}

export default exercise
