import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-lex-03',
  title: 'Lexer — NextToken & Whitespace',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 18,
  description: `Implement string and number literals in the lexer. Literals are complex tokens with escape sequences and formats.`,
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
    'For strings: find opening quote, handle escapes, find closing quote',
    'For numbers: handle decimal, hex, octal, scientific notation',
    'Track position for error reporting',
  ],
}

export default exercise
