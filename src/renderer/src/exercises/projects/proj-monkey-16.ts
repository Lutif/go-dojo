import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-16',
  title: 'Evaluator — Prefix Expressions',
  category: 'Projects',
  subcategory: 'Monkey Interpreter',
  difficulty: 'advanced',
  order: 116,
  description: `Extend the evaluator to handle prefix operators: \`!\` (logical not) and \`-\` (integer negation).

## Operators

### \`!\` (bang)

Produces the logical negation of **truthiness**:

| operand   | result  |
|-----------|---------|
| TRUE      | FALSE   |
| FALSE     | TRUE    |
| NULL_VAL  | TRUE    |
| anything else (e.g. Integer) | FALSE |

So \`!5\` is \`FALSE\`, and \`!!5\` is \`TRUE\`.

### \`-\` (minus)

Only valid on integers. For any other operand type return an \`Error\` with message
\`"unknown operator: -<TYPE>"\` (e.g. \`"unknown operator: -BOOLEAN"\`).

## Your task

1. Add an \`Error\` object type (\`Type() == "ERROR"\`, \`Inspect()\` returns \`"ERROR: " + Message\`).
2. Implement \`evalPrefix(op string, right Object) Object\` with helpers \`evalBang\` and \`evalMinus\`.
3. Add a \`*PrefixExpression\` case to \`Eval\`. First evaluate the \`Right\` node, then apply the operator. If the right-hand side is already an \`Error\`, propagate it.

Tests build prefix-expression AST nodes directly.`,
  code: `package main

import "fmt"

// ─── AST (provided) ──────────────────────────────────
type Node interface{ astNode() }
type IntegerLiteral struct{ Value int64 }
type BooleanLiteral struct{ Value bool }
type NullLiteral struct{}
type PrefixExpression struct {
	Operator string
	Right    Node
}
func (*IntegerLiteral) astNode()    {}
func (*BooleanLiteral) astNode()    {}
func (*NullLiteral) astNode()       {}
func (*PrefixExpression) astNode()  {}

// ─── Object system (from step 15) ────────────────────
const (
	INTEGER_OBJ = "INTEGER"
	BOOLEAN_OBJ = "BOOLEAN"
	NULL_OBJ    = "NULL"
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
type Null struct{}
func (*Null) Type() string    { return NULL_OBJ }
func (*Null) Inspect() string { return "null" }

// TODO: Define Error with Message string, Type() == ERROR_OBJ,
// Inspect() returns "ERROR: " + Message.

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

// TODO: Implement evalBang, evalMinus, evalPrefix.

// ─── Evaluator ───────────────────────────────────────
func Eval(node Node) Object {
	switch n := node.(type) {
	case *IntegerLiteral:
		return &Integer{Value: n.Value}
	case *BooleanLiteral:
		return nativeBool(n.Value)
	case *NullLiteral:
		return NULL_VAL
	// TODO: handle *PrefixExpression — evaluate Right, propagate errors, then dispatch to evalPrefix.
	}
	return nil
}

func main() {}
`,
  testCode: `package main

import "testing"

func TestBangOperator(t *testing.T) {
	cases := []struct {
		in   Node
		want bool
	}{
		{&PrefixExpression{Operator: "!", Right: &BooleanLiteral{Value: true}}, false},
		{&PrefixExpression{Operator: "!", Right: &BooleanLiteral{Value: false}}, true},
		{&PrefixExpression{Operator: "!", Right: &NullLiteral{}}, true},
		{&PrefixExpression{Operator: "!", Right: &IntegerLiteral{Value: 5}}, false},
		{&PrefixExpression{Operator: "!", Right: &PrefixExpression{Operator: "!", Right: &IntegerLiteral{Value: 5}}}, true},
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

func TestMinusPrefix(t *testing.T) {
	got := Eval(&PrefixExpression{Operator: "-", Right: &IntegerLiteral{Value: 5}})
	i, ok := got.(*Integer)
	if !ok {
		t.Fatalf("expected *Integer, got %T", got)
	}
	if i.Value != -5 {
		t.Errorf("got %d, want -5", i.Value)
	}

	got2 := Eval(&PrefixExpression{Operator: "-", Right: &PrefixExpression{Operator: "-", Right: &IntegerLiteral{Value: 10}}})
	if i2, ok := got2.(*Integer); !ok || i2.Value != 10 {
		t.Errorf("--10 = %v, want 10", got2)
	}
}

func TestMinusOnNonInteger(t *testing.T) {
	got := Eval(&PrefixExpression{Operator: "-", Right: &BooleanLiteral{Value: true}})
	e, ok := got.(*Error)
	if !ok {
		t.Fatalf("expected *Error, got %T (%v)", got, got)
	}
	if e.Type() != ERROR_OBJ {
		t.Errorf("Type() = %q, want %q", e.Type(), ERROR_OBJ)
	}
	if e.Message != "unknown operator: -BOOLEAN" {
		t.Errorf("Message = %q, want %q", e.Message, "unknown operator: -BOOLEAN")
	}
}

func TestErrorPropagation(t *testing.T) {
	// -(-true) → inner produces Error, outer should propagate it unchanged.
	inner := &PrefixExpression{Operator: "-", Right: &BooleanLiteral{Value: true}}
	outer := &PrefixExpression{Operator: "-", Right: inner}
	got := Eval(outer)
	if _, ok := got.(*Error); !ok {
		t.Fatalf("expected *Error propagated, got %T (%v)", got, got)
	}
}
`,
  solution: `package main

import "fmt"

// ─── AST ─────────────────────────────────────────────
type Node interface{ astNode() }
type IntegerLiteral struct{ Value int64 }
type BooleanLiteral struct{ Value bool }
type NullLiteral struct{}
type PrefixExpression struct {
	Operator string
	Right    Node
}
func (*IntegerLiteral) astNode()   {}
func (*BooleanLiteral) astNode()   {}
func (*NullLiteral) astNode()      {}
func (*PrefixExpression) astNode() {}

// ─── Object system ───────────────────────────────────
const (
	INTEGER_OBJ = "INTEGER"
	BOOLEAN_OBJ = "BOOLEAN"
	NULL_OBJ    = "NULL"
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
type Null struct{}
func (*Null) Type() string    { return NULL_OBJ }
func (*Null) Inspect() string { return "null" }
type Error struct{ Message string }
func (e *Error) Type() string    { return ERROR_OBJ }
func (e *Error) Inspect() string { return "ERROR: " + e.Message }

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
func newError(format string, a ...interface{}) *Error {
	return &Error{Message: fmt.Sprintf(format, a...)}
}
func isError(o Object) bool { return o != nil && o.Type() == ERROR_OBJ }

func evalBang(right Object) Object {
	switch right {
	case TRUE:
		return FALSE
	case FALSE:
		return TRUE
	case NULL_VAL:
		return TRUE
	default:
		return FALSE
	}
}

func evalMinus(right Object) Object {
	if right.Type() != INTEGER_OBJ {
		return newError("unknown operator: -%s", right.Type())
	}
	return &Integer{Value: -right.(*Integer).Value}
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

// ─── Evaluator ───────────────────────────────────────
func Eval(node Node) Object {
	switch n := node.(type) {
	case *IntegerLiteral:
		return &Integer{Value: n.Value}
	case *BooleanLiteral:
		return nativeBool(n.Value)
	case *NullLiteral:
		return NULL_VAL
	case *PrefixExpression:
		right := Eval(n.Right)
		if isError(right) {
			return right
		}
		return evalPrefix(n.Operator, right)
	}
	return nil
}

func main() {}
`,
  hints: [
    'evalBang uses a switch on the singleton pointer: `switch right { case TRUE: return FALSE; ... default: return FALSE }`.',
    'evalMinus must check right.Type() == INTEGER_OBJ before casting — otherwise return an Error with message "unknown operator: -<TYPE>".',
    'After recursively evaluating node.Right, use an isError helper to short-circuit propagation before applying the operator.',
  ],
  projectId: 'proj-monkey',
  step: 16,
  totalSteps: 22,
}

export default exercise
