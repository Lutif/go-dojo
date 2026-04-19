import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-lex-06',
  title: 'Lexer — Tokenize() Capstone',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'expert',
  order: 21,
  description: `Implement error recovery and position tracking in the lexer. Good error reporting helps users fix code.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Track current position (line, column) in source',
    'Report unexpected characters with location',
    'Continue lexing after errors when possible',
  ],
}

export default exercise
