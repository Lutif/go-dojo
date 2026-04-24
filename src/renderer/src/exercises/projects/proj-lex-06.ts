import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-lex-06',
  title: 'Lexer — Tokenize() Capstone',
  category: 'Projects',
  subcategory: 'Lexer',
  difficulty: 'expert',
  order: 21,
  projectId: 'proj-lex',
  step: 6,
  totalSteps: 6,
  description: `Capstone for the lexer series. You have all the pieces; now wire them into a single convenience API and prove the lexer handles a realistic Monkey program end-to-end.

**Requirements:**
- Keep all previous behavior: numbers, identifiers, keywords, strings, operators, whitespace skipping, line comments, line tracking.
- Add a package-level \`Tokenize(input string) []Token\` helper that drains the lexer until (and including) the \`EOF\` token and returns the full slice.
- Add a \`Position\` field to \`Token\` (struct with \`Line\` and \`Col\`, both 1-indexed) and populate it when each token is produced. \`Col\` is the column of the first byte of the token's literal.
- \`ILLEGAL\` tokens must still be emitted (error recovery) so the lexer keeps going past unknown bytes.

Tokenizing a full Monkey snippet such as \`let add = fn(x, y) { x + y };\` should produce the expected token stream with correct positions.`,
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
	LBRACE    TokenType = "LBRACE"
	RBRACE    TokenType = "RBRACE"
	COMMA     TokenType = "COMMA"
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

type Position struct {
	Line int
	Col  int
}

type Token struct {
	Type    TokenType
	Literal string
	Pos     Position
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
	pos   int  // index of next byte to read
	ch    byte // current byte (0 at EOF)
	Line  int
	Col   int // column of current ch (1-indexed); 0 before first read
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
	l.Col++
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
			l.Col = 0
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
	l.readChar() // consume opening "
	start := l.pos - 1
	for l.ch != '"' && l.ch != 0 {
		l.readChar()
	}
	s := l.input[start : l.pos-1]
	l.readChar() // consume closing "
	return s
}

// TODO: Record the start position (l.Line, l.Col) for the token before advancing,
// then stamp it onto the returned Token.
func (l *Lexer) NextToken() Token {
	l.skipWhitespace()
	if l.ch == 0 {
		return Token{Type: EOF, Literal: "", Pos: Position{Line: l.Line, Col: l.Col}}
	}
	var tok Token
	switch l.ch {
	case '+':
		tok = Token{Type: PLUS, Literal: "+"}
	case '-':
		tok = Token{Type: MINUS, Literal: "-"}
	case '*':
		tok = Token{Type: STAR, Literal: "*"}
	case '/':
		if l.peekChar() == '/' {
			l.skipLineComment()
			return l.NextToken()
		}
		tok = Token{Type: SLASH, Literal: "/"}
	case '(':
		tok = Token{Type: LPAREN, Literal: "("}
	case ')':
		tok = Token{Type: RPAREN, Literal: ")"}
	case '{':
		tok = Token{Type: LBRACE, Literal: "{"}
	case '}':
		tok = Token{Type: RBRACE, Literal: "}"}
	case ',':
		tok = Token{Type: COMMA, Literal: ","}
	case '=':
		tok = Token{Type: ASSIGN, Literal: "="}
	case ';':
		tok = Token{Type: SEMICOLON, Literal: ";"}
	case '"':
		startLine, startCol := l.Line, l.Col
		lit := l.readString()
		return Token{Type: STRING, Literal: lit, Pos: Position{Line: startLine, Col: startCol}}
	default:
		if isDigit(l.ch) {
			startLine, startCol := l.Line, l.Col
			lit := l.readNumber()
			return Token{Type: INT, Literal: lit, Pos: Position{Line: startLine, Col: startCol}}
		}
		if isLetter(l.ch) {
			startLine, startCol := l.Line, l.Col
			lit := l.readIdentifier()
			return Token{Type: LookupIdent(lit), Literal: lit, Pos: Position{Line: startLine, Col: startCol}}
		}
		tok = Token{Type: ILLEGAL, Literal: string(l.ch)}
	}
	// TODO: stamp the position for single-char tokens using current l.Line / l.Col
	l.readChar()
	return tok
}

// TODO: Implement Tokenize. Create a new Lexer, repeatedly call NextToken,
// append each result to a slice, and stop after appending the EOF token.
func Tokenize(input string) []Token {
	return nil
}

func main() {}
`,
  testCode: `package main

import "testing"

func TestTokenizeFullProgram(t *testing.T) {
	input := ` + '`' + `let add = fn(x, y) { x + y };
let result = add(5, 10);` + '`' + `
	toks := Tokenize(input)
	if len(toks) == 0 {
		t.Fatal("Tokenize returned empty slice")
	}
	if toks[len(toks)-1].Type != EOF {
		t.Fatalf("last token should be EOF, got %s", toks[len(toks)-1].Type)
	}
	want := []TokenType{
		LET, IDENT, ASSIGN, FN, LPAREN, IDENT, COMMA, IDENT, RPAREN,
		LBRACE, IDENT, PLUS, IDENT, RBRACE, SEMICOLON,
		LET, IDENT, ASSIGN, IDENT, LPAREN, INT, COMMA, INT, RPAREN, SEMICOLON,
		EOF,
	}
	if len(toks) != len(want) {
		t.Fatalf("expected %d tokens, got %d (%v)", len(want), len(toks), toks)
	}
	for i, w := range want {
		if toks[i].Type != w {
			t.Errorf("token[%d]: want %s, got %s/%q", i, w, toks[i].Type, toks[i].Literal)
		}
	}
}

func TestTokenizePositions(t *testing.T) {
	toks := Tokenize("let x = 5;")
	// let at line 1 col 1
	if toks[0].Pos.Line != 1 || toks[0].Pos.Col != 1 {
		t.Errorf("'let' pos: want 1:1, got %d:%d", toks[0].Pos.Line, toks[0].Pos.Col)
	}
	// x at col 5
	if toks[1].Literal != "x" || toks[1].Pos.Col != 5 {
		t.Errorf("'x' pos: want col 5, got %d", toks[1].Pos.Col)
	}
	// 5 at col 9
	if toks[3].Literal != "5" || toks[3].Pos.Col != 9 {
		t.Errorf("'5' pos: want col 9, got %d", toks[3].Pos.Col)
	}
}

func TestTokenizeMultiline(t *testing.T) {
	toks := Tokenize("let x = 1;\\nlet y = 2;")
	// find second 'let'
	var second Token
	count := 0
	for _, tk := range toks {
		if tk.Type == LET {
			count++
			if count == 2 {
				second = tk
				break
			}
		}
	}
	if count < 2 {
		t.Fatal("expected two LET tokens")
	}
	if second.Pos.Line != 2 || second.Pos.Col != 1 {
		t.Errorf("second 'let' pos: want 2:1, got %d:%d", second.Pos.Line, second.Pos.Col)
	}
}

func TestTokenizeComments(t *testing.T) {
	toks := Tokenize("// hi\\nlet x = 1; // trailing\\n")
	want := []TokenType{LET, IDENT, ASSIGN, INT, SEMICOLON, EOF}
	if len(toks) != len(want) {
		t.Fatalf("expected %d tokens, got %d", len(want), len(toks))
	}
	for i, w := range want {
		if toks[i].Type != w {
			t.Errorf("token[%d]: want %s, got %s", i, w, toks[i].Type)
		}
	}
}

func TestTokenizeIllegalRecovers(t *testing.T) {
	toks := Tokenize("@ 5")
	if toks[0].Type != ILLEGAL {
		t.Errorf("expected first token ILLEGAL, got %s", toks[0].Type)
	}
	if toks[1].Type != INT || toks[1].Literal != "5" {
		t.Errorf("expected INT 5 after ILLEGAL, got %s/%q", toks[1].Type, toks[1].Literal)
	}
	if toks[len(toks)-1].Type != EOF {
		t.Errorf("last token should be EOF")
	}
}

func TestTokenizeString(t *testing.T) {
	toks := Tokenize(` + '`' + `let s = "hi";` + '`' + `)
	if toks[3].Type != STRING || toks[3].Literal != "hi" {
		t.Errorf("expected STRING \\"hi\\", got %s/%q", toks[3].Type, toks[3].Literal)
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
	LBRACE    TokenType = "LBRACE"
	RBRACE    TokenType = "RBRACE"
	COMMA     TokenType = "COMMA"
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

type Position struct {
	Line int
	Col  int
}

type Token struct {
	Type    TokenType
	Literal string
	Pos     Position
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
	Col   int
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
	l.Col++
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
			l.Col = 0
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
		return Token{Type: EOF, Literal: "", Pos: Position{Line: l.Line, Col: l.Col}}
	}
	startLine, startCol := l.Line, l.Col
	var tok Token
	switch l.ch {
	case '+':
		tok = Token{Type: PLUS, Literal: "+"}
	case '-':
		tok = Token{Type: MINUS, Literal: "-"}
	case '*':
		tok = Token{Type: STAR, Literal: "*"}
	case '/':
		if l.peekChar() == '/' {
			l.skipLineComment()
			return l.NextToken()
		}
		tok = Token{Type: SLASH, Literal: "/"}
	case '(':
		tok = Token{Type: LPAREN, Literal: "("}
	case ')':
		tok = Token{Type: RPAREN, Literal: ")"}
	case '{':
		tok = Token{Type: LBRACE, Literal: "{"}
	case '}':
		tok = Token{Type: RBRACE, Literal: "}"}
	case ',':
		tok = Token{Type: COMMA, Literal: ","}
	case '=':
		tok = Token{Type: ASSIGN, Literal: "="}
	case ';':
		tok = Token{Type: SEMICOLON, Literal: ";"}
	case '"':
		lit := l.readString()
		return Token{Type: STRING, Literal: lit, Pos: Position{Line: startLine, Col: startCol}}
	default:
		if isDigit(l.ch) {
			lit := l.readNumber()
			return Token{Type: INT, Literal: lit, Pos: Position{Line: startLine, Col: startCol}}
		}
		if isLetter(l.ch) {
			lit := l.readIdentifier()
			return Token{Type: LookupIdent(lit), Literal: lit, Pos: Position{Line: startLine, Col: startCol}}
		}
		tok = Token{Type: ILLEGAL, Literal: string(l.ch)}
	}
	tok.Pos = Position{Line: startLine, Col: startCol}
	l.readChar()
	return tok
}

func Tokenize(input string) []Token {
	l := New(input)
	var out []Token
	for {
		tok := l.NextToken()
		out = append(out, tok)
		if tok.Type == EOF {
			return out
		}
	}
}

func main() {}
`,
  hints: [
    'Capture startLine/startCol BEFORE calling readChar so the position points at the first byte of the token.',
    'Reset Col to 0 when you see a newline (readChar will bump it back to 1 for the first byte of the new line).',
    'Tokenize is just a small loop: call NextToken until you get an EOF token, then return the slice including that EOF.',
  ],
}

export default exercise
