import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-07',
  title: 'Monkey — Parse Expressions',
  category: 'Projects',
  subcategory: 'Monkey Interpreter',
  difficulty: 'advanced',
  order: 107,
  projectId: 'proj-monkey',
  step: 7,
  totalSteps: 22,
  description: `Implement a Pratt parser for expressions with operator precedence.

Add AST nodes:
- \`PrefixExpression\` — operator + right operand (e.g., \`-5\`, \`!true\`)
- \`InfixExpression\` — left + operator + right (e.g., \`a + b\`)
- \`Boolean\` — with Value bool

Add precedence levels: LOWEST, EQUALS, LESSGREATER, SUM, PRODUCT, PREFIX.

Implement \`parseExpression(precedence int)\` using prefix and infix parse functions:
- Prefix: INT -> parseIntegerLiteral, IDENT -> parseIdentifier, BANG/MINUS -> parsePrefixExpression, TRUE/FALSE -> parseBoolean, LPAREN -> parseGroupedExpression
- Infix: +, -, *, /, <, >, ==, != -> parseInfixExpression`,
  code: `package main

import (
	"fmt"
	"strconv"
)

// --- Tokens & Lexer (Steps 1-4) ---
type TokenType string
type Token struct { Type TokenType; Literal string }
const (
	INT=TokenType("INT"); IDENT=TokenType("IDENT"); STRING=TokenType("STRING")
	ASSIGN=TokenType("ASSIGN"); PLUS=TokenType("PLUS"); MINUS=TokenType("MINUS")
	ASTERISK=TokenType("ASTERISK"); SLASH=TokenType("SLASH"); BANG=TokenType("BANG")
	LT=TokenType("LT"); GT=TokenType("GT"); EQ=TokenType("EQ"); NOT_EQ=TokenType("NOT_EQ")
	COMMA=TokenType("COMMA"); SEMICOLON=TokenType("SEMICOLON")
	LPAREN=TokenType("LPAREN"); RPAREN=TokenType("RPAREN")
	LBRACE=TokenType("LBRACE"); RBRACE=TokenType("RBRACE")
	LET=TokenType("LET"); FUNCTION=TokenType("FUNCTION")
	TRUE=TokenType("TRUE"); FALSE=TokenType("FALSE")
	IF=TokenType("IF"); ELSE=TokenType("ELSE"); RETURN=TokenType("RETURN")
	EOF=TokenType("EOF"); ILLEGAL=TokenType("ILLEGAL")
)
var keywords = map[string]TokenType{"let":LET,"fn":FUNCTION,"if":IF,"else":ELSE,"return":RETURN,"true":TRUE,"false":FALSE}
func LookupIdent(ident string) TokenType { if t,ok:=keywords[ident];ok{return t}; return IDENT }
type Lexer struct { input string; pos int; readPos int; ch byte }
func NewLexer(input string) *Lexer { l:=&Lexer{input:input}; l.readChar(); return l }
func (l *Lexer) readChar() { if l.readPos>=len(l.input){l.ch=0}else{l.ch=l.input[l.readPos]}; l.pos=l.readPos; l.readPos++ }
func (l *Lexer) peekChar() byte { if l.readPos>=len(l.input){return 0}; return l.input[l.readPos] }
func (l *Lexer) skipWhitespace() { for l.ch==' '||l.ch=='\\t'||l.ch=='\\n'||l.ch=='\\r'{l.readChar()} }
func (l *Lexer) readNumber() string { s:=l.pos; for l.ch>='0'&&l.ch<='9'{l.readChar()}; return l.input[s:l.pos] }
func isLetter(ch byte) bool { return (ch>='a'&&ch<='z')||(ch>='A'&&ch<='Z')||ch=='_' }
func (l *Lexer) readIdentifier() string { s:=l.pos; for isLetter(l.ch){l.readChar()}; return l.input[s:l.pos] }
func (l *Lexer) readString() string { l.readChar(); s:=l.pos; for l.ch!='"'&&l.ch!=0{l.readChar()}; str:=l.input[s:l.pos]; l.readChar(); return str }
func (l *Lexer) NextToken() Token {
	var tok Token; l.skipWhitespace()
	switch l.ch {
	case '+': tok=Token{PLUS,"+"}; case '-': tok=Token{MINUS,"-"}
	case '*': tok=Token{ASTERISK,"*"}; case '/': tok=Token{SLASH,"/"}
	case '<': tok=Token{LT,"<"}; case '>': tok=Token{GT,">"}
	case '!': if l.peekChar()=='='{l.readChar();tok=Token{NOT_EQ,"!="}}else{tok=Token{BANG,"!"}}
	case '=': if l.peekChar()=='='{l.readChar();tok=Token{EQ,"=="}}else{tok=Token{ASSIGN,"="}}
	case '"': return Token{STRING,l.readString()}
	case ',': tok=Token{COMMA,","}; case ';': tok=Token{SEMICOLON,";"}
	case '(': tok=Token{LPAREN,"("}; case ')': tok=Token{RPAREN,")"}
	case '{': tok=Token{LBRACE,"{"}; case '}': tok=Token{RBRACE,"}"}
	case 0: return Token{EOF,""}
	default:
		if l.ch>='0'&&l.ch<='9'{return Token{INT,l.readNumber()}}
		if isLetter(l.ch){lit:=l.readIdentifier();return Token{LookupIdent(lit),lit}}
		tok=Token{ILLEGAL,string(l.ch)}
	}
	l.readChar(); return tok
}

// --- AST (Step 5) ---
type Node interface { TokenLiteral() string; String() string }
type Statement interface { Node; statementNode() }
type Expression interface { Node; expressionNode() }
type Program struct { Statements []Statement }
func (p *Program) TokenLiteral() string { if len(p.Statements)>0{return p.Statements[0].TokenLiteral()}; return "" }
func (p *Program) String() string { s:=""; for _,st:=range p.Statements{s+=st.String()}; return s }
type Identifier struct { Token Token; Value string }
func (i *Identifier) expressionNode() {}; func (i *Identifier) TokenLiteral() string { return i.Token.Literal }; func (i *Identifier) String() string { return i.Value }
type IntegerLiteral struct { Token Token; Value int64 }
func (il *IntegerLiteral) expressionNode() {}; func (il *IntegerLiteral) TokenLiteral() string { return il.Token.Literal }; func (il *IntegerLiteral) String() string { return il.Token.Literal }
type ExpressionStatement struct { Token Token; Expression Expression }
func (es *ExpressionStatement) statementNode() {}; func (es *ExpressionStatement) TokenLiteral() string { return es.Token.Literal }
func (es *ExpressionStatement) String() string { if es.Expression!=nil{return es.Expression.String()}; return "" }
type LetStatement struct { Token Token; Name *Identifier; Value Expression }
func (ls *LetStatement) statementNode() {}; func (ls *LetStatement) TokenLiteral() string { return ls.Token.Literal }
func (ls *LetStatement) String() string { return fmt.Sprintf("let %s = %s;",ls.Name.String(),ls.Value.String()) }
type ReturnStatement struct { Token Token; ReturnValue Expression }
func (rs *ReturnStatement) statementNode() {}; func (rs *ReturnStatement) TokenLiteral() string { return rs.Token.Literal }
func (rs *ReturnStatement) String() string { return fmt.Sprintf("return %s;",rs.ReturnValue.String()) }

// --- Parser skeleton (Step 6) ---
type Parser struct { l *Lexer; curToken Token; peekToken Token; errors []string }
func NewParser(l *Lexer) *Parser { p:=&Parser{l:l,errors:[]string{}}; p.nextToken(); p.nextToken(); return p }
func (p *Parser) nextToken() { p.curToken=p.peekToken; p.peekToken=p.l.NextToken() }
func (p *Parser) curTokenIs(t TokenType) bool { return p.curToken.Type==t }
func (p *Parser) peekTokenIs(t TokenType) bool { return p.peekToken.Type==t }
func (p *Parser) Errors() []string { return p.errors }
func (p *Parser) expectPeek(t TokenType) bool {
	if p.peekTokenIs(t){p.nextToken();return true}
	p.errors=append(p.errors,fmt.Sprintf("expected next token to be %s, got %s",t,p.peekToken.Type))
	return false
}

// TODO: Define PrefixExpression struct { Token; Operator string; Right Expression }
// TODO: Define InfixExpression struct { Token; Left Expression; Operator string; Right Expression }
// TODO: Define Boolean struct { Token; Value bool }
// TODO: Define precedence constants: LOWEST=1, EQUALS=2, LESSGREATER=3, SUM=4, PRODUCT=5, PREFIX=6
// TODO: Define precedences map[TokenType]int for EQ, NOT_EQ, LT, GT, PLUS, MINUS, SLASH, ASTERISK
// TODO: Implement peekPrecedence() and curPrecedence()
// TODO: Implement parseExpression(precedence int) Expression
// TODO: Implement parseIntegerLiteral, parseIdentifier, parsePrefixExpression, parseBoolean, parseGroupedExpression
// TODO: Implement parseInfixExpression
// TODO: Update parseExpressionStatement to use parseExpression(LOWEST)
// TODO: Wire up prefix/infix parse functions in maps

var _ = strconv.Atoi // keep import

func (p *Parser) ParseProgram() *Program {
	prog:=&Program{}
	for !p.curTokenIs(EOF) {
		stmt:=p.parseStatement()
		if stmt!=nil{prog.Statements=append(prog.Statements,stmt)}
		p.nextToken()
	}
	return prog
}
func (p *Parser) parseStatement() Statement { return p.parseExpressionStatement() }
func (p *Parser) parseExpressionStatement() *ExpressionStatement {
	stmt:=&ExpressionStatement{Token:p.curToken}
	// TODO: replace with parseExpression(LOWEST)
	stmt.Expression=&Identifier{Token:p.curToken,Value:p.curToken.Literal}
	if p.peekTokenIs(SEMICOLON){p.nextToken()}
	return stmt
}

func main() {}
`,
  testCode: `package main

import "testing"

func TestParseIntegerLiteral(t *testing.T) {
	p := NewParser(NewLexer("5;"))
	prog := p.ParseProgram()
	checkErrors(t, p)
	if len(prog.Statements) != 1 { t.Fatalf("expected 1 stmt, got %d", len(prog.Statements)) }
	es := prog.Statements[0].(*ExpressionStatement)
	il, ok := es.Expression.(*IntegerLiteral)
	if !ok { t.Fatalf("expected IntegerLiteral, got %T", es.Expression) }
	if il.Value != 5 { t.Fatalf("expected 5, got %d", il.Value) }
}

func TestParsePrefixExpressions(t *testing.T) {
	tests := []struct{ input string; op string; val int64 }{
		{"-15;", "-", 15}, {"!5;", "!", 5},
	}
	for _, tt := range tests {
		p := NewParser(NewLexer(tt.input))
		prog := p.ParseProgram()
		checkErrors(t, p)
		es := prog.Statements[0].(*ExpressionStatement)
		pe, ok := es.Expression.(*PrefixExpression)
		if !ok { t.Fatalf("expected PrefixExpression, got %T", es.Expression) }
		if pe.Operator != tt.op { t.Fatalf("expected op %s, got %s", tt.op, pe.Operator) }
		testIntegerLiteral(t, pe.Right, tt.val)
	}
}

func TestParseInfixExpressions(t *testing.T) {
	tests := []struct{ input string; leftVal int64; op string; rightVal int64 }{
		{"5 + 5;", 5, "+", 5}, {"5 - 5;", 5, "-", 5},
		{"5 * 5;", 5, "*", 5}, {"5 / 5;", 5, "/", 5},
		{"5 > 5;", 5, ">", 5}, {"5 < 5;", 5, "<", 5},
		{"5 == 5;", 5, "==", 5}, {"5 != 5;", 5, "!=", 5},
	}
	for _, tt := range tests {
		p := NewParser(NewLexer(tt.input))
		prog := p.ParseProgram()
		checkErrors(t, p)
		es := prog.Statements[0].(*ExpressionStatement)
		ie, ok := es.Expression.(*InfixExpression)
		if !ok { t.Fatalf("input %q: expected InfixExpression, got %T", tt.input, es.Expression) }
		testIntegerLiteral(t, ie.Left, tt.leftVal)
		if ie.Operator != tt.op { t.Fatalf("expected op %s, got %s", tt.op, ie.Operator) }
		testIntegerLiteral(t, ie.Right, tt.rightVal)
	}
}

func TestOperatorPrecedence(t *testing.T) {
	tests := []struct{ input string; expected string }{
		{"-a * b", "((-a) * b)"},
		{"a + b + c", "((a + b) + c)"},
		{"a + b * c", "(a + (b * c))"},
		{"1 + (2 + 3) + 4", "((1 + (2 + 3)) + 4)"},
	}
	for _, tt := range tests {
		p := NewParser(NewLexer(tt.input))
		prog := p.ParseProgram()
		checkErrors(t, p)
		got := prog.String()
		if got != tt.expected {
			t.Errorf("input %q: expected %q, got %q", tt.input, tt.expected, got)
		}
	}
}

func TestParseBoolean(t *testing.T) {
	p := NewParser(NewLexer("true;"))
	prog := p.ParseProgram()
	checkErrors(t, p)
	es := prog.Statements[0].(*ExpressionStatement)
	b, ok := es.Expression.(*Boolean)
	if !ok { t.Fatalf("expected Boolean, got %T", es.Expression) }
	if b.Value != true { t.Fatal("expected true") }
}

func checkErrors(t *testing.T, p *Parser) {
	t.Helper()
	errs := p.Errors()
	if len(errs) > 0 { t.Fatalf("parser errors: %v", errs) }
}

func testIntegerLiteral(t *testing.T, exp Expression, val int64) {
	t.Helper()
	il, ok := exp.(*IntegerLiteral)
	if !ok { t.Fatalf("expected IntegerLiteral, got %T", exp) }
	if il.Value != val { t.Fatalf("expected %d, got %d", val, il.Value) }
}
`,
  solution: `package main

import (
	"fmt"
	"strconv"
)

type TokenType string
type Token struct { Type TokenType; Literal string }
const (
	INT=TokenType("INT"); IDENT=TokenType("IDENT"); STRING=TokenType("STRING")
	ASSIGN=TokenType("ASSIGN"); PLUS=TokenType("PLUS"); MINUS=TokenType("MINUS")
	ASTERISK=TokenType("ASTERISK"); SLASH=TokenType("SLASH"); BANG=TokenType("BANG")
	LT=TokenType("LT"); GT=TokenType("GT"); EQ=TokenType("EQ"); NOT_EQ=TokenType("NOT_EQ")
	COMMA=TokenType("COMMA"); SEMICOLON=TokenType("SEMICOLON")
	LPAREN=TokenType("LPAREN"); RPAREN=TokenType("RPAREN")
	LBRACE=TokenType("LBRACE"); RBRACE=TokenType("RBRACE")
	LET=TokenType("LET"); FUNCTION=TokenType("FUNCTION")
	TRUE=TokenType("TRUE"); FALSE=TokenType("FALSE")
	IF=TokenType("IF"); ELSE=TokenType("ELSE"); RETURN=TokenType("RETURN")
	EOF=TokenType("EOF"); ILLEGAL=TokenType("ILLEGAL")
)
var keywords = map[string]TokenType{"let":LET,"fn":FUNCTION,"if":IF,"else":ELSE,"return":RETURN,"true":TRUE,"false":FALSE}
func LookupIdent(ident string) TokenType { if t,ok:=keywords[ident];ok{return t}; return IDENT }
type Lexer struct { input string; pos int; readPos int; ch byte }
func NewLexer(input string) *Lexer { l:=&Lexer{input:input}; l.readChar(); return l }
func (l *Lexer) readChar() { if l.readPos>=len(l.input){l.ch=0}else{l.ch=l.input[l.readPos]}; l.pos=l.readPos; l.readPos++ }
func (l *Lexer) peekChar() byte { if l.readPos>=len(l.input){return 0}; return l.input[l.readPos] }
func (l *Lexer) skipWhitespace() { for l.ch==' '||l.ch=='\\t'||l.ch=='\\n'||l.ch=='\\r'{l.readChar()} }
func (l *Lexer) readNumber() string { s:=l.pos; for l.ch>='0'&&l.ch<='9'{l.readChar()}; return l.input[s:l.pos] }
func isLetter(ch byte) bool { return (ch>='a'&&ch<='z')||(ch>='A'&&ch<='Z')||ch=='_' }
func (l *Lexer) readIdentifier() string { s:=l.pos; for isLetter(l.ch){l.readChar()}; return l.input[s:l.pos] }
func (l *Lexer) readString() string { l.readChar(); s:=l.pos; for l.ch!='"'&&l.ch!=0{l.readChar()}; str:=l.input[s:l.pos]; l.readChar(); return str }
func (l *Lexer) NextToken() Token {
	var tok Token; l.skipWhitespace()
	switch l.ch {
	case '+': tok=Token{PLUS,"+"}; case '-': tok=Token{MINUS,"-"}
	case '*': tok=Token{ASTERISK,"*"}; case '/': tok=Token{SLASH,"/"}
	case '<': tok=Token{LT,"<"}; case '>': tok=Token{GT,">"}
	case '!': if l.peekChar()=='='{l.readChar();tok=Token{NOT_EQ,"!="}}else{tok=Token{BANG,"!"}}
	case '=': if l.peekChar()=='='{l.readChar();tok=Token{EQ,"=="}}else{tok=Token{ASSIGN,"="}}
	case '"': return Token{STRING,l.readString()}
	case ',': tok=Token{COMMA,","}; case ';': tok=Token{SEMICOLON,";"}
	case '(': tok=Token{LPAREN,"("}; case ')': tok=Token{RPAREN,")"}
	case '{': tok=Token{LBRACE,"{"}; case '}': tok=Token{RBRACE,"}"}
	case 0: return Token{EOF,""}
	default:
		if l.ch>='0'&&l.ch<='9'{return Token{INT,l.readNumber()}}
		if isLetter(l.ch){lit:=l.readIdentifier();return Token{LookupIdent(lit),lit}}
		tok=Token{ILLEGAL,string(l.ch)}
	}
	l.readChar(); return tok
}

// --- AST ---
type Node interface { TokenLiteral() string; String() string }
type Statement interface { Node; statementNode() }
type Expression interface { Node; expressionNode() }
type Program struct { Statements []Statement }
func (p *Program) TokenLiteral() string { if len(p.Statements)>0{return p.Statements[0].TokenLiteral()}; return "" }
func (p *Program) String() string { s:=""; for _,st:=range p.Statements{s+=st.String()}; return s }
type Identifier struct { Token Token; Value string }
func (i *Identifier) expressionNode() {}; func (i *Identifier) TokenLiteral() string { return i.Token.Literal }; func (i *Identifier) String() string { return i.Value }
type IntegerLiteral struct { Token Token; Value int64 }
func (il *IntegerLiteral) expressionNode() {}; func (il *IntegerLiteral) TokenLiteral() string { return il.Token.Literal }; func (il *IntegerLiteral) String() string { return il.Token.Literal }
type Boolean struct { Token Token; Value bool }
func (b *Boolean) expressionNode() {}; func (b *Boolean) TokenLiteral() string { return b.Token.Literal }; func (b *Boolean) String() string { return b.Token.Literal }
type PrefixExpression struct { Token Token; Operator string; Right Expression }
func (pe *PrefixExpression) expressionNode() {}; func (pe *PrefixExpression) TokenLiteral() string { return pe.Token.Literal }
func (pe *PrefixExpression) String() string { return fmt.Sprintf("(%s%s)", pe.Operator, pe.Right.String()) }
type InfixExpression struct { Token Token; Left Expression; Operator string; Right Expression }
func (ie *InfixExpression) expressionNode() {}; func (ie *InfixExpression) TokenLiteral() string { return ie.Token.Literal }
func (ie *InfixExpression) String() string { return fmt.Sprintf("(%s %s %s)", ie.Left.String(), ie.Operator, ie.Right.String()) }
type ExpressionStatement struct { Token Token; Expression Expression }
func (es *ExpressionStatement) statementNode() {}; func (es *ExpressionStatement) TokenLiteral() string { return es.Token.Literal }
func (es *ExpressionStatement) String() string { if es.Expression!=nil{return es.Expression.String()}; return "" }
type LetStatement struct { Token Token; Name *Identifier; Value Expression }
func (ls *LetStatement) statementNode() {}; func (ls *LetStatement) TokenLiteral() string { return ls.Token.Literal }
func (ls *LetStatement) String() string { return fmt.Sprintf("let %s = %s;",ls.Name.String(),ls.Value.String()) }
type ReturnStatement struct { Token Token; ReturnValue Expression }
func (rs *ReturnStatement) statementNode() {}; func (rs *ReturnStatement) TokenLiteral() string { return rs.Token.Literal }
func (rs *ReturnStatement) String() string { return fmt.Sprintf("return %s;",rs.ReturnValue.String()) }

// --- Precedences ---
const ( LOWEST=1; EQUALS=2; LESSGREATER=3; SUM=4; PRODUCT=5; PREFIX=6 )
var precedences = map[TokenType]int{
	EQ:EQUALS, NOT_EQ:EQUALS, LT:LESSGREATER, GT:LESSGREATER,
	PLUS:SUM, MINUS:SUM, SLASH:PRODUCT, ASTERISK:PRODUCT,
}

// --- Parser ---
type (
	prefixParseFn func() Expression
	infixParseFn  func(Expression) Expression
)
type Parser struct {
	l *Lexer; curToken Token; peekToken Token; errors []string
	prefixParseFns map[TokenType]prefixParseFn
	infixParseFns  map[TokenType]infixParseFn
}
func NewParser(l *Lexer) *Parser {
	p:=&Parser{l:l,errors:[]string{}}
	p.prefixParseFns=map[TokenType]prefixParseFn{
		IDENT: p.parseIdentifier, INT: p.parseIntegerLiteral,
		BANG: p.parsePrefixExpression, MINUS: p.parsePrefixExpression,
		TRUE: p.parseBoolean, FALSE: p.parseBoolean,
		LPAREN: p.parseGroupedExpression,
	}
	p.infixParseFns=map[TokenType]infixParseFn{
		PLUS:p.parseInfixExpression, MINUS:p.parseInfixExpression,
		SLASH:p.parseInfixExpression, ASTERISK:p.parseInfixExpression,
		EQ:p.parseInfixExpression, NOT_EQ:p.parseInfixExpression,
		LT:p.parseInfixExpression, GT:p.parseInfixExpression,
	}
	p.nextToken(); p.nextToken()
	return p
}
func (p *Parser) nextToken() { p.curToken=p.peekToken; p.peekToken=p.l.NextToken() }
func (p *Parser) curTokenIs(t TokenType) bool { return p.curToken.Type==t }
func (p *Parser) peekTokenIs(t TokenType) bool { return p.peekToken.Type==t }
func (p *Parser) Errors() []string { return p.errors }
func (p *Parser) expectPeek(t TokenType) bool {
	if p.peekTokenIs(t){p.nextToken();return true}
	p.errors=append(p.errors,fmt.Sprintf("expected next token to be %s, got %s",t,p.peekToken.Type))
	return false
}
func (p *Parser) peekPrecedence() int { if p,ok:=precedences[p.peekToken.Type];ok{return p}; return LOWEST }
func (p *Parser) curPrecedence() int { if p,ok:=precedences[p.curToken.Type];ok{return p}; return LOWEST }

func (p *Parser) ParseProgram() *Program {
	prog:=&Program{}
	for !p.curTokenIs(EOF) {
		stmt:=p.parseStatement(); if stmt!=nil{prog.Statements=append(prog.Statements,stmt)}
		p.nextToken()
	}
	return prog
}
func (p *Parser) parseStatement() Statement { return p.parseExpressionStatement() }
func (p *Parser) parseExpressionStatement() *ExpressionStatement {
	stmt:=&ExpressionStatement{Token:p.curToken}
	stmt.Expression=p.parseExpression(LOWEST)
	if p.peekTokenIs(SEMICOLON){p.nextToken()}
	return stmt
}
func (p *Parser) parseExpression(prec int) Expression {
	prefix:=p.prefixParseFns[p.curToken.Type]
	if prefix==nil { p.errors=append(p.errors,fmt.Sprintf("no prefix parse function for %s",p.curToken.Type)); return nil }
	leftExp:=prefix()
	for !p.peekTokenIs(SEMICOLON) && prec<p.peekPrecedence() {
		infix:=p.infixParseFns[p.peekToken.Type]
		if infix==nil{return leftExp}
		p.nextToken()
		leftExp=infix(leftExp)
	}
	return leftExp
}
func (p *Parser) parseIdentifier() Expression { return &Identifier{Token:p.curToken,Value:p.curToken.Literal} }
func (p *Parser) parseIntegerLiteral() Expression {
	val,err:=strconv.ParseInt(p.curToken.Literal,0,64)
	if err!=nil{p.errors=append(p.errors,fmt.Sprintf("could not parse %q as integer",p.curToken.Literal));return nil}
	return &IntegerLiteral{Token:p.curToken,Value:val}
}
func (p *Parser) parseBoolean() Expression { return &Boolean{Token:p.curToken,Value:p.curTokenIs(TRUE)} }
func (p *Parser) parsePrefixExpression() Expression {
	exp:=&PrefixExpression{Token:p.curToken,Operator:p.curToken.Literal}
	p.nextToken()
	exp.Right=p.parseExpression(PREFIX)
	return exp
}
func (p *Parser) parseInfixExpression(left Expression) Expression {
	exp:=&InfixExpression{Token:p.curToken,Operator:p.curToken.Literal,Left:left}
	prec:=p.curPrecedence()
	p.nextToken()
	exp.Right=p.parseExpression(prec)
	return exp
}
func (p *Parser) parseGroupedExpression() Expression {
	p.nextToken()
	exp:=p.parseExpression(LOWEST)
	if !p.expectPeek(RPAREN){return nil}
	return exp
}

func main() {}
`,
  hints: [
    'Use maps of prefixParseFn and infixParseFn keyed by TokenType.',
    'parseExpression calls the prefix function, then loops calling infix while precedence allows.',
    'PrefixExpression.String() should format as "(<op><right>)", InfixExpression as "(<left> <op> <right>)".',
    'parseGroupedExpression skips LPAREN, parses expression, then expects RPAREN.',
  ],
}

export default exercise
