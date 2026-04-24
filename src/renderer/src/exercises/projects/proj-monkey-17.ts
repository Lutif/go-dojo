import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-17',
  title: 'Evaluator — Infix Arithmetic',
  category: 'Projects',
  subcategory: 'Monkey Interpreter',
  difficulty: 'advanced',
  order: 117,
  description: `Add integer arithmetic to the evaluator.

## Operators

Support \`+\`, \`-\`, \`*\`, \`/\` — both operands must be \`*Integer\`. The result is a new \`*Integer\`.

If either operand is not an integer, return an \`Error\`:

| condition                            | message                                          |
|--------------------------------------|--------------------------------------------------|
| left and right types differ          | \`"type mismatch: <L> <op> <R>"\`                |
| both same non-INTEGER type           | \`"unknown operator: <L> <op> <R>"\`             |

(Integer division uses Go's \`/\` operator; no need to handle divide-by-zero specially.)

## Your task

1. Add a \`*InfixExpression\` case to \`Eval\`. Evaluate \`Left\`, then \`Right\`, propagating any \`Error\`.
2. Implement \`evalInfix(op string, left, right Object) Object\` that dispatches to \`evalIntegerInfix\` when both operands are integers.
3. Implement \`evalIntegerInfix\` with cases for \`+\`, \`-\`, \`*\`, \`/\`. Return an \`Error\` for an unknown operator.

Tests construct AST nodes directly — no lexer/parser needed.`,
  code: `package main

import "fmt"

// ─── AST ─────────────────────────────────────────────
type Node interface{ astNode() }
type IntegerLiteral struct{ Value int64 }
type BooleanLiteral struct{ Value bool }
type PrefixExpression struct {
	Operator string
	Right    Node
}
type InfixExpression struct {
	Left     Node
	Operator string
	Right    Node
}
func (*IntegerLiteral) astNode()   {}
func (*BooleanLiteral) astNode()   {}
func (*PrefixExpression) astNode() {}
func (*InfixExpression) astNode()  {}

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

// Prefix (from step 16) ──────────────────────────────
func evalMinus(right Object) Object {
	if right.Type() != INTEGER_OBJ {
		return newError("unknown operator: -%s", right.Type())
	}
	return &Integer{Value: -right.(*Integer).Value}
}
func evalBang(right Object) Object {
	switch right {
	case TRUE:
		return FALSE
	case FALSE:
		return TRUE
	default:
		return FALSE
	}
}
func evalPrefix(op string, right Object) Object {
	switch op {
	case "!":
		return evalBang(right)
	case "-":
		return evalMinus(right)
	}
	return newError("unknown operator: %s%s", op, right.Type())
}

// TODO: Implement evalIntegerInfix(op string, left, right Object) Object
// TODO: Implement evalInfix(op string, left, right Object) Object

// ─── Evaluator ───────────────────────────────────────
func Eval(node Node) Object {
	switch n := node.(type) {
	case *IntegerLiteral:
		return &Integer{Value: n.Value}
	case *BooleanLiteral:
		return nativeBool(n.Value)
	case *PrefixExpression:
		r := Eval(n.Right)
		if isError(r) {
			return r
		}
		return evalPrefix(n.Operator, r)
	// TODO: handle *InfixExpression — evaluate Left, then Right, propagate errors, dispatch to evalInfix.
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

func TestBasicArithmetic(t *testing.T) {
	cases := []struct {
		in   Node
		want int64
	}{
		{infix(intLit(5), "+", intLit(5)), 10},
		{infix(intLit(5), "-", intLit(5)), 0},
		{infix(intLit(5), "*", intLit(5)), 25},
		{infix(intLit(10), "/", intLit(2)), 5},
	}
	for _, c := range cases {
		got := Eval(c.in)
		i, ok := got.(*Integer)
		if !ok {
			t.Fatalf("expected *Integer, got %T (%v)", got, got)
		}
		if i.Value != c.want {
			t.Errorf("got %d, want %d", i.Value, c.want)
		}
	}
}

func TestNestedArithmetic(t *testing.T) {
	// (2 + 3) * 4 = 20
	expr := infix(infix(intLit(2), "+", intLit(3)), "*", intLit(4))
	got := Eval(expr)
	i, ok := got.(*Integer)
	if !ok {
		t.Fatalf("expected *Integer, got %T", got)
	}
	if i.Value != 20 {
		t.Errorf("got %d, want 20", i.Value)
	}
}

func TestArithmeticWithNegation(t *testing.T) {
	// -5 + 10 = 5
	neg5 := &PrefixExpression{Operator: "-", Right: intLit(5)}
	got := Eval(infix(neg5, "+", intLit(10)))
	i, ok := got.(*Integer)
	if !ok {
		t.Fatalf("expected *Integer, got %T", got)
	}
	if i.Value != 5 {
		t.Errorf("got %d, want 5", i.Value)
	}
}

func TestTypeMismatch(t *testing.T) {
	got := Eval(infix(intLit(5), "+", boolLit(true)))
	e, ok := got.(*Error)
	if !ok {
		t.Fatalf("expected *Error, got %T (%v)", got, got)
	}
	want := "type mismatch: INTEGER + BOOLEAN"
	if e.Message != want {
		t.Errorf("Message = %q, want %q", e.Message, want)
	}
}

func TestUnknownBoolOperator(t *testing.T) {
	got := Eval(infix(boolLit(true), "+", boolLit(false)))
	e, ok := got.(*Error)
	if !ok {
		t.Fatalf("expected *Error, got %T (%v)", got, got)
	}
	want := "unknown operator: BOOLEAN + BOOLEAN"
	if e.Message != want {
		t.Errorf("Message = %q, want %q", e.Message, want)
	}
}

func TestLeftErrorPropagates(t *testing.T) {
	// (-true) + 5 → left produces Error, should propagate.
	bad := &PrefixExpression{Operator: "-", Right: boolLit(true)}
	got := Eval(infix(bad, "+", intLit(5)))
	if _, ok := got.(*Error); !ok {
		t.Fatalf("expected *Error, got %T", got)
	}
}
`,
  solution: `package main

import "fmt"

type Node interface{ astNode() }
type IntegerLiteral struct{ Value int64 }
type BooleanLiteral struct{ Value bool }
type PrefixExpression struct {
	Operator string
	Right    Node
}
type InfixExpression struct {
	Left     Node
	Operator string
	Right    Node
}
func (*IntegerLiteral) astNode()   {}
func (*BooleanLiteral) astNode()   {}
func (*PrefixExpression) astNode() {}
func (*InfixExpression) astNode()  {}

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

func evalMinus(right Object) Object {
	if right.Type() != INTEGER_OBJ {
		return newError("unknown operator: -%s", right.Type())
	}
	return &Integer{Value: -right.(*Integer).Value}
}
func evalBang(right Object) Object {
	switch right {
	case TRUE:
		return FALSE
	case FALSE:
		return TRUE
	default:
		return FALSE
	}
}
func evalPrefix(op string, right Object) Object {
	switch op {
	case "!":
		return evalBang(right)
	case "-":
		return evalMinus(right)
	}
	return newError("unknown operator: %s%s", op, right.Type())
}

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

func evalInfix(op string, left, right Object) Object {
	if left.Type() == INTEGER_OBJ && right.Type() == INTEGER_OBJ {
		return evalIntegerInfix(op, left, right)
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
	case *PrefixExpression:
		r := Eval(n.Right)
		if isError(r) {
			return r
		}
		return evalPrefix(n.Operator, r)
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
    'In Eval, evaluate Left first and return immediately if it is an Error; then evaluate Right with the same check.',
    'evalInfix should branch: if both operands are INTEGER_OBJ, delegate to evalIntegerInfix. Otherwise compare types to produce either a "type mismatch" or "unknown operator" error.',
    'Use fmt.Sprintf via a newError helper so messages like "type mismatch: INTEGER + BOOLEAN" are produced consistently.',
  ],
  projectId: 'proj-monkey',
  step: 17,
  totalSteps: 22,
}

export default exercise
