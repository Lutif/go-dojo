import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-lex-01',
  title: 'Lexer — Token Types & Token Struct',
  category: 'Projects',
  subcategory: 'Lexer',
  difficulty: 'intermediate',
  order: 16,
  projectId: 'proj-lex',
  projectTitle: 'Lexer',
  step: 1,
  totalSteps: 6,
  description: `Build a lexer from scratch! Start by defining token types and the Token struct.

**Requirements:**
- Define TokenType as a string type
- Define constants: INT, PLUS, MINUS, STAR, SLASH, LPAREN, RPAREN, EOF, ILLEGAL
- Define a Token struct with Type (TokenType) and Literal (string) fields
- Implement NewToken(tokenType TokenType, literal string) Token`,
  code: `package main

// TODO: Define TokenType as a string type

// TODO: Define token type constants:
// INT, PLUS, MINUS, STAR, SLASH, LPAREN, RPAREN, EOF, ILLEGAL

// TODO: Define Token struct with Type (TokenType) and Literal (string)

// TODO: Implement NewToken(tokenType TokenType, literal string) Token

func main() {}
`,
  testCode: `package main

import "testing"

func TestTokenTypes(t *testing.T) {
	if INT != "INT" {
		t.Errorf("expected INT=INT, got %s", string(INT))
	}
	if PLUS != "PLUS" {
		t.Errorf("expected PLUS=PLUS, got %s", string(PLUS))
	}
	if MINUS != "MINUS" {
		t.Errorf("expected MINUS=MINUS, got %s", string(MINUS))
	}
	if STAR != "STAR" {
		t.Errorf("expected STAR=STAR, got %s", string(STAR))
	}
	if SLASH != "SLASH" {
		t.Errorf("expected SLASH=SLASH, got %s", string(SLASH))
	}
	if LPAREN != "LPAREN" {
		t.Errorf("expected LPAREN=LPAREN, got %s", string(LPAREN))
	}
	if RPAREN != "RPAREN" {
		t.Errorf("expected RPAREN=RPAREN, got %s", string(RPAREN))
	}
	if EOF != "EOF" {
		t.Errorf("expected EOF=EOF, got %s", string(EOF))
	}
	if ILLEGAL != "ILLEGAL" {
		t.Errorf("expected ILLEGAL=ILLEGAL, got %s", string(ILLEGAL))
	}
}

func TestNewToken(t *testing.T) {
	tok := NewToken(INT, "42")
	if tok.Type != INT {
		t.Errorf("expected type INT, got %s", string(tok.Type))
	}
	if tok.Literal != "42" {
		t.Errorf("expected literal 42, got %s", tok.Literal)
	}
}

func TestNewTokenOperator(t *testing.T) {
	tok := NewToken(PLUS, "+")
	if tok.Type != PLUS {
		t.Errorf("expected type PLUS, got %s", string(tok.Type))
	}
	if tok.Literal != "+" {
		t.Errorf("expected literal +, got %s", tok.Literal)
	}
}

func TestNewTokenEOF(t *testing.T) {
	tok := NewToken(EOF, "")
	if tok.Type != EOF {
		t.Errorf("expected type EOF, got %s", string(tok.Type))
	}
	if tok.Literal != "" {
		t.Errorf("expected empty literal, got %s", tok.Literal)
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

func main() {}
`,
  hints: [
    'Define TokenType as: type TokenType string',
    'Use const block with typed string constants: INT TokenType = "INT"',
    'Token struct just needs two fields: Type TokenType and Literal string',
  ],
}

export default exercise
