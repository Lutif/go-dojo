import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-lex-04',
  title: 'Lexer — Keyword Recognition',
  category: 'Projects',
  subcategory: 'Lexer',
  difficulty: 'advanced',
  order: 19,
  projectId: 'proj-lex',
  step: 4,
  totalSteps: 6,
  description: `Add keyword recognition to the lexer. After reading an identifier, check if it matches a reserved keyword.

**Requirements (cumulative):**
- All previous functionality still works
- Add keyword token types: LET, FN, IF, ELSE, RETURN, TRUE, FALSE
- When an identifier matches a keyword, return the keyword token type instead of IDENT
- Use a lookup map for keyword detection`,
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
	// TODO: Add keyword token types: LET, FN, IF, ELSE, RETURN, TRUE, FALSE
)

type Token struct {
	Type    TokenType
	Literal string
}

func NewToken(tokenType TokenType, literal string) Token {
	return Token{Type: tokenType, Literal: literal}
}

// TODO: Create a keywords map from string to TokenType

// LookupIdent checks if an identifier is a keyword.
// Returns the keyword TokenType if found, IDENT otherwise.
func LookupIdent(ident string) TokenType {
	// TODO: Look up ident in keywords map
	return IDENT
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

func isDigit(ch byte) bool { return ch >= '0' && ch <= '9' }
func isLetter(ch byte) bool {
	return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch == '_'
}

func (l *Lexer) readNumber() string {
	start := l.pos - 1
	for isDigit(l.ch) { l.readChar() }
	return l.input[start : l.pos-1]
}

func (l *Lexer) readIdentifier() string {
	start := l.pos - 1
	for isLetter(l.ch) || isDigit(l.ch) { l.readChar() }
	return l.input[start : l.pos-1]
}

func (l *Lexer) readString() string {
	l.readChar()
	start := l.pos - 1
	for l.ch != '"' && l.ch != 0 { l.readChar() }
	s := l.input[start : l.pos-1]
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
	case '+': tok = NewToken(PLUS, "+")
	case '-': tok = NewToken(MINUS, "-")
	case '*': tok = NewToken(STAR, "*")
	case '/': tok = NewToken(SLASH, "/")
	case '(': tok = NewToken(LPAREN, "(")
	case ')': tok = NewToken(RPAREN, ")")
	case '=': tok = NewToken(ASSIGN, "=")
	case ';': tok = NewToken(SEMICOLON, ";")
	case '"': return NewToken(STRING, l.readString())
	default:
		if isDigit(l.ch) {
			return NewToken(INT, l.readNumber())
		}
		if isLetter(l.ch) {
			ident := l.readIdentifier()
			// TODO: Use LookupIdent to check for keywords
			return NewToken(IDENT, ident)
		}
		tok = NewToken(ILLEGAL, string(l.ch))
	}
	l.readChar()
	return tok
}

func main() {}
`,
  testCode: `package main

import "testing"

func TestLexKeywords(t *testing.T) {
	input := "let fn if else return true false"
	l := New(input)
	expected := []struct {
		typ TokenType
		lit string
	}{
		{LET, "let"}, {FN, "fn"}, {IF, "if"}, {ELSE, "else"},
		{RETURN, "return"}, {TRUE, "true"}, {FALSE, "false"}, {EOF, ""},
	}
	for i, tt := range expected {
		tok := l.NextToken()
		if tok.Type != tt.typ || tok.Literal != tt.lit {
			t.Errorf("token[%d]: expected %s/%s, got %s/%s",
				i, tt.typ, tt.lit, tok.Type, tok.Literal)
		}
	}
}

func TestLexIdentNotKeyword(t *testing.T) {
	l := New("letter fns iffy")
	expected := []struct {
		typ TokenType
		lit string
	}{
		{IDENT, "letter"}, {IDENT, "fns"}, {IDENT, "iffy"}, {EOF, ""},
	}
	for i, tt := range expected {
		tok := l.NextToken()
		if tok.Type != tt.typ || tok.Literal != tt.lit {
			t.Errorf("token[%d]: expected %s/%s, got %s/%s",
				i, tt.typ, tt.lit, tok.Type, tok.Literal)
		}
	}
}

func TestLexLetStatement(t *testing.T) {
	l := New("let x = 5;")
	expected := []struct {
		typ TokenType
		lit string
	}{
		{LET, "let"}, {IDENT, "x"}, {ASSIGN, "="}, {INT, "5"},
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

func TestLexFnDefinition(t *testing.T) {
	l := New("fn add(a b) return a + b;")
	expected := []struct {
		typ TokenType
		lit string
	}{
		{FN, "fn"}, {IDENT, "add"}, {LPAREN, "("}, {IDENT, "a"},
		{IDENT, "b"}, {RPAREN, ")"}, {RETURN, "return"}, {IDENT, "a"},
		{PLUS, "+"}, {IDENT, "b"}, {SEMICOLON, ";"}, {EOF, ""},
	}
	for i, tt := range expected {
		tok := l.NextToken()
		if tok.Type != tt.typ || tok.Literal != tt.lit {
			t.Errorf("token[%d]: expected %s/%s, got %s/%s",
				i, tt.typ, tt.lit, tok.Type, tok.Literal)
		}
	}
}

func TestLookupIdent(t *testing.T) {
	if LookupIdent("let") != LET {
		t.Error("let should be LET keyword")
	}
	if LookupIdent("foo") != IDENT {
		t.Error("foo should be IDENT")
	}
	if LookupIdent("true") != TRUE {
		t.Error("true should be TRUE keyword")
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
	LET       TokenType = "LET"
	FN        TokenType = "FN"
	IF        TokenType = "IF"
	ELSE      TokenType = "ELSE"
	RETURN    TokenType = "RETURN"
	TRUE      TokenType = "TRUE"
	FALSE     TokenType = "FALSE"
)

type Token struct {
	Type    TokenType
	Literal string
}

func NewToken(tokenType TokenType, literal string) Token {
	return Token{Type: tokenType, Literal: literal}
}

var keywords = map[string]TokenType{
	"let":    LET,
	"fn":     FN,
	"if":     IF,
	"else":   ELSE,
	"return": RETURN,
	"true":   TRUE,
	"false":  FALSE,
}

// LookupIdent checks if an identifier is a keyword.
func LookupIdent(ident string) TokenType {
	if tok, ok := keywords[ident]; ok {
		return tok
	}
	return IDENT
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

func isDigit(ch byte) bool { return ch >= '0' && ch <= '9' }
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
	l.readChar()
	start := l.pos - 1
	for l.ch != '"' && l.ch != 0 {
		l.readChar()
	}
	s := l.input[start : l.pos-1]
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
			ident := l.readIdentifier()
			return NewToken(LookupIdent(ident), ident)
		}
		tok = NewToken(ILLEGAL, string(l.ch))
	}
	l.readChar()
	return tok
}

func main() {}
`,
  hints: [
    'Create a map[string]TokenType with entries like "let": LET, "fn": FN, etc.',
    'LookupIdent checks the map and returns IDENT if not found',
    'After readIdentifier, use LookupIdent to decide the token type',
  ],
}

export default exercise
