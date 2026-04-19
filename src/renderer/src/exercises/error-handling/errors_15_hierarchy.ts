import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_15_hierarchy',
  title: 'Error Type Hierarchy',
  category: 'Error Handling',
  subcategory: 'Error Handling',
  difficulty: 'advanced',
  order: 15,
  description: `Build error hierarchies for structured error handling. Error hierarchies enable granular error handling at different levels of the call stack.`,
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
    'Define error types in a hierarchy (base errors, specific errors)',
    'Use errors.As() to check the specific error type',
    'Each level adds context relevant to that layer',
  ],
}

export default exercise
