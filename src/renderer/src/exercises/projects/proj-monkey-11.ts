import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-11',
  title: 'Parser — Grouped Expressions',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 111,
  description: `Add return statements with early exit. Return statements exit functions with a value.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Use special return value type to propagate return',
    'Unwrap return value at top level',
    'Stop execution when return encountered',
  ],
}

export default exercise
