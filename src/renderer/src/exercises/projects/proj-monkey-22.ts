import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-22',
  title: 'Capstone — Full Monkey Interpreter',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 122,
  projectId: 'proj-monkey',
  step: 22,
  totalSteps: 22,
  description: `The finish line. Wire lexer → parser → evaluator into a single public entry point:

\`\`\`go
func Run(source string) (Object, error)
\`\`\`

It lexes, parses, and evaluates the source. If the parser accumulates any errors, \`Run\` returns \`(nil, error)\` with a message that lists them. If evaluation produces an \`*Error\` object, \`Run\` returns \`(nil, error)\`. Otherwise it returns the final \`Object\` and a nil error.

**What's in scope for this capstone:**
- Integers, booleans, \`null\`
- Prefix: \`!\`, \`-\`
- Infix arithmetic: \`+ - * /\`
- Comparison: \`< > == !=\`
- Grouped expressions with parens
- \`let\` bindings, identifier lookup
- \`if (cond) { ... } else { ... }\` — an *expression*, with falsy = \`false\` or \`null\`
- \`return\` with proper unwinding through nested blocks
- \`fn(params) { body }\` function literals that capture their defining env (closures)
- Call expressions

No strings, arrays, or hashes here — those belong to a follow-on. This is the scheme-in-Go core.

**Architecture reminder:**
- \`evalProgram\` unwraps \`ReturnValue\` at the top level (so the REPL sees the raw value).
- \`evalBlockStatement\` does NOT unwrap — it must return the still-wrapped \`*ReturnValue\` so an early return inside a nested \`if\` bubbles all the way out of the surrounding function call.
- \`applyFunction\` unwraps at the call boundary so a callee's return never escapes into the caller.

Tests walk through both happy paths (Fibonacci, closures, \`let newAdder\`) and error paths (parser error, unbound identifier, type mismatch).`,
  code: `package main

import "fmt"

// TODO: Implement the full Monkey interpreter:
//
//   1. Lexer: NextToken over a source string.
//      Tokens: INT, IDENT, TRUE, FALSE, LET, IF, ELSE, RETURN, FUNCTION,
//              = == ! != + - * / < > , ; ( ) { }, EOF, ILLEGAL.
//
//   2. AST: Program, LetStatement, ReturnStatement, ExpressionStatement,
//           BlockStatement, Identifier, IntegerLiteral, BooleanLiteral,
//           PrefixExpression, InfixExpression, IfExpression, FunctionLiteral,
//           CallExpression.
//
//   3. Parser: Pratt parser with precedences
//      LOWEST < EQUALS < LESSGREATER < SUM < PRODUCT < PREFIX < CALL.
//      Register prefix/infix parse fns for every relevant token.
//
//   4. Object system: Integer, Boolean, Null, Error, ReturnValue, Function.
//      Environment with outer pointer; NewEnclosedEnvironment.
//
//   5. Evaluator: evalProgram (unwrap ReturnValue), evalBlockStatement (don't),
//      evalPrefix, evalInfix (integer arithmetic, comparisons, boolean ==/!= via
//      pointer identity on singletons TRUE_OBJ/FALSE_OBJ), evalIf (truthy:
//      not FALSE_OBJ, not NULL), applyFunction (new enclosed env rooted at
//      fn.Env, unwrap ReturnValue after body).
//
//   6. Run(source) — lex, parse, check parser errors, Eval, check for *Error.
//
// The test file calls Run directly and expects the contract described above.

type Object interface {
	Type() string
	Inspect() string
}

func Run(source string) (Object, error) {
	return nil, fmt.Errorf("not implemented")
}

func main() {}
`,
  testCode: `package main

import (
	"strings"
	"testing"
)

func mustInt(t *testing.T, obj Object, err error, want int64) {
	t.Helper()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	i, ok := obj.(*Integer)
	if !ok {
		t.Fatalf("expected *Integer, got %T (%v)", obj, obj)
	}
	if i.Value != want {
		t.Errorf("want %d, got %d", want, i.Value)
	}
}

func mustBool(t *testing.T, obj Object, err error, want bool) {
	t.Helper()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	b, ok := obj.(*Boolean)
	if !ok {
		t.Fatalf("expected *Boolean, got %T (%v)", obj, obj)
	}
	if b.Value != want {
		t.Errorf("want %t, got %t", want, b.Value)
	}
}

func TestRunIntegerArithmetic(t *testing.T) {
	cases := []struct {
		src  string
		want int64
	}{
		{"5", 5},
		{"-10", -10},
		{"2 + 3 * 4", 14},
		{"(2 + 3) * 4", 20},
		{"50 / 2 * 2 + 10", 60},
		{"-50 + 100 + -50", 0},
	}
	for _, c := range cases {
		obj, err := Run(c.src)
		mustInt(t, obj, err, c.want)
	}
}

func TestRunBooleanAndComparison(t *testing.T) {
	cases := []struct {
		src  string
		want bool
	}{
		{"true", true},
		{"false", false},
		{"!true", false},
		{"!!true", true},
		{"!5", false},
		{"1 < 2", true},
		{"1 > 2", false},
		{"1 == 1", true},
		{"1 != 2", true},
		{"true == true", true},
		{"true != false", true},
		{"(1 < 2) == true", true},
		{"(1 > 2) == false", true},
	}
	for _, c := range cases {
		obj, err := Run(c.src)
		mustBool(t, obj, err, c.want)
	}
}

func TestRunLetAndIdentifier(t *testing.T) {
	obj, err := Run("let a = 5; let b = a * 2; a + b")
	mustInt(t, obj, err, 15)
}

func TestRunIfExpression(t *testing.T) {
	obj, err := Run("if (1 < 2) { 10 } else { 20 }")
	mustInt(t, obj, err, 10)

	obj, err = Run("if (1 > 2) { 10 } else { 20 }")
	mustInt(t, obj, err, 20)
}

func TestRunReturnShortCircuit(t *testing.T) {
	// Nested blocks: inner return must escape all the way out.
	src := "if (10 > 1) { if (10 > 1) { return 10; } return 1; }"
	obj, err := Run(src)
	mustInt(t, obj, err, 10)
}

func TestRunFunctionAndCall(t *testing.T) {
	src := "let add = fn(a, b) { a + b }; add(2, 3)"
	obj, err := Run(src)
	mustInt(t, obj, err, 5)
}

func TestRunClosureCapturesEnv(t *testing.T) {
	src := "let newAdder = fn(x) { fn(y) { x + y } }; let addTwo = newAdder(2); addTwo(7)"
	obj, err := Run(src)
	mustInt(t, obj, err, 9)
}

func TestRunRecursiveFib(t *testing.T) {
	src := "let fib = fn(n) { if (n < 2) { n } else { fib(n - 1) + fib(n - 2) } }; fib(10)"
	obj, err := Run(src)
	mustInt(t, obj, err, 55)
}

func TestRunParserErrorReturnsError(t *testing.T) {
	_, err := Run("let = 5;")
	if err == nil {
		t.Fatal("expected parser error, got nil")
	}
}

func TestRunUnboundIdentifierIsError(t *testing.T) {
	_, err := Run("foobar")
	if err == nil {
		t.Fatal("expected evaluator error, got nil")
	}
	if !strings.Contains(err.Error(), "foobar") {
		t.Errorf("error should mention the missing name, got %q", err.Error())
	}
}

func TestRunTypeMismatchIsError(t *testing.T) {
	_, err := Run("5 + true")
	if err == nil {
		t.Fatal("expected type mismatch error, got nil")
	}
}
`,
  solution: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

// ─── Lexer ───────────────────────────────────────────
type TokenType string
type Token struct {
	Type    TokenType
	Literal string
}

const (
	ILLEGAL   TokenType = "ILLEGAL"
	EOF       TokenType = "EOF"
	IDENT     TokenType = "IDENT"
	INT       TokenType = "INT"
	ASSIGN    TokenType = "="
	PLUS      TokenType = "+"
	MINUS     TokenType = "-"
	BANG      TokenType = "!"
	ASTERISK  TokenType = "*"
	SLASH     TokenType = "/"
	LT        TokenType = "<"
	GT        TokenType = ">"
	EQ        TokenType = "=="
	NOT_EQ    TokenType = "!="
	COMMA     TokenType = ","
	SEMICOLON TokenType = ";"
	LPAREN    TokenType = "("
	RPAREN    TokenType = ")"
	LBRACE    TokenType = "{"
	RBRACE    TokenType = "}"
	FUNCTION  TokenType = "FUNCTION"
	LET       TokenType = "LET"
	TRUE      TokenType = "TRUE"
	FALSE     TokenType = "FALSE"
	IF        TokenType = "IF"
	ELSE      TokenType = "ELSE"
	RETURN    TokenType = "RETURN"
)

var keywords = map[string]TokenType{
	"fn":     FUNCTION,
	"let":    LET,
	"true":   TRUE,
	"false":  FALSE,
	"if":     IF,
	"else":   ELSE,
	"return": RETURN,
}

type Lexer struct {
	input   string
	pos     int
	readPos int
	ch      byte
}

func NewLexer(in string) *Lexer { l := &Lexer{input: in}; l.readChar(); return l }
func (l *Lexer) readChar() {
	if l.readPos >= len(l.input) {
		l.ch = 0
	} else {
		l.ch = l.input[l.readPos]
	}
	l.pos = l.readPos
	l.readPos++
}
func (l *Lexer) peekChar() byte {
	if l.readPos >= len(l.input) {
		return 0
	}
	return l.input[l.readPos]
}
func (l *Lexer) skipWS() {
	for l.ch == ' ' || l.ch == '\\t' || l.ch == '\\n' || l.ch == '\\r' {
		l.readChar()
	}
}
func isLetter(c byte) bool { return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c == '_' }
func isDigit(c byte) bool  { return c >= '0' && c <= '9' }
func (l *Lexer) readIdent() string {
	p := l.pos
	for isLetter(l.ch) {
		l.readChar()
	}
	return l.input[p:l.pos]
}
func (l *Lexer) readNum() string {
	p := l.pos
	for isDigit(l.ch) {
		l.readChar()
	}
	return l.input[p:l.pos]
}

func (l *Lexer) NextToken() Token {
	l.skipWS()
	var t Token
	switch l.ch {
	case '=':
		if l.peekChar() == '=' {
			l.readChar()
			t = Token{EQ, "=="}
		} else {
			t = Token{ASSIGN, "="}
		}
	case '!':
		if l.peekChar() == '=' {
			l.readChar()
			t = Token{NOT_EQ, "!="}
		} else {
			t = Token{BANG, "!"}
		}
	case '+':
		t = Token{PLUS, "+"}
	case '-':
		t = Token{MINUS, "-"}
	case '*':
		t = Token{ASTERISK, "*"}
	case '/':
		t = Token{SLASH, "/"}
	case '<':
		t = Token{LT, "<"}
	case '>':
		t = Token{GT, ">"}
	case ',':
		t = Token{COMMA, ","}
	case ';':
		t = Token{SEMICOLON, ";"}
	case '(':
		t = Token{LPAREN, "("}
	case ')':
		t = Token{RPAREN, ")"}
	case '{':
		t = Token{LBRACE, "{"}
	case '}':
		t = Token{RBRACE, "}"}
	case 0:
		t = Token{EOF, ""}
	default:
		if isLetter(l.ch) {
			lit := l.readIdent()
			tp := IDENT
			if k, ok := keywords[lit]; ok {
				tp = k
			}
			return Token{tp, lit}
		}
		if isDigit(l.ch) {
			return Token{INT, l.readNum()}
		}
		t = Token{ILLEGAL, string(l.ch)}
	}
	l.readChar()
	return t
}

// ─── AST ─────────────────────────────────────────────
type Node interface{ node() }
type Statement interface {
	Node
	statementNode()
}
type Expression interface {
	Node
	expressionNode()
}

type Program struct{ Statements []Statement }

func (*Program) node() {}

type LetStatement struct {
	Name  *Identifier
	Value Expression
}

func (*LetStatement) node()          {}
func (*LetStatement) statementNode() {}

type ReturnStatement struct{ ReturnValue Expression }

func (*ReturnStatement) node()          {}
func (*ReturnStatement) statementNode() {}

type ExpressionStatement struct{ Expression Expression }

func (*ExpressionStatement) node()          {}
func (*ExpressionStatement) statementNode() {}

type BlockStatement struct{ Statements []Statement }

func (*BlockStatement) node()          {}
func (*BlockStatement) statementNode() {}

type Identifier struct{ Value string }

func (*Identifier) node()           {}
func (*Identifier) expressionNode() {}

type IntegerLiteral struct{ Value int64 }

func (*IntegerLiteral) node()           {}
func (*IntegerLiteral) expressionNode() {}

type BooleanLiteral struct{ Value bool }

func (*BooleanLiteral) node()           {}
func (*BooleanLiteral) expressionNode() {}

type PrefixExpression struct {
	Operator string
	Right    Expression
}

func (*PrefixExpression) node()           {}
func (*PrefixExpression) expressionNode() {}

type InfixExpression struct {
	Left     Expression
	Operator string
	Right    Expression
}

func (*InfixExpression) node()           {}
func (*InfixExpression) expressionNode() {}

type IfExpression struct {
	Condition   Expression
	Consequence *BlockStatement
	Alternative *BlockStatement
}

func (*IfExpression) node()           {}
func (*IfExpression) expressionNode() {}

type FunctionLiteral struct {
	Parameters []*Identifier
	Body       *BlockStatement
}

func (*FunctionLiteral) node()           {}
func (*FunctionLiteral) expressionNode() {}

type CallExpression struct {
	Function  Expression
	Arguments []Expression
}

func (*CallExpression) node()           {}
func (*CallExpression) expressionNode() {}

// ─── Parser (Pratt) ──────────────────────────────────
const (
	_ int = iota
	LOWEST
	EQUALS
	LESSGREATER
	SUM
	PRODUCT
	PREFIX
	CALL
)

var precedences = map[TokenType]int{
	EQ:       EQUALS,
	NOT_EQ:   EQUALS,
	LT:       LESSGREATER,
	GT:       LESSGREATER,
	PLUS:     SUM,
	MINUS:    SUM,
	SLASH:    PRODUCT,
	ASTERISK: PRODUCT,
	LPAREN:   CALL,
}

type (
	prefixFn func() Expression
	infixFn  func(Expression) Expression
)

type Parser struct {
	l              *Lexer
	curToken       Token
	peekToken      Token
	errors         []string
	prefixParseFns map[TokenType]prefixFn
	infixParseFns  map[TokenType]infixFn
}

func NewParser(l *Lexer) *Parser {
	p := &Parser{l: l, errors: []string{}}
	p.prefixParseFns = map[TokenType]prefixFn{
		IDENT:    p.parseIdent,
		INT:      p.parseInt,
		TRUE:     p.parseBool,
		FALSE:    p.parseBool,
		BANG:     p.parsePrefix,
		MINUS:    p.parsePrefix,
		LPAREN:   p.parseGroup,
		IF:       p.parseIf,
		FUNCTION: p.parseFn,
	}
	p.infixParseFns = map[TokenType]infixFn{
		PLUS:     p.parseInfix,
		MINUS:    p.parseInfix,
		SLASH:    p.parseInfix,
		ASTERISK: p.parseInfix,
		EQ:       p.parseInfix,
		NOT_EQ:   p.parseInfix,
		LT:       p.parseInfix,
		GT:       p.parseInfix,
		LPAREN:   p.parseCall,
	}
	p.nextToken()
	p.nextToken()
	return p
}

func (p *Parser) Errors() []string             { return p.errors }
func (p *Parser) nextToken()                   { p.curToken = p.peekToken; p.peekToken = p.l.NextToken() }
func (p *Parser) curIs(t TokenType) bool       { return p.curToken.Type == t }
func (p *Parser) peekIs(t TokenType) bool      { return p.peekToken.Type == t }
func (p *Parser) peekPrec() int {
	if pr, ok := precedences[p.peekToken.Type]; ok {
		return pr
	}
	return LOWEST
}
func (p *Parser) curPrec() int {
	if pr, ok := precedences[p.curToken.Type]; ok {
		return pr
	}
	return LOWEST
}
func (p *Parser) expectPeek(t TokenType) bool {
	if p.peekIs(t) {
		p.nextToken()
		return true
	}
	p.errors = append(p.errors, fmt.Sprintf("expected next token to be %s, got %s instead", t, p.peekToken.Type))
	return false
}

func (p *Parser) ParseProgram() *Program {
	prog := &Program{}
	for !p.curIs(EOF) {
		if s := p.parseStmt(); s != nil {
			prog.Statements = append(prog.Statements, s)
		}
		p.nextToken()
	}
	return prog
}

func (p *Parser) parseStmt() Statement {
	switch p.curToken.Type {
	case LET:
		return p.parseLet()
	case RETURN:
		return p.parseRet()
	default:
		return p.parseExprStmt()
	}
}

func (p *Parser) parseLet() *LetStatement {
	s := &LetStatement{}
	if !p.expectPeek(IDENT) {
		return nil
	}
	s.Name = &Identifier{Value: p.curToken.Literal}
	if !p.expectPeek(ASSIGN) {
		return nil
	}
	p.nextToken()
	s.Value = p.parseExpr(LOWEST)
	if p.peekIs(SEMICOLON) {
		p.nextToken()
	}
	return s
}

func (p *Parser) parseRet() *ReturnStatement {
	s := &ReturnStatement{}
	p.nextToken()
	s.ReturnValue = p.parseExpr(LOWEST)
	if p.peekIs(SEMICOLON) {
		p.nextToken()
	}
	return s
}

func (p *Parser) parseExprStmt() *ExpressionStatement {
	s := &ExpressionStatement{Expression: p.parseExpr(LOWEST)}
	if p.peekIs(SEMICOLON) {
		p.nextToken()
	}
	return s
}

func (p *Parser) parseExpr(prec int) Expression {
	pfx := p.prefixParseFns[p.curToken.Type]
	if pfx == nil {
		p.errors = append(p.errors, fmt.Sprintf("no prefix parse function for %s", p.curToken.Type))
		return nil
	}
	left := pfx()
	for !p.peekIs(SEMICOLON) && prec < p.peekPrec() {
		ifx := p.infixParseFns[p.peekToken.Type]
		if ifx == nil {
			return left
		}
		p.nextToken()
		left = ifx(left)
	}
	return left
}

func (p *Parser) parseIdent() Expression { return &Identifier{Value: p.curToken.Literal} }
func (p *Parser) parseInt() Expression {
	v, err := strconv.ParseInt(p.curToken.Literal, 0, 64)
	if err != nil {
		p.errors = append(p.errors, fmt.Sprintf("could not parse %q as integer", p.curToken.Literal))
		return nil
	}
	return &IntegerLiteral{Value: v}
}
func (p *Parser) parseBool() Expression { return &BooleanLiteral{Value: p.curIs(TRUE)} }
func (p *Parser) parsePrefix() Expression {
	e := &PrefixExpression{Operator: p.curToken.Literal}
	p.nextToken()
	e.Right = p.parseExpr(PREFIX)
	return e
}
func (p *Parser) parseInfix(left Expression) Expression {
	e := &InfixExpression{Left: left, Operator: p.curToken.Literal}
	pr := p.curPrec()
	p.nextToken()
	e.Right = p.parseExpr(pr)
	return e
}
func (p *Parser) parseGroup() Expression {
	p.nextToken()
	exp := p.parseExpr(LOWEST)
	if !p.expectPeek(RPAREN) {
		return nil
	}
	return exp
}
func (p *Parser) parseIf() Expression {
	e := &IfExpression{}
	if !p.expectPeek(LPAREN) {
		return nil
	}
	p.nextToken()
	e.Condition = p.parseExpr(LOWEST)
	if !p.expectPeek(RPAREN) {
		return nil
	}
	if !p.expectPeek(LBRACE) {
		return nil
	}
	e.Consequence = p.parseBlock()
	if p.peekIs(ELSE) {
		p.nextToken()
		if !p.expectPeek(LBRACE) {
			return nil
		}
		e.Alternative = p.parseBlock()
	}
	return e
}
func (p *Parser) parseBlock() *BlockStatement {
	b := &BlockStatement{}
	p.nextToken()
	for !p.curIs(RBRACE) && !p.curIs(EOF) {
		if s := p.parseStmt(); s != nil {
			b.Statements = append(b.Statements, s)
		}
		p.nextToken()
	}
	return b
}
func (p *Parser) parseFn() Expression {
	fl := &FunctionLiteral{}
	if !p.expectPeek(LPAREN) {
		return nil
	}
	fl.Parameters = p.parseParams()
	if !p.expectPeek(LBRACE) {
		return nil
	}
	fl.Body = p.parseBlock()
	return fl
}
func (p *Parser) parseParams() []*Identifier {
	ids := []*Identifier{}
	if p.peekIs(RPAREN) {
		p.nextToken()
		return ids
	}
	p.nextToken()
	ids = append(ids, &Identifier{Value: p.curToken.Literal})
	for p.peekIs(COMMA) {
		p.nextToken()
		p.nextToken()
		ids = append(ids, &Identifier{Value: p.curToken.Literal})
	}
	if !p.expectPeek(RPAREN) {
		return nil
	}
	return ids
}
func (p *Parser) parseCall(fn Expression) Expression {
	return &CallExpression{Function: fn, Arguments: p.parseCallArgs()}
}
func (p *Parser) parseCallArgs() []Expression {
	args := []Expression{}
	if p.peekIs(RPAREN) {
		p.nextToken()
		return args
	}
	p.nextToken()
	args = append(args, p.parseExpr(LOWEST))
	for p.peekIs(COMMA) {
		p.nextToken()
		p.nextToken()
		args = append(args, p.parseExpr(LOWEST))
	}
	if !p.expectPeek(RPAREN) {
		return nil
	}
	return args
}

// ─── Objects ─────────────────────────────────────────
type Object interface {
	Type() string
	Inspect() string
}

const (
	INTEGER_OBJ      = "INTEGER"
	BOOLEAN_OBJ      = "BOOLEAN"
	NULL_OBJ         = "NULL"
	ERROR_OBJ        = "ERROR"
	RETURN_VALUE_OBJ = "RETURN_VALUE"
	FUNCTION_OBJ     = "FUNCTION"
)

type Integer struct{ Value int64 }

func (*Integer) Type() string      { return INTEGER_OBJ }
func (i *Integer) Inspect() string { return fmt.Sprintf("%d", i.Value) }

type Boolean struct{ Value bool }

func (*Boolean) Type() string      { return BOOLEAN_OBJ }
func (b *Boolean) Inspect() string { return fmt.Sprintf("%t", b.Value) }

type Null struct{}

func (*Null) Type() string    { return NULL_OBJ }
func (*Null) Inspect() string { return "null" }

type ErrorObj struct{ Message string }

func (*ErrorObj) Type() string      { return ERROR_OBJ }
func (e *ErrorObj) Inspect() string { return "ERROR: " + e.Message }

type ReturnValue struct{ Value Object }

func (*ReturnValue) Type() string      { return RETURN_VALUE_OBJ }
func (r *ReturnValue) Inspect() string { return r.Value.Inspect() }

type Function struct {
	Parameters []*Identifier
	Body       *BlockStatement
	Env        *Environment
}

func (*Function) Type() string     { return FUNCTION_OBJ }
func (*Function) Inspect() string  { return "fn(...) { ... }" }

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

// ─── Evaluator ───────────────────────────────────────
var (
	TRUE_OBJ  = &Boolean{Value: true}
	FALSE_OBJ = &Boolean{Value: false}
	NULL      = &Null{}
)

func newError(f string, a ...interface{}) *ErrorObj { return &ErrorObj{Message: fmt.Sprintf(f, a...)} }
func isError(o Object) bool                          { return o != nil && o.Type() == ERROR_OBJ }
func nativeBool(b bool) *Boolean {
	if b {
		return TRUE_OBJ
	}
	return FALSE_OBJ
}

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
	case *BooleanLiteral:
		return nativeBool(n.Value)
	case *Identifier:
		if v, ok := env.Get(n.Value); ok {
			return v
		}
		return newError("identifier not found: %s", n.Value)
	case *PrefixExpression:
		r := Eval(n.Right, env)
		if isError(r) {
			return r
		}
		return evalPrefix(n.Operator, r)
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
	case *IfExpression:
		return evalIf(n, env)
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
		fn := Eval(n.Function, env)
		if isError(fn) {
			return fn
		}
		args := make([]Object, 0, len(n.Arguments))
		for _, a := range n.Arguments {
			av := Eval(a, env)
			if isError(av) {
				return av
			}
			args = append(args, av)
		}
		return applyFunction(fn, args)
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
		case *ErrorObj:
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

func evalPrefix(op string, right Object) Object {
	switch op {
	case "!":
		switch right {
		case TRUE_OBJ:
			return FALSE_OBJ
		case FALSE_OBJ:
			return TRUE_OBJ
		case NULL:
			return TRUE_OBJ
		default:
			return FALSE_OBJ
		}
	case "-":
		if right.Type() != INTEGER_OBJ {
			return newError("unknown operator: -%s", right.Type())
		}
		return &Integer{Value: -right.(*Integer).Value}
	}
	return newError("unknown operator: %s%s", op, right.Type())
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
		case "<":
			return nativeBool(lv < rv)
		case ">":
			return nativeBool(lv > rv)
		case "==":
			return nativeBool(lv == rv)
		case "!=":
			return nativeBool(lv != rv)
		}
		return newError("unknown operator: %s %s %s", l.Type(), op, r.Type())
	}
	if op == "==" {
		return nativeBool(l == r)
	}
	if op == "!=" {
		return nativeBool(l != r)
	}
	if l.Type() != r.Type() {
		return newError("type mismatch: %s %s %s", l.Type(), op, r.Type())
	}
	return newError("unknown operator: %s %s %s", l.Type(), op, r.Type())
}

func isTruthy(o Object) bool {
	switch o {
	case NULL, FALSE_OBJ:
		return false
	default:
		return true
	}
}

func evalIf(ie *IfExpression, env *Environment) Object {
	cond := Eval(ie.Condition, env)
	if isError(cond) {
		return cond
	}
	if isTruthy(cond) {
		return Eval(ie.Consequence, env)
	} else if ie.Alternative != nil {
		return Eval(ie.Alternative, env)
	}
	return NULL
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

// ─── Public entry point ─────────────────────────────
func Run(source string) (Object, error) {
	l := NewLexer(source)
	p := NewParser(l)
	prog := p.ParseProgram()
	if errs := p.Errors(); len(errs) > 0 {
		return nil, fmt.Errorf("parser errors: %s", strings.Join(errs, "; "))
	}
	result := Eval(prog, NewEnvironment())
	if err, ok := result.(*ErrorObj); ok {
		return nil, fmt.Errorf("%s", err.Message)
	}
	return result, nil
}

func main() {}
`,
  hints: [
    'Run is a thin wrapper: NewLexer → NewParser → ParseProgram → check Errors (return error) → Eval(prog, NewEnvironment()) → if result is *ErrorObj return error, else return (result, nil).',
    'The two block-evaluation modes are load-bearing. evalProgram unwraps *ReturnValue so the final value is naked; evalBlockStatement keeps it wrapped so an inner return escapes all the way to applyFunction, which is the one place that unwraps at the call boundary.',
    'For closures, capture env at FunctionLiteral eval time (store it on *Function). At call time build NewEnclosedEnvironment(fn.Env) — NOT from the caller\'s env. That one choice is what makes newAdder(2) return a function that still sees x=2.',
  ],
}

export default exercise
