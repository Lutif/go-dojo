import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_22_command',
  title: 'Command Pattern',
  category: 'Patterns',
  subcategory: 'Design Patterns',
  difficulty: 'advanced',
  order: 22,
  description: `Implement the Command pattern with Execute/Undo support and command history.

The Command pattern encapsulates actions as objects, enabling undo/redo, queuing, and logging of operations.

Your tasks:

1. Define a \`Command\` interface with:
   - \`Execute() string\` - performs the action, returns description of what was done
   - \`Undo() string\` - reverses the action, returns description of what was undone

2. Create an \`AddItemCommand\` struct that adds an item to a slice:
   - Fields: \`items *[]string\`, \`item string\`
   - \`Execute()\`: appends item to the slice, returns "added: ITEM"
   - \`Undo()\`: removes last item from slice, returns "removed: ITEM"

3. Create a \`DeleteItemCommand\` struct that removes the last item from a slice:
   - Fields: \`items *[]string\`, \`deleted string\` (to remember what was deleted)
   - \`Execute()\`: removes and stores the last item, returns "deleted: ITEM" (or "nothing to delete" if empty)
   - \`Undo()\`: re-adds the deleted item, returns "restored: ITEM" (or "nothing to restore" if deleted is empty)

4. Define a \`History\` struct that tracks executed commands:
   - \`commands []Command\` - stack of executed commands

5. Implement \`NewHistory() *History\`.

6. Implement \`(h *History) Execute(cmd Command) string\`:
   - Calls cmd.Execute() and pushes cmd onto the stack
   - Returns the Execute result

7. Implement \`(h *History) Undo() string\`:
   - Pops the last command and calls Undo()
   - Returns the Undo result, or "nothing to undo" if stack is empty

8. Implement \`(h *History) Len() int\` returning the number of commands in history.`,
  code: `package main

// TODO: Define Command interface with Execute() string and Undo() string

// TODO: Define AddItemCommand struct with items *[]string and item string

// TODO: Implement Execute() and Undo() for AddItemCommand
// Execute: append item, return "added: ITEM"
// Undo: remove last item, return "removed: ITEM"

// TODO: Define DeleteItemCommand struct with items *[]string and deleted string

// TODO: Implement Execute() and Undo() for DeleteItemCommand
// Execute: remove last item, return "deleted: ITEM" or "nothing to delete"
// Undo: re-add deleted item, return "restored: ITEM" or "nothing to restore"

// TODO: Define History struct with commands []Command

// TODO: Implement NewHistory() *History

// TODO: Implement (h *History) Execute(cmd Command) string

// TODO: Implement (h *History) Undo() string
// Pop last command, call Undo(), or return "nothing to undo"

// TODO: Implement (h *History) Len() int

func main() {}`,
  testCode: `package main

import (
	"testing"
)

func TestAddItemCommand(t *testing.T) {
	items := &[]string{}
	cmd := &AddItemCommand{items: items, item: "apple"}

	result := cmd.Execute()
	if result != "added: apple" {
		t.Errorf("expected 'added: apple', got %q", result)
	}
	if len(*items) != 1 || (*items)[0] != "apple" {
		t.Errorf("expected [apple], got %v", *items)
	}

	result = cmd.Undo()
	if result != "removed: apple" {
		t.Errorf("expected 'removed: apple', got %q", result)
	}
	if len(*items) != 0 {
		t.Errorf("expected empty slice, got %v", *items)
	}
}

func TestDeleteItemCommand(t *testing.T) {
	items := &[]string{"apple", "banana"}
	cmd := &DeleteItemCommand{items: items}

	result := cmd.Execute()
	if result != "deleted: banana" {
		t.Errorf("expected 'deleted: banana', got %q", result)
	}
	if len(*items) != 1 {
		t.Errorf("expected 1 item, got %d", len(*items))
	}

	result = cmd.Undo()
	if result != "restored: banana" {
		t.Errorf("expected 'restored: banana', got %q", result)
	}
	if len(*items) != 2 || (*items)[1] != "banana" {
		t.Errorf("expected [apple banana], got %v", *items)
	}
}

func TestDeleteEmptySlice(t *testing.T) {
	items := &[]string{}
	cmd := &DeleteItemCommand{items: items}

	result := cmd.Execute()
	if result != "nothing to delete" {
		t.Errorf("expected 'nothing to delete', got %q", result)
	}
}

func TestDeleteUndoWithoutExecute(t *testing.T) {
	items := &[]string{}
	cmd := &DeleteItemCommand{items: items}

	result := cmd.Undo()
	if result != "nothing to restore" {
		t.Errorf("expected 'nothing to restore', got %q", result)
	}
}

func TestHistory(t *testing.T) {
	items := &[]string{}
	h := NewHistory()

	h.Execute(&AddItemCommand{items: items, item: "a"})
	h.Execute(&AddItemCommand{items: items, item: "b"})
	h.Execute(&AddItemCommand{items: items, item: "c"})

	if h.Len() != 3 {
		t.Errorf("expected history length 3, got %d", h.Len())
	}
	if len(*items) != 3 {
		t.Errorf("expected 3 items, got %d", len(*items))
	}

	result := h.Undo()
	if result != "removed: c" {
		t.Errorf("expected 'removed: c', got %q", result)
	}
	if h.Len() != 2 {
		t.Errorf("expected history length 2, got %d", h.Len())
	}
	if len(*items) != 2 {
		t.Errorf("expected 2 items, got %d", len(*items))
	}
}

func TestHistoryUndoEmpty(t *testing.T) {
	h := NewHistory()
	result := h.Undo()
	if result != "nothing to undo" {
		t.Errorf("expected 'nothing to undo', got %q", result)
	}
}

func TestHistoryMixedCommands(t *testing.T) {
	items := &[]string{"x", "y"}
	h := NewHistory()

	h.Execute(&AddItemCommand{items: items, item: "z"})
	h.Execute(&DeleteItemCommand{items: items})

	if len(*items) != 2 {
		t.Errorf("expected 2 items after add+delete, got %v", *items)
	}

	h.Undo() // undo delete -> restore z
	if len(*items) != 3 {
		t.Errorf("expected 3 items after undo delete, got %v", *items)
	}

	h.Undo() // undo add -> remove z
	if len(*items) != 2 {
		t.Errorf("expected 2 items after undo add, got %v", *items)
	}
}

func TestHistoryExecuteReturnsResult(t *testing.T) {
	items := &[]string{}
	h := NewHistory()

	result := h.Execute(&AddItemCommand{items: items, item: "test"})
	if result != "added: test" {
		t.Errorf("expected 'added: test', got %q", result)
	}
}`,
  solution: `package main

type Command interface {
	Execute() string
	Undo() string
}

type AddItemCommand struct {
	items *[]string
	item  string
}

func (c *AddItemCommand) Execute() string {
	*c.items = append(*c.items, c.item)
	return "added: " + c.item
}

func (c *AddItemCommand) Undo() string {
	if len(*c.items) > 0 {
		*c.items = (*c.items)[:len(*c.items)-1]
	}
	return "removed: " + c.item
}

type DeleteItemCommand struct {
	items   *[]string
	deleted string
}

func (c *DeleteItemCommand) Execute() string {
	if len(*c.items) == 0 {
		return "nothing to delete"
	}
	c.deleted = (*c.items)[len(*c.items)-1]
	*c.items = (*c.items)[:len(*c.items)-1]
	return "deleted: " + c.deleted
}

func (c *DeleteItemCommand) Undo() string {
	if c.deleted == "" {
		return "nothing to restore"
	}
	*c.items = append(*c.items, c.deleted)
	return "restored: " + c.deleted
}

type History struct {
	commands []Command
}

func NewHistory() *History {
	return &History{}
}

func (h *History) Execute(cmd Command) string {
	result := cmd.Execute()
	h.commands = append(h.commands, cmd)
	return result
}

func (h *History) Undo() string {
	if len(h.commands) == 0 {
		return "nothing to undo"
	}
	cmd := h.commands[len(h.commands)-1]
	h.commands = h.commands[:len(h.commands)-1]
	return cmd.Undo()
}

func (h *History) Len() int {
	return len(h.commands)
}

func main() {}`,
  hints: [
    'Use *[]string (pointer to slice) for items so that commands can modify the same underlying slice.',
    'DeleteItemCommand should store the deleted item in its "deleted" field during Execute, so Undo can restore it.',
    'History uses a slice as a stack: append to push, slice [:len-1] to pop.',
    'History.Undo pops the last command and calls its Undo method. Return "nothing to undo" for empty history.',
  ],
}

export default exercise
