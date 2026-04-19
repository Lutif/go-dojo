import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-02',
  title: 'Lexer — Numbers & Identifiers',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 102,
  description: `Create a parser for expressions. The parser builds abstract syntax trees from tokens.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Use recursive descent parsing',
    'Handle operator precedence correctly',
    'Parse primary expressions: identifiers, literals, grouped expressions',
  ],
}

export default exercise
