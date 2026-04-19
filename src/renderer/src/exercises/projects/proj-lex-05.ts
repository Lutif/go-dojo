import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-lex-05',
  title: 'Lexer — Keyword Recognition',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 20,
  description: `Handle comments and whitespace in the lexer. Comments and whitespace are significant for structure but not tokens.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Skip whitespace (spaces, tabs, newlines)',
    'Recognize comments (// to eol or /* ... */)',
    'Track line numbers for error reporting',
  ],
}

export default exercise
