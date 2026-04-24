import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-20',
  title: 'Evaluator — Environment & Variables',
  category: 'Projects',
  subcategory: 'Monkey Interpreter',
  difficulty: 'advanced',
  order: 120,
  description: `Add variable binding and lookup to the evaluator.

You'll finish the \`Environment\` struct and add two AST cases to \`Eval\`:

**1. Environment.** A chainable map for variable bindings:
\`\`\`go
type Environment struct {
    store map[string]Object
    outer *Environment
}
\`\`\`
- \`Get(name)\` looks up \`name\` in \`store\`. If not found and \`outer != nil\`,
  recurse into the outer environment. Returns \`(Object, bool)\`.
- \`Set(name, val)\` stores the binding in the current (innermost) \`store\` and
  returns \`val\`.
- \`NewEnclosedEnvironment(outer)\` creates a fresh environment whose \`outer\`
  pointer points at \`outer\` — you'll use it heavily for function scopes later.

**2. Eval cases.**
- \`*LetStatement\`: evaluate \`node.Value\`, bail on error, then
  \`env.Set(node.Name.Value, value)\`.
- \`*Identifier\`: \`env.Get(node.Value)\`; if not found, return an error
  \`"identifier not found: <name>"\`.

Tests construct AST nodes directly — no parser is involved.`,
  code: `package main

import "fmt"

// ─── Minimal AST ─────────────────────────────────────
type Node interface{ node() }
type Statement interface{ Node; stmt() }
type Expression interface{ Node; expr() }

type Program struct{ Statements []Statement }
func (*Program) node() {}

type ExpressionStatement struct{ Expression Expression }
func (*ExpressionStatement) node() {}
func (*ExpressionStatement) stmt() {}

type LetStatement struct{ Name *Identifier; Value Expression }
func (*LetStatement) node() {}
func (*LetStatement) stmt() {}

type Identifier struct{ Value string }
func (*Identifier) node() {}
func (*Identifier) expr() {}

type IntegerLiteral struct{ Value int64 }
func (*IntegerLiteral) node() {}
func (*IntegerLiteral) expr() {}

type BooleanLiteral struct{ Value bool }
func (*BooleanLiteral) node() {}
func (*BooleanLiteral) expr() {}

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

// ─── Environment ─────────────────────────────────────
type Environment struct {
	store map[string]Object
	outer *Environment
}

func NewEnvironment() *Environment {
	return &Environment{store: map[string]Object{}}
}

// TODO: Implement NewEnclosedEnvironment(outer *Environment) *Environment
//   - Create a new Environment whose outer pointer points at outer.

func NewEnclosedEnvironment(outer *Environment) *Environment {
	// TODO
	return nil
}

// TODO: Implement (e *Environment) Get(name string) (Object, bool)
//   - Look up name in e.store. If not found AND e.outer != nil, recurse into e.outer.Get.
func (e *Environment) Get(name string) (Object, bool) {
	// TODO
	return nil, false
}

// TODO: Implement (e *Environment) Set(name string, val Object) Object
//   - Store val in the current environment; return val.
func (e *Environment) Set(name string, val Object) Object {
	// TODO
	return val
}

// ─── Evaluator ───────────────────────────────────────
// TODO: In Eval, add cases for:
//   *LetStatement — evaluate Value, bail on error, then env.Set(name, val).
//   *Identifier   — env.Get(name); if missing, return newError("identifier not found: "+name).

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
	// TODO: case *LetStatement
	// TODO: case *Identifier
	}
	return NULL
}

func main() {}
`,
  testCode: `package main

import "testing"

func ident(name string) *Identifier { return &Identifier{Value: name} }
func intLit(v int64) *IntegerLiteral { return &IntegerLiteral{Value: v} }
func letStmt(name string, val Expression) *LetStatement {
	return &LetStatement{Name: ident(name), Value: val}
}
func exprStmt(e Expression) *ExpressionStatement {
	return &ExpressionStatement{Expression: e}
}

func TestEnvironmentSetAndGet(t *testing.T) {
	env := NewEnvironment()
	env.Set("x", &IntegerObject{Value: 42})
	got, ok := env.Get("x")
	if !ok { t.Fatal("expected x to be present") }
	iv, ok := got.(*IntegerObject)
	if !ok { t.Fatalf("expected IntegerObject, got %T", got) }
	if iv.Value != 42 { t.Errorf("expected 42, got %d", iv.Value) }
}

func TestEnvironmentGetMissing(t *testing.T) {
	env := NewEnvironment()
	if _, ok := env.Get("nope"); ok {
		t.Error("expected missing lookup to return false")
	}
}

func TestEnvironmentEnclosedFallsBackToOuter(t *testing.T) {
	outer := NewEnvironment()
	outer.Set("x", &IntegerObject{Value: 7})
	inner := NewEnclosedEnvironment(outer)
	got, ok := inner.Get("x")
	if !ok { t.Fatal("expected inner to find x via outer") }
	iv, ok := got.(*IntegerObject)
	if !ok { t.Fatalf("expected IntegerObject, got %T", got) }
	if iv.Value != 7 { t.Errorf("expected 7, got %d", iv.Value) }
}

func TestEnvironmentInnerShadowsOuter(t *testing.T) {
	outer := NewEnvironment()
	outer.Set("x", &IntegerObject{Value: 1})
	inner := NewEnclosedEnvironment(outer)
	inner.Set("x", &IntegerObject{Value: 99})
	got, _ := inner.Get("x")
	iv := got.(*IntegerObject)
	if iv.Value != 99 { t.Errorf("inner should shadow outer, got %d", iv.Value) }
	// outer unaffected
	got2, _ := outer.Get("x")
	iv2 := got2.(*IntegerObject)
	if iv2.Value != 1 { t.Errorf("outer should stay 1, got %d", iv2.Value) }
}

func TestEvalLetAndIdentifier(t *testing.T) {
	// let x = 5; x
	prog := &Program{Statements: []Statement{
		letStmt("x", intLit(5)),
		exprStmt(ident("x")),
	}}
	got := Eval(prog, NewEnvironment())
	iv, ok := got.(*IntegerObject)
	if !ok { t.Fatalf("expected IntegerObject, got %T (%v)", got, got) }
	if iv.Value != 5 { t.Errorf("expected 5, got %d", iv.Value) }
}

func TestEvalMultipleBindings(t *testing.T) {
	// let a = 10; let b = 20; a
	prog := &Program{Statements: []Statement{
		letStmt("a", intLit(10)),
		letStmt("b", intLit(20)),
		exprStmt(ident("a")),
	}}
	got := Eval(prog, NewEnvironment())
	iv, ok := got.(*IntegerObject)
	if !ok { t.Fatalf("expected IntegerObject, got %T", got) }
	if iv.Value != 10 { t.Errorf("expected 10, got %d", iv.Value) }
}

func TestEvalLetReferencesPriorBinding(t *testing.T) {
	// let a = 7; let b = a; b
	prog := &Program{Statements: []Statement{
		letStmt("a", intLit(7)),
		letStmt("b", ident("a")),
		exprStmt(ident("b")),
	}}
	got := Eval(prog, NewEnvironment())
	iv, ok := got.(*IntegerObject)
	if !ok { t.Fatalf("expected IntegerObject, got %T", got) }
	if iv.Value != 7 { t.Errorf("expected 7, got %d", iv.Value) }
}

func TestEvalUnknownIdentifierIsError(t *testing.T) {
	prog := &Program{Statements: []Statement{exprStmt(ident("missing"))}}
	got := Eval(prog, NewEnvironment())
	errObj, ok := got.(*ErrorObject)
	if !ok { t.Fatalf("expected ErrorObject, got %T (%v)", got, got) }
	if errObj.Message == "" { t.Error("expected non-empty error message") }
	// Expect the name to appear in the message.
	found := false
	for i := 0; i+len("missing") <= len(errObj.Message); i++ {
		if errObj.Message[i:i+len("missing")] == "missing" { found = true; break }
	}
	if !found {
		t.Errorf("expected error to mention 'missing', got %q", errObj.Message)
	}
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

type LetStatement struct{ Name *Identifier; Value Expression }
func (*LetStatement) node() {}
func (*LetStatement) stmt() {}

type Identifier struct{ Value string }
func (*Identifier) node() {}
func (*Identifier) expr() {}

type IntegerLiteral struct{ Value int64 }
func (*IntegerLiteral) node() {}
func (*IntegerLiteral) expr() {}

type BooleanLiteral struct{ Value bool }
func (*BooleanLiteral) node() {}
func (*BooleanLiteral) expr() {}

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

type Environment struct {
	store map[string]Object
	outer *Environment
}

func NewEnvironment() *Environment {
	return &Environment{store: map[string]Object{}}
}

func NewEnclosedEnvironment(outer *Environment) *Environment {
	env := NewEnvironment()
	env.outer = outer
	return env
}

func (e *Environment) Get(name string) (Object, bool) {
	obj, ok := e.store[name]
	if !ok && e.outer != nil {
		return e.outer.Get(name)
	}
	return obj, ok
}

func (e *Environment) Set(name string, val Object) Object {
	e.store[name] = val
	return val
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
	case *LetStatement:
		val := Eval(node.Value, env)
		if isError(val) { return val }
		env.Set(node.Name.Value, val)
		return val
	case *Identifier:
		if v, ok := env.Get(node.Value); ok {
			return v
		}
		return newError("identifier not found: %s", node.Value)
	case *IntegerLiteral:
		return &IntegerObject{Value: node.Value}
	case *BooleanLiteral:
		return nativeBoolToBooleanObject(node.Value)
	}
	return NULL
}

func main() {}
`,
  hints: [
    'Get: `obj, ok := e.store[name]`. If not ok and `e.outer != nil`, recurse via `e.outer.Get(name)`. Otherwise return `(obj, ok)`.',
    'NewEnclosedEnvironment: construct a fresh Environment with its own store, then set `env.outer = outer`. Set stores in the innermost map so inner bindings shadow outer.',
    'For *Identifier in Eval: look up the name via env.Get; if missing, return `newError("identifier not found: " + node.Value)`. For *LetStatement: evaluate Value, bail on error, then env.Set.',
  ],
  projectId: 'proj-monkey',
  step: 20,
  totalSteps: 22,
}

export default exercise
