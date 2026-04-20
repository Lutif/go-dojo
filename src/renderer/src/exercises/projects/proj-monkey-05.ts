import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-05',
  title: 'Monkey — AST Nodes',
  category: 'Projects',
  subcategory: 'Monkey Interpreter',
  difficulty: 'intermediate',
  order: 105,
  projectId: 'proj-monkey',
  step: 5,
  totalSteps: 22,
  description: `Define the AST (Abstract Syntax Tree) node interfaces and types.

Create interfaces:
- \`Node\` with \`TokenLiteral() string\` and \`String() string\`
- \`Statement\` (embeds Node) with \`statementNode()\`
- \`Expression\` (embeds Node) with \`expressionNode()\`

Create types:
- \`Program\` — has \`Statements []Statement\`
- \`Identifier\` — has \`Token\` and \`Value string\`
- \`IntegerLiteral\` — has \`Token\` and \`Value int64\`
- \`ExpressionStatement\` — wraps an Expression
- \`LetStatement\` — has Name (*Identifier) and Value (Expression)
- \`ReturnStatement\` — has ReturnValue (Expression)`,
  code: `package main

import "fmt"

// --- Tokens & Lexer (Steps 1-4) ---
type TokenType string
type Token struct { Type TokenType; Literal string }
const (
	INT = TokenType("INT"); IDENT = TokenType("IDENT"); STRING = TokenType("STRING")
	ASSIGN = TokenType("ASSIGN"); PLUS = TokenType("PLUS"); MINUS = TokenType("MINUS")
	ASTERISK = TokenType("ASTERISK"); SLASH = TokenType("SLASH"); BANG = TokenType("BANG")
	LT = TokenType("LT"); GT = TokenType("GT"); EQ = TokenType("EQ"); NOT_EQ = TokenType("NOT_EQ")
	COMMA = TokenType("COMMA"); SEMICOLON = TokenType("SEMICOLON")
	LPAREN = TokenType("LPAREN"); RPAREN = TokenType("RPAREN")
	LBRACE = TokenType("LBRACE"); RBRACE = TokenType("RBRACE")
	LET = TokenType("LET"); FUNCTION = TokenType("FUNCTION")
	TRUE = TokenType("TRUE"); FALSE = TokenType("FALSE")
	IF = TokenType("IF"); ELSE = TokenType("ELSE"); RETURN = TokenType("RETURN")
	EOF = TokenType("EOF"); ILLEGAL = TokenType("ILLEGAL")
)

var keywords = map[string]TokenType{
	"let": LET, "fn": FUNCTION, "if": IF, "else": ELSE,
	"return": RETURN, "true": TRUE, "false": FALSE,
}
func LookupIdent(ident string) TokenType {
	if tok, ok := keywords[ident]; ok { return tok }; return IDENT
}
type Lexer struct { input string; pos int; readPos int; ch byte }
func NewLexer(input string) *Lexer { l := &Lexer{input: input}; l.readChar(); return l }
func (l *Lexer) readChar() {
	if l.readPos >= len(l.input) { l.ch = 0 } else { l.ch = l.input[l.readPos] }
	l.pos = l.readPos; l.readPos++
}
func (l *Lexer) peekChar() byte { if l.readPos >= len(l.input) { return 0 }; return l.input[l.readPos] }
func (l *Lexer) skipWhitespace() { for l.ch==' '||l.ch=='\\t'||l.ch=='\\n'||l.ch=='\\r' { l.readChar() } }
func (l *Lexer) readNumber() string { s:=l.pos; for l.ch>='0'&&l.ch<='9' { l.readChar() }; return l.input[s:l.pos] }
func isLetter(ch byte) bool { return (ch>='a'&&ch<='z')||(ch>='A'&&ch<='Z')||ch=='_' }
func (l *Lexer) readIdentifier() string { s:=l.pos; for isLetter(l.ch) { l.readChar() }; return l.input[s:l.pos] }
func (l *Lexer) readString() string {
	l.readChar(); s:=l.pos; for l.ch!='"'&&l.ch!=0 { l.readChar() }
	str:=l.input[s:l.pos]; l.readChar(); return str
}
func (l *Lexer) NextToken() Token {
	var tok Token; l.skipWhitespace()
	switch l.ch {
	case '+': tok=Token{PLUS,"+"}; case '-': tok=Token{MINUS,"-"}
	case '*': tok=Token{ASTERISK,"*"}; case '/': tok=Token{SLASH,"/"}
	case '<': tok=Token{LT,"<"}; case '>': tok=Token{GT,">"}
	case '!':
		if l.peekChar()=='=' { l.readChar(); tok=Token{NOT_EQ,"!="} } else { tok=Token{BANG,"!"} }
	case '=':
		if l.peekChar()=='=' { l.readChar(); tok=Token{EQ,"=="} } else { tok=Token{ASSIGN,"="} }
	case '"': return Token{STRING,l.readString()}
	case ',': tok=Token{COMMA,","}; case ';': tok=Token{SEMICOLON,";"}
	case '(': tok=Token{LPAREN,"("}; case ')': tok=Token{RPAREN,")"}
	case '{': tok=Token{LBRACE,"{"}; case '}': tok=Token{RBRACE,"}"}
	case 0: return Token{EOF,""}
	default:
		if l.ch>='0'&&l.ch<='9' { return Token{INT,l.readNumber()} }
		if isLetter(l.ch) { lit:=l.readIdentifier(); return Token{LookupIdent(lit),lit} }
		tok=Token{ILLEGAL,string(l.ch)}
	}
	l.readChar(); return tok
}

// TODO: Define Node interface with TokenLiteral() string and String() string
// TODO: Define Statement interface (Node + statementNode())
// TODO: Define Expression interface (Node + expressionNode())
// TODO: Define Program struct with Statements []Statement
// TODO: Define Identifier with Token, Value string
// TODO: Define IntegerLiteral with Token, Value int64
// TODO: Define ExpressionStatement with Token, Expression
// TODO: Define LetStatement with Token, Name *Identifier, Value Expression
// TODO: Define ReturnStatement with Token, ReturnValue Expression

// Hint: Each type needs TokenLiteral(), String(), and either statementNode() or expressionNode()

var _ = fmt.Sprintf // keep fmt import

func main() {}
`,
  testCode: `package main

import (
	"fmt"
	"testing"
)

func TestProgramNode(t *testing.T) {
	p := &Program{}
	if p.TokenLiteral() != "" {
		t.Fatal("empty program should have empty TokenLiteral")
	}
	p.Statements = append(p.Statements, &LetStatement{
		Token: Token{LET, "let"},
		Name:  &Identifier{Token: Token{IDENT, "x"}, Value: "x"},
		Value: &IntegerLiteral{Token: Token{INT, "5"}, Value: 5},
	})
	if p.TokenLiteral() != "let" {
		t.Fatalf("expected 'let', got %q", p.TokenLiteral())
	}
}

func TestIdentifierExpression(t *testing.T) {
	id := &Identifier{Token: Token{IDENT, "foobar"}, Value: "foobar"}
	if id.TokenLiteral() != "foobar" { t.Fatal("wrong TokenLiteral") }
	if id.String() != "foobar" { t.Fatal("wrong String") }
	id.expressionNode() // must compile
}

func TestIntegerLiteral(t *testing.T) {
	il := &IntegerLiteral{Token: Token{INT, "42"}, Value: 42}
	if il.TokenLiteral() != "42" { t.Fatal("wrong TokenLiteral") }
	if il.String() != "42" { t.Fatal("wrong String") }
	il.expressionNode()
}

func TestLetStatementString(t *testing.T) {
	ls := &LetStatement{
		Token: Token{LET, "let"},
		Name:  &Identifier{Token: Token{IDENT, "x"}, Value: "x"},
		Value: &IntegerLiteral{Token: Token{INT, "10"}, Value: 10},
	}
	ls.statementNode()
	s := ls.String()
	if s != "let x = 10;" {
		t.Fatalf("expected 'let x = 10;', got %q", s)
	}
}

func TestReturnStatementString(t *testing.T) {
	rs := &ReturnStatement{
		Token:       Token{RETURN, "return"},
		ReturnValue: &Identifier{Token: Token{IDENT, "y"}, Value: "y"},
	}
	rs.statementNode()
	s := rs.String()
	if s != "return y;" {
		t.Fatalf("expected 'return y;', got %q", s)
	}
}

func TestExpressionStatement(t *testing.T) {
	es := &ExpressionStatement{
		Token:      Token{IDENT, "x"},
		Expression: &Identifier{Token: Token{IDENT, "x"}, Value: "x"},
	}
	es.statementNode()
	if es.String() != "x" { t.Fatalf("expected 'x', got %q", es.String()) }
}

func TestNodeInterfaces(t *testing.T) {
	// Verify interface compliance
	var _ Node = &Program{}
	var _ Statement = &LetStatement{}
	var _ Statement = &ReturnStatement{}
	var _ Statement = &ExpressionStatement{}
	var _ Expression = &Identifier{}
	var _ Expression = &IntegerLiteral{}
	_ = fmt.Sprintf("ok")
}
`,
  solution: `package main

import "fmt"

type TokenType string
type Token struct { Type TokenType; Literal string }
const (
	INT = TokenType("INT"); IDENT = TokenType("IDENT"); STRING = TokenType("STRING")
	ASSIGN = TokenType("ASSIGN"); PLUS = TokenType("PLUS"); MINUS = TokenType("MINUS")
	ASTERISK = TokenType("ASTERISK"); SLASH = TokenType("SLASH"); BANG = TokenType("BANG")
	LT = TokenType("LT"); GT = TokenType("GT"); EQ = TokenType("EQ"); NOT_EQ = TokenType("NOT_EQ")
	COMMA = TokenType("COMMA"); SEMICOLON = TokenType("SEMICOLON")
	LPAREN = TokenType("LPAREN"); RPAREN = TokenType("RPAREN")
	LBRACE = TokenType("LBRACE"); RBRACE = TokenType("RBRACE")
	LET = TokenType("LET"); FUNCTION = TokenType("FUNCTION")
	TRUE = TokenType("TRUE"); FALSE = TokenType("FALSE")
	IF = TokenType("IF"); ELSE = TokenType("ELSE"); RETURN = TokenType("RETURN")
	EOF = TokenType("EOF"); ILLEGAL = TokenType("ILLEGAL")
)
var keywords = map[string]TokenType{
	"let": LET, "fn": FUNCTION, "if": IF, "else": ELSE,
	"return": RETURN, "true": TRUE, "false": FALSE,
}
func LookupIdent(ident string) TokenType {
	if tok, ok := keywords[ident]; ok { return tok }; return IDENT
}
type Lexer struct { input string; pos int; readPos int; ch byte }
func NewLexer(input string) *Lexer { l := &Lexer{input: input}; l.readChar(); return l }
func (l *Lexer) readChar() {
	if l.readPos >= len(l.input) { l.ch = 0 } else { l.ch = l.input[l.readPos] }
	l.pos = l.readPos; l.readPos++
}
func (l *Lexer) peekChar() byte { if l.readPos >= len(l.input) { return 0 }; return l.input[l.readPos] }
func (l *Lexer) skipWhitespace() { for l.ch==' '||l.ch=='\\t'||l.ch=='\\n'||l.ch=='\\r' { l.readChar() } }
func (l *Lexer) readNumber() string { s:=l.pos; for l.ch>='0'&&l.ch<='9' { l.readChar() }; return l.input[s:l.pos] }
func isLetter(ch byte) bool { return (ch>='a'&&ch<='z')||(ch>='A'&&ch<='Z')||ch=='_' }
func (l *Lexer) readIdentifier() string { s:=l.pos; for isLetter(l.ch) { l.readChar() }; return l.input[s:l.pos] }
func (l *Lexer) readString() string {
	l.readChar(); s:=l.pos; for l.ch!='"'&&l.ch!=0 { l.readChar() }
	str:=l.input[s:l.pos]; l.readChar(); return str
}
func (l *Lexer) NextToken() Token {
	var tok Token; l.skipWhitespace()
	switch l.ch {
	case '+': tok=Token{PLUS,"+"}; case '-': tok=Token{MINUS,"-"}
	case '*': tok=Token{ASTERISK,"*"}; case '/': tok=Token{SLASH,"/"}
	case '<': tok=Token{LT,"<"}; case '>': tok=Token{GT,">"}
	case '!':
		if l.peekChar()=='=' { l.readChar(); tok=Token{NOT_EQ,"!="} } else { tok=Token{BANG,"!"} }
	case '=':
		if l.peekChar()=='=' { l.readChar(); tok=Token{EQ,"=="} } else { tok=Token{ASSIGN,"="} }
	case '"': return Token{STRING,l.readString()}
	case ',': tok=Token{COMMA,","}; case ';': tok=Token{SEMICOLON,";"}
	case '(': tok=Token{LPAREN,"("}; case ')': tok=Token{RPAREN,")"}
	case '{': tok=Token{LBRACE,"{"}; case '}': tok=Token{RBRACE,"}"}
	case 0: return Token{EOF,""}
	default:
		if l.ch>='0'&&l.ch<='9' { return Token{INT,l.readNumber()} }
		if isLetter(l.ch) { lit:=l.readIdentifier(); return Token{LookupIdent(lit),lit} }
		tok=Token{ILLEGAL,string(l.ch)}
	}
	l.readChar(); return tok
}

// --- AST ---
type Node interface { TokenLiteral() string; String() string }
type Statement interface { Node; statementNode() }
type Expression interface { Node; expressionNode() }

type Program struct { Statements []Statement }
func (p *Program) TokenLiteral() string {
	if len(p.Statements) > 0 { return p.Statements[0].TokenLiteral() }; return ""
}
func (p *Program) String() string {
	s := ""; for _, stmt := range p.Statements { s += stmt.String() }; return s
}

type Identifier struct { Token Token; Value string }
func (i *Identifier) expressionNode() {}
func (i *Identifier) TokenLiteral() string { return i.Token.Literal }
func (i *Identifier) String() string { return i.Value }

type IntegerLiteral struct { Token Token; Value int64 }
func (il *IntegerLiteral) expressionNode() {}
func (il *IntegerLiteral) TokenLiteral() string { return il.Token.Literal }
func (il *IntegerLiteral) String() string { return il.Token.Literal }

type ExpressionStatement struct { Token Token; Expression Expression }
func (es *ExpressionStatement) statementNode() {}
func (es *ExpressionStatement) TokenLiteral() string { return es.Token.Literal }
func (es *ExpressionStatement) String() string {
	if es.Expression != nil { return es.Expression.String() }; return ""
}

type LetStatement struct { Token Token; Name *Identifier; Value Expression }
func (ls *LetStatement) statementNode() {}
func (ls *LetStatement) TokenLiteral() string { return ls.Token.Literal }
func (ls *LetStatement) String() string {
	return fmt.Sprintf("let %s = %s;", ls.Name.String(), ls.Value.String())
}

type ReturnStatement struct { Token Token; ReturnValue Expression }
func (rs *ReturnStatement) statementNode() {}
func (rs *ReturnStatement) TokenLiteral() string { return rs.Token.Literal }
func (rs *ReturnStatement) String() string {
	return fmt.Sprintf("return %s;", rs.ReturnValue.String())
}

func main() {}
`,
  hints: [
    'Node is the base interface; Statement and Expression extend it with marker methods.',
    'Program.TokenLiteral returns the first statement\'s TokenLiteral, or "".',
    'LetStatement.String() should format as "let <name> = <value>;".',
  ],
}

export default exercise
