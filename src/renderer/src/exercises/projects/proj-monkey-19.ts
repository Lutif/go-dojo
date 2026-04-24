import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-19',
  title: 'Evaluator — If-Else & Truthiness',
  category: 'Projects',
  subcategory: 'Monkey Interpreter',
  difficulty: 'advanced',
  order: 119,
  description: `Add \`*IfExpression\` evaluation to \`Eval\`.

An \`IfExpression\` has three fields:
- \`Condition\` — any expression
- \`Consequence\` — a \`*BlockStatement\` run when the condition is truthy
- \`Alternative\` — a \`*BlockStatement\` run when the condition is falsy (may be nil)

**Truthiness rules** (Monkey semantics):
- \`FALSE_OBJ\` is falsy
- \`NULL\` is falsy
- **everything else** is truthy (including \`0\` and \`TRUE_OBJ\`)

If the condition is truthy, evaluate the consequence block. If it is falsy and an
alternative exists, evaluate the alternative. If it is falsy and there is no
alternative, return \`NULL\`.

You also need a \`*BlockStatement\` case in \`Eval\` that iterates its statements
and returns the last produced value (early-return on errors).

Propagate errors from evaluating the condition.

The tests build AST nodes directly — no parsing involved — so your only job is
the evaluator logic.`,
  code: `package main

import "fmt"

// ─── Minimal AST (subset needed for this step) ───────
type Node interface{ node() }
type Statement interface{ Node; stmt() }
type Expression interface{ Node; expr() }

type Program struct{ Statements []Statement }
func (*Program) node() {}

type ExpressionStatement struct{ Expression Expression }
func (*ExpressionStatement) node() {}
func (*ExpressionStatement) stmt() {}

type BlockStatement struct{ Statements []Statement }
func (*BlockStatement) node() {}
func (*BlockStatement) stmt() {}

type IntegerLiteral struct{ Value int64 }
func (*IntegerLiteral) node() {}
func (*IntegerLiteral) expr() {}

type BooleanLiteral struct{ Value bool }
func (*BooleanLiteral) node() {}
func (*BooleanLiteral) expr() {}

type PrefixExpression struct{ Operator string; Right Expression }
func (*PrefixExpression) node() {}
func (*PrefixExpression) expr() {}

type IfExpression struct{
	Condition   Expression
	Consequence *BlockStatement
	Alternative *BlockStatement
}
func (*IfExpression) node() {}
func (*IfExpression) expr() {}

// ─── Object System ───────────────────────────────────
type ObjectType string
const (
	INTEGER_OBJ ObjectType = "INTEGER"
	BOOLEAN_OBJ ObjectType = "BOOLEAN"
	NULL_OBJ    ObjectType = "NULL"
	ERROR_OBJ   ObjectType = "ERROR"
)

type Object interface{ Type() ObjectType; Inspect() string }

type IntegerObject struct{ Value int64 }
func (o *IntegerObject) Type() ObjectType { return INTEGER_OBJ }
func (o *IntegerObject) Inspect() string  { return fmt.Sprintf("%d", o.Value) }

type BooleanObject struct{ Value bool }
func (o *BooleanObject) Type() ObjectType { return BOOLEAN_OBJ }
func (o *BooleanObject) Inspect() string  { return fmt.Sprintf("%t", o.Value) }

type NullObject struct{}
func (o *NullObject) Type() ObjectType { return NULL_OBJ }
func (o *NullObject) Inspect() string  { return "null" }

type ErrorObject struct{ Message string }
func (o *ErrorObject) Type() ObjectType { return ERROR_OBJ }
func (o *ErrorObject) Inspect() string  { return "ERROR: " + o.Message }

type Environment struct{ store map[string]Object; outer *Environment }
func NewEnvironment() *Environment { return &Environment{store: map[string]Object{}} }

var (
	TRUE_OBJ  = &BooleanObject{Value: true}
	FALSE_OBJ = &BooleanObject{Value: false}
	NULL      = &NullObject{}
)

func nativeBoolToBooleanObject(b bool) *BooleanObject {
	if b { return TRUE_OBJ }
	return FALSE_OBJ
}
func isError(obj Object) bool { return obj != nil && obj.Type() == ERROR_OBJ }
func newError(f string, a ...interface{}) *ErrorObject {
	return &ErrorObject{Message: fmt.Sprintf(f, a...)}
}

func evalBangOperator(right Object) Object {
	switch right {
	case TRUE_OBJ:  return FALSE_OBJ
	case FALSE_OBJ: return TRUE_OBJ
	case NULL:      return TRUE_OBJ
	default:        return FALSE_OBJ
	}
}
func evalMinusPrefix(right Object) Object {
	if right.Type() != INTEGER_OBJ {
		return newError("unknown operator: -%s", right.Type())
	}
	return &IntegerObject{Value: -right.(*IntegerObject).Value}
}
func evalPrefixExpression(op string, right Object) Object {
	switch op {
	case "!": return evalBangOperator(right)
	case "-": return evalMinusPrefix(right)
	}
	return newError("unknown operator: %s%s", op, right.Type())
}

// TODO: Implement isTruthy(obj Object) bool
//   - FALSE_OBJ and NULL are falsy; everything else is truthy.

// TODO: Implement evalBlockStatement(block *BlockStatement, env *Environment) Object
//   - Iterate block.Statements, Eval each, return last result.
//   - If any result is an error, return it immediately.

// TODO: Add cases to Eval for *IfExpression and *BlockStatement.

func Eval(node Node, env *Environment) Object {
	switch node := node.(type) {
	case *Program:
		var result Object
		for _, s := range node.Statements {
			result = Eval(s, env)
			if isError(result) { return result }
		}
		return result
	case *ExpressionStatement:
		return Eval(node.Expression, env)
	case *IntegerLiteral:
		return &IntegerObject{Value: node.Value}
	case *BooleanLiteral:
		return nativeBoolToBooleanObject(node.Value)
	case *PrefixExpression:
		right := Eval(node.Right, env)
		if isError(right) { return right }
		return evalPrefixExpression(node.Operator, right)
	// TODO: add *BlockStatement case
	// TODO: add *IfExpression case
	}
	return NULL
}

func main() {}
`,
  testCode: `package main

import "testing"

// Helpers to build AST nodes compactly.
func intLit(v int64) *IntegerLiteral      { return &IntegerLiteral{Value: v} }
func boolLit(v bool) *BooleanLiteral      { return &BooleanLiteral{Value: v} }
func bang(e Expression) *PrefixExpression { return &PrefixExpression{Operator: "!", Right: e} }
func block(exprs ...Expression) *BlockStatement {
	stmts := make([]Statement, len(exprs))
	for i, e := range exprs { stmts[i] = &ExpressionStatement{Expression: e} }
	return &BlockStatement{Statements: stmts}
}

func run(e Expression) Object {
	p := &Program{Statements: []Statement{&ExpressionStatement{Expression: e}}}
	return Eval(p, NewEnvironment())
}

func TestIfTrueConditionTakesConsequence(t *testing.T) {
	// if (true) { 10 } else { 20 }
	ie := &IfExpression{
		Condition:   boolLit(true),
		Consequence: block(intLit(10)),
		Alternative: block(intLit(20)),
	}
	got := run(ie)
	iv, ok := got.(*IntegerObject)
	if !ok { t.Fatalf("expected IntegerObject, got %T (%v)", got, got) }
	if iv.Value != 10 { t.Errorf("expected 10, got %d", iv.Value) }
}

func TestIfFalseConditionTakesAlternative(t *testing.T) {
	// if (false) { 10 } else { 20 }
	ie := &IfExpression{
		Condition:   boolLit(false),
		Consequence: block(intLit(10)),
		Alternative: block(intLit(20)),
	}
	got := run(ie)
	iv, ok := got.(*IntegerObject)
	if !ok { t.Fatalf("expected IntegerObject, got %T (%v)", got, got) }
	if iv.Value != 20 { t.Errorf("expected 20, got %d", iv.Value) }
}

func TestIfFalseNoAlternativeReturnsNull(t *testing.T) {
	// if (false) { 10 }
	ie := &IfExpression{
		Condition:   boolLit(false),
		Consequence: block(intLit(10)),
	}
	got := run(ie)
	if got != NULL {
		t.Errorf("expected NULL, got %T (%v)", got, got)
	}
}

func TestIfIntegerIsTruthy(t *testing.T) {
	// if (1) { 99 } else { 0 } -- integers are truthy
	ie := &IfExpression{
		Condition:   intLit(1),
		Consequence: block(intLit(99)),
		Alternative: block(intLit(0)),
	}
	got := run(ie)
	iv, ok := got.(*IntegerObject)
	if !ok { t.Fatalf("expected IntegerObject, got %T", got) }
	if iv.Value != 99 { t.Errorf("expected 99, got %d", iv.Value) }
}

func TestIfZeroIsTruthy(t *testing.T) {
	// if (0) { 1 } else { 2 } -- in Monkey, 0 is truthy (only false and null are falsy)
	ie := &IfExpression{
		Condition:   intLit(0),
		Consequence: block(intLit(1)),
		Alternative: block(intLit(2)),
	}
	got := run(ie)
	iv, ok := got.(*IntegerObject)
	if !ok { t.Fatalf("expected IntegerObject, got %T", got) }
	if iv.Value != 1 { t.Errorf("expected 1 (zero is truthy), got %d", iv.Value) }
}

func TestIfBangedConditionFlipsBranch(t *testing.T) {
	// if (!true) { 1 } else { 2 }
	ie := &IfExpression{
		Condition:   bang(boolLit(true)),
		Consequence: block(intLit(1)),
		Alternative: block(intLit(2)),
	}
	got := run(ie)
	iv, ok := got.(*IntegerObject)
	if !ok { t.Fatalf("expected IntegerObject, got %T", got) }
	if iv.Value != 2 { t.Errorf("expected 2, got %d", iv.Value) }
}

func TestBlockReturnsLastStatement(t *testing.T) {
	// { 1; 2; 3 } — block evaluated directly
	b := block(intLit(1), intLit(2), intLit(3))
	got := Eval(b, NewEnvironment())
	iv, ok := got.(*IntegerObject)
	if !ok { t.Fatalf("expected IntegerObject, got %T", got) }
	if iv.Value != 3 { t.Errorf("expected 3, got %d", iv.Value) }
}
`,
  solution: `package main

import "fmt"

type Node interface{ node() }
type Statement interface{ Node; stmt() }
type Expression interface{ Node; expr() }

type Program struct{ Statements []Statement }
func (*Program) node() {}

type ExpressionStatement struct{ Expression Expression }
func (*ExpressionStatement) node() {}
func (*ExpressionStatement) stmt() {}

type BlockStatement struct{ Statements []Statement }
func (*BlockStatement) node() {}
func (*BlockStatement) stmt() {}

type IntegerLiteral struct{ Value int64 }
func (*IntegerLiteral) node() {}
func (*IntegerLiteral) expr() {}

type BooleanLiteral struct{ Value bool }
func (*BooleanLiteral) node() {}
func (*BooleanLiteral) expr() {}

type PrefixExpression struct{ Operator string; Right Expression }
func (*PrefixExpression) node() {}
func (*PrefixExpression) expr() {}

type IfExpression struct{
	Condition   Expression
	Consequence *BlockStatement
	Alternative *BlockStatement
}
func (*IfExpression) node() {}
func (*IfExpression) expr() {}

type ObjectType string
const (
	INTEGER_OBJ ObjectType = "INTEGER"
	BOOLEAN_OBJ ObjectType = "BOOLEAN"
	NULL_OBJ    ObjectType = "NULL"
	ERROR_OBJ   ObjectType = "ERROR"
)
type Object interface{ Type() ObjectType; Inspect() string }

type IntegerObject struct{ Value int64 }
func (o *IntegerObject) Type() ObjectType { return INTEGER_OBJ }
func (o *IntegerObject) Inspect() string  { return fmt.Sprintf("%d", o.Value) }
type BooleanObject struct{ Value bool }
func (o *BooleanObject) Type() ObjectType { return BOOLEAN_OBJ }
func (o *BooleanObject) Inspect() string  { return fmt.Sprintf("%t", o.Value) }
type NullObject struct{}
func (o *NullObject) Type() ObjectType { return NULL_OBJ }
func (o *NullObject) Inspect() string  { return "null" }
type ErrorObject struct{ Message string }
func (o *ErrorObject) Type() ObjectType { return ERROR_OBJ }
func (o *ErrorObject) Inspect() string  { return "ERROR: " + o.Message }

type Environment struct{ store map[string]Object; outer *Environment }
func NewEnvironment() *Environment { return &Environment{store: map[string]Object{}} }

var (
	TRUE_OBJ  = &BooleanObject{Value: true}
	FALSE_OBJ = &BooleanObject{Value: false}
	NULL      = &NullObject{}
)

func nativeBoolToBooleanObject(b bool) *BooleanObject {
	if b { return TRUE_OBJ }
	return FALSE_OBJ
}
func isError(obj Object) bool { return obj != nil && obj.Type() == ERROR_OBJ }
func newError(f string, a ...interface{}) *ErrorObject {
	return &ErrorObject{Message: fmt.Sprintf(f, a...)}
}
func evalBangOperator(right Object) Object {
	switch right {
	case TRUE_OBJ:  return FALSE_OBJ
	case FALSE_OBJ: return TRUE_OBJ
	case NULL:      return TRUE_OBJ
	default:        return FALSE_OBJ
	}
}
func evalMinusPrefix(right Object) Object {
	if right.Type() != INTEGER_OBJ {
		return newError("unknown operator: -%s", right.Type())
	}
	return &IntegerObject{Value: -right.(*IntegerObject).Value}
}
func evalPrefixExpression(op string, right Object) Object {
	switch op {
	case "!": return evalBangOperator(right)
	case "-": return evalMinusPrefix(right)
	}
	return newError("unknown operator: %s%s", op, right.Type())
}

func isTruthy(obj Object) bool {
	switch obj {
	case NULL:      return false
	case FALSE_OBJ: return false
	case TRUE_OBJ:  return true
	default:        return true
	}
}

func evalBlockStatement(block *BlockStatement, env *Environment) Object {
	var result Object
	for _, s := range block.Statements {
		result = Eval(s, env)
		if isError(result) { return result }
	}
	return result
}

func evalIfExpression(ie *IfExpression, env *Environment) Object {
	cond := Eval(ie.Condition, env)
	if isError(cond) { return cond }
	if isTruthy(cond) {
		return Eval(ie.Consequence, env)
	} else if ie.Alternative != nil {
		return Eval(ie.Alternative, env)
	}
	return NULL
}

func Eval(node Node, env *Environment) Object {
	switch node := node.(type) {
	case *Program:
		var result Object
		for _, s := range node.Statements {
			result = Eval(s, env)
			if isError(result) { return result }
		}
		return result
	case *ExpressionStatement:
		return Eval(node.Expression, env)
	case *BlockStatement:
		return evalBlockStatement(node, env)
	case *IntegerLiteral:
		return &IntegerObject{Value: node.Value}
	case *BooleanLiteral:
		return nativeBoolToBooleanObject(node.Value)
	case *PrefixExpression:
		right := Eval(node.Right, env)
		if isError(right) { return right }
		return evalPrefixExpression(node.Operator, right)
	case *IfExpression:
		return evalIfExpression(node, env)
	}
	return NULL
}

func main() {}
`,
  hints: [
    'Write isTruthy: return false for NULL and FALSE_OBJ, true for everything else (even integers like 0).',
    'evalBlockStatement loops through Statements and returns the last result; bail out early if you see an error.',
    'For IfExpression: evaluate the condition, check isTruthy, then Eval the Consequence or Alternative block. If the condition is falsy and Alternative is nil, return NULL.',
  ],
  projectId: 'proj-monkey',
  step: 19,
  totalSteps: 22,
}

export default exercise
