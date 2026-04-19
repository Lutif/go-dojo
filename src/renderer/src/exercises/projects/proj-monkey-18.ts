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

func TestImplementation(t *testing.T) {
	// Verify the implementation matches the exercise requirements
	// Refer to the exercise description and hints for specific test cases
	t.Skip("Implement test based on exercise requirements")
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Ensure function names are bound before evaluating body',
    'Allow functions to reference themselves',
    'Stack overflow handling (limit recursion depth)',
  ],
}

export default exercise
