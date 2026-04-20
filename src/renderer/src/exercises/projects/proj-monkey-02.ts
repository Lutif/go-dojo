import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-02',
  title: 'Monkey — Lexer Basics',
  category: 'Projects',
  subcategory: 'Monkey Interpreter',
  difficulty: 'intermediate',
  order: 102,
  projectId: 'proj-monkey',
  step: 2,
  totalSteps: 22,
  description: `Build a basic lexer that tokenizes single-character operators, delimiters, and integers.

Create a \`Lexer\` struct with fields: \`input string\`, \`pos int\`, \`readPos int\`, \`ch byte\`.

Implement:
- \`NewLexer(input string) *Lexer\` — creates a lexer and reads the first character
- \`readChar()\` — advances to the next character (sets ch to 0 at end)
- \`NextToken() Token\` — returns the next token, skipping whitespace

The lexer should handle: +, -, *, /, <, >, =, !, ;, ,, (, ), {, }, integers, and EOF.
Use a helper \`readNumber()\` to consume consecutive digits.`,
  code: `package main

// --- Token types from Step 1 ---
type TokenType string
type Token struct {
	Type    TokenType
	Literal string
}
const (
	INT    = TokenType("INT")
	IDENT  = TokenType("IDENT")
	STRING = TokenType("STRING")
	ASSIGN   = TokenType("ASSIGN")
	PLUS     = TokenType("PLUS")
	MINUS    = TokenType("MINUS")
	ASTERISK = TokenType("ASTERISK")
	SLASH    = TokenType("SLASH")
	BANG     = TokenType("BANG")
	LT       = TokenType("LT")
	GT       = TokenType("GT")
	EQ       = TokenType("EQ")
	NOT_EQ   = TokenType("NOT_EQ")
	COMMA     = TokenType("COMMA")
	SEMICOLON = TokenType("SEMICOLON")
	LPAREN    = TokenType("LPAREN")
	RPAREN    = TokenType("RPAREN")
	LBRACE    = TokenType("LBRACE")
	RBRACE    = TokenType("RBRACE")
	LET      = TokenType("LET")
	FUNCTION = TokenType("FUNCTION")
	TRUE     = TokenType("TRUE")
	FALSE    = TokenType("FALSE")
	IF       = TokenType("IF")
	ELSE     = TokenType("ELSE")
	RETURN   = TokenType("RETURN")
	EOF     = TokenType("EOF")
	ILLEGAL = TokenType("ILLEGAL")
)

// TODO: Define Lexer struct with input, pos, readPos, ch
// TODO: Implement NewLexer(input string) *Lexer
// TODO: Implement (l *Lexer) readChar()
// TODO: Implement (l *Lexer) NextToken() Token
// TODO: Implement (l *Lexer) readNumber() string
// TODO: Implement (l *Lexer) skipWhitespace()

func main() {}
`,
  testCode: `package main

import "testing"

func TestLexerSingleChars(t *testing.T) {
	input := "+-*/,;(){}<>!=."
	l := NewLexer(input)
	expected := []TokenType{PLUS, MINUS, ASTERISK, SLASH, COMMA, SEMICOLON, LPAREN, RPAREN, LBRACE, RBRACE, LT, GT, BANG, ASSIGN}
	for i, exp := range expected {
		tok := l.NextToken()
		if tok.Type != exp {
			t.Fatalf("test[%d]: expected %s, got %s (literal=%q)", i, exp, tok.Type, tok.Literal)
		}
	}
}

func TestLexerIntegers(t *testing.T) {
	l := NewLexer("123 456")
	tok := l.NextToken()
	if tok.Type != INT || tok.Literal != "123" {
		t.Fatalf("expected INT 123, got %s %q", tok.Type, tok.Literal)
	}
	tok = l.NextToken()
	if tok.Type != INT || tok.Literal != "456" {
		t.Fatalf("expected INT 456, got %s %q", tok.Type, tok.Literal)
	}
	tok = l.NextToken()
	if tok.Type != EOF {
		t.Fatalf("expected EOF, got %s", tok.Type)
	}
}

func TestLexerWhitespace(t *testing.T) {
	l := NewLexer("  +  -  ")
	tok := l.NextToken()
	if tok.Type != PLUS {
		t.Fatalf("expected PLUS, got %s", tok.Type)
	}
	tok = l.NextToken()
	if tok.Type != MINUS {
		t.Fatalf("expected MINUS, got %s", tok.Type)
	}
}
`,
  solution: `package main

type TokenType string
type Token struct {
	Type    TokenType
	Literal string
}
const (
	INT    = TokenType("INT")
	IDENT  = TokenType("IDENT")
	STRING = TokenType("STRING")
	ASSIGN   = TokenType("ASSIGN")
	PLUS     = TokenType("PLUS")
	MINUS    = TokenType("MINUS")
	ASTERISK = TokenType("ASTERISK")
	SLASH    = TokenType("SLASH")
	BANG     = TokenType("BANG")
	LT       = TokenType("LT")
	GT       = TokenType("GT")
	EQ       = TokenType("EQ")
	NOT_EQ   = TokenType("NOT_EQ")
	COMMA     = TokenType("COMMA")
	SEMICOLON = TokenType("SEMICOLON")
	LPAREN    = TokenType("LPAREN")
	RPAREN    = TokenType("RPAREN")
	LBRACE    = TokenType("LBRACE")
	RBRACE    = TokenType("RBRACE")
	LET      = TokenType("LET")
	FUNCTION = TokenType("FUNCTION")
	TRUE     = TokenType("TRUE")
	FALSE    = TokenType("FALSE")
	IF       = TokenType("IF")
	ELSE     = TokenType("ELSE")
	RETURN   = TokenType("RETURN")
	EOF     = TokenType("EOF")
	ILLEGAL = TokenType("ILLEGAL")
)

type Lexer struct {
	input   string
	pos     int
	readPos int
	ch      byte
}

func NewLexer(input string) *Lexer {
	l := &Lexer{input: input}
	l.readChar()
	return l
}

func (l *Lexer) readChar() {
	if l.readPos >= len(l.input) {
		l.ch = 0
	} else {
		l.ch = l.input[l.readPos]
	}
	l.pos = l.readPos
	l.readPos++
}

func (l *Lexer) skipWhitespace() {
	for l.ch == ' ' || l.ch == '\\t' || l.ch == '\\n' || l.ch == '\\r' {
		l.readChar()
	}
}

func (l *Lexer) readNumber() string {
	start := l.pos
	for l.ch >= '0' && l.ch <= '9' {
		l.readChar()
	}
	return l.input[start:l.pos]
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
	case 0:
		tok = Token{EOF, ""}
		return tok
	default:
		if l.ch >= '0' && l.ch <= '9' {
			return Token{INT, l.readNumber()}
		}
		tok = Token{ILLEGAL, string(l.ch)}
	}
	l.readChar()
	return tok
}

func main() {}
`,
  hints: [
    'The Lexer struct tracks position in the input string and the current character.',
    'readChar advances readPos and updates ch; set ch=0 when past the end.',
    'Use a switch on l.ch in NextToken to map characters to token types.',
    'For integers, loop while the character is a digit and return the substring.',
  ],
}

export default exercise
