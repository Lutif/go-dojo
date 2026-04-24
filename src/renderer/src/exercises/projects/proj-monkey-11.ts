import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-11',
  title: 'Parser — Grouped Expressions',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 111,
  projectId: 'proj-monkey',
  step: 11,
  totalSteps: 22,
  description: `Pratt parsing gives us precedence almost for free — but we still need a way to **override** the default precedence. That's what parentheses are for: \`(2 + 3) * 4\` should multiply the *sum*, not just \`3 * 4\`.

The trick is elegant: when we see an \`LPAREN\` in **prefix** position (i.e., at the start of an expression), we don't build a special AST node. We just recursively parse an expression at \`LOWEST\` precedence, then consume the matching \`RPAREN\`. The returned sub-expression naturally has its own nesting, and because the outer parser's precedence loop resumes *after* the \`RPAREN\`, the grouped expression becomes an atomic unit.

**Tasks:**
- Teach the lexer to emit \`LPAREN\` (\`(\`) and \`RPAREN\` (\`)\`).
- Register a prefix parse function for \`LPAREN\` — call it \`parseGroupedExpression\`.
- Implement \`expectPeek(RPAREN)\`: advances if the peek token matches, records an error otherwise.
- \`parseGroupedExpression\` advances past the \`(\`, parses an expression at \`LOWEST\`, then calls \`expectPeek(RPAREN)\`.

Expected shapes:
- \`(2 + 3) * 4\` → \`((2 + 3) * 4)\`
- \`2 * (3 + 4)\` → \`(2 * (3 + 4))\`
- \`-(5 + 5)\` → \`(-(5 + 5))\`
- \`((1 + 2))\` → \`(1 + 2)\` (nested parens collapse — no special AST node)
- \`(1 + 2\` → parser error (unterminated group).`,
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
	ASSIGN    TokenType = "ASSIGN"
	LT        TokenType = "LT"
	GT        TokenType = "GT"
	EQ        TokenType = "EQ"
	NOT_EQ    TokenType = "NOT_EQ"
	LPAREN    TokenType = "LPAREN"
	RPAREN    TokenType = "RPAREN"
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
func (l *Lexer) peekChar() byte {
	if l.readPos >= len(l.input) {
		return 0
	}
	return l.input[l.readPos]
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

// TODO: add '(' → LPAREN and ')' → RPAREN cases.
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
	case '<':
		tok = Token{LT, "<"}
	case '>':
		tok = Token{GT, ">"}
	case '!':
		if l.peekChar() == '=' {
			l.readChar()
			tok = Token{NOT_EQ, "!="}
		} else {
			tok = Token{BANG, "!"}
		}
	case '=':
		if l.peekChar() == '=' {
			l.readChar()
			tok = Token{EQ, "=="}
		} else {
			tok = Token{ASSIGN, "="}
		}
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

// --- Precedence ---
const (
	LOWEST      = 1
	EQUALS      = 2
	LESSGREATER = 3
	SUM         = 4
	PRODUCT     = 5
	PREFIX      = 6
)

var precedences = map[TokenType]int{
	EQ:       EQUALS,
	NOT_EQ:   EQUALS,
	LT:       LESSGREATER,
	GT:       LESSGREATER,
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
		// TODO: register LPAREN → p.parseGroupedExpression
	}
	p.infixParseFns = map[TokenType]infixParseFn{
		PLUS:     p.parseInfixExpression,
		MINUS:    p.parseInfixExpression,
		ASTERISK: p.parseInfixExpression,
		SLASH:    p.parseInfixExpression,
		LT:       p.parseInfixExpression,
		GT:       p.parseInfixExpression,
		EQ:       p.parseInfixExpression,
		NOT_EQ:   p.parseInfixExpression,
	}
	p.nextToken()
	p.nextToken()
	return p
}

func (p *Parser) nextToken()                   { p.curToken = p.peekToken; p.peekToken = p.l.NextToken() }
func (p *Parser) curTokenIs(t TokenType) bool  { return p.curToken.Type == t }
func (p *Parser) peekTokenIs(t TokenType) bool { return p.peekToken.Type == t }
func (p *Parser) Errors() []string             { return p.errors }

// TODO: implement expectPeek — if peekToken is t, advance and return true;
// otherwise append an error like "expected X, got Y" and return false.
func (p *Parser) expectPeek(t TokenType) bool {
	return false
}

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

// TODO: implement parseGroupedExpression.
// Advance past '(' with nextToken, then parse an expression at LOWEST precedence,
// then require RPAREN via expectPeek. Return the inner expression directly —
// no new AST node is needed; the nesting handles precedence on its own.
func (p *Parser) parseGroupedExpression() Expression {
	return nil
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
  testCode: `package main

import "testing"

func checkNoErrors(t *testing.T, p *Parser) {
	t.Helper()
	if len(p.Errors()) > 0 {
		t.Fatalf("parser errors: %v", p.Errors())
	}
}

func TestLexerParens(t *testing.T) {
	l := NewLexer("( )")
	if tk := l.NextToken(); tk.Type != LPAREN {
		t.Fatalf("want LPAREN, got %s/%q", tk.Type, tk.Literal)
	}
	if tk := l.NextToken(); tk.Type != RPAREN {
		t.Fatalf("want RPAREN, got %s/%q", tk.Type, tk.Literal)
	}
}

func TestGroupOverridesPrecedence(t *testing.T) {
	p := NewParser(NewLexer("(2 + 3) * 4"))
	prog := p.ParseProgram()
	checkNoErrors(t, p)
	if got := prog.String(); got != "((2 + 3) * 4)" {
		t.Fatalf("want ((2 + 3) * 4), got %q", got)
	}
}

func TestGroupOnRightSide(t *testing.T) {
	p := NewParser(NewLexer("2 * (3 + 4)"))
	prog := p.ParseProgram()
	checkNoErrors(t, p)
	if got := prog.String(); got != "(2 * (3 + 4))" {
		t.Fatalf("want (2 * (3 + 4)), got %q", got)
	}
}

func TestNestedGroupsCollapse(t *testing.T) {
	p := NewParser(NewLexer("((1 + 2))"))
	prog := p.ParseProgram()
	checkNoErrors(t, p)
	// No special AST node: nested parens disappear from String().
	if got := prog.String(); got != "(1 + 2)" {
		t.Fatalf("want (1 + 2), got %q", got)
	}
}

func TestPrefixBeforeGroup(t *testing.T) {
	p := NewParser(NewLexer("-(5 + 5)"))
	prog := p.ParseProgram()
	checkNoErrors(t, p)
	if got := prog.String(); got != "(-(5 + 5))" {
		t.Fatalf("want (-(5 + 5)), got %q", got)
	}
}

func TestGroupWithComparison(t *testing.T) {
	p := NewParser(NewLexer("(a < b) == c"))
	prog := p.ParseProgram()
	checkNoErrors(t, p)
	if got := prog.String(); got != "((a < b) == c)" {
		t.Fatalf("want ((a < b) == c), got %q", got)
	}
}

func TestUnterminatedGroupRecordsError(t *testing.T) {
	p := NewParser(NewLexer("(1 + 2"))
	p.ParseProgram()
	if len(p.Errors()) == 0 {
		t.Fatal("expected parser error for unterminated group, got none")
	}
}

func TestGroupedResultIsNotPrefixNode(t *testing.T) {
	// The grouped expression should be an InfixExpression directly,
	// not wrapped in some GroupExpression node.
	p := NewParser(NewLexer("(1 + 2)"))
	prog := p.ParseProgram()
	checkNoErrors(t, p)
	es := prog.Statements[0].(*ExpressionStatement)
	if _, ok := es.Expression.(*InfixExpression); !ok {
		t.Fatalf("expected *InfixExpression directly (no group wrapper), got %T", es.Expression)
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
	ASSIGN    TokenType = "ASSIGN"
	LT        TokenType = "LT"
	GT        TokenType = "GT"
	EQ        TokenType = "EQ"
	NOT_EQ    TokenType = "NOT_EQ"
	LPAREN    TokenType = "LPAREN"
	RPAREN    TokenType = "RPAREN"
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
func (l *Lexer) peekChar() byte {
	if l.readPos >= len(l.input) {
		return 0
	}
	return l.input[l.readPos]
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
	case '<':
		tok = Token{LT, "<"}
	case '>':
		tok = Token{GT, ">"}
	case '(':
		tok = Token{LPAREN, "("}
	case ')':
		tok = Token{RPAREN, ")"}
	case '!':
		if l.peekChar() == '=' {
			l.readChar()
			tok = Token{NOT_EQ, "!="}
		} else {
			tok = Token{BANG, "!"}
		}
	case '=':
		if l.peekChar() == '=' {
			l.readChar()
			tok = Token{EQ, "=="}
		} else {
			tok = Token{ASSIGN, "="}
		}
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
	LOWEST      = 1
	EQUALS      = 2
	LESSGREATER = 3
	SUM         = 4
	PRODUCT     = 5
	PREFIX      = 6
)

var precedences = map[TokenType]int{
	EQ:       EQUALS,
	NOT_EQ:   EQUALS,
	LT:       LESSGREATER,
	GT:       LESSGREATER,
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
		IDENT:  p.parseIdentifier,
		INT:    p.parseIntegerLiteral,
		BANG:   p.parsePrefixExpression,
		MINUS:  p.parsePrefixExpression,
		LPAREN: p.parseGroupedExpression,
	}
	p.infixParseFns = map[TokenType]infixParseFn{
		PLUS:     p.parseInfixExpression,
		MINUS:    p.parseInfixExpression,
		ASTERISK: p.parseInfixExpression,
		SLASH:    p.parseInfixExpression,
		LT:       p.parseInfixExpression,
		GT:       p.parseInfixExpression,
		EQ:       p.parseInfixExpression,
		NOT_EQ:   p.parseInfixExpression,
	}
	p.nextToken()
	p.nextToken()
	return p
}

func (p *Parser) nextToken()                   { p.curToken = p.peekToken; p.peekToken = p.l.NextToken() }
func (p *Parser) curTokenIs(t TokenType) bool  { return p.curToken.Type == t }
func (p *Parser) peekTokenIs(t TokenType) bool { return p.peekToken.Type == t }
func (p *Parser) Errors() []string             { return p.errors }

func (p *Parser) expectPeek(t TokenType) bool {
	if p.peekTokenIs(t) {
		p.nextToken()
		return true
	}
	p.errors = append(p.errors, fmt.Sprintf("expected next token to be %s, got %s instead", t, p.peekToken.Type))
	return false
}

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

func (p *Parser) parseGroupedExpression() Expression {
	p.nextToken()
	exp := p.parseExpression(LOWEST)
	if !p.expectPeek(RPAREN) {
		return nil
	}
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
    'parseGroupedExpression is three lines: nextToken() past the "(", parseExpression(LOWEST), then expectPeek(RPAREN). Return the inner expression — no wrapper node.',
    'expectPeek is the parser\'s workhorse: peek matches → advance+true, else record an error and return false. You will reuse it for every bracketed syntax from here on.',
    'No new AST node is needed. The grouping is *structural* — once parseExpression finishes inside the parens, the outer precedence climbing resumes cleanly after RPAREN.',
  ],
}

export default exercise
