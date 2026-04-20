import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-lex-03',
  title: 'Lexer — String Literals & Identifiers',
  category: 'Projects',
  subcategory: 'Lexer',
  difficulty: 'advanced',
  order: 18,
  projectId: 'proj-lex',
  step: 3,
  totalSteps: 6,
  description: `Extend the lexer to handle string literals and identifiers.

**Requirements (cumulative -- includes all previous functionality):**
- All previous token types and operators still work
- Add STRING token type for double-quoted strings: "hello"
- Add IDENT token type for identifiers (letters and underscores)
- Add ASSIGN token type for "="
- Add SEMICOLON token type for ";"
- String literals store their value without the surrounding quotes
- Identifiers start with a letter or underscore, followed by letters, digits, or underscores`,
  code: `package main

type TokenType string

const (
	INT       TokenType = "INT"
	STRING    TokenType = "STRING"
	IDENT     TokenType = "IDENT"
	PLUS      TokenType = "PLUS"
	MINUS     TokenType = "MINUS"
	STAR      TokenType = "STAR"
	SLASH     TokenType = "SLASH"
	LPAREN    TokenType = "LPAREN"
	RPAREN    TokenType = "RPAREN"
	ASSIGN    TokenType = "ASSIGN"
	SEMICOLON TokenType = "SEMICOLON"
	EOF       TokenType = "EOF"
	ILLEGAL   TokenType = "ILLEGAL"
)

type Token struct {
	Type    TokenType
	Literal string
}

func NewToken(tokenType TokenType, literal string) Token {
	return Token{Type: tokenType, Literal: literal}
}

type Lexer struct {
	input string
	pos   int
	ch    byte
}

func New(input string) *Lexer {
	l := &Lexer{input: input}
	l.readChar()
	return l
}

func (l *Lexer) readChar() {
	if l.pos >= len(l.input) {
		l.ch = 0
	} else {
		l.ch = l.input[l.pos]
	}
	l.pos++
}

func (l *Lexer) skipWhitespace() {
	for l.ch == ' ' || l.ch == '\\t' || l.ch == '\\n' || l.ch == '\\r' {
		l.readChar()
	}
}

func isDigit(ch byte) bool {
	return ch >= '0' && ch <= '9'
}

func (l *Lexer) readNumber() string {
	start := l.pos - 1
	for isDigit(l.ch) {
		l.readChar()
	}
	return l.input[start : l.pos-1]
}

// TODO: Add isLetter function (letters and underscore)

// TODO: Add readIdentifier method

// TODO: Add readString method (reads between double quotes)

func (l *Lexer) NextToken() Token {
	l.skipWhitespace()

	if l.ch == 0 {
		return NewToken(EOF, "")
	}

	var tok Token
	switch l.ch {
	case '+':
		tok = NewToken(PLUS, "+")
	case '-':
		tok = NewToken(MINUS, "-")
	case '*':
		tok = NewToken(STAR, "*")
	case '/':
		tok = NewToken(SLASH, "/")
	case '(':
		tok = NewToken(LPAREN, "(")
	case ')':
		tok = NewToken(RPAREN, ")")
	case '=':
		tok = NewToken(ASSIGN, "=")
	case ';':
		tok = NewToken(SEMICOLON, ";")
	// TODO: Add case for '"' to read strings
	default:
		if isDigit(l.ch) {
			return NewToken(INT, l.readNumber())
		}
		// TODO: Add identifier reading here
		tok = NewToken(ILLEGAL, string(l.ch))
	}
	l.readChar()
	return tok
}

func main() {}
`,
  testCode: `package main

import "testing"

func TestLexString(t *testing.T) {
	l := New("  \\"hello\\"  ")
	tok := l.NextToken()
	if tok.Type != STRING || tok.Literal != "hello" {
		t.Errorf("expected STRING/hello, got %s/%s", tok.Type, tok.Literal)
	}
}

func TestLexIdentifier(t *testing.T) {
	l := New("foo")
	tok := l.NextToken()
	if tok.Type != IDENT || tok.Literal != "foo" {
		t.Errorf("expected IDENT/foo, got %s/%s", tok.Type, tok.Literal)
	}
}

func TestLexIdentifierWithDigits(t *testing.T) {
	l := New("var1")
	tok := l.NextToken()
	if tok.Type != IDENT || tok.Literal != "var1" {
		t.Errorf("expected IDENT/var1, got %s/%s", tok.Type, tok.Literal)
	}
}

func TestLexIdentifierUnderscore(t *testing.T) {
	l := New("_private")
	tok := l.NextToken()
	if tok.Type != IDENT || tok.Literal != "_private" {
		t.Errorf("expected IDENT/_private, got %s/%s", tok.Type, tok.Literal)
	}
}

func TestLexAssignment(t *testing.T) {
	l := New("x = 42;")
	expected := []struct {
		typ TokenType
		lit string
	}{
		{IDENT, "x"}, {ASSIGN, "="}, {INT, "42"}, {SEMICOLON, ";"}, {EOF, ""},
	}
	for i, tt := range expected {
		tok := l.NextToken()
		if tok.Type != tt.typ || tok.Literal != tt.lit {
			t.Errorf("token[%d]: expected %s/%s, got %s/%s",
				i, tt.typ, tt.lit, tok.Type, tok.Literal)
		}
	}
}

func TestLexStringAssignment(t *testing.T) {
	l := New("name = \\"Alice\\";")
	expected := []struct {
		typ TokenType
		lit string
	}{
		{IDENT, "name"}, {ASSIGN, "="}, {STRING, "Alice"},
		{SEMICOLON, ";"}, {EOF, ""},
	}
	for i, tt := range expected {
		tok := l.NextToken()
		if tok.Type != tt.typ || tok.Literal != tt.lit {
			t.Errorf("token[%d]: expected %s/%s, got %s/%s",
				i, tt.typ, tt.lit, tok.Type, tok.Literal)
		}
	}
}

func TestLexMathStillWorks(t *testing.T) {
	l := New("3 + 42 * (10 - 2)")
	expected := []struct {
		typ TokenType
		lit string
	}{
		{INT, "3"}, {PLUS, "+"}, {INT, "42"}, {STAR, "*"},
		{LPAREN, "("}, {INT, "10"}, {MINUS, "-"}, {INT, "2"},
		{RPAREN, ")"}, {EOF, ""},
	}
	for i, tt := range expected {
		tok := l.NextToken()
		if tok.Type != tt.typ || tok.Literal != tt.lit {
			t.Errorf("token[%d]: expected %s/%s, got %s/%s",
				i, tt.typ, tt.lit, tok.Type, tok.Literal)
		}
	}
}
`,
  solution: `package main

type TokenType string

const (
	INT       TokenType = "INT"
	STRING    TokenType = "STRING"
	IDENT     TokenType = "IDENT"
	PLUS      TokenType = "PLUS"
	MINUS     TokenType = "MINUS"
	STAR      TokenType = "STAR"
	SLASH     TokenType = "SLASH"
	LPAREN    TokenType = "LPAREN"
	RPAREN    TokenType = "RPAREN"
	ASSIGN    TokenType = "ASSIGN"
	SEMICOLON TokenType = "SEMICOLON"
	EOF       TokenType = "EOF"
	ILLEGAL   TokenType = "ILLEGAL"
)

type Token struct {
	Type    TokenType
	Literal string
}

func NewToken(tokenType TokenType, literal string) Token {
	return Token{Type: tokenType, Literal: literal}
}

type Lexer struct {
	input string
	pos   int
	ch    byte
}

func New(input string) *Lexer {
	l := &Lexer{input: input}
	l.readChar()
	return l
}

func (l *Lexer) readChar() {
	if l.pos >= len(l.input) {
		l.ch = 0
	} else {
		l.ch = l.input[l.pos]
	}
	l.pos++
}

func (l *Lexer) skipWhitespace() {
	for l.ch == ' ' || l.ch == '\\t' || l.ch == '\\n' || l.ch == '\\r' {
		l.readChar()
	}
}

func isDigit(ch byte) bool {
	return ch >= '0' && ch <= '9'
}

func isLetter(ch byte) bool {
	return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch == '_'
}

func (l *Lexer) readNumber() string {
	start := l.pos - 1
	for isDigit(l.ch) {
		l.readChar()
	}
	return l.input[start : l.pos-1]
}

func (l *Lexer) readIdentifier() string {
	start := l.pos - 1
	for isLetter(l.ch) || isDigit(l.ch) {
		l.readChar()
	}
	return l.input[start : l.pos-1]
}

func (l *Lexer) readString() string {
	// skip opening quote
	l.readChar()
	start := l.pos - 1
	for l.ch != '"' && l.ch != 0 {
		l.readChar()
	}
	s := l.input[start : l.pos-1]
	// skip closing quote
	l.readChar()
	return s
}

func (l *Lexer) NextToken() Token {
	l.skipWhitespace()

	if l.ch == 0 {
		return NewToken(EOF, "")
	}

	var tok Token
	switch l.ch {
	case '+':
		tok = NewToken(PLUS, "+")
	case '-':
		tok = NewToken(MINUS, "-")
	case '*':
		tok = NewToken(STAR, "*")
	case '/':
		tok = NewToken(SLASH, "/")
	case '(':
		tok = NewToken(LPAREN, "(")
	case ')':
		tok = NewToken(RPAREN, ")")
	case '=':
		tok = NewToken(ASSIGN, "=")
	case ';':
		tok = NewToken(SEMICOLON, ";")
	case '"':
		return NewToken(STRING, l.readString())
	default:
		if isDigit(l.ch) {
			return NewToken(INT, l.readNumber())
		}
		if isLetter(l.ch) {
			return NewToken(IDENT, l.readIdentifier())
		}
		tok = NewToken(ILLEGAL, string(l.ch))
	}
	l.readChar()
	return tok
}

func main() {}
`,
  hints: [
    'isLetter checks a-z, A-Z, and underscore',
    'readIdentifier is like readNumber but uses isLetter || isDigit for continuation',
    'readString skips the opening quote, reads until closing quote, then skips the closing quote',
  ],
}

export default exercise
