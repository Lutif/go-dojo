import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_04_is',
  title: 'errors.Is',
  category: 'Error Handling',
  subcategory: 'Error Handling',
  difficulty: 'intermediate',
  order: 4,
  description: `Check for specific error values using errors.Is(). Is() checks if an error in the chain matches a target error.`,
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
    'errors.Is(err, target) returns true if target is in the error chain',
    'Works with wrapped errors created with fmt.Errorf("%w", err)',
    'Use for checking sentinel errors or specific error types',
  ],
}

export default exercise
