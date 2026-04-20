import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-lex-02',
  title: 'Lexer — Lex Integers & Operators',
  category: 'Projects',
  subcategory: 'Lexer',
  difficulty: 'intermediate',
  order: 17,
  projectId: 'proj-lex',
  step: 2,
  totalSteps: 6,
  description: `Implement the core lexer that tokenizes integers and single-character operators.

**Requirements:**
- Lexer struct with New(input string) *Lexer constructor
- NextToken() Token method that returns the next token
- Lex integers (sequences of digits): "123" becomes Token{INT, "123"}
- Lex single-char operators: +, -, *, /, (, )
- Skip whitespace between tokens
- Return EOF token at end of input
- Return ILLEGAL for unrecognized characters`,
  code: `package main

// TokenType represents the type of a lexer token.
type TokenType string

const (
	INT     TokenType = "INT"
	PLUS    TokenType = "PLUS"
	MINUS   TokenType = "MINUS"
	STAR    TokenType = "STAR"
	SLASH   TokenType = "SLASH"
	LPAREN  TokenType = "LPAREN"
	RPAREN  TokenType = "RPAREN"
	EOF     TokenType = "EOF"
	ILLEGAL TokenType = "ILLEGAL"
)

// Token represents a single lexical token.
type Token struct {
	Type    TokenType
	Literal string
}

// NewToken creates a new Token.
func NewToken(tokenType TokenType, literal string) Token {
	return Token{Type: tokenType, Literal: literal}
}

// Lexer tokenizes an input string.
type Lexer struct {
	// TODO: Add fields: input string, pos int, ch byte
}

// New creates a new Lexer for the given input.
func New(input string) *Lexer {
	// TODO: Initialize Lexer and read first character
	return nil
}

// NextToken returns the next token from the input.
func (l *Lexer) NextToken() Token {
	// TODO: Implement token scanning
	// 1. Skip whitespace
	// 2. Check current character
	// 3. For digits, read full number
	// 4. For operators, return single-char token
	// 5. At end of input, return EOF
	return NewToken(EOF, "")
}

func main() {}
`,
  testCode: `package main

import "testing"

func TestLexSingleDigit(t *testing.T) {
	l := New("5")
	tok := l.NextToken()
	if tok.Type != INT || tok.Literal != "5" {
		t.Errorf("expected INT/5, got %s/%s", tok.Type, tok.Literal)
	}
	tok = l.NextToken()
	if tok.Type != EOF {
		t.Errorf("expected EOF, got %s", tok.Type)
	}
}

func TestLexMultiDigit(t *testing.T) {
	l := New("123")
	tok := l.NextToken()
	if tok.Type != INT || tok.Literal != "123" {
		t.Errorf("expected INT/123, got %s/%s", tok.Type, tok.Literal)
	}
}

func TestLexOperators(t *testing.T) {
	l := New("+-*/()")
	tests := []struct {
		typ TokenType
		lit string
	}{
		{PLUS, "+"}, {MINUS, "-"}, {STAR, "*"},
		{SLASH, "/"}, {LPAREN, "("}, {RPAREN, ")"},
	}
	for _, tt := range tests {
		tok := l.NextToken()
		if tok.Type != tt.typ || tok.Literal != tt.lit {
			t.Errorf("expected %s/%s, got %s/%s", tt.typ, tt.lit, tok.Type, tok.Literal)
		}
	}
}

func TestLexExpression(t *testing.T) {
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

func TestLexWhitespace(t *testing.T) {
	l := New("  1  +  2  ")
	tok := l.NextToken()
	if tok.Type != INT || tok.Literal != "1" {
		t.Errorf("expected INT/1, got %s/%s", tok.Type, tok.Literal)
	}
}

func TestLexIllegal(t *testing.T) {
	l := New("@")
	tok := l.NextToken()
	if tok.Type != ILLEGAL {
		t.Errorf("expected ILLEGAL, got %s", tok.Type)
	}
}

func TestLexEmpty(t *testing.T) {
	l := New("")
	tok := l.NextToken()
	if tok.Type != EOF {
		t.Errorf("expected EOF, got %s", tok.Type)
	}
}
`,
  solution: `package main

// TokenType represents the type of a lexer token.
type TokenType string

const (
	INT     TokenType = "INT"
	PLUS    TokenType = "PLUS"
	MINUS   TokenType = "MINUS"
	STAR    TokenType = "STAR"
	SLASH   TokenType = "SLASH"
	LPAREN  TokenType = "LPAREN"
	RPAREN  TokenType = "RPAREN"
	EOF     TokenType = "EOF"
	ILLEGAL TokenType = "ILLEGAL"
)

// Token represents a single lexical token.
type Token struct {
	Type    TokenType
	Literal string
}

// NewToken creates a new Token.
func NewToken(tokenType TokenType, literal string) Token {
	return Token{Type: tokenType, Literal: literal}
}

// Lexer tokenizes an input string.
type Lexer struct {
	input string
	pos   int
	ch    byte
}

// New creates a new Lexer for the given input.
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

// NextToken returns the next token from the input.
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
	default:
		if isDigit(l.ch) {
			return NewToken(INT, l.readNumber())
		}
		tok = NewToken(ILLEGAL, string(l.ch))
	}
	l.readChar()
	return tok
}

func main() {}
`,
  hints: [
    'Keep a pos (current position) and ch (current character) in the Lexer struct',
    'readChar advances pos and updates ch; set ch to 0 at end of input',
    'For numbers, record the start position and keep reading while isDigit(ch)',
  ],
}

export default exercise
