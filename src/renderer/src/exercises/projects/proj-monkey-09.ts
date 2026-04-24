import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-09',
  title: 'Parser — Infix Expressions (Arithmetic)',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 109,
  projectId: 'proj-monkey',
  step: 9,
  totalSteps: 22,
  description: `Add infix arithmetic to the Pratt parser: \`3 + 4\`, \`x - y\`, \`2 * 3\`, \`10 / 5\`.

So far \`parseExpression\` only calls a prefix parse function and returns. You will now extend it with the **precedence-climbing loop** that consumes infix operators whose precedence is strictly greater than the caller's.

**Tasks:**
- Fill in the \`precedences\` map so \`PLUS\`/\`MINUS\` return \`SUM\` and \`ASTERISK\`/\`SLASH\` return \`PRODUCT\`.
- Implement \`parseInfixExpression(left Expression) Expression\` that builds an \`*InfixExpression\` whose right side is parsed at the operator's own precedence (left-associative).
- Register it in \`infixParseFns\` for the four arithmetic operators.
- Extend \`parseExpression\` with the standard Pratt loop: while the peek precedence beats \`prec\`, advance and fold with the infix fn.

Associativity check: \`1 - 2 - 3\` must stringify to \`((1 - 2) - 3)\`, and \`1 + 2 * 3\` to \`(1 + (2 * 3))\`.`,
  code: `package main

import (
	"fmt"
	"strconv"
)

// --- Tokens & Lexer ---
type TokenType string
type Token struct {
	Type    TokenType
	Literal string
}

const (
	INT       TokenType = "INT"
	IDENT     TokenType = "IDENT"
	PLUS      TokenType = "PLUS"
	MINUS     TokenType = "MINUS"
	ASTERISK  TokenType = "ASTERISK"
	SLASH     TokenType = "SLASH"
	BANG      TokenType = "BANG"
	SEMICOLON TokenType = "SEMICOLON"
	EOF       TokenType = "EOF"
	ILLEGAL   TokenType = "ILLEGAL"
)

type Lexer struct {
	input   string
	pos     int
	readPos int
	ch      byte
}

func NewLexer(input string) *Lexer { l := &Lexer{input: input}; l.readChar(); return l }
func (l *Lexer) readChar() {
	if l.readPos >= len(l.input) {
		l.ch = 0
	} else {
		l.ch = l.input[l.readPos]
	}
	l.pos = l.readPos
	l.readPos++
}
func (l *Lexer) skipWhitespace() {
	for l.ch == ' ' || l.ch == '\\t' || l.ch == '\\n' || l.ch == '\\r' {
		l.readChar()
	}
}
func (l *Lexer) readNumber() string {
	s := l.pos
	for l.ch >= '0' && l.ch <= '9' {
		l.readChar()
	}
	return l.input[s:l.pos]
}
func isLetter(ch byte) bool {
	return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch == '_'
}
func (l *Lexer) readIdentifier() string {
	s := l.pos
	for isLetter(l.ch) {
		l.readChar()
	}
	return l.input[s:l.pos]
}
func (l *Lexer) NextToken() Token {
	var tok Token
	l.skipWhitespace()
	switch l.ch {
	case '+':
		tok = Token{PLUS, "+"}
	case '-':
		tok = Token{MINUS, "-"}
	case '*':
		tok = Token{ASTERISK, "*"}
	case '/':
		tok = Token{SLASH, "/"}
	case '!':
		tok = Token{BANG, "!"}
	case ';':
		tok = Token{SEMICOLON, ";"}
	case 0:
		return Token{EOF, ""}
	default:
		if l.ch >= '0' && l.ch <= '9' {
			return Token{INT, l.readNumber()}
		}
		if isLetter(l.ch) {
			return Token{IDENT, l.readIdentifier()}
		}
		tok = Token{ILLEGAL, string(l.ch)}
	}
	l.readChar()
	return tok
}

// --- AST ---
type Node interface {
	TokenLiteral() string
	String() string
}
type Expression interface {
	Node
	expressionNode()
}
type Statement interface {
	Node
	statementNode()
}
type Program struct{ Statements []Statement }

func (p *Program) TokenLiteral() string {
	if len(p.Statements) > 0 {
		return p.Statements[0].TokenLiteral()
	}
	return ""
}
func (p *Program) String() string {
	s := ""
	for _, st := range p.Statements {
		s += st.String()
	}
	return s
}

type Identifier struct {
	Token Token
	Value string
}

func (i *Identifier) expressionNode()      {}
func (i *Identifier) TokenLiteral() string { return i.Token.Literal }
func (i *Identifier) String() string       { return i.Value }

type IntegerLiteral struct {
	Token Token
	Value int64
}

func (il *IntegerLiteral) expressionNode()      {}
func (il *IntegerLiteral) TokenLiteral() string { return il.Token.Literal }
func (il *IntegerLiteral) String() string       { return il.Token.Literal }

type PrefixExpression struct {
	Token    Token
	Operator string
	Right    Expression
}

func (pe *PrefixExpression) expressionNode()      {}
func (pe *PrefixExpression) TokenLiteral() string { return pe.Token.Literal }
func (pe *PrefixExpression) String() string {
	return fmt.Sprintf("(%s%s)", pe.Operator, pe.Right.String())
}

type InfixExpression struct {
	Token    Token
	Left     Expression
	Operator string
	Right    Expression
}

func (ie *InfixExpression) expressionNode()      {}
func (ie *InfixExpression) TokenLiteral() string { return ie.Token.Literal }
func (ie *InfixExpression) String() string {
	return fmt.Sprintf("(%s %s %s)", ie.Left.String(), ie.Operator, ie.Right.String())
}

type ExpressionStatement struct {
	Token      Token
	Expression Expression
}

func (es *ExpressionStatement) statementNode()       {}
func (es *ExpressionStatement) TokenLiteral() string { return es.Token.Literal }
func (es *ExpressionStatement) String() string {
	if es.Expression != nil {
		return es.Expression.String()
	}
	return ""
}

// --- Precedence levels ---
const (
	LOWEST  = 1
	SUM     = 4 // + -
	PRODUCT = 5 // * /
	PREFIX  = 6 // -x, !x
)

// TODO: fill in entries for PLUS, MINUS, ASTERISK, SLASH
var precedences = map[TokenType]int{}

// --- Parser ---
type (
	prefixParseFn func() Expression
	infixParseFn  func(Expression) Expression
)

type Parser struct {
	l              *Lexer
	curToken       Token
	peekToken      Token
	errors         []string
	prefixParseFns map[TokenType]prefixParseFn
	infixParseFns  map[TokenType]infixParseFn
}

func NewParser(l *Lexer) *Parser {
	p := &Parser{l: l, errors: []string{}}
	p.prefixParseFns = map[TokenType]prefixParseFn{
		IDENT: p.parseIdentifier,
		INT:   p.parseIntegerLiteral,
		BANG:  p.parsePrefixExpression,
		MINUS: p.parsePrefixExpression,
	}
	// TODO: populate infixParseFns for PLUS, MINUS, ASTERISK, SLASH
	p.infixParseFns = map[TokenType]infixParseFn{}
	p.nextToken()
	p.nextToken()
	return p
}

func (p *Parser) nextToken()                   { p.curToken = p.peekToken; p.peekToken = p.l.NextToken() }
func (p *Parser) curTokenIs(t TokenType) bool  { return p.curToken.Type == t }
func (p *Parser) peekTokenIs(t TokenType) bool { return p.peekToken.Type == t }
func (p *Parser) Errors() []string             { return p.errors }

func (p *Parser) peekPrecedence() int {
	if pr, ok := precedences[p.peekToken.Type]; ok {
		return pr
	}
	return LOWEST
}
func (p *Parser) curPrecedence() int {
	if pr, ok := precedences[p.curToken.Type]; ok {
		return pr
	}
	return LOWEST
}

// TODO: extend parseExpression with the Pratt precedence loop.
// After computing leftExp from the prefix fn, while the next token is not
// SEMICOLON and prec < peekPrecedence(), look up the infix fn for peekToken,
// advance, and set leftExp = infix(leftExp).
func (p *Parser) parseExpression(prec int) Expression {
	prefix := p.prefixParseFns[p.curToken.Type]
	if prefix == nil {
		p.errors = append(p.errors, fmt.Sprintf("no prefix parse function for %s", p.curToken.Type))
		return nil
	}
	leftExp := prefix()
	return leftExp
}

func (p *Parser) parseIdentifier() Expression {
	return &Identifier{Token: p.curToken, Value: p.curToken.Literal}
}
func (p *Parser) parseIntegerLiteral() Expression {
	val, err := strconv.ParseInt(p.curToken.Literal, 0, 64)
	if err != nil {
		p.errors = append(p.errors, fmt.Sprintf("could not parse %q as integer", p.curToken.Literal))
		return nil
	}
	return &IntegerLiteral{Token: p.curToken, Value: val}
}
func (p *Parser) parsePrefixExpression() Expression {
	exp := &PrefixExpression{Token: p.curToken, Operator: p.curToken.Literal}
	p.nextToken()
	exp.Right = p.parseExpression(PREFIX)
	return exp
}

// TODO: implement parseInfixExpression.
// Build an *InfixExpression from p.curToken (the operator) and the given left.
// Capture curPrecedence(), advance nextToken, then exp.Right = parseExpression(prec).
// Return exp.

func (p *Parser) parseExpressionStatement() *ExpressionStatement {
	stmt := &ExpressionStatement{Token: p.curToken}
	stmt.Expression = p.parseExpression(LOWEST)
	if p.peekTokenIs(SEMICOLON) {
		p.nextToken()
	}
	return stmt
}

func (p *Parser) ParseProgram() *Program {
	prog := &Program{}
	for !p.curTokenIs(EOF) {
		stmt := p.parseExpressionStatement()
		if stmt != nil {
			prog.Statements = append(prog.Statements, stmt)
		}
		p.nextToken()
	}
	return prog
}

func main() {}
`,
  testCode: `package main

import "testing"

func checkErrors(t *testing.T, p *Parser) {
	t.Helper()
	if len(p.Errors()) > 0 {
		t.Fatalf("parser errors: %v", p.Errors())
	}
}

func TestInfixAddition(t *testing.T) {
	p := NewParser(NewLexer("3 + 4"))
	prog := p.ParseProgram()
	checkErrors(t, p)
	if prog.String() != "(3 + 4)" {
		t.Fatalf("want (3 + 4), got %q", prog.String())
	}
}

func TestInfixAllArithmetic(t *testing.T) {
	cases := []struct {
		in, want string
	}{
		{"1 + 2", "(1 + 2)"},
		{"5 - 2", "(5 - 2)"},
		{"3 * 4", "(3 * 4)"},
		{"10 / 2", "(10 / 2)"},
	}
	for _, c := range cases {
		p := NewParser(NewLexer(c.in))
		prog := p.ParseProgram()
		checkErrors(t, p)
		if prog.String() != c.want {
			t.Errorf("%s: want %s, got %s", c.in, c.want, prog.String())
		}
	}
}

func TestInfixPrecedence(t *testing.T) {
	p := NewParser(NewLexer("1 + 2 * 3"))
	prog := p.ParseProgram()
	checkErrors(t, p)
	if prog.String() != "(1 + (2 * 3))" {
		t.Fatalf("want (1 + (2 * 3)), got %q", prog.String())
	}
}

func TestInfixLeftAssociative(t *testing.T) {
	p := NewParser(NewLexer("1 - 2 - 3"))
	prog := p.ParseProgram()
	checkErrors(t, p)
	if prog.String() != "((1 - 2) - 3)" {
		t.Fatalf("want ((1 - 2) - 3), got %q", prog.String())
	}
}

func TestInfixStructure(t *testing.T) {
	p := NewParser(NewLexer("2 * 3"))
	prog := p.ParseProgram()
	checkErrors(t, p)
	es := prog.Statements[0].(*ExpressionStatement)
	ie, ok := es.Expression.(*InfixExpression)
	if !ok {
		t.Fatalf("expected *InfixExpression, got %T", es.Expression)
	}
	if ie.Operator != "*" {
		t.Errorf("operator: want *, got %s", ie.Operator)
	}
	if ie.Left.(*IntegerLiteral).Value != 2 {
		t.Errorf("left: want 2, got %d", ie.Left.(*IntegerLiteral).Value)
	}
	if ie.Right.(*IntegerLiteral).Value != 3 {
		t.Errorf("right: want 3, got %d", ie.Right.(*IntegerLiteral).Value)
	}
}

func TestInfixWithPrefix(t *testing.T) {
	p := NewParser(NewLexer("-1 + 2"))
	prog := p.ParseProgram()
	checkErrors(t, p)
	if prog.String() != "((-1) + 2)" {
		t.Fatalf("want ((-1) + 2), got %q", prog.String())
	}
}
`,
  solution: `package main

import (
	"fmt"
	"strconv"
)

type TokenType string
type Token struct {
	Type    TokenType
	Literal string
}

const (
	INT       TokenType = "INT"
	IDENT     TokenType = "IDENT"
	PLUS      TokenType = "PLUS"
	MINUS     TokenType = "MINUS"
	ASTERISK  TokenType = "ASTERISK"
	SLASH     TokenType = "SLASH"
	BANG      TokenType = "BANG"
	SEMICOLON TokenType = "SEMICOLON"
	EOF       TokenType = "EOF"
	ILLEGAL   TokenType = "ILLEGAL"
)

type Lexer struct {
	input   string
	pos     int
	readPos int
	ch      byte
}

func NewLexer(input string) *Lexer { l := &Lexer{input: input}; l.readChar(); return l }
func (l *Lexer) readChar() {
	if l.readPos >= len(l.input) {
		l.ch = 0
	} else {
		l.ch = l.input[l.readPos]
	}
	l.pos = l.readPos
	l.readPos++
}
func (l *Lexer) skipWhitespace() {
	for l.ch == ' ' || l.ch == '\\t' || l.ch == '\\n' || l.ch == '\\r' {
		l.readChar()
	}
}
func (l *Lexer) readNumber() string {
	s := l.pos
	for l.ch >= '0' && l.ch <= '9' {
		l.readChar()
	}
	return l.input[s:l.pos]
}
func isLetter(ch byte) bool {
	return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch == '_'
}
func (l *Lexer) readIdentifier() string {
	s := l.pos
	for isLetter(l.ch) {
		l.readChar()
	}
	return l.input[s:l.pos]
}
func (l *Lexer) NextToken() Token {
	var tok Token
	l.skipWhitespace()
	switch l.ch {
	case '+':
		tok = Token{PLUS, "+"}
	case '-':
		tok = Token{MINUS, "-"}
	case '*':
		tok = Token{ASTERISK, "*"}
	case '/':
		tok = Token{SLASH, "/"}
	case '!':
		tok = Token{BANG, "!"}
	case ';':
		tok = Token{SEMICOLON, ";"}
	case 0:
		return Token{EOF, ""}
	default:
		if l.ch >= '0' && l.ch <= '9' {
			return Token{INT, l.readNumber()}
		}
		if isLetter(l.ch) {
			return Token{IDENT, l.readIdentifier()}
		}
		tok = Token{ILLEGAL, string(l.ch)}
	}
	l.readChar()
	return tok
}

type Node interface {
	TokenLiteral() string
	String() string
}
type Expression interface {
	Node
	expressionNode()
}
type Statement interface {
	Node
	statementNode()
}
type Program struct{ Statements []Statement }

func (p *Program) TokenLiteral() string {
	if len(p.Statements) > 0 {
		return p.Statements[0].TokenLiteral()
	}
	return ""
}
func (p *Program) String() string {
	s := ""
	for _, st := range p.Statements {
		s += st.String()
	}
	return s
}

type Identifier struct {
	Token Token
	Value string
}

func (i *Identifier) expressionNode()      {}
func (i *Identifier) TokenLiteral() string { return i.Token.Literal }
func (i *Identifier) String() string       { return i.Value }

type IntegerLiteral struct {
	Token Token
	Value int64
}

func (il *IntegerLiteral) expressionNode()      {}
func (il *IntegerLiteral) TokenLiteral() string { return il.Token.Literal }
func (il *IntegerLiteral) String() string       { return il.Token.Literal }

type PrefixExpression struct {
	Token    Token
	Operator string
	Right    Expression
}

func (pe *PrefixExpression) expressionNode()      {}
func (pe *PrefixExpression) TokenLiteral() string { return pe.Token.Literal }
func (pe *PrefixExpression) String() string {
	return fmt.Sprintf("(%s%s)", pe.Operator, pe.Right.String())
}

type InfixExpression struct {
	Token    Token
	Left     Expression
	Operator string
	Right    Expression
}

func (ie *InfixExpression) expressionNode()      {}
func (ie *InfixExpression) TokenLiteral() string { return ie.Token.Literal }
func (ie *InfixExpression) String() string {
	return fmt.Sprintf("(%s %s %s)", ie.Left.String(), ie.Operator, ie.Right.String())
}

type ExpressionStatement struct {
	Token      Token
	Expression Expression
}

func (es *ExpressionStatement) statementNode()       {}
func (es *ExpressionStatement) TokenLiteral() string { return es.Token.Literal }
func (es *ExpressionStatement) String() string {
	if es.Expression != nil {
		return es.Expression.String()
	}
	return ""
}

const (
	LOWEST  = 1
	SUM     = 4
	PRODUCT = 5
	PREFIX  = 6
)

var precedences = map[TokenType]int{
	PLUS:     SUM,
	MINUS:    SUM,
	ASTERISK: PRODUCT,
	SLASH:    PRODUCT,
}

type (
	prefixParseFn func() Expression
	infixParseFn  func(Expression) Expression
)

type Parser struct {
	l              *Lexer
	curToken       Token
	peekToken      Token
	errors         []string
	prefixParseFns map[TokenType]prefixParseFn
	infixParseFns  map[TokenType]infixParseFn
}

func NewParser(l *Lexer) *Parser {
	p := &Parser{l: l, errors: []string{}}
	p.prefixParseFns = map[TokenType]prefixParseFn{
		IDENT: p.parseIdentifier,
		INT:   p.parseIntegerLiteral,
		BANG:  p.parsePrefixExpression,
		MINUS: p.parsePrefixExpression,
	}
	p.infixParseFns = map[TokenType]infixParseFn{
		PLUS:     p.parseInfixExpression,
		MINUS:    p.parseInfixExpression,
		ASTERISK: p.parseInfixExpression,
		SLASH:    p.parseInfixExpression,
	}
	p.nextToken()
	p.nextToken()
	return p
}

func (p *Parser) nextToken()                   { p.curToken = p.peekToken; p.peekToken = p.l.NextToken() }
func (p *Parser) curTokenIs(t TokenType) bool  { return p.curToken.Type == t }
func (p *Parser) peekTokenIs(t TokenType) bool { return p.peekToken.Type == t }
func (p *Parser) Errors() []string             { return p.errors }

func (p *Parser) peekPrecedence() int {
	if pr, ok := precedences[p.peekToken.Type]; ok {
		return pr
	}
	return LOWEST
}
func (p *Parser) curPrecedence() int {
	if pr, ok := precedences[p.curToken.Type]; ok {
		return pr
	}
	return LOWEST
}

func (p *Parser) parseExpression(prec int) Expression {
	prefix := p.prefixParseFns[p.curToken.Type]
	if prefix == nil {
		p.errors = append(p.errors, fmt.Sprintf("no prefix parse function for %s", p.curToken.Type))
		return nil
	}
	leftExp := prefix()
	for !p.peekTokenIs(SEMICOLON) && prec < p.peekPrecedence() {
		infix := p.infixParseFns[p.peekToken.Type]
		if infix == nil {
			return leftExp
		}
		p.nextToken()
		leftExp = infix(leftExp)
	}
	return leftExp
}

func (p *Parser) parseIdentifier() Expression {
	return &Identifier{Token: p.curToken, Value: p.curToken.Literal}
}
func (p *Parser) parseIntegerLiteral() Expression {
	val, err := strconv.ParseInt(p.curToken.Literal, 0, 64)
	if err != nil {
		p.errors = append(p.errors, fmt.Sprintf("could not parse %q as integer", p.curToken.Literal))
		return nil
	}
	return &IntegerLiteral{Token: p.curToken, Value: val}
}
func (p *Parser) parsePrefixExpression() Expression {
	exp := &PrefixExpression{Token: p.curToken, Operator: p.curToken.Literal}
	p.nextToken()
	exp.Right = p.parseExpression(PREFIX)
	return exp
}

func (p *Parser) parseInfixExpression(left Expression) Expression {
	exp := &InfixExpression{Token: p.curToken, Operator: p.curToken.Literal, Left: left}
	prec := p.curPrecedence()
	p.nextToken()
	exp.Right = p.parseExpression(prec)
	return exp
}

func (p *Parser) parseExpressionStatement() *ExpressionStatement {
	stmt := &ExpressionStatement{Token: p.curToken}
	stmt.Expression = p.parseExpression(LOWEST)
	if p.peekTokenIs(SEMICOLON) {
		p.nextToken()
	}
	return stmt
}

func (p *Parser) ParseProgram() *Program {
	prog := &Program{}
	for !p.curTokenIs(EOF) {
		stmt := p.parseExpressionStatement()
		if stmt != nil {
			prog.Statements = append(prog.Statements, stmt)
		}
		p.nextToken()
	}
	return prog
}

func main() {}
`,
  hints: [
    'parseInfixExpression captures the current operator token, records curPrecedence, advances, then parses the right side at that same precedence — this gives left-associativity.',
    'The Pratt loop in parseExpression keeps folding while prec < peekPrecedence(). Strict "<" is the key: equal precedences do NOT recurse on the right, which is exactly what makes 1-2-3 bind left.',
    'Fill both the precedences map AND the infixParseFns map. If either is missing, peekPrecedence returns LOWEST and the loop never runs.',
  ],
}

export default exercise
