import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-21',
  title: 'Evaluator — Functions & Closures',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 121,
  description: `Add error handling with try-catch-like semantics. Error handling prevents crashes.`,
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
    'Return errors as special values (not exceptions)',
    'Check for errors in evaluation',
    'Propagate errors up the call stack',
  ],
}

export default exercise
