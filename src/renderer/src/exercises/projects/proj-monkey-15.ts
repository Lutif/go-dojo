import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-15',
  title: 'Evaluator — Integer & Boolean Values',
  category: 'Projects',
  subcategory: 'Monkey Interpreter',
  difficulty: 'advanced',
  order: 115,
  description: `Start the tree-walking evaluator by turning AST literal nodes into runtime *values*.

You'll build the **object system** — the runtime representation of Monkey values — and the first cases of the \`Eval\` function.

## Object system

\`\`\`go
type Object interface {
    Type() string
    Inspect() string
}
type Integer struct { Value int64 }
type Boolean struct { Value bool }
type Null    struct{}
\`\`\`

Constants \`"INTEGER"\`, \`"BOOLEAN"\`, \`"NULL"\` are returned by \`Type()\`.
\`Inspect()\` returns a human-readable string (\`"5"\`, \`"true"\`, \`"null"\`).

## Your task

1. Implement \`Type()\` and \`Inspect()\` on each object type.
2. Create two **singleton** booleans \`TRUE\` and \`FALSE\` plus singleton \`NULL_VAL\`.
3. Implement \`Eval(node Node) Object\`:
   - \`*IntegerLiteral\`  → \`&Integer{Value: n.Value}\`
   - \`*BooleanLiteral\`  → \`TRUE\` or \`FALSE\` (return the singleton, not a new struct)
   - \`*NullLiteral\`     → \`NULL_VAL\`

Tests construct AST nodes directly, so you don't need the lexer or parser for this step.`,
  code: `package main

import "fmt"

// ─── Minimal AST (provided) ──────────────────────────
type Node interface{ astNode() }
type IntegerLiteral struct{ Value int64 }
type BooleanLiteral struct{ Value bool }
type NullLiteral struct{}
func (*IntegerLiteral) astNode() {}
func (*BooleanLiteral) astNode() {}
func (*NullLiteral) astNode()    {}

// ─── Object system ───────────────────────────────────
const (
	INTEGER_OBJ = "INTEGER"
	BOOLEAN_OBJ = "BOOLEAN"
	NULL_OBJ    = "NULL"
)

type Object interface {
	Type() string
	Inspect() string
}

// TODO: Define Integer, Boolean, Null with Type() and Inspect() methods.
type Integer struct{ Value int64 }
type Boolean struct{ Value bool }
type Null struct{}

// TODO: Declare singletons TRUE, FALSE, NULL_VAL.

// ─── Evaluator ───────────────────────────────────────
func Eval(node Node) Object {
	// TODO: switch on node type and return the corresponding Object.
	_ = fmt.Sprintf
	return nil
}

func main() {}
`,
  testCode: `package main

import "testing"

func TestIntegerEval(t *testing.T) {
	obj := Eval(&IntegerLiteral{Value: 42})
	if obj == nil {
		t.Fatal("Eval returned nil for IntegerLiteral")
	}
	if obj.Type() != INTEGER_OBJ {
		t.Fatalf("Type() = %q, want %q", obj.Type(), INTEGER_OBJ)
	}
	i, ok := obj.(*Integer)
	if !ok {
		t.Fatalf("expected *Integer, got %T", obj)
	}
	if i.Value != 42 {
		t.Errorf("Value = %d, want 42", i.Value)
	}
	if i.Inspect() != "42" {
		t.Errorf("Inspect() = %q, want \\"42\\"", i.Inspect())
	}
}

func TestBooleanEval(t *testing.T) {
	tr := Eval(&BooleanLiteral{Value: true})
	fa := Eval(&BooleanLiteral{Value: false})
	if tr.Type() != BOOLEAN_OBJ || fa.Type() != BOOLEAN_OBJ {
		t.Fatalf("boolean Type mismatch: %q / %q", tr.Type(), fa.Type())
	}
	if tr.Inspect() != "true" {
		t.Errorf("true.Inspect() = %q", tr.Inspect())
	}
	if fa.Inspect() != "false" {
		t.Errorf("false.Inspect() = %q", fa.Inspect())
	}
}

func TestBooleanSingletons(t *testing.T) {
	a := Eval(&BooleanLiteral{Value: true})
	b := Eval(&BooleanLiteral{Value: true})
	if a != b {
		t.Error("true should be a singleton: Eval(true) must return the same pointer each call")
	}
	c := Eval(&BooleanLiteral{Value: false})
	d := Eval(&BooleanLiteral{Value: false})
	if c != d {
		t.Error("false should be a singleton")
	}
	if a == c {
		t.Error("TRUE and FALSE must not be the same pointer")
	}
}

func TestNullEval(t *testing.T) {
	obj := Eval(&NullLiteral{})
	if obj == nil {
		t.Fatal("Eval returned nil for NullLiteral")
	}
	if obj.Type() != NULL_OBJ {
		t.Errorf("Type() = %q, want %q", obj.Type(), NULL_OBJ)
	}
	if obj.Inspect() != "null" {
		t.Errorf("Inspect() = %q, want \\"null\\"", obj.Inspect())
	}
}
`,
  solution: `package main

import "fmt"

// ─── Minimal AST (provided) ──────────────────────────
type Node interface{ astNode() }
type IntegerLiteral struct{ Value int64 }
type BooleanLiteral struct{ Value bool }
type NullLiteral struct{}
func (*IntegerLiteral) astNode() {}
func (*BooleanLiteral) astNode() {}
func (*NullLiteral) astNode()    {}

// ─── Object system ───────────────────────────────────
const (
	INTEGER_OBJ = "INTEGER"
	BOOLEAN_OBJ = "BOOLEAN"
	NULL_OBJ    = "NULL"
)

type Object interface {
	Type() string
	Inspect() string
}

type Integer struct{ Value int64 }
func (i *Integer) Type() string    { return INTEGER_OBJ }
func (i *Integer) Inspect() string { return fmt.Sprintf("%d", i.Value) }

type Boolean struct{ Value bool }
func (b *Boolean) Type() string    { return BOOLEAN_OBJ }
func (b *Boolean) Inspect() string { return fmt.Sprintf("%t", b.Value) }

type Null struct{}
func (*Null) Type() string    { return NULL_OBJ }
func (*Null) Inspect() string { return "null" }

var (
	TRUE     = &Boolean{Value: true}
	FALSE    = &Boolean{Value: false}
	NULL_VAL = &Null{}
)

func nativeBool(b bool) *Boolean {
	if b {
		return TRUE
	}
	return FALSE
}

// ─── Evaluator ───────────────────────────────────────
func Eval(node Node) Object {
	switch n := node.(type) {
	case *IntegerLiteral:
		return &Integer{Value: n.Value}
	case *BooleanLiteral:
		return nativeBool(n.Value)
	case *NullLiteral:
		return NULL_VAL
	}
	return nil
}

func main() {}
`,
  hints: [
    'Use fmt.Sprintf("%d", i.Value) for Integer.Inspect and "%t" for Boolean.',
    'Declare package-level var (TRUE = &Boolean{Value:true}; FALSE = &Boolean{Value:false}) so all callers get the same pointer.',
    'In Eval, use a type switch: `switch n := node.(type) { case *IntegerLiteral: ... }`.',
  ],
  projectId: 'proj-monkey',
  step: 15,
  totalSteps: 22,
}

export default exercise
