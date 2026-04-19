import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-18',
  title: 'Evaluator — Comparison & Logical',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 118,
  description: `Implement recursion support. Recursion allows functions to call themselves.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Ensure function names are bound before evaluating body',
    'Allow functions to reference themselves',
    'Stack overflow handling (limit recursion depth)',
  ],
}

export default exercise
