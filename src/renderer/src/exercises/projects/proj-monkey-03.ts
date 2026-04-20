import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-03',
  title: 'Monkey — Keywords & Identifiers',
  category: 'Projects',
  subcategory: 'Monkey Interpreter',
  difficulty: 'intermediate',
  order: 103,
  projectId: 'proj-monkey',
  step: 3,
  totalSteps: 22,
  description: `Add identifier and keyword support to the lexer.

Implement:
- \`readIdentifier()\` — reads consecutive letters and underscores
- \`LookupIdent(ident string) TokenType\` — returns the keyword token type if the identifier is a keyword, otherwise IDENT

Keywords: let, fn, if, else, return, true, false.`,
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

// --- Lexer (Step 2) ---
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
	case '!': tok = Token{BANG, "!"}
	case '=': tok = Token{ASSIGN, "="}
	case ',': tok = Token{COMMA, ","}
	case ';': tok = Token{SEMICOLON, ";"}
	case '(': tok = Token{LPAREN, "("}
	case ')': tok = Token{RPAREN, ")"}
	case '{': tok = Token{LBRACE, "{"}
	case '}': tok = Token{RBRACE, "}"}
	case 0: return Token{EOF, ""}
	default:
		if l.ch >= '0' && l.ch <= '9' { return Token{INT, l.readNumber()} }
		if isLetter(l.ch) {
			lit := l.readIdentifier()
			return Token{LookupIdent(lit), lit}
		}
		tok = Token{ILLEGAL, string(l.ch)}
	}
	l.readChar()
	return tok
}

// TODO: Implement LookupIdent(ident string) TokenType
//   - Use a map of keywords: let->LET, fn->FUNCTION, if->IF, else->ELSE,
//     return->RETURN, true->TRUE, false->FALSE
//   - If not found, return IDENT

// TODO: Implement (l *Lexer) readIdentifier() string
//   - Read while isLetter(l.ch) is true

func main() {}
`,
  testCode: `package main

import "testing"

func TestLookupIdent(t *testing.T) {
	tests := []struct{ input string; want TokenType }{
		{"let", LET}, {"fn", FUNCTION}, {"if", IF}, {"else", ELSE},
		{"return", RETURN}, {"true", TRUE}, {"false", FALSE},
		{"foo", IDENT}, {"bar", IDENT}, {"x", IDENT},
	}
	for _, tt := range tests {
		got := LookupIdent(tt.input)
		if got != tt.want {
			t.Errorf("LookupIdent(%q) = %s, want %s", tt.input, got, tt.want)
		}
	}
}

func TestLexIdentifiersAndKeywords(t *testing.T) {
	input := "let five = 5;"
	l := NewLexer(input)
	expected := []struct{ typ TokenType; lit string }{
		{LET, "let"}, {IDENT, "five"}, {ASSIGN, "="}, {INT, "5"}, {SEMICOLON, ";"},
	}
	for i, e := range expected {
		tok := l.NextToken()
		if tok.Type != e.typ || tok.Literal != e.lit {
			t.Fatalf("test[%d]: expected {%s %q}, got {%s %q}", i, e.typ, e.lit, tok.Type, tok.Literal)
		}
	}
}

func TestLexFunctionDef(t *testing.T) {
	input := "let add = fn(x, y) { x + y; };"
	l := NewLexer(input)
	expected := []TokenType{LET, IDENT, ASSIGN, FUNCTION, LPAREN, IDENT, COMMA, IDENT, RPAREN, LBRACE, IDENT, PLUS, IDENT, SEMICOLON, RBRACE, SEMICOLON}
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
	if tok, ok := keywords[ident]; ok { return tok }
	return IDENT
}

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
	case '!': tok = Token{BANG, "!"}
	case '=': tok = Token{ASSIGN, "="}
	case ',': tok = Token{COMMA, ","}
	case ';': tok = Token{SEMICOLON, ";"}
	case '(': tok = Token{LPAREN, "("}
	case ')': tok = Token{RPAREN, ")"}
	case '{': tok = Token{LBRACE, "{"}
	case '}': tok = Token{RBRACE, "}"}
	case 0: return Token{EOF, ""}
	default:
		if l.ch >= '0' && l.ch <= '9' { return Token{INT, l.readNumber()} }
		if isLetter(l.ch) {
			lit := l.readIdentifier()
			return Token{LookupIdent(lit), lit}
		}
		tok = Token{ILLEGAL, string(l.ch)}
	}
	l.readChar()
	return tok
}

func main() {}
`,
  hints: [
    'Create a map[string]TokenType for keywords: let, fn, if, else, return, true, false.',
    'readIdentifier loops while the character is a letter or underscore.',
    'After reading an identifier, use LookupIdent to check if it is a keyword.',
  ],
}

export default exercise
