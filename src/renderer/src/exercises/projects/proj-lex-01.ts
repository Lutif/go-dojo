import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-lex-01',
  title: 'Lexer — Token Types & Single-Char Tokens',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 16,
  description: `Create lexer that recognizes single-character tokens. Lexers break source code into meaningful tokens.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Read characters one at a time from input',
    'Create token for each character (operators, delimiters)',
    'Return tokens with type and value',
  ],
}

export default exercise
