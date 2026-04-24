import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-10',
  title: 'Parser — Comparison Operators',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 110,
  projectId: 'proj-monkey',
  step: 10,
  totalSteps: 22,
  description: `Arithmetic infix parsing is wired up from step 9. Now extend the parser with comparison operators: \`<\`, \`>\`, \`==\`, \`!=\`.

**Tasks:**
- Teach the lexer to emit \`LT\`, \`GT\`, \`EQ\`, \`NOT_EQ\`. Watch the two-char operators: when you see \`=\`, peek for another \`=\`; when you see \`!\`, peek for \`=\`. Otherwise \`=\` stays ASSIGN (placeholder here) and \`!\` stays BANG.
- Add two precedence levels between \`LOWEST\` and \`SUM\`: \`EQUALS\` for \`==\`/\`!=\` and \`LESSGREATER\` for \`<\`/\`>\`.
- Register \`parseInfixExpression\` for all four comparison tokens and add their entries to the \`precedences\` map.

Expected shapes:
- \`1 + 2 < 3\` → \`((1 + 2) < 3)\` (arithmetic binds tighter)
- \`a == b != c\` → \`((a == b) != c)\` (left-associative within same level)
- \`x < y == true\` → \`((x < y) == true)\` — but we don't have booleans yet, so tests use identifiers.`,
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

// TODO: extend NextToken to emit LT ('<'), GT ('>'), EQ ('=='), NOT_EQ ('!=').
// For '=' check peekChar() == '=' to decide EQ vs ASSIGN.
// For '!' check peekChar() == '=' to decide NOT_EQ vs BANG.
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
	case '=':
		tok = Token{ASSIGN, "="}
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

// --- AST (same as step 9) ---
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
	LOWEST      = 1
	EQUALS      = 2 // ==, !=
	LESSGREATER = 3 // <, >
	SUM         = 4
	PRODUCT     = 5
	PREFIX      = 6
)

// TODO: add entries for EQ, NOT_EQ, LT, GT
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
	// TODO: register parseInfixExpression for LT, GT, EQ, NOT_EQ as well
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
  testCode: `package main

import "testing"

func checkErrors(t *testing.T, p *Parser) {
	t.Helper()
	if len(p.Errors()) > 0 {
		t.Fatalf("parser errors: %v", p.Errors())
	}
}

func TestLexerTwoCharOperators(t *testing.T) {
	l := NewLexer("== != < >")
	want := []TokenType{EQ, NOT_EQ, LT, GT, EOF}
	for i, w := range want {
		tk := l.NextToken()
		if tk.Type != w {
			t.Errorf("tok[%d]: want %s, got %s/%q", i, w, tk.Type, tk.Literal)
		}
	}
}

func TestParseLessThan(t *testing.T) {
	p := NewParser(NewLexer("x < y"))
	prog := p.ParseProgram()
	checkErrors(t, p)
	if prog.String() != "(x < y)" {
		t.Fatalf("want (x < y), got %q", prog.String())
	}
}

func TestParseAllComparisons(t *testing.T) {
	cases := []struct{ in, want string }{
		{"a < b", "(a < b)"},
		{"a > b", "(a > b)"},
		{"a == b", "(a == b)"},
		{"a != b", "(a != b)"},
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

func TestArithmeticBindsTighterThanComparison(t *testing.T) {
	p := NewParser(NewLexer("1 + 2 < 3"))
	prog := p.ParseProgram()
	checkErrors(t, p)
	if prog.String() != "((1 + 2) < 3)" {
		t.Fatalf("want ((1 + 2) < 3), got %q", prog.String())
	}
}

func TestComparisonBindsTighterThanEquality(t *testing.T) {
	p := NewParser(NewLexer("a < b == c"))
	prog := p.ParseProgram()
	checkErrors(t, p)
	if prog.String() != "((a < b) == c)" {
		t.Fatalf("want ((a < b) == c), got %q", prog.String())
	}
}

func TestEqualityLeftAssociative(t *testing.T) {
	p := NewParser(NewLexer("a == b != c"))
	prog := p.ParseProgram()
	checkErrors(t, p)
	if prog.String() != "((a == b) != c)" {
		t.Fatalf("want ((a == b) != c), got %q", prog.String())
	}
}

func TestNotEqStructure(t *testing.T) {
	p := NewParser(NewLexer("x != y"))
	prog := p.ParseProgram()
	checkErrors(t, p)
	es := prog.Statements[0].(*ExpressionStatement)
	ie, ok := es.Expression.(*InfixExpression)
	if !ok {
		t.Fatalf("expected *InfixExpression, got %T", es.Expression)
	}
	if ie.Operator != "!=" {
		t.Errorf("operator: want !=, got %s", ie.Operator)
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
    'For two-char operators, use peekChar(): when curChar is "=", peek for another "="; same pattern for "!" → "!=".',
    'EQUALS < LESSGREATER < SUM < PRODUCT. With that ordering, 1+2<3 naturally parses as (1+2)<3 and a<b==c as (a<b)==c.',
    'Every new infix token needs TWO registrations: an entry in the precedences map AND in infixParseFns. Missing either one makes the parser silently stop folding.',
  ],
}

export default exercise
