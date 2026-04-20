import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-01',
  title: 'Monkey — Token Types',
  category: 'Projects',
  subcategory: 'Monkey Interpreter',
  difficulty: 'intermediate',
  order: 101,
  projectId: 'proj-monkey',
  step: 1,
  totalSteps: 22,
  description: `Define token types and the Token struct for the Monkey language.

Create a \`TokenType\` (string alias) and a \`Token\` struct with fields \`Type TokenType\` and \`Literal string\`.

Define these token-type constants:
- Literals: INT, IDENT, STRING
- Operators: ASSIGN, PLUS, MINUS, ASTERISK, SLASH, BANG, LT, GT, EQ, NOT_EQ
- Delimiters: COMMA, SEMICOLON, LPAREN, RPAREN, LBRACE, RBRACE
- Keywords: LET, FUNCTION, TRUE, FALSE, IF, ELSE, RETURN
- Special: EOF, ILLEGAL

Use short uppercase string values (e.g. \`const INT = TokenType("INT")\`).`,
  code: `package main

// TODO: Define TokenType as a string type
// TODO: Define Token struct with Type (TokenType) and Literal (string)

// TODO: Define token-type constants:
// INT, IDENT, STRING
// ASSIGN, PLUS, MINUS, ASTERISK, SLASH, BANG, LT, GT, EQ, NOT_EQ
// COMMA, SEMICOLON, LPAREN, RPAREN, LBRACE, RBRACE
// LET, FUNCTION, TRUE, FALSE, IF, ELSE, RETURN
// EOF, ILLEGAL

func main() {}
`,
  testCode: `package main

import "testing"

func TestTokenType(t *testing.T) {
	var tt TokenType = "TEST"
	if tt != "TEST" {
		t.Fatal("TokenType should be a string type")
	}
}

func TestTokenStruct(t *testing.T) {
	tok := Token{Type: INT, Literal: "42"}
	if tok.Type != INT {
		t.Fatalf("expected INT, got %s", tok.Type)
	}
	if tok.Literal != "42" {
		t.Fatalf("expected 42, got %s", tok.Literal)
	}
}

func TestTokenConstants(t *testing.T) {
	constants := []TokenType{
		INT, IDENT, STRING,
		ASSIGN, PLUS, MINUS, ASTERISK, SLASH, BANG, LT, GT, EQ, NOT_EQ,
		COMMA, SEMICOLON, LPAREN, RPAREN, LBRACE, RBRACE,
		LET, FUNCTION, TRUE, FALSE, IF, ELSE, RETURN,
		EOF, ILLEGAL,
	}
	seen := map[TokenType]bool{}
	for _, c := range constants {
		if c == "" {
			t.Fatal("token constant must not be empty")
		}
		if seen[c] {
			t.Fatalf("duplicate token constant: %s", c)
		}
		seen[c] = true
	}
	if len(constants) != 27 {
		t.Fatalf("expected 27 constants, got %d", len(constants))
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
	// Literals
	INT    = TokenType("INT")
	IDENT  = TokenType("IDENT")
	STRING = TokenType("STRING")
	// Operators
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
	// Delimiters
	COMMA     = TokenType("COMMA")
	SEMICOLON = TokenType("SEMICOLON")
	LPAREN    = TokenType("LPAREN")
	RPAREN    = TokenType("RPAREN")
	LBRACE    = TokenType("LBRACE")
	RBRACE    = TokenType("RBRACE")
	// Keywords
	LET      = TokenType("LET")
	FUNCTION = TokenType("FUNCTION")
	TRUE     = TokenType("TRUE")
	FALSE    = TokenType("FALSE")
	IF       = TokenType("IF")
	ELSE     = TokenType("ELSE")
	RETURN   = TokenType("RETURN")
	// Special
	EOF     = TokenType("EOF")
	ILLEGAL = TokenType("ILLEGAL")
)

func main() {}
`,
  hints: [
    'Use `type TokenType string` to define the token type alias.',
    'Define constants with `const ( INT = TokenType("INT") ... )`.',
    'The Token struct just needs two fields: Type and Literal.',
  ],
}

export default exercise
