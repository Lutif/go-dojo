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

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Distinguish single-char and multi-char operators',
    'Use lookahead to determine which operator it is',
    'Handle ambiguous cases (e.g., < vs <=)',
  ],
}

export default exercise
