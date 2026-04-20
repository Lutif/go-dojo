import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-04',
  title: 'Monkey — Two-Char Tokens & Strings',
  category: 'Projects',
  subcategory: 'Monkey Interpreter',
  difficulty: 'intermediate',
  order: 104,
  projectId: 'proj-monkey',
  step: 4,
  totalSteps: 22,
  description: `Extend the lexer to handle two-character tokens (\`==\`, \`!=\`) and string literals.

- \`peekChar()\` — look ahead one character without consuming
- Update \`!\` to check for \`!=\` and \`=\` to check for \`==\`
- \`readString()\` — reads characters between double quotes`,
  code: `package main

// --- Tokens (Step 1) ---
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

// --- Lexer (Steps 2-3) ---
type Lexer struct { input string; pos int; readPos int; ch byte }
func NewLexer(input string) *Lexer {
	l := &Lexer{input: input}; l.readChar(); return l
}
func (l *Lexer) readChar() {
	if l.readPos >= len(l.input) { l.ch = 0 } else { l.ch = l.input[l.readPos] }
	l.pos = l.readPos; l.readPos++
}
func (l *Lexer) skipWhitespace() {
	for l.ch == ' ' || l.ch == '\\t' || l.ch == '\\n' || l.ch == '\\r' { l.readChar() }
}
func (l *Lexer) readNumber() string {
	s := l.pos; for l.ch >= '0' && l.ch <= '9' { l.readChar() }; return l.input[s:l.pos]
}
func isLetter(ch byte) bool {
	return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch == '_'
}
func (l *Lexer) readIdentifier() string {
	s := l.pos; for isLetter(l.ch) { l.readChar() }; return l.input[s:l.pos]
}

func (l *Lexer) NextToken() Token {
	var tok Token
	l.skipWhitespace()
	switch l.ch {
	case '+': tok = Token{PLUS, "+"}
	case '-': tok = Token{MINUS, "-"}
	case '*': tok = Token{ASTERISK, "*"}
	case '/': tok = Token{SLASH, "/"}
	case '<': tok = Token{LT, "<"}
	case '>': tok = Token{GT, ">"}
	// TODO: Update '!' to peek for '=' -> NOT_EQ, else BANG
	case '!': tok = Token{BANG, "!"}
	// TODO: Update '=' to peek for '=' -> EQ, else ASSIGN
	case '=': tok = Token{ASSIGN, "="}
	// TODO: Add case '"' to call readString and return STRING token
	case ',': tok = Token{COMMA, ","}
	case ';': tok = Token{SEMICOLON, ";"}
	case '(': tok = Token{LPAREN, "("}
	case ')': tok = Token{RPAREN, ")"}
	case '{': tok = Token{LBRACE, "{"}
	case '}': tok = Token{RBRACE, "}"}
	case 0: return Token{EOF, ""}
	default:
		if l.ch >= '0' && l.ch <= '9' { return Token{INT, l.readNumber()} }
		if isLetter(l.ch) { lit := l.readIdentifier(); return Token{LookupIdent(lit), lit} }
		tok = Token{ILLEGAL, string(l.ch)}
	}
	l.readChar()
	return tok
}

// TODO: Implement (l *Lexer) peekChar() byte
// TODO: Implement (l *Lexer) readString() string

func main() {}
`,
  testCode: `package main

import "testing"

func TestTwoCharTokens(t *testing.T) {
	l := NewLexer("== != = !")
	tests := []struct{ typ TokenType; lit string }{
		{EQ, "=="}, {NOT_EQ, "!="}, {ASSIGN, "="}, {BANG, "!"},
	}
	for i, tt := range tests {
		tok := l.NextToken()
		if tok.Type != tt.typ || tok.Literal != tt.lit {
			t.Fatalf("test[%d]: expected {%s %q}, got {%s %q}", i, tt.typ, tt.lit, tok.Type, tok.Literal)
		}
	}
}

func TestStringLiteral(t *testing.T) {
	l := NewLexer(\` "hello world" \`)
	tok := l.NextToken()
	if tok.Type != STRING || tok.Literal != "hello world" {
		t.Fatalf("expected STRING %q, got %s %q", "hello world", tok.Type, tok.Literal)
	}
}

func TestMixedTokens(t *testing.T) {
	input := \`let name = "monkey"; if (x == 10) { return true; }\`
	l := NewLexer(input)
	expected := []TokenType{LET, IDENT, ASSIGN, STRING, SEMICOLON, IF, LPAREN, IDENT, EQ, INT, RPAREN, LBRACE, RETURN, TRUE, SEMICOLON, RBRACE}
	for i, exp := range expected {
		tok := l.NextToken()
		if tok.Type != exp {
			t.Fatalf("test[%d]: expected %s, got %s (%q)", i, exp, tok.Type, tok.Literal)
		}
	}
}
`,
  solution: `package main

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
func NewLexer(input string) *Lexer {
	l := &Lexer{input: input}; l.readChar(); return l
}
func (l *Lexer) readChar() {
	if l.readPos >= len(l.input) { l.ch = 0 } else { l.ch = l.input[l.readPos] }
	l.pos = l.readPos; l.readPos++
}
func (l *Lexer) peekChar() byte {
	if l.readPos >= len(l.input) { return 0 }
	return l.input[l.readPos]
}
func (l *Lexer) skipWhitespace() {
	for l.ch == ' ' || l.ch == '\\t' || l.ch == '\\n' || l.ch == '\\r' { l.readChar() }
}
func (l *Lexer) readNumber() string {
	s := l.pos; for l.ch >= '0' && l.ch <= '9' { l.readChar() }; return l.input[s:l.pos]
}
func isLetter(ch byte) bool {
	return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch == '_'
}
func (l *Lexer) readIdentifier() string {
	s := l.pos; for isLetter(l.ch) { l.readChar() }; return l.input[s:l.pos]
}
func (l *Lexer) readString() string {
	l.readChar() // skip opening quote
	s := l.pos
	for l.ch != '"' && l.ch != 0 { l.readChar() }
	str := l.input[s:l.pos]
	l.readChar() // skip closing quote
	return str
}

func (l *Lexer) NextToken() Token {
	var tok Token
	l.skipWhitespace()
	switch l.ch {
	case '+': tok = Token{PLUS, "+"}
	case '-': tok = Token{MINUS, "-"}
	case '*': tok = Token{ASTERISK, "*"}
	case '/': tok = Token{SLASH, "/"}
	case '<': tok = Token{LT, "<"}
	case '>': tok = Token{GT, ">"}
	case '!':
		if l.peekChar() == '=' { l.readChar(); tok = Token{NOT_EQ, "!="} } else { tok = Token{BANG, "!"} }
	case '=':
		if l.peekChar() == '=' { l.readChar(); tok = Token{EQ, "=="} } else { tok = Token{ASSIGN, "="} }
	case '"':
		return Token{STRING, l.readString()}
	case ',': tok = Token{COMMA, ","}
	case ';': tok = Token{SEMICOLON, ";"}
	case '(': tok = Token{LPAREN, "("}
	case ')': tok = Token{RPAREN, ")"}
	case '{': tok = Token{LBRACE, "{"}
	case '}': tok = Token{RBRACE, "}"}
	case 0: return Token{EOF, ""}
	default:
		if l.ch >= '0' && l.ch <= '9' { return Token{INT, l.readNumber()} }
		if isLetter(l.ch) { lit := l.readIdentifier(); return Token{LookupIdent(lit), lit} }
		tok = Token{ILLEGAL, string(l.ch)}
	}
	l.readChar()
	return tok
}

func main() {}
`,
  hints: [
    'peekChar returns input[readPos] without advancing the position.',
    'For ==: when you see =, peek; if next is =, readChar again and return EQ with literal "==".',
    'readString skips the opening quote, reads until closing quote or end, then skips the closing quote.',
  ],
}

export default exercise
