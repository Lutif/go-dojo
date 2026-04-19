import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-lex-04',
  title: 'Lexer — Two-Char Operators & String Literals',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 19,
  description: `Add operator and delimiter recognition with correct precedence. Operators may be multi-character (<=, ==, &&).`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestImplementation(t *testing.T) {
	// Verify the implementation matches the exercise requirements
	// Refer to the exercise description and hints for specific test cases
	t.Skip("Implement test based on exercise requirements")
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Distinguish single-char and multi-char operators',
    'Use lookahead to determine which operator it is',
    'Handle ambiguous cases (e.g., < vs <=)',
  ],
}

export default exercise
