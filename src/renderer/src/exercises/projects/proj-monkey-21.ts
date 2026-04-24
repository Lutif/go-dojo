import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-21',
  title: 'Evaluator — Functions & Closures',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 121,
  projectId: 'proj-monkey',
  step: 21,
  totalSteps: 22,
  description: `Functions are the heart of the language — and closures fall out almost for free once you get the environment model right.

A \`Function\` object carries three things: the parameter list, the body (a block statement), and a reference to the environment in which it was **defined**. That last part is the secret. When you call a function, you build a *new* environment whose \`outer\` pointer is the captured one — not the caller's environment. That single decision turns ordinary functions into closures: an inner \`fn\` that references an outer \`let\` binding keeps seeing that binding even after the outer function returns, because the inner function's \`Env\` still points at the (now-orphaned) enclosed environment.

**Tasks:**
- Define \`Function\` object: \`struct { Parameters []*Identifier; Body *BlockStatement; Env *Environment }\` implementing \`Object\`.
- In \`Eval\`, handle \`*FunctionLiteral\`: return a \`Function\` whose \`Env\` is the **current** env.
- Handle \`*Identifier\`: look up in env, error if unbound.
- Handle \`*LetStatement\`: evaluate value, \`env.Set(name, val)\`.
- Handle \`*CallExpression\`:
  1. \`Eval\` the function expression.
  2. Evaluate each argument (propagate first error).
  3. Build \`NewEnclosedEnvironment(fn.Env)\` (not the caller's env!).
  4. Bind each parameter name to its argument.
  5. \`Eval\` the body in that new env.
  6. If the result is a \`*ReturnValue\`, unwrap it before returning — otherwise an early \`return\` inside a callee would escape through the caller.

To keep the exercise focused, tests build AST nodes directly (no parser in the loop) and pass them to \`Eval\`. You are writing the evaluator, not re-testing the parser.`,
  code: `package main

import "fmt"

// --- Minimal AST (only what the evaluator needs) ---
type Node interface{ node() }

type Identifier struct{ Value string }

func (*Identifier) node() {}

type IntegerLiteral struct{ Value int64 }

func (*IntegerLiteral) node() {}

type InfixExpression struct {
	Operator    string
	Left, Right Node
}

func (*InfixExpression) node() {}

type BlockStatement struct{ Statements []Node }

func (*BlockStatement) node() {}

type ExpressionStatement struct{ Expression Node }

func (*ExpressionStatement) node() {}

type LetStatement struct {
	Name  *Identifier
	Value Node
}

func (*LetStatement) node() {}

type ReturnStatement struct{ ReturnValue Node }

func (*ReturnStatement) node() {}

type FunctionLiteral struct {
	Parameters []*Identifier
	Body       *BlockStatement
}

func (*FunctionLiteral) node() {}

type CallExpression struct {
	Function  Node
	Arguments []Node
}

func (*CallExpression) node() {}

type Program struct{ Statements []Node }

func (*Program) node() {}

// --- Object system ---
type ObjectType string

const (
	INTEGER_OBJ      ObjectType = "INTEGER"
	ERROR_OBJ        ObjectType = "ERROR"
	RETURN_VALUE_OBJ ObjectType = "RETURN_VALUE"
	FUNCTION_OBJ     ObjectType = "FUNCTION"
	NULL_OBJ         ObjectType = "NULL"
)

type Object interface {
	Type() ObjectType
	Inspect() string
}

type Integer struct{ Value int64 }

func (i *Integer) Type() ObjectType { return INTEGER_OBJ }
func (i *Integer) Inspect() string  { return fmt.Sprintf("%d", i.Value) }

type Error struct{ Message string }

func (e *Error) Type() ObjectType { return ERROR_OBJ }
func (e *Error) Inspect() string  { return "ERROR: " + e.Message }

type ReturnValue struct{ Value Object }

func (r *ReturnValue) Type() ObjectType { return RETURN_VALUE_OBJ }
func (r *ReturnValue) Inspect() string  { return r.Value.Inspect() }

type Null struct{}

func (*Null) Type() ObjectType { return NULL_OBJ }
func (*Null) Inspect() string  { return "null" }

// TODO: define Function with Parameters, Body, Env. Implement Object.
// type Function struct { Parameters []*Identifier; Body *BlockStatement; Env *Environment }

// --- Environment ---
type Environment struct {
	store map[string]Object
	outer *Environment
}

func NewEnvironment() *Environment { return &Environment{store: map[string]Object{}} }
func NewEnclosedEnvironment(outer *Environment) *Environment {
	e := NewEnvironment()
	e.outer = outer
	return e
}
func (e *Environment) Get(name string) (Object, bool) {
	o, ok := e.store[name]
	if !ok && e.outer != nil {
		return e.outer.Get(name)
	}
	return o, ok
}
func (e *Environment) Set(name string, val Object) Object { e.store[name] = val; return val }

var NULL = &Null{}

func newError(f string, a ...interface{}) *Error { return &Error{Message: fmt.Sprintf(f, a...)} }
func isError(o Object) bool                      { return o != nil && o.Type() == ERROR_OBJ }

// TODO: implement Eval. Handle at minimum:
//   *Program            — run statements, unwrap ReturnValue at top level, stop on Error
//   *BlockStatement     — run statements, propagate ReturnValue WITHOUT unwrapping (so nested returns bubble up), stop on Error
//   *ExpressionStatement
//   *IntegerLiteral
//   *Identifier         — env.Get, error "identifier not found: X" if missing
//   *InfixExpression    — integer +, -, *, / (enough for tests)
//   *LetStatement       — eval value, env.Set
//   *ReturnStatement    — wrap in ReturnValue
//   *FunctionLiteral    — return *Function with captured env
//   *CallExpression     — eval fn, eval args, extend env with params, eval body, UNWRAP ReturnValue
func Eval(node Node, env *Environment) Object {
	return NULL
}

func main() {}
`,
  testCode: `package main

import "testing"

func intLit(n int64) *IntegerLiteral { return &IntegerLiteral{Value: n} }
func ident(s string) *Identifier     { return &Identifier{Value: s} }

func TestFunctionLiteralEvaluatesToFunctionObject(t *testing.T) {
	// fn(x) { x + 2 }
	fn := &FunctionLiteral{
		Parameters: []*Identifier{ident("x")},
		Body: &BlockStatement{Statements: []Node{
			&ExpressionStatement{Expression: &InfixExpression{Operator: "+", Left: ident("x"), Right: intLit(2)}},
		}},
	}
	prog := &Program{Statements: []Node{&ExpressionStatement{Expression: fn}}}
	got := Eval(prog, NewEnvironment())
	f, ok := got.(*Function)
	if !ok {
		t.Fatalf("expected *Function, got %T (%v)", got, got)
	}
	if len(f.Parameters) != 1 || f.Parameters[0].Value != "x" {
		t.Fatalf("bad parameters: %+v", f.Parameters)
	}
	if f.Env == nil {
		t.Fatal("Function.Env should be captured (non-nil)")
	}
}

func TestCallAppliesArguments(t *testing.T) {
	// let add = fn(a, b) { a + b }; add(2, 3)
	env := NewEnvironment()
	fn := &FunctionLiteral{
		Parameters: []*Identifier{ident("a"), ident("b")},
		Body: &BlockStatement{Statements: []Node{
			&ExpressionStatement{Expression: &InfixExpression{Operator: "+", Left: ident("a"), Right: ident("b")}},
		}},
	}
	prog := &Program{Statements: []Node{
		&LetStatement{Name: ident("add"), Value: fn},
		&ExpressionStatement{Expression: &CallExpression{Function: ident("add"), Arguments: []Node{intLit(2), intLit(3)}}},
	}}
	got := Eval(prog, env)
	i, ok := got.(*Integer)
	if !ok {
		t.Fatalf("expected *Integer, got %T (%v)", got, got)
	}
	if i.Value != 5 {
		t.Errorf("want 5, got %d", i.Value)
	}
}

func TestUnwrapReturnValueAtCallBoundary(t *testing.T) {
	// let f = fn() { return 7; 99 }; f() + 1  →  must be 8, not something weird.
	fn := &FunctionLiteral{
		Parameters: nil,
		Body: &BlockStatement{Statements: []Node{
			&ReturnStatement{ReturnValue: intLit(7)},
			&ExpressionStatement{Expression: intLit(99)},
		}},
	}
	prog := &Program{Statements: []Node{
		&LetStatement{Name: ident("f"), Value: fn},
		&ExpressionStatement{Expression: &InfixExpression{
			Operator: "+",
			Left:     &CallExpression{Function: ident("f")},
			Right:    intLit(1),
		}},
	}}
	got := Eval(prog, NewEnvironment())
	i, ok := got.(*Integer)
	if !ok {
		t.Fatalf("expected *Integer (return value must be unwrapped), got %T (%v)", got, got)
	}
	if i.Value != 8 {
		t.Errorf("want 8, got %d", i.Value)
	}
}

func TestClosureCapturesDefiningEnv(t *testing.T) {
	// let newAdder = fn(x) { fn(y) { x + y } };
	// let addTwo = newAdder(2);
	// addTwo(3)  →  5
	innerFn := &FunctionLiteral{
		Parameters: []*Identifier{ident("y")},
		Body: &BlockStatement{Statements: []Node{
			&ExpressionStatement{Expression: &InfixExpression{Operator: "+", Left: ident("x"), Right: ident("y")}},
		}},
	}
	outerFn := &FunctionLiteral{
		Parameters: []*Identifier{ident("x")},
		Body: &BlockStatement{Statements: []Node{
			&ExpressionStatement{Expression: innerFn},
		}},
	}
	prog := &Program{Statements: []Node{
		&LetStatement{Name: ident("newAdder"), Value: outerFn},
		&LetStatement{Name: ident("addTwo"), Value: &CallExpression{Function: ident("newAdder"), Arguments: []Node{intLit(2)}}},
		&ExpressionStatement{Expression: &CallExpression{Function: ident("addTwo"), Arguments: []Node{intLit(3)}}},
	}}
	got := Eval(prog, NewEnvironment())
	i, ok := got.(*Integer)
	if !ok {
		t.Fatalf("expected *Integer, got %T (%v)", got, got)
	}
	if i.Value != 5 {
		t.Errorf("closure lost its capture: want 5, got %d", i.Value)
	}
}

func TestUnboundIdentifierIsError(t *testing.T) {
	prog := &Program{Statements: []Node{&ExpressionStatement{Expression: ident("nope")}}}
	got := Eval(prog, NewEnvironment())
	e, ok := got.(*Error)
	if !ok {
		t.Fatalf("expected *Error, got %T (%v)", got, got)
	}
	if e.Message == "" {
		t.Error("error message should not be empty")
	}
}

func TestCallerEnvDoesNotLeakIntoCallee(t *testing.T) {
	// let x = 10; let f = fn() { x }; let x = 20; f()  →  should still see 10 (captured env)
	// In this language re-binding via let in the same scope overwrites, so instead we test that
	// an arg named "x" shadows the captured one only inside the call.
	// let x = 10; let f = fn(x) { x }; f(99)  →  99, and outer x still 10.
	env := NewEnvironment()
	fn := &FunctionLiteral{
		Parameters: []*Identifier{ident("x")},
		Body:       &BlockStatement{Statements: []Node{&ExpressionStatement{Expression: ident("x")}}},
	}
	prog := &Program{Statements: []Node{
		&LetStatement{Name: ident("x"), Value: intLit(10)},
		&LetStatement{Name: ident("f"), Value: fn},
		&ExpressionStatement{Expression: &CallExpression{Function: ident("f"), Arguments: []Node{intLit(99)}}},
	}}
	got := Eval(prog, env)
	i, ok := got.(*Integer)
	if !ok {
		t.Fatalf("expected *Integer, got %T", got)
	}
	if i.Value != 99 {
		t.Errorf("want 99, got %d", i.Value)
	}
	// outer x must still be 10
	outer, _ := env.Get("x")
	if outer.(*Integer).Value != 10 {
		t.Errorf("outer x was clobbered: %v", outer.Inspect())
	}
}
`,
  solution: `package main

import "fmt"

type Node interface{ node() }

type Identifier struct{ Value string }

func (*Identifier) node() {}

type IntegerLiteral struct{ Value int64 }

func (*IntegerLiteral) node() {}

type InfixExpression struct {
	Operator    string
	Left, Right Node
}

func (*InfixExpression) node() {}

type BlockStatement struct{ Statements []Node }

func (*BlockStatement) node() {}

type ExpressionStatement struct{ Expression Node }

func (*ExpressionStatement) node() {}

type LetStatement struct {
	Name  *Identifier
	Value Node
}

func (*LetStatement) node() {}

type ReturnStatement struct{ ReturnValue Node }

func (*ReturnStatement) node() {}

type FunctionLiteral struct {
	Parameters []*Identifier
	Body       *BlockStatement
}

func (*FunctionLiteral) node() {}

type CallExpression struct {
	Function  Node
	Arguments []Node
}

func (*CallExpression) node() {}

type Program struct{ Statements []Node }

func (*Program) node() {}

type ObjectType string

const (
	INTEGER_OBJ      ObjectType = "INTEGER"
	ERROR_OBJ        ObjectType = "ERROR"
	RETURN_VALUE_OBJ ObjectType = "RETURN_VALUE"
	FUNCTION_OBJ     ObjectType = "FUNCTION"
	NULL_OBJ         ObjectType = "NULL"
)

type Object interface {
	Type() ObjectType
	Inspect() string
}

type Integer struct{ Value int64 }

func (i *Integer) Type() ObjectType { return INTEGER_OBJ }
func (i *Integer) Inspect() string  { return fmt.Sprintf("%d", i.Value) }

type Error struct{ Message string }

func (e *Error) Type() ObjectType { return ERROR_OBJ }
func (e *Error) Inspect() string  { return "ERROR: " + e.Message }

type ReturnValue struct{ Value Object }

func (r *ReturnValue) Type() ObjectType { return RETURN_VALUE_OBJ }
func (r *ReturnValue) Inspect() string  { return r.Value.Inspect() }

type Null struct{}

func (*Null) Type() ObjectType { return NULL_OBJ }
func (*Null) Inspect() string  { return "null" }

type Function struct {
	Parameters []*Identifier
	Body       *BlockStatement
	Env        *Environment
}

func (f *Function) Type() ObjectType { return FUNCTION_OBJ }
func (f *Function) Inspect() string  { return "fn(...) { ... }" }

type Environment struct {
	store map[string]Object
	outer *Environment
}

func NewEnvironment() *Environment { return &Environment{store: map[string]Object{}} }
func NewEnclosedEnvironment(outer *Environment) *Environment {
	e := NewEnvironment()
	e.outer = outer
	return e
}
func (e *Environment) Get(name string) (Object, bool) {
	o, ok := e.store[name]
	if !ok && e.outer != nil {
		return e.outer.Get(name)
	}
	return o, ok
}
func (e *Environment) Set(name string, val Object) Object { e.store[name] = val; return val }

var NULL = &Null{}

func newError(f string, a ...interface{}) *Error { return &Error{Message: fmt.Sprintf(f, a...)} }
func isError(o Object) bool                      { return o != nil && o.Type() == ERROR_OBJ }

func Eval(node Node, env *Environment) Object {
	switch n := node.(type) {
	case *Program:
		return evalProgram(n, env)
	case *BlockStatement:
		return evalBlock(n, env)
	case *ExpressionStatement:
		return Eval(n.Expression, env)
	case *IntegerLiteral:
		return &Integer{Value: n.Value}
	case *Identifier:
		if v, ok := env.Get(n.Value); ok {
			return v
		}
		return newError("identifier not found: %s", n.Value)
	case *InfixExpression:
		l := Eval(n.Left, env)
		if isError(l) {
			return l
		}
		r := Eval(n.Right, env)
		if isError(r) {
			return r
		}
		return evalInfix(n.Operator, l, r)
	case *LetStatement:
		v := Eval(n.Value, env)
		if isError(v) {
			return v
		}
		env.Set(n.Name.Value, v)
		return NULL
	case *ReturnStatement:
		v := Eval(n.ReturnValue, env)
		if isError(v) {
			return v
		}
		return &ReturnValue{Value: v}
	case *FunctionLiteral:
		return &Function{Parameters: n.Parameters, Body: n.Body, Env: env}
	case *CallExpression:
		fnObj := Eval(n.Function, env)
		if isError(fnObj) {
			return fnObj
		}
		args := make([]Object, 0, len(n.Arguments))
		for _, a := range n.Arguments {
			av := Eval(a, env)
			if isError(av) {
				return av
			}
			args = append(args, av)
		}
		return applyFunction(fnObj, args)
	}
	return NULL
}

func evalProgram(p *Program, env *Environment) Object {
	var result Object = NULL
	for _, s := range p.Statements {
		result = Eval(s, env)
		switch r := result.(type) {
		case *ReturnValue:
			return r.Value
		case *Error:
			return r
		}
	}
	return result
}

func evalBlock(b *BlockStatement, env *Environment) Object {
	var result Object = NULL
	for _, s := range b.Statements {
		result = Eval(s, env)
		if result != nil {
			t := result.Type()
			if t == RETURN_VALUE_OBJ || t == ERROR_OBJ {
				return result
			}
		}
	}
	return result
}

func evalInfix(op string, l, r Object) Object {
	if l.Type() == INTEGER_OBJ && r.Type() == INTEGER_OBJ {
		lv := l.(*Integer).Value
		rv := r.(*Integer).Value
		switch op {
		case "+":
			return &Integer{Value: lv + rv}
		case "-":
			return &Integer{Value: lv - rv}
		case "*":
			return &Integer{Value: lv * rv}
		case "/":
			return &Integer{Value: lv / rv}
		}
	}
	return newError("unknown operator: %s %s %s", l.Type(), op, r.Type())
}

func applyFunction(fnObj Object, args []Object) Object {
	fn, ok := fnObj.(*Function)
	if !ok {
		return newError("not a function: %s", fnObj.Type())
	}
	if len(fn.Parameters) != len(args) {
		return newError("wrong number of arguments: want %d, got %d", len(fn.Parameters), len(args))
	}
	extended := NewEnclosedEnvironment(fn.Env)
	for i, p := range fn.Parameters {
		extended.Set(p.Value, args[i])
	}
	evaluated := Eval(fn.Body, extended)
	if rv, ok := evaluated.(*ReturnValue); ok {
		return rv.Value
	}
	return evaluated
}

func main() {}
`,
  hints: [
    'Store the *current* environment inside the Function object at FunctionLiteral evaluation time — NOT at call time. That captured env is what makes closures work.',
    'A CallExpression needs TWO environment operations: create NewEnclosedEnvironment(fn.Env) (not the caller env), then Set each parameter. After evaluating the body, unwrap *ReturnValue so an early return does not bubble past the caller.',
    'evalProgram unwraps ReturnValue (top level), but evalBlock must NOT — it has to keep ReturnValue wrapped so nested blocks (like an if inside a function) propagate the return up to the call boundary.',
  ],
}

export default exercise
