import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-lex-02',
  title: 'Lexer — Read Numbers and Identifiers',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 17,
  description: `Add multi-character tokens (keywords, identifiers) to the lexer. Identifiers and keywords require lookahead.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Read sequence of alphanumeric characters as identifier',
    'Check if identifier is a reserved keyword',
    'Distinguish keywords from identifiers',
  ],
}

export default exercise
