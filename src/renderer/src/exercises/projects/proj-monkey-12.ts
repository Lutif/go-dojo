import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-12',
  title: 'Evaluator — Object System',
  category: 'Projects',
  subcategory: 'Monkey Interpreter',
  difficulty: 'intermediate',
  order: 112,
  description: `Build the object system that the evaluator will use to represent runtime values.

Define an Object interface with two methods:
- Type() ObjectType (a string type alias)
- Inspect() string (returns a human-readable representation)

Implement these concrete object types:
- IntegerObject: wraps an int64 value
- BooleanObject: wraps a bool value
- NullObject: represents null/nil (no fields)
- ErrorObject: wraps an error message string
- ReturnValueObject: wraps an Object (for propagating returns)

Also implement an Environment struct with:
- A map[string]Object store
- An optional outer *Environment for scope chaining
- Get(name string) (Object, bool): looks up name, falls back to outer
- Set(name string, val Object) Object: binds name in current scope

This step also includes the full lexer and parser from steps 1-11.`,
  code: `package main

// Full lexer and parser from steps 1-11 are provided.
// Your task: implement the object system.

// ─── Lexer ───────────────────────────────────────────
type TokenType string
type Token struct {
	Type    TokenType
	Literal string
}

const (
	ILLEGAL = "ILLEGAL"; EOF_TOKEN = "EOF"
	IDENT = "IDENT"; INT = "INT"; STRING = "STRING"
	ASSIGN = "="; PLUS = "+"; MINUS = "-"; BANG = "!"
	ASTERISK = "*"; SLASH = "/"
	LT = "<"; GT = ">"
	EQ = "=="; NOT_EQ = "!="
	COMMA = ","; SEMICOLON = ";"; COLON = ":"
	LPAREN = "("; RPAREN = ")"
	LBRACE = "{"; RBRACE = "}"
	LBRACKET = "["; RBRACKET = "]"
	FUNCTION = "FUNCTION"; LET = "LET"; TRUE = "TRUE"; FALSE = "FALSE"
	IF = "IF"; ELSE = "ELSE"; RETURN = "RETURN"
)

var keywords = map[string]TokenType{
	"fn": FUNCTION, "let": LET, "true": TRUE, "false": FALSE,
	"if": IF, "else": ELSE, "return": RETURN,
}

type Lexer struct{ input string; pos, readPos int; ch byte }

func NewLexer(input string) *Lexer {
	l := &Lexer{input: input}
	l.readChar()
	return l
}
func (l *Lexer) readChar() {
	if l.readPos >= len(l.input) { l.ch = 0 } else { l.ch = l.input[l.readPos] }
	l.pos = l.readPos; l.readPos++
}
func (l *Lexer) peekChar() byte {
	if l.readPos >= len(l.input) { return 0 }; return l.input[l.readPos]
}
func (l *Lexer) skipWhitespace() { for l.ch == ' ' || l.ch == '\\t' || l.ch == '\\n' || l.ch == '\\r' { l.readChar() } }
func (l *Lexer) readIdentifier() string { p := l.pos; for isLetter(l.ch) { l.readChar() }; return l.input[p:l.pos] }
func (l *Lexer) readNumber() string { p := l.pos; for isDigit(l.ch) { l.readChar() }; return l.input[p:l.pos] }
func (l *Lexer) readString() string {
	l.readChar(); p := l.pos; for l.ch != '"' && l.ch != 0 { l.readChar() }
	s := l.input[p:l.pos]; l.readChar(); return s
}
func isLetter(ch byte) bool { return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch == '_' }
func isDigit(ch byte) bool  { return ch >= '0' && ch <= '9' }
func (l *Lexer) NextToken() Token {
	l.skipWhitespace()
	var tok Token
	switch l.ch {
	case '=': if l.peekChar()=='=' { l.readChar(); tok=Token{EQ,"=="}  } else { tok=Token{ASSIGN,"="} }
	case '!': if l.peekChar()=='=' { l.readChar(); tok=Token{NOT_EQ,"!="} } else { tok=Token{BANG,"!"} }
	case '+': tok=Token{PLUS,"+"}; case '-': tok=Token{MINUS,"-"}
	case '*': tok=Token{ASTERISK,"*"}; case '/': tok=Token{SLASH,"/"}
	case '<': tok=Token{LT,"<"}; case '>': tok=Token{GT,">"}
	case ',': tok=Token{COMMA,","}; case ';': tok=Token{SEMICOLON,";"}; case ':': tok=Token{COLON,":"}
	case '(': tok=Token{LPAREN,"("}; case ')': tok=Token{RPAREN,")"}
	case '{': tok=Token{LBRACE,"{"}; case '}': tok=Token{RBRACE,"}"}
	case '[': tok=Token{LBRACKET,"["}; case ']': tok=Token{RBRACKET,"]"}
	case '"': return Token{STRING, l.readString()}
	case 0: tok=Token{EOF_TOKEN,""}
	default:
		if isLetter(l.ch) { lit:=l.readIdentifier(); tp:=IDENT; if kw,ok:=keywords[lit];ok{tp=kw}; return Token{tp,lit} }
		if isDigit(l.ch) { return Token{INT,l.readNumber()} }
		tok=Token{ILLEGAL,string(l.ch)}
	}
	l.readChar(); return tok
}

// ─── AST ─────────────────────────────────────────────
type Node interface{ TokenLiteral() string; String() string }
type Statement interface{ Node; statementNode() }
type Expression interface{ Node; expressionNode() }

type Program struct{ Statements []Statement }
func (p *Program) TokenLiteral() string { if len(p.Statements)>0{return p.Statements[0].TokenLiteral()}; return "" }
func (p *Program) String() string { s:=""; for _,st:=range p.Statements{s+=st.String()}; return s }

type LetStatement struct{ Token Token; Name *Identifier; Value Expression }
func (ls *LetStatement) statementNode() {}
func (ls *LetStatement) TokenLiteral() string { return ls.Token.Literal }
func (ls *LetStatement) String() string { return "let "+ls.Name.String()+" = "+ls.Value.String()+";" }

type ReturnStatement struct{ Token Token; ReturnValue Expression }
func (rs *ReturnStatement) statementNode() {}
func (rs *ReturnStatement) TokenLiteral() string { return rs.Token.Literal }
func (rs *ReturnStatement) String() string { return "return "+rs.ReturnValue.String()+";" }

type ExpressionStatement struct{ Token Token; Expression Expression }
func (es *ExpressionStatement) statementNode() {}
func (es *ExpressionStatement) TokenLiteral() string { return es.Token.Literal }
func (es *ExpressionStatement) String() string { if es.Expression!=nil{return es.Expression.String()}; return "" }

type BlockStatement struct{ Token Token; Statements []Statement }
func (bs *BlockStatement) statementNode() {}
func (bs *BlockStatement) TokenLiteral() string { return bs.Token.Literal }
func (bs *BlockStatement) String() string { s:=""; for _,st:=range bs.Statements{s+=st.String()}; return s }

type Identifier struct{ Token Token; Value string }
func (i *Identifier) expressionNode() {}
func (i *Identifier) TokenLiteral() string { return i.Token.Literal }
func (i *Identifier) String() string { return i.Value }

type IntegerLiteral struct{ Token Token; Value int64 }
func (il *IntegerLiteral) expressionNode() {}
func (il *IntegerLiteral) TokenLiteral() string { return il.Token.Literal }
func (il *IntegerLiteral) String() string { return il.Token.Literal }

type BooleanLiteral struct{ Token Token; Value bool }
func (b *BooleanLiteral) expressionNode() {}
func (b *BooleanLiteral) TokenLiteral() string { return b.Token.Literal }
func (b *BooleanLiteral) String() string { return b.Token.Literal }

type StringLiteral struct{ Token Token; Value string }
func (s *StringLiteral) expressionNode() {}
func (s *StringLiteral) TokenLiteral() string { return s.Token.Literal }
func (s *StringLiteral) String() string { return "\\""+s.Value+"\\"" }

type PrefixExpression struct{ Token Token; Operator string; Right Expression }
func (pe *PrefixExpression) expressionNode() {}
func (pe *PrefixExpression) TokenLiteral() string { return pe.Token.Literal }
func (pe *PrefixExpression) String() string { return "("+pe.Operator+pe.Right.String()+")" }

type InfixExpression struct{ Token Token; Left Expression; Operator string; Right Expression }
func (ie *InfixExpression) expressionNode() {}
func (ie *InfixExpression) TokenLiteral() string { return ie.Token.Literal }
func (ie *InfixExpression) String() string { return "("+ie.Left.String()+" "+ie.Operator+" "+ie.Right.String()+")" }

type IfExpression struct{ Token Token; Condition Expression; Consequence, Alternative *BlockStatement }
func (ie *IfExpression) expressionNode() {}
func (ie *IfExpression) TokenLiteral() string { return ie.Token.Literal }
func (ie *IfExpression) String() string {
	s:="if "+ie.Condition.String()+" "+ie.Consequence.String()
	if ie.Alternative!=nil{s+=" else "+ie.Alternative.String()}; return s
}

type FunctionLiteral struct{ Token Token; Parameters []*Identifier; Body *BlockStatement }
func (fl *FunctionLiteral) expressionNode() {}
func (fl *FunctionLiteral) TokenLiteral() string { return fl.Token.Literal }
func (fl *FunctionLiteral) String() string {
	s:="fn("; for i,p:=range fl.Parameters{if i>0{s+=", "};s+=p.String()}; return s+") "+fl.Body.String()
}

type CallExpression struct{ Token Token; Function Expression; Arguments []Expression }
func (ce *CallExpression) expressionNode() {}
func (ce *CallExpression) TokenLiteral() string { return ce.Token.Literal }
func (ce *CallExpression) String() string {
	s:=ce.Function.String()+"("; for i,a:=range ce.Arguments{if i>0{s+=", "};s+=a.String()}; return s+")"
}

type ArrayLiteral struct{ Token Token; Elements []Expression }
func (a *ArrayLiteral) expressionNode() {}
func (a *ArrayLiteral) TokenLiteral() string { return a.Token.Literal }
func (a *ArrayLiteral) String() string {
	s:="["; for i,e:=range a.Elements{if i>0{s+=", "};s+=e.String()}; return s+"]"
}

type IndexExpression struct{ Token Token; Left, Index Expression }
func (ie *IndexExpression) expressionNode() {}
func (ie *IndexExpression) TokenLiteral() string { return ie.Token.Literal }
func (ie *IndexExpression) String() string { return "("+ie.Left.String()+"["+ie.Index.String()+"])" }

type HashLiteral struct{ Token Token; Pairs map[Expression]Expression }
func (h *HashLiteral) expressionNode() {}
func (h *HashLiteral) TokenLiteral() string { return h.Token.Literal }
func (h *HashLiteral) String() string {
	s:="{"; i:=0; for k,v:=range h.Pairs{if i>0{s+=", "};s+=k.String()+":"+v.String();i++}; return s+"}"
}

// ─── Parser ──────────────────────────────────────────
import ( "fmt"; "strconv" )

const ( _ int = iota; LOWEST; EQUALS; LESSGREATER; SUM; PRODUCT; PREFIX; CALL; INDEX )

var precedences = map[TokenType]int{
	EQ:EQUALS, NOT_EQ:EQUALS, LT:LESSGREATER, GT:LESSGREATER,
	PLUS:SUM, MINUS:SUM, SLASH:PRODUCT, ASTERISK:PRODUCT,
	LPAREN:CALL, LBRACKET:INDEX,
}

type Parser struct {
	l *Lexer; curToken, peekToken Token; errors []string
	prefixParseFns map[TokenType]func()Expression
	infixParseFns  map[TokenType]func(Expression)Expression
}

func NewParser(l *Lexer) *Parser {
	p := &Parser{l:l, errors:[]string{}}
	p.prefixParseFns = map[TokenType]func()Expression{
		IDENT: p.parseIdentifier, INT: p.parseIntegerLiteral,
		TRUE: p.parseBooleanLiteral, FALSE: p.parseBooleanLiteral,
		STRING: p.parseStringLiteral, BANG: p.parsePrefixExpression,
		MINUS: p.parsePrefixExpression, LPAREN: p.parseGroupedExpression,
		IF: p.parseIfExpression, FUNCTION: p.parseFunctionLiteral,
		LBRACKET: p.parseArrayLiteral, LBRACE: p.parseHashLiteral,
	}
	p.infixParseFns = map[TokenType]func(Expression)Expression{
		PLUS:p.parseInfixExpression, MINUS:p.parseInfixExpression,
		SLASH:p.parseInfixExpression, ASTERISK:p.parseInfixExpression,
		EQ:p.parseInfixExpression, NOT_EQ:p.parseInfixExpression,
		LT:p.parseInfixExpression, GT:p.parseInfixExpression,
		LPAREN:p.parseCallExpression, LBRACKET:p.parseIndexExpression,
	}
	p.nextToken(); p.nextToken()
	return p
}
func (p *Parser) Errors() []string { return p.errors }
func (p *Parser) nextToken() { p.curToken=p.peekToken; p.peekToken=p.l.NextToken() }
func (p *Parser) curTokenIs(t TokenType) bool { return p.curToken.Type==t }
func (p *Parser) peekTokenIs(t TokenType) bool { return p.peekToken.Type==t }
func (p *Parser) expectPeek(t TokenType) bool {
	if p.peekTokenIs(t) { p.nextToken(); return true }
	p.errors=append(p.errors,fmt.Sprintf("expected %s, got %s",t,p.peekToken.Type)); return false
}
func (p *Parser) peekPrecedence() int { if pr,ok:=precedences[p.peekToken.Type];ok{return pr}; return LOWEST }
func (p *Parser) curPrecedence() int { if pr,ok:=precedences[p.curToken.Type];ok{return pr}; return LOWEST }

func (p *Parser) ParseProgram() *Program {
	prog:=&Program{}
	for !p.curTokenIs(EOF_TOKEN) { if s:=p.parseStatement();s!=nil{prog.Statements=append(prog.Statements,s)}; p.nextToken() }
	return prog
}
func (p *Parser) parseStatement() Statement {
	switch p.curToken.Type {
	case LET: return p.parseLetStatement()
	case RETURN: return p.parseReturnStatement()
	default: return p.parseExpressionStatement()
	}
}
func (p *Parser) parseLetStatement() *LetStatement {
	s:=&LetStatement{Token:p.curToken}; if !p.expectPeek(IDENT){return nil}
	s.Name=&Identifier{Token:p.curToken,Value:p.curToken.Literal}
	if !p.expectPeek(ASSIGN){return nil}; p.nextToken()
	s.Value=p.parseExpression(LOWEST); if p.peekTokenIs(SEMICOLON){p.nextToken()}; return s
}
func (p *Parser) parseReturnStatement() *ReturnStatement {
	s:=&ReturnStatement{Token:p.curToken}; p.nextToken()
	s.ReturnValue=p.parseExpression(LOWEST); if p.peekTokenIs(SEMICOLON){p.nextToken()}; return s
}
func (p *Parser) parseExpressionStatement() *ExpressionStatement {
	s:=&ExpressionStatement{Token:p.curToken,Expression:p.parseExpression(LOWEST)}
	if p.peekTokenIs(SEMICOLON){p.nextToken()}; return s
}
func (p *Parser) parseExpression(prec int) Expression {
	prefix:=p.prefixParseFns[p.curToken.Type]; if prefix==nil{return nil}
	left:=prefix(); for !p.peekTokenIs(SEMICOLON)&&prec<p.peekPrecedence(){
		infix:=p.infixParseFns[p.peekToken.Type]; if infix==nil{return left}; p.nextToken(); left=infix(left)
	}; return left
}
func (p *Parser) parseIdentifier() Expression { return &Identifier{Token:p.curToken,Value:p.curToken.Literal} }
func (p *Parser) parseIntegerLiteral() Expression {
	v,err:=strconv.ParseInt(p.curToken.Literal,0,64); if err!=nil{return nil}
	return &IntegerLiteral{Token:p.curToken,Value:v}
}
func (p *Parser) parseBooleanLiteral() Expression { return &BooleanLiteral{Token:p.curToken,Value:p.curTokenIs(TRUE)} }
func (p *Parser) parseStringLiteral() Expression { return &StringLiteral{Token:p.curToken,Value:p.curToken.Literal} }
func (p *Parser) parsePrefixExpression() Expression {
	e:=&PrefixExpression{Token:p.curToken,Operator:p.curToken.Literal}; p.nextToken()
	e.Right=p.parseExpression(PREFIX); return e
}
func (p *Parser) parseInfixExpression(left Expression) Expression {
	e:=&InfixExpression{Token:p.curToken,Operator:p.curToken.Literal,Left:left}
	pr:=p.curPrecedence(); p.nextToken(); e.Right=p.parseExpression(pr); return e
}
func (p *Parser) parseGroupedExpression() Expression {
	p.nextToken(); exp:=p.parseExpression(LOWEST); if !p.expectPeek(RPAREN){return nil}; return exp
}
func (p *Parser) parseIfExpression() Expression {
	e:=&IfExpression{Token:p.curToken}; if !p.expectPeek(LPAREN){return nil}; p.nextToken()
	e.Condition=p.parseExpression(LOWEST); if !p.expectPeek(RPAREN){return nil}
	if !p.expectPeek(LBRACE){return nil}; e.Consequence=p.parseBlockStatement()
	if p.peekTokenIs(ELSE){p.nextToken();if !p.expectPeek(LBRACE){return nil};e.Alternative=p.parseBlockStatement()}
	return e
}
func (p *Parser) parseBlockStatement() *BlockStatement {
	b:=&BlockStatement{Token:p.curToken}; p.nextToken()
	for !p.curTokenIs(RBRACE)&&!p.curTokenIs(EOF_TOKEN){if s:=p.parseStatement();s!=nil{b.Statements=append(b.Statements,s)};p.nextToken()}
	return b
}
func (p *Parser) parseFunctionLiteral() Expression {
	fl:=&FunctionLiteral{Token:p.curToken}; if !p.expectPeek(LPAREN){return nil}
	fl.Parameters=p.parseFunctionParameters(); if !p.expectPeek(LBRACE){return nil}
	fl.Body=p.parseBlockStatement(); return fl
}
func (p *Parser) parseFunctionParameters() []*Identifier {
	ids:=[]*Identifier{}; if p.peekTokenIs(RPAREN){p.nextToken();return ids}; p.nextToken()
	ids=append(ids,&Identifier{Token:p.curToken,Value:p.curToken.Literal})
	for p.peekTokenIs(COMMA){p.nextToken();p.nextToken();ids=append(ids,&Identifier{Token:p.curToken,Value:p.curToken.Literal})}
	if !p.expectPeek(RPAREN){return nil}; return ids
}
func (p *Parser) parseCallExpression(fn Expression) Expression {
	return &CallExpression{Token:p.curToken,Function:fn,Arguments:p.parseExpressionList(RPAREN)}
}
func (p *Parser) parseExpressionList(end TokenType) []Expression {
	list:=[]Expression{}; if p.peekTokenIs(end){p.nextToken();return list}; p.nextToken()
	list=append(list,p.parseExpression(LOWEST))
	for p.peekTokenIs(COMMA){p.nextToken();p.nextToken();list=append(list,p.parseExpression(LOWEST))}
	if !p.expectPeek(end){return nil}; return list
}
func (p *Parser) parseArrayLiteral() Expression {
	return &ArrayLiteral{Token:p.curToken,Elements:p.parseExpressionList(RBRACKET)}
}
func (p *Parser) parseIndexExpression(left Expression) Expression {
	e:=&IndexExpression{Token:p.curToken,Left:left}; p.nextToken()
	e.Index=p.parseExpression(LOWEST); if !p.expectPeek(RBRACKET){return nil}; return e
}
func (p *Parser) parseHashLiteral() Expression {
	h:=&HashLiteral{Token:p.curToken,Pairs:map[Expression]Expression{}}
	for !p.peekTokenIs(RBRACE){p.nextToken();k:=p.parseExpression(LOWEST)
		if !p.expectPeek(COLON){return nil};p.nextToken();v:=p.parseExpression(LOWEST);h.Pairs[k]=v
		if !p.peekTokenIs(RBRACE)&&!p.expectPeek(COMMA){return nil}}
	if !p.expectPeek(RBRACE){return nil}; return h
}

// ─── Object System (TODO) ────────────────────────────

// TODO: Define ObjectType as a string type alias

// TODO: Define constants for object types:
//   INTEGER_OBJ, BOOLEAN_OBJ, NULL_OBJ, ERROR_OBJ, RETURN_VALUE_OBJ

// TODO: Define Object interface with Type() ObjectType and Inspect() string

// TODO: Implement IntegerObject with Value int64

// TODO: Implement BooleanObject with Value bool

// TODO: Implement NullObject (no fields)

// TODO: Implement ErrorObject with Message string

// TODO: Implement ReturnValueObject with Value Object

// TODO: Implement Environment struct with:
//   - store map[string]Object
//   - outer *Environment
//   - NewEnvironment() *Environment
//   - NewEnclosedEnvironment(outer *Environment) *Environment
//   - Get(name string) (Object, bool)
//   - Set(name string, val Object) Object

func main() {}
`,
  testCode: `package main

import (
	"testing"
)

func TestIntegerObject(t *testing.T) {
	obj := &IntegerObject{Value: 42}
	if obj.Type() != INTEGER_OBJ {
		t.Errorf("wrong type: got %s", obj.Type())
	}
	if obj.Inspect() != "42" {
		t.Errorf("wrong inspect: got %s", obj.Inspect())
	}
}

func TestBooleanObject(t *testing.T) {
	obj := &BooleanObject{Value: true}
	if obj.Type() != BOOLEAN_OBJ {
		t.Errorf("wrong type: got %s", obj.Type())
	}
	if obj.Inspect() != "true" {
		t.Errorf("wrong inspect: got %s", obj.Inspect())
	}
}

func TestNullObject(t *testing.T) {
	obj := &NullObject{}
	if obj.Type() != NULL_OBJ {
		t.Errorf("wrong type: got %s", obj.Type())
	}
	if obj.Inspect() != "null" {
		t.Errorf("wrong inspect: got %s", obj.Inspect())
	}
}

func TestErrorObject(t *testing.T) {
	obj := &ErrorObject{Message: "something went wrong"}
	if obj.Type() != ERROR_OBJ {
		t.Errorf("wrong type: got %s", obj.Type())
	}
	if obj.Inspect() != "ERROR: something went wrong" {
		t.Errorf("wrong inspect: got %s", obj.Inspect())
	}
}

func TestReturnValueObject(t *testing.T) {
	inner := &IntegerObject{Value: 99}
	obj := &ReturnValueObject{Value: inner}
	if obj.Type() != RETURN_VALUE_OBJ {
		t.Errorf("wrong type: got %s", obj.Type())
	}
	if obj.Inspect() != "99" {
		t.Errorf("wrong inspect: got %s", obj.Inspect())
	}
}

func TestEnvironment(t *testing.T) {
	env := NewEnvironment()
	env.Set("x", &IntegerObject{Value: 10})
	obj, ok := env.Get("x")
	if !ok {
		t.Fatal("expected to find x")
	}
	if obj.(*IntegerObject).Value != 10 {
		t.Errorf("expected 10, got %d", obj.(*IntegerObject).Value)
	}
	_, ok = env.Get("y")
	if ok {
		t.Fatal("expected y to not be found")
	}
}

func TestEnclosedEnvironment(t *testing.T) {
	outer := NewEnvironment()
	outer.Set("x", &IntegerObject{Value: 5})
	inner := NewEnclosedEnvironment(outer)
	inner.Set("y", &IntegerObject{Value: 10})

	obj, ok := inner.Get("x")
	if !ok {
		t.Fatal("expected inner to find x from outer")
	}
	if obj.(*IntegerObject).Value != 5 {
		t.Errorf("expected 5, got %d", obj.(*IntegerObject).Value)
	}
	obj, ok = inner.Get("y")
	if !ok {
		t.Fatal("expected inner to find y")
	}
	if obj.(*IntegerObject).Value != 10 {
		t.Errorf("expected 10, got %d", obj.(*IntegerObject).Value)
	}
}
`,
  solution: `package main

// ─── Lexer ───────────────────────────────────────────
type TokenType string
type Token struct {
	Type    TokenType
	Literal string
}

const (
	ILLEGAL = "ILLEGAL"; EOF_TOKEN = "EOF"
	IDENT = "IDENT"; INT = "INT"; STRING = "STRING"
	ASSIGN = "="; PLUS = "+"; MINUS = "-"; BANG = "!"
	ASTERISK = "*"; SLASH = "/"
	LT = "<"; GT = ">"
	EQ = "=="; NOT_EQ = "!="
	COMMA = ","; SEMICOLON = ";"; COLON = ":"
	LPAREN = "("; RPAREN = ")"
	LBRACE = "{"; RBRACE = "}"
	LBRACKET = "["; RBRACKET = "]"
	FUNCTION = "FUNCTION"; LET = "LET"; TRUE = "TRUE"; FALSE = "FALSE"
	IF = "IF"; ELSE = "ELSE"; RETURN = "RETURN"
)

var keywords = map[string]TokenType{
	"fn": FUNCTION, "let": LET, "true": TRUE, "false": FALSE,
	"if": IF, "else": ELSE, "return": RETURN,
}

type Lexer struct{ input string; pos, readPos int; ch byte }

func NewLexer(input string) *Lexer {
	l := &Lexer{input: input}
	l.readChar()
	return l
}
func (l *Lexer) readChar() {
	if l.readPos >= len(l.input) { l.ch = 0 } else { l.ch = l.input[l.readPos] }
	l.pos = l.readPos; l.readPos++
}
func (l *Lexer) peekChar() byte {
	if l.readPos >= len(l.input) { return 0 }; return l.input[l.readPos]
}
func (l *Lexer) skipWhitespace() { for l.ch == ' ' || l.ch == '\\t' || l.ch == '\\n' || l.ch == '\\r' { l.readChar() } }
func (l *Lexer) readIdentifier() string { p := l.pos; for isLetter(l.ch) { l.readChar() }; return l.input[p:l.pos] }
func (l *Lexer) readNumber() string { p := l.pos; for isDigit(l.ch) { l.readChar() }; return l.input[p:l.pos] }
func (l *Lexer) readString() string {
	l.readChar(); p := l.pos; for l.ch != '"' && l.ch != 0 { l.readChar() }
	s := l.input[p:l.pos]; l.readChar(); return s
}
func isLetter(ch byte) bool { return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch == '_' }
func isDigit(ch byte) bool  { return ch >= '0' && ch <= '9' }
func (l *Lexer) NextToken() Token {
	l.skipWhitespace()
	var tok Token
	switch l.ch {
	case '=': if l.peekChar()=='=' { l.readChar(); tok=Token{EQ,"=="} } else { tok=Token{ASSIGN,"="} }
	case '!': if l.peekChar()=='=' { l.readChar(); tok=Token{NOT_EQ,"!="} } else { tok=Token{BANG,"!"} }
	case '+': tok=Token{PLUS,"+"}; case '-': tok=Token{MINUS,"-"}
	case '*': tok=Token{ASTERISK,"*"}; case '/': tok=Token{SLASH,"/"}
	case '<': tok=Token{LT,"<"}; case '>': tok=Token{GT,">"}
	case ',': tok=Token{COMMA,","}; case ';': tok=Token{SEMICOLON,";"}; case ':': tok=Token{COLON,":"}
	case '(': tok=Token{LPAREN,"("}; case ')': tok=Token{RPAREN,")"}
	case '{': tok=Token{LBRACE,"{"}; case '}': tok=Token{RBRACE,"}"}
	case '[': tok=Token{LBRACKET,"["}; case ']': tok=Token{RBRACKET,"]"}
	case '"': return Token{STRING, l.readString()}
	case 0: tok=Token{EOF_TOKEN,""}
	default:
		if isLetter(l.ch) { lit:=l.readIdentifier(); tp:=IDENT; if kw,ok:=keywords[lit];ok{tp=kw}; return Token{tp,lit} }
		if isDigit(l.ch) { return Token{INT,l.readNumber()} }
		tok=Token{ILLEGAL,string(l.ch)}
	}
	l.readChar(); return tok
}

// ─── AST ─────────────────────────────────────────────
type Node interface{ TokenLiteral() string; String() string }
type Statement interface{ Node; statementNode() }
type Expression interface{ Node; expressionNode() }

type Program struct{ Statements []Statement }
func (p *Program) TokenLiteral() string { if len(p.Statements)>0{return p.Statements[0].TokenLiteral()}; return "" }
func (p *Program) String() string { s:=""; for _,st:=range p.Statements{s+=st.String()}; return s }

type LetStatement struct{ Token Token; Name *Identifier; Value Expression }
func (ls *LetStatement) statementNode() {}
func (ls *LetStatement) TokenLiteral() string { return ls.Token.Literal }
func (ls *LetStatement) String() string { return "let "+ls.Name.String()+" = "+ls.Value.String()+";" }

type ReturnStatement struct{ Token Token; ReturnValue Expression }
func (rs *ReturnStatement) statementNode() {}
func (rs *ReturnStatement) TokenLiteral() string { return rs.Token.Literal }
func (rs *ReturnStatement) String() string { return "return "+rs.ReturnValue.String()+";" }

type ExpressionStatement struct{ Token Token; Expression Expression }
func (es *ExpressionStatement) statementNode() {}
func (es *ExpressionStatement) TokenLiteral() string { return es.Token.Literal }
func (es *ExpressionStatement) String() string { if es.Expression!=nil{return es.Expression.String()}; return "" }

type BlockStatement struct{ Token Token; Statements []Statement }
func (bs *BlockStatement) statementNode() {}
func (bs *BlockStatement) TokenLiteral() string { return bs.Token.Literal }
func (bs *BlockStatement) String() string { s:=""; for _,st:=range bs.Statements{s+=st.String()}; return s }

type Identifier struct{ Token Token; Value string }
func (i *Identifier) expressionNode() {}
func (i *Identifier) TokenLiteral() string { return i.Token.Literal }
func (i *Identifier) String() string { return i.Value }

type IntegerLiteral struct{ Token Token; Value int64 }
func (il *IntegerLiteral) expressionNode() {}
func (il *IntegerLiteral) TokenLiteral() string { return il.Token.Literal }
func (il *IntegerLiteral) String() string { return il.Token.Literal }

type BooleanLiteral struct{ Token Token; Value bool }
func (b *BooleanLiteral) expressionNode() {}
func (b *BooleanLiteral) TokenLiteral() string { return b.Token.Literal }
func (b *BooleanLiteral) String() string { return b.Token.Literal }

type StringLiteral struct{ Token Token; Value string }
func (s *StringLiteral) expressionNode() {}
func (s *StringLiteral) TokenLiteral() string { return s.Token.Literal }
func (s *StringLiteral) String() string { return "\\""+s.Value+"\\"" }

type PrefixExpression struct{ Token Token; Operator string; Right Expression }
func (pe *PrefixExpression) expressionNode() {}
func (pe *PrefixExpression) TokenLiteral() string { return pe.Token.Literal }
func (pe *PrefixExpression) String() string { return "("+pe.Operator+pe.Right.String()+")" }

type InfixExpression struct{ Token Token; Left Expression; Operator string; Right Expression }
func (ie *InfixExpression) expressionNode() {}
func (ie *InfixExpression) TokenLiteral() string { return ie.Token.Literal }
func (ie *InfixExpression) String() string { return "("+ie.Left.String()+" "+ie.Operator+" "+ie.Right.String()+")" }

type IfExpression struct{ Token Token; Condition Expression; Consequence, Alternative *BlockStatement }
func (ie *IfExpression) expressionNode() {}
func (ie *IfExpression) TokenLiteral() string { return ie.Token.Literal }
func (ie *IfExpression) String() string {
	s:="if "+ie.Condition.String()+" "+ie.Consequence.String()
	if ie.Alternative!=nil{s+=" else "+ie.Alternative.String()}; return s
}

type FunctionLiteral struct{ Token Token; Parameters []*Identifier; Body *BlockStatement }
func (fl *FunctionLiteral) expressionNode() {}
func (fl *FunctionLiteral) TokenLiteral() string { return fl.Token.Literal }
func (fl *FunctionLiteral) String() string {
	s:="fn("; for i,p:=range fl.Parameters{if i>0{s+=", "};s+=p.String()}; return s+") "+fl.Body.String()
}

type CallExpression struct{ Token Token; Function Expression; Arguments []Expression }
func (ce *CallExpression) expressionNode() {}
func (ce *CallExpression) TokenLiteral() string { return ce.Token.Literal }
func (ce *CallExpression) String() string {
	s:=ce.Function.String()+"("; for i,a:=range ce.Arguments{if i>0{s+=", "};s+=a.String()}; return s+")"
}

type ArrayLiteral struct{ Token Token; Elements []Expression }
func (a *ArrayLiteral) expressionNode() {}
func (a *ArrayLiteral) TokenLiteral() string { return a.Token.Literal }
func (a *ArrayLiteral) String() string {
	s:="["; for i,e:=range a.Elements{if i>0{s+=", "};s+=e.String()}; return s+"]"
}

type IndexExpression struct{ Token Token; Left, Index Expression }
func (ie *IndexExpression) expressionNode() {}
func (ie *IndexExpression) TokenLiteral() string { return ie.Token.Literal }
func (ie *IndexExpression) String() string { return "("+ie.Left.String()+"["+ie.Index.String()+"])" }

type HashLiteral struct{ Token Token; Pairs map[Expression]Expression }
func (h *HashLiteral) expressionNode() {}
func (h *HashLiteral) TokenLiteral() string { return h.Token.Literal }
func (h *HashLiteral) String() string {
	s:="{"; i:=0; for k,v:=range h.Pairs{if i>0{s+=", "};s+=k.String()+":"+v.String();i++}; return s+"}"
}

// ─── Parser ──────────────────────────────────────────
import ( "fmt"; "strconv" )

const ( _ int = iota; LOWEST; EQUALS; LESSGREATER; SUM; PRODUCT; PREFIX; CALL; INDEX )

var precedences = map[TokenType]int{
	EQ:EQUALS, NOT_EQ:EQUALS, LT:LESSGREATER, GT:LESSGREATER,
	PLUS:SUM, MINUS:SUM, SLASH:PRODUCT, ASTERISK:PRODUCT,
	LPAREN:CALL, LBRACKET:INDEX,
}

type Parser struct {
	l *Lexer; curToken, peekToken Token; errors []string
	prefixParseFns map[TokenType]func()Expression
	infixParseFns  map[TokenType]func(Expression)Expression
}

func NewParser(l *Lexer) *Parser {
	p := &Parser{l:l, errors:[]string{}}
	p.prefixParseFns = map[TokenType]func()Expression{
		IDENT: p.parseIdentifier, INT: p.parseIntegerLiteral,
		TRUE: p.parseBooleanLiteral, FALSE: p.parseBooleanLiteral,
		STRING: p.parseStringLiteral, BANG: p.parsePrefixExpression,
		MINUS: p.parsePrefixExpression, LPAREN: p.parseGroupedExpression,
		IF: p.parseIfExpression, FUNCTION: p.parseFunctionLiteral,
		LBRACKET: p.parseArrayLiteral, LBRACE: p.parseHashLiteral,
	}
	p.infixParseFns = map[TokenType]func(Expression)Expression{
		PLUS:p.parseInfixExpression, MINUS:p.parseInfixExpression,
		SLASH:p.parseInfixExpression, ASTERISK:p.parseInfixExpression,
		EQ:p.parseInfixExpression, NOT_EQ:p.parseInfixExpression,
		LT:p.parseInfixExpression, GT:p.parseInfixExpression,
		LPAREN:p.parseCallExpression, LBRACKET:p.parseIndexExpression,
	}
	p.nextToken(); p.nextToken()
	return p
}
func (p *Parser) Errors() []string { return p.errors }
func (p *Parser) nextToken() { p.curToken=p.peekToken; p.peekToken=p.l.NextToken() }
func (p *Parser) curTokenIs(t TokenType) bool { return p.curToken.Type==t }
func (p *Parser) peekTokenIs(t TokenType) bool { return p.peekToken.Type==t }
func (p *Parser) expectPeek(t TokenType) bool {
	if p.peekTokenIs(t) { p.nextToken(); return true }
	p.errors=append(p.errors,fmt.Sprintf("expected %s, got %s",t,p.peekToken.Type)); return false
}
func (p *Parser) peekPrecedence() int { if pr,ok:=precedences[p.peekToken.Type];ok{return pr}; return LOWEST }
func (p *Parser) curPrecedence() int { if pr,ok:=precedences[p.curToken.Type];ok{return pr}; return LOWEST }

func (p *Parser) ParseProgram() *Program {
	prog:=&Program{}
	for !p.curTokenIs(EOF_TOKEN) { if s:=p.parseStatement();s!=nil{prog.Statements=append(prog.Statements,s)}; p.nextToken() }
	return prog
}
func (p *Parser) parseStatement() Statement {
	switch p.curToken.Type {
	case LET: return p.parseLetStatement()
	case RETURN: return p.parseReturnStatement()
	default: return p.parseExpressionStatement()
	}
}
func (p *Parser) parseLetStatement() *LetStatement {
	s:=&LetStatement{Token:p.curToken}; if !p.expectPeek(IDENT){return nil}
	s.Name=&Identifier{Token:p.curToken,Value:p.curToken.Literal}
	if !p.expectPeek(ASSIGN){return nil}; p.nextToken()
	s.Value=p.parseExpression(LOWEST); if p.peekTokenIs(SEMICOLON){p.nextToken()}; return s
}
func (p *Parser) parseReturnStatement() *ReturnStatement {
	s:=&ReturnStatement{Token:p.curToken}; p.nextToken()
	s.ReturnValue=p.parseExpression(LOWEST); if p.peekTokenIs(SEMICOLON){p.nextToken()}; return s
}
func (p *Parser) parseExpressionStatement() *ExpressionStatement {
	s:=&ExpressionStatement{Token:p.curToken,Expression:p.parseExpression(LOWEST)}
	if p.peekTokenIs(SEMICOLON){p.nextToken()}; return s
}
func (p *Parser) parseExpression(prec int) Expression {
	prefix:=p.prefixParseFns[p.curToken.Type]; if prefix==nil{return nil}
	left:=prefix(); for !p.peekTokenIs(SEMICOLON)&&prec<p.peekPrecedence(){
		infix:=p.infixParseFns[p.peekToken.Type]; if infix==nil{return left}; p.nextToken(); left=infix(left)
	}; return left
}
func (p *Parser) parseIdentifier() Expression { return &Identifier{Token:p.curToken,Value:p.curToken.Literal} }
func (p *Parser) parseIntegerLiteral() Expression {
	v,err:=strconv.ParseInt(p.curToken.Literal,0,64); if err!=nil{return nil}
	return &IntegerLiteral{Token:p.curToken,Value:v}
}
func (p *Parser) parseBooleanLiteral() Expression { return &BooleanLiteral{Token:p.curToken,Value:p.curTokenIs(TRUE)} }
func (p *Parser) parseStringLiteral() Expression { return &StringLiteral{Token:p.curToken,Value:p.curToken.Literal} }
func (p *Parser) parsePrefixExpression() Expression {
	e:=&PrefixExpression{Token:p.curToken,Operator:p.curToken.Literal}; p.nextToken()
	e.Right=p.parseExpression(PREFIX); return e
}
func (p *Parser) parseInfixExpression(left Expression) Expression {
	e:=&InfixExpression{Token:p.curToken,Operator:p.curToken.Literal,Left:left}
	pr:=p.curPrecedence(); p.nextToken(); e.Right=p.parseExpression(pr); return e
}
func (p *Parser) parseGroupedExpression() Expression {
	p.nextToken(); exp:=p.parseExpression(LOWEST); if !p.expectPeek(RPAREN){return nil}; return exp
}
func (p *Parser) parseIfExpression() Expression {
	e:=&IfExpression{Token:p.curToken}; if !p.expectPeek(LPAREN){return nil}; p.nextToken()
	e.Condition=p.parseExpression(LOWEST); if !p.expectPeek(RPAREN){return nil}
	if !p.expectPeek(LBRACE){return nil}; e.Consequence=p.parseBlockStatement()
	if p.peekTokenIs(ELSE){p.nextToken();if !p.expectPeek(LBRACE){return nil};e.Alternative=p.parseBlockStatement()}
	return e
}
func (p *Parser) parseBlockStatement() *BlockStatement {
	b:=&BlockStatement{Token:p.curToken}; p.nextToken()
	for !p.curTokenIs(RBRACE)&&!p.curTokenIs(EOF_TOKEN){if s:=p.parseStatement();s!=nil{b.Statements=append(b.Statements,s)};p.nextToken()}
	return b
}
func (p *Parser) parseFunctionLiteral() Expression {
	fl:=&FunctionLiteral{Token:p.curToken}; if !p.expectPeek(LPAREN){return nil}
	fl.Parameters=p.parseFunctionParameters(); if !p.expectPeek(LBRACE){return nil}
	fl.Body=p.parseBlockStatement(); return fl
}
func (p *Parser) parseFunctionParameters() []*Identifier {
	ids:=[]*Identifier{}; if p.peekTokenIs(RPAREN){p.nextToken();return ids}; p.nextToken()
	ids=append(ids,&Identifier{Token:p.curToken,Value:p.curToken.Literal})
	for p.peekTokenIs(COMMA){p.nextToken();p.nextToken();ids=append(ids,&Identifier{Token:p.curToken,Value:p.curToken.Literal})}
	if !p.expectPeek(RPAREN){return nil}; return ids
}
func (p *Parser) parseCallExpression(fn Expression) Expression {
	return &CallExpression{Token:p.curToken,Function:fn,Arguments:p.parseExpressionList(RPAREN)}
}
func (p *Parser) parseExpressionList(end TokenType) []Expression {
	list:=[]Expression{}; if p.peekTokenIs(end){p.nextToken();return list}; p.nextToken()
	list=append(list,p.parseExpression(LOWEST))
	for p.peekTokenIs(COMMA){p.nextToken();p.nextToken();list=append(list,p.parseExpression(LOWEST))}
	if !p.expectPeek(end){return nil}; return list
}
func (p *Parser) parseArrayLiteral() Expression {
	return &ArrayLiteral{Token:p.curToken,Elements:p.parseExpressionList(RBRACKET)}
}
func (p *Parser) parseIndexExpression(left Expression) Expression {
	e:=&IndexExpression{Token:p.curToken,Left:left}; p.nextToken()
	e.Index=p.parseExpression(LOWEST); if !p.expectPeek(RBRACKET){return nil}; return e
}
func (p *Parser) parseHashLiteral() Expression {
	h:=&HashLiteral{Token:p.curToken,Pairs:map[Expression]Expression{}}
	for !p.peekTokenIs(RBRACE){p.nextToken();k:=p.parseExpression(LOWEST)
		if !p.expectPeek(COLON){return nil};p.nextToken();v:=p.parseExpression(LOWEST);h.Pairs[k]=v
		if !p.peekTokenIs(RBRACE)&&!p.expectPeek(COMMA){return nil}}
	if !p.expectPeek(RBRACE){return nil}; return h
}

// ─── Object System ───────────────────────────────────
type ObjectType string

const (
	INTEGER_OBJ      ObjectType = "INTEGER"
	BOOLEAN_OBJ      ObjectType = "BOOLEAN"
	NULL_OBJ         ObjectType = "NULL"
	ERROR_OBJ        ObjectType = "ERROR"
	RETURN_VALUE_OBJ ObjectType = "RETURN_VALUE"
)

type Object interface {
	Type() ObjectType
	Inspect() string
}

type IntegerObject struct{ Value int64 }
func (i *IntegerObject) Type() ObjectType { return INTEGER_OBJ }
func (i *IntegerObject) Inspect() string  { return fmt.Sprintf("%d", i.Value) }

type BooleanObject struct{ Value bool }
func (b *BooleanObject) Type() ObjectType { return BOOLEAN_OBJ }
func (b *BooleanObject) Inspect() string  { return fmt.Sprintf("%t", b.Value) }

type NullObject struct{}
func (n *NullObject) Type() ObjectType { return NULL_OBJ }
func (n *NullObject) Inspect() string  { return "null" }

type ErrorObject struct{ Message string }
func (e *ErrorObject) Type() ObjectType { return ERROR_OBJ }
func (e *ErrorObject) Inspect() string  { return "ERROR: " + e.Message }

type ReturnValueObject struct{ Value Object }
func (r *ReturnValueObject) Type() ObjectType { return RETURN_VALUE_OBJ }
func (r *ReturnValueObject) Inspect() string  { return r.Value.Inspect() }

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
		obj, ok = e.outer.Get(name)
	}
	return obj, ok
}

func (e *Environment) Set(name string, val Object) Object {
	e.store[name] = val
	return val
}

func main() {}
`,
  hints: [
    'ObjectType is just a string alias: type ObjectType string',
    'Each object struct needs Type() and Inspect() methods to satisfy the Object interface',
    'NullObject has no fields; its Inspect() returns "null"',
    'Environment.Get checks local store first, then falls back to outer',
  ],
  projectId: 'proj-monkey',
  step: 12,
  totalSteps: 22,
}

export default exercise
