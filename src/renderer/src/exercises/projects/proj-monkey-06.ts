import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-06',
  title: 'Lexer — Multi-Character Operators',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 106,
  description: `Build an evaluator for simple expressions. The evaluator computes expression values.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Evaluate integer literals to their values',
    'Evaluate boolean literals',
    'Evaluate binary operations (+, -, *, /)',
  ],
}

export default exercise
