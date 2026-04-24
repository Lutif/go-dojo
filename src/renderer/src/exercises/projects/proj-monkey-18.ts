import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-18',
  title: 'Evaluator — Infix Comparison',
  category: 'Projects',
  subcategory: 'Monkey Interpreter',
  difficulty: 'advanced',
  order: 118,
  description: `Add comparison operators to the infix evaluator.

## Operators

| op   | integers          | booleans (or mixed object types) |
|------|-------------------|-----------------------------------|
| \`<\` | int < int → Bool  | error (unknown operator)         |
| \`>\` | int > int → Bool  | error                            |
| \`==\`| int == int → Bool | **pointer equality** → Bool       |
| \`!=\`| int != int → Bool | **pointer equality** → Bool       |

Because \`TRUE\` and \`FALSE\` are singletons, \`left == right\` (Go pointer compare) works for boolean equality:
\`true == true\` → both sides resolve to the \`TRUE\` singleton, \`left == right\` is \`true\`.

Return \`"type mismatch: <L> <op> <R>"\` when the sides differ in type AND the op isn't \`==\`/\`!=\`.
Return \`"unknown operator: <L> <op> <R>"\` when same non-INTEGER type sees an unsupported op (e.g. \`true < false\`).

## Your task

Extend \`evalInfix\` and \`evalIntegerInfix\` from step 17 to handle \`<\`, \`>\`, \`==\`, \`!=\`. The test file exercises all four operators on integers and booleans.`,
  code: `package main

import "fmt"

// ─── AST ─────────────────────────────────────────────
type Node interface{ astNode() }
type IntegerLiteral struct{ Value int64 }
type BooleanLiteral struct{ Value bool }
type InfixExpression struct {
	Left     Node
	Operator string
	Right    Node
}
func (*IntegerLiteral) astNode()  {}
func (*BooleanLiteral) astNode()  {}
func (*InfixExpression) astNode() {}

// ─── Object system ───────────────────────────────────
const (
	INTEGER_OBJ = "INTEGER"
	BOOLEAN_OBJ = "BOOLEAN"
	ERROR_OBJ   = "ERROR"
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
type Error struct{ Message string }
func (e *Error) Type() string    { return ERROR_OBJ }
func (e *Error) Inspect() string { return "ERROR: " + e.Message }

var (
	TRUE  = &Boolean{Value: true}
	FALSE = &Boolean{Value: false}
)

func nativeBool(b bool) *Boolean {
	if b {
		return TRUE
	}
	return FALSE
}
func newError(format string, a ...interface{}) *Error {
	return &Error{Message: fmt.Sprintf(format, a...)}
}
func isError(o Object) bool { return o != nil && o.Type() == ERROR_OBJ }

// TODO: Extend evalIntegerInfix with cases for "<", ">", "==", "!=" that
// return nativeBool(...).
func evalIntegerInfix(op string, left, right Object) Object {
	l := left.(*Integer).Value
	r := right.(*Integer).Value
	switch op {
	case "+":
		return &Integer{Value: l + r}
	case "-":
		return &Integer{Value: l - r}
	case "*":
		return &Integer{Value: l * r}
	case "/":
		return &Integer{Value: l / r}
	}
	return newError("unknown operator: %s %s %s", left.Type(), op, right.Type())
}

// TODO: Extend evalInfix to handle "==" and "!=" for non-integer pairs
// via pointer equality (return nativeBool(left == right) / (left != right)).
func evalInfix(op string, left, right Object) Object {
	if left.Type() == INTEGER_OBJ && right.Type() == INTEGER_OBJ {
		return evalIntegerInfix(op, left, right)
	}
	if left.Type() != right.Type() {
		return newError("type mismatch: %s %s %s", left.Type(), op, right.Type())
	}
	return newError("unknown operator: %s %s %s", left.Type(), op, right.Type())
}

// ─── Evaluator ───────────────────────────────────────
func Eval(node Node) Object {
	switch n := node.(type) {
	case *IntegerLiteral:
		return &Integer{Value: n.Value}
	case *BooleanLiteral:
		return nativeBool(n.Value)
	case *InfixExpression:
		l := Eval(n.Left)
		if isError(l) {
			return l
		}
		r := Eval(n.Right)
		if isError(r) {
			return r
		}
		return evalInfix(n.Operator, l, r)
	}
	return nil
}

func main() {}
`,
  testCode: `package main

import "testing"

func intLit(v int64) *IntegerLiteral { return &IntegerLiteral{Value: v} }
func boolLit(b bool) *BooleanLiteral { return &BooleanLiteral{Value: b} }
func infix(l Node, op string, r Node) *InfixExpression {
	return &InfixExpression{Left: l, Operator: op, Right: r}
}

func TestIntegerComparison(t *testing.T) {
	cases := []struct {
		in   Node
		want bool
	}{
		{infix(intLit(1), "<", intLit(2)), true},
		{infix(intLit(1), ">", intLit(2)), false},
		{infix(intLit(1), "<", intLit(1)), false},
		{infix(intLit(1), ">", intLit(1)), false},
		{infix(intLit(1), "==", intLit(1)), true},
		{infix(intLit(1), "!=", intLit(1)), false},
		{infix(intLit(1), "==", intLit(2)), false},
		{infix(intLit(1), "!=", intLit(2)), true},
	}
	for _, c := range cases {
		got := Eval(c.in)
		b, ok := got.(*Boolean)
		if !ok {
			t.Fatalf("expected *Boolean, got %T (%v)", got, got)
		}
		if b.Value != c.want {
			t.Errorf("got %v, want %v", b.Value, c.want)
		}
	}
}

func TestBooleanEquality(t *testing.T) {
	cases := []struct {
		in   Node
		want bool
	}{
		{infix(boolLit(true), "==", boolLit(true)), true},
		{infix(boolLit(false), "==", boolLit(false)), true},
		{infix(boolLit(true), "==", boolLit(false)), false},
		{infix(boolLit(true), "!=", boolLit(false)), true},
		{infix(boolLit(true), "!=", boolLit(true)), false},
	}
	for _, c := range cases {
		got := Eval(c.in)
		b, ok := got.(*Boolean)
		if !ok {
			t.Fatalf("expected *Boolean, got %T (%v)", got, got)
		}
		if b.Value != c.want {
			t.Errorf("got %v, want %v", b.Value, c.want)
		}
	}
}

func TestMixedEquality(t *testing.T) {
	// (1 < 2) == true should be true
	left := infix(intLit(1), "<", intLit(2))
	got := Eval(infix(left, "==", boolLit(true)))
	b, ok := got.(*Boolean)
	if !ok {
		t.Fatalf("expected *Boolean, got %T (%v)", got, got)
	}
	if !b.Value {
		t.Error("(1 < 2) == true should be true")
	}
}

func TestBooleanLessThanIsError(t *testing.T) {
	got := Eval(infix(boolLit(true), "<", boolLit(false)))
	e, ok := got.(*Error)
	if !ok {
		t.Fatalf("expected *Error, got %T (%v)", got, got)
	}
	want := "unknown operator: BOOLEAN < BOOLEAN"
	if e.Message != want {
		t.Errorf("Message = %q, want %q", e.Message, want)
	}
}

func TestTypeMismatchLessThan(t *testing.T) {
	got := Eval(infix(intLit(1), "<", boolLit(true)))
	e, ok := got.(*Error)
	if !ok {
		t.Fatalf("expected *Error, got %T (%v)", got, got)
	}
	want := "type mismatch: INTEGER < BOOLEAN"
	if e.Message != want {
		t.Errorf("Message = %q, want %q", e.Message, want)
	}
}
`,
  solution: `package main

import "fmt"

type Node interface{ astNode() }
type IntegerLiteral struct{ Value int64 }
type BooleanLiteral struct{ Value bool }
type InfixExpression struct {
	Left     Node
	Operator string
	Right    Node
}
func (*IntegerLiteral) astNode()  {}
func (*BooleanLiteral) astNode()  {}
func (*InfixExpression) astNode() {}

const (
	INTEGER_OBJ = "INTEGER"
	BOOLEAN_OBJ = "BOOLEAN"
	ERROR_OBJ   = "ERROR"
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
type Error struct{ Message string }
func (e *Error) Type() string    { return ERROR_OBJ }
func (e *Error) Inspect() string { return "ERROR: " + e.Message }

var (
	TRUE  = &Boolean{Value: true}
	FALSE = &Boolean{Value: false}
)

func nativeBool(b bool) *Boolean {
	if b {
		return TRUE
	}
	return FALSE
}
func newError(format string, a ...interface{}) *Error {
	return &Error{Message: fmt.Sprintf(format, a...)}
}
func isError(o Object) bool { return o != nil && o.Type() == ERROR_OBJ }

func evalIntegerInfix(op string, left, right Object) Object {
	l := left.(*Integer).Value
	r := right.(*Integer).Value
	switch op {
	case "+":
		return &Integer{Value: l + r}
	case "-":
		return &Integer{Value: l - r}
	case "*":
		return &Integer{Value: l * r}
	case "/":
		return &Integer{Value: l / r}
	case "<":
		return nativeBool(l < r)
	case ">":
		return nativeBool(l > r)
	case "==":
		return nativeBool(l == r)
	case "!=":
		return nativeBool(l != r)
	}
	return newError("unknown operator: %s %s %s", left.Type(), op, right.Type())
}

func evalInfix(op string, left, right Object) Object {
	if left.Type() == INTEGER_OBJ && right.Type() == INTEGER_OBJ {
		return evalIntegerInfix(op, left, right)
	}
	if op == "==" {
		return nativeBool(left == right)
	}
	if op == "!=" {
		return nativeBool(left != right)
	}
	if left.Type() != right.Type() {
		return newError("type mismatch: %s %s %s", left.Type(), op, right.Type())
	}
	return newError("unknown operator: %s %s %s", left.Type(), op, right.Type())
}

func Eval(node Node) Object {
	switch n := node.(type) {
	case *IntegerLiteral:
		return &Integer{Value: n.Value}
	case *BooleanLiteral:
		return nativeBool(n.Value)
	case *InfixExpression:
		l := Eval(n.Left)
		if isError(l) {
			return l
		}
		r := Eval(n.Right)
		if isError(r) {
			return r
		}
		return evalInfix(n.Operator, l, r)
	}
	return nil
}

func main() {}
`,
  hints: [
    'In evalIntegerInfix, add four cases that return nativeBool(l < r), nativeBool(l > r), and the two equality variants.',
    'Handle == and != for non-integer operands *before* the type-mismatch check so that boolean equality works via pointer compare: nativeBool(left == right).',
    'Because TRUE and FALSE are singletons, Go pointer equality (left == right) gives the correct boolean equality result.',
  ],
  projectId: 'proj-monkey',
  step: 18,
  totalSteps: 22,
}

export default exercise
