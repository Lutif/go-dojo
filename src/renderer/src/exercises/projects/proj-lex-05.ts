import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-lex-05',
  title: 'Lexer — Whitespace & Line Comments',
  category: 'Projects',
  subcategory: 'Lexer',
  difficulty: 'advanced',
  order: 20,
  projectId: 'proj-lex',
  step: 5,
  totalSteps: 6,
  description: `Add support for skipping // line comments. Comments run from // to end of line and are not emitted as tokens.

**Requirements (cumulative):**
- All previous functionality still works
- When the lexer sees //, skip everything until end of line (or end of input)
- After skipping a comment, continue lexing normally
- A standalone / is still the SLASH token
- Track line numbers: add a Line field to Lexer, increment on newlines`,
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
	"let": LET, "fn": FN, "if": IF, "else": ELSE,
	"return": RETURN, "true": TRUE, "false": FALSE,
}

func LookupIdent(ident string) TokenType {
	if tok, ok := keywords[ident]; ok { return tok }
	return IDENT
}

type Lexer struct {
	input string
	pos   int
	ch    byte
	Line  int  // TODO: Track current line number (1-indexed)
}

func New(input string) *Lexer {
	l := &Lexer{input: input, Line: 1}
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

// TODO: Update skipWhitespace to increment Line on newlines

func (l *Lexer) skipWhitespace() {
	for l.ch == ' ' || l.ch == '\\t' || l.ch == '\\n' || l.ch == '\\r' {
		l.readChar()
	}
}

// TODO: Add peekChar method (returns next char without advancing)

// TODO: Add skipLineComment method (skip from // to end of line)

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
	if l.ch == 0 { return NewToken(EOF, "") }
	var tok Token
	switch l.ch {
	case '+': tok = NewToken(PLUS, "+")
	case '-': tok = NewToken(MINUS, "-")
	case '*': tok = NewToken(STAR, "*")
	case '/':
		// TODO: Check if next char is '/' for line comment
		// If so, skip comment and call NextToken again
		tok = NewToken(SLASH, "/")
	case '(': tok = NewToken(LPAREN, "(")
	case ')': tok = NewToken(RPAREN, ")")
	case '=': tok = NewToken(ASSIGN, "=")
	case ';': tok = NewToken(SEMICOLON, ";")
	case '"': return NewToken(STRING, l.readString())
	default:
		if isDigit(l.ch) { return NewToken(INT, l.readNumber()) }
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
  testCode: `package main

import "testing"

func TestSkipLineComment(t *testing.T) {
	l := New("1 + 2 // this is a comment")
	expected := []struct {
		typ TokenType
		lit string
	}{
		{INT, "1"}, {PLUS, "+"}, {INT, "2"}, {EOF, ""},
	}
	for i, tt := range expected {
		tok := l.NextToken()
		if tok.Type != tt.typ || tok.Literal != tt.lit {
			t.Errorf("token[%d]: expected %s/%s, got %s/%s",
				i, tt.typ, tt.lit, tok.Type, tok.Literal)
		}
	}
}

func TestCommentOnOwnLine(t *testing.T) {
	input := "// comment\nlet x = 5;"
	l := New(input)
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

func TestSlashNotComment(t *testing.T) {
	l := New("10 / 2")
	expected := []struct {
		typ TokenType
		lit string
	}{
		{INT, "10"}, {SLASH, "/"}, {INT, "2"}, {EOF, ""},
	}
	for i, tt := range expected {
		tok := l.NextToken()
		if tok.Type != tt.typ || tok.Literal != tt.lit {
			t.Errorf("token[%d]: expected %s/%s, got %s/%s",
				i, tt.typ, tt.lit, tok.Type, tok.Literal)
		}
	}
}

func TestMultipleComments(t *testing.T) {
	input := "// first\n1 // second\n+ 2 // third"
	l := New(input)
	expected := []struct {
		typ TokenType
		lit string
	}{
		{INT, "1"}, {PLUS, "+"}, {INT, "2"}, {EOF, ""},
	}
	for i, tt := range expected {
		tok := l.NextToken()
		if tok.Type != tt.typ || tok.Literal != tt.lit {
			t.Errorf("token[%d]: expected %s/%s, got %s/%s",
				i, tt.typ, tt.lit, tok.Type, tok.Literal)
		}
	}
}

func TestLineTracking(t *testing.T) {
	input := "let x = 1;\nlet y = 2;\nlet z = 3;"
	l := New(input)
	// Consume first line: let x = 1;
	for i := 0; i < 4; i++ {
		l.NextToken()
	}
	if l.Line != 1 {
		t.Errorf("after first line, expected Line=1, got %d", l.Line)
	}
	// Consume semicolon which is still line 1, then next token is on line 2
	l.NextToken() // ;
	tok := l.NextToken() // let on line 2
	if tok.Type != LET {
		t.Errorf("expected LET, got %s", tok.Type)
	}
	if l.Line != 2 {
		t.Errorf("after second line start, expected Line=2, got %d", l.Line)
	}
}

func TestCommentOnly(t *testing.T) {
	l := New("// just a comment")
	tok := l.NextToken()
	if tok.Type != EOF {
		t.Errorf("expected EOF, got %s/%s", tok.Type, tok.Literal)
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
	"let": LET, "fn": FN, "if": IF, "else": ELSE,
	"return": RETURN, "true": TRUE, "false": FALSE,
}

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
	Line  int
}

func New(input string) *Lexer {
	l := &Lexer{input: input, Line: 1}
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

func (l *Lexer) peekChar() byte {
	if l.pos >= len(l.input) {
		return 0
	}
	return l.input[l.pos]
}

func (l *Lexer) skipWhitespace() {
	for l.ch == ' ' || l.ch == '\\t' || l.ch == '\\n' || l.ch == '\\r' {
		if l.ch == '\\n' {
			l.Line++
		}
		l.readChar()
	}
}

func (l *Lexer) skipLineComment() {
	for l.ch != '\\n' && l.ch != 0 {
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
		if l.peekChar() == '/' {
			l.skipLineComment()
			return l.NextToken()
		}
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
    'Add a peekChar method that returns input[pos] without advancing',
    'In the "/" case, check peekChar() == "/" to detect comments',
    'After skipping a comment, recursively call NextToken to get the actual next token',
  ],
}

export default exercise
