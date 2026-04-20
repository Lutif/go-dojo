import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-06',
  title: 'Monkey — Parser Skeleton',
  category: 'Projects',
  subcategory: 'Monkey Interpreter',
  difficulty: 'intermediate',
  order: 106,
  projectId: 'proj-monkey',
  step: 6,
  totalSteps: 22,
  description: `Build the parser skeleton with token management.

Create a \`Parser\` struct with:
- \`l *Lexer\` — the lexer
- \`curToken Token\` — current token
- \`peekToken Token\` — next token
- \`errors []string\` — parse errors

Implement:
- \`NewParser(l *Lexer) *Parser\` — creates parser, reads two tokens
- \`nextToken()\` — advances curToken and peekToken
- \`ParseProgram() *Program\` — loops calling \`parseStatement()\` until EOF
- \`parseStatement()\` — dispatches on curToken.Type (for now, returns ExpressionStatement wrapping an Identifier for IDENT tokens)
- \`curTokenIs(t TokenType) bool\` and \`peekTokenIs(t TokenType) bool\` helpers
- \`expectPeek(t TokenType) bool\` — if peek matches, advance and return true; else add error`,
  code: `package main

import "fmt"

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
func (es *ExpressionStatement) String() string { if es.Expression!=nil{return es.Expression.String()}; return "" }
type LetStatement struct { Token Token; Name *Identifier; Value Expression }
func (ls *LetStatement) statementNode() {}
func (ls *LetStatement) TokenLiteral() string { return ls.Token.Literal }
func (ls *LetStatement) String() string { return fmt.Sprintf("let %s = %s;",ls.Name.String(),ls.Value.String()) }
type ReturnStatement struct { Token Token; ReturnValue Expression }
func (rs *ReturnStatement) statementNode() {}
func (rs *ReturnStatement) TokenLiteral() string { return rs.Token.Literal }
func (rs *ReturnStatement) String() string { return fmt.Sprintf("return %s;",rs.ReturnValue.String()) }

// TODO: Define Parser struct with l, curToken, peekToken, errors
// TODO: Implement NewParser(l *Lexer) *Parser
// TODO: Implement (p *Parser) nextToken()
// TODO: Implement (p *Parser) curTokenIs(t TokenType) bool
// TODO: Implement (p *Parser) peekTokenIs(t TokenType) bool
// TODO: Implement (p *Parser) expectPeek(t TokenType) bool
// TODO: Implement (p *Parser) Errors() []string
// TODO: Implement (p *Parser) ParseProgram() *Program
// TODO: Implement (p *Parser) parseStatement() Statement

func main() {}
`,
  testCode: `package main

import "testing"

func TestNewParser(t *testing.T) {
	l := NewLexer("x")
	p := NewParser(l)
	if p.curToken.Type != IDENT {
		t.Fatalf("expected curToken IDENT, got %s", p.curToken.Type)
	}
	if p.peekToken.Type != EOF {
		t.Fatalf("expected peekToken EOF, got %s", p.peekToken.Type)
	}
}

func TestParseEmptyProgram(t *testing.T) {
	l := NewLexer("")
	p := NewParser(l)
	prog := p.ParseProgram()
	if prog == nil {
		t.Fatal("ParseProgram returned nil")
	}
	if len(prog.Statements) != 0 {
		t.Fatalf("expected 0 statements, got %d", len(prog.Statements))
	}
}

func TestParseSingleIdentifier(t *testing.T) {
	l := NewLexer("foobar;")
	p := NewParser(l)
	prog := p.ParseProgram()
	if len(prog.Statements) != 1 {
		t.Fatalf("expected 1 statement, got %d", len(prog.Statements))
	}
	es, ok := prog.Statements[0].(*ExpressionStatement)
	if !ok {
		t.Fatalf("expected ExpressionStatement, got %T", prog.Statements[0])
	}
	ident, ok := es.Expression.(*Identifier)
	if !ok {
		t.Fatalf("expected Identifier, got %T", es.Expression)
	}
	if ident.Value != "foobar" {
		t.Fatalf("expected foobar, got %s", ident.Value)
	}
}

func TestExpectPeekError(t *testing.T) {
	l := NewLexer("let 5;")
	p := NewParser(l)
	p.ParseProgram()
	errs := p.Errors()
	if len(errs) == 0 {
		t.Fatal("expected parse errors")
	}
}

func TestCurTokenIs(t *testing.T) {
	l := NewLexer("let")
	p := NewParser(l)
	if !p.curTokenIs(LET) {
		t.Fatal("curTokenIs(LET) should be true")
	}
	if p.curTokenIs(IDENT) {
		t.Fatal("curTokenIs(IDENT) should be false")
	}
}
`,
  solution: `package main

import "fmt"

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
func (es *ExpressionStatement) String() string { if es.Expression!=nil{return es.Expression.String()}; return "" }
type LetStatement struct { Token Token; Name *Identifier; Value Expression }
func (ls *LetStatement) statementNode() {}
func (ls *LetStatement) TokenLiteral() string { return ls.Token.Literal }
func (ls *LetStatement) String() string { return fmt.Sprintf("let %s = %s;",ls.Name.String(),ls.Value.String()) }
type ReturnStatement struct { Token Token; ReturnValue Expression }
func (rs *ReturnStatement) statementNode() {}
func (rs *ReturnStatement) TokenLiteral() string { return rs.Token.Literal }
func (rs *ReturnStatement) String() string { return fmt.Sprintf("return %s;",rs.ReturnValue.String()) }

// --- Parser ---
type Parser struct {
	l         *Lexer
	curToken  Token
	peekToken Token
	errors    []string
}

func NewParser(l *Lexer) *Parser {
	p := &Parser{l: l, errors: []string{}}
	p.nextToken()
	p.nextToken()
	return p
}

func (p *Parser) nextToken() { p.curToken = p.peekToken; p.peekToken = p.l.NextToken() }
func (p *Parser) curTokenIs(t TokenType) bool { return p.curToken.Type == t }
func (p *Parser) peekTokenIs(t TokenType) bool { return p.peekToken.Type == t }
func (p *Parser) Errors() []string { return p.errors }

func (p *Parser) expectPeek(t TokenType) bool {
	if p.peekTokenIs(t) { p.nextToken(); return true }
	p.errors = append(p.errors, fmt.Sprintf("expected next token to be %s, got %s", t, p.peekToken.Type))
	return false
}

func (p *Parser) ParseProgram() *Program {
	prog := &Program{}
	for !p.curTokenIs(EOF) {
		stmt := p.parseStatement()
		if stmt != nil { prog.Statements = append(prog.Statements, stmt) }
		p.nextToken()
	}
	return prog
}

func (p *Parser) parseStatement() Statement {
	switch p.curToken.Type {
	default:
		return p.parseExpressionStatement()
	}
}

func (p *Parser) parseExpressionStatement() *ExpressionStatement {
	stmt := &ExpressionStatement{Token: p.curToken}
	stmt.Expression = &Identifier{Token: p.curToken, Value: p.curToken.Literal}
	if p.peekTokenIs(SEMICOLON) { p.nextToken() }
	return stmt
}

func main() {}
`,
  hints: [
    'NewParser calls nextToken twice so both curToken and peekToken are set.',
    'ParseProgram loops until curToken is EOF, calling parseStatement each iteration.',
    'expectPeek advances only if the peek matches; otherwise it appends an error.',
  ],
}

export default exercise
