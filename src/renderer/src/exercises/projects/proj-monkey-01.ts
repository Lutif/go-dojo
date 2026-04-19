import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-01',
  title: 'Lexer — Single-Character Tokens',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 101,
  description: `Build a lexer for the Monkey language. The lexer tokenizes Monkey source code for the parser.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Recognize keywords: let, fn, if, else, return, true, false',
    'Recognize operators: =, ==, !=, <, >, +, -, *, /, %, !',
    'Handle identifiers, integers, strings, delimiters',
  ],
}

export default exercise
