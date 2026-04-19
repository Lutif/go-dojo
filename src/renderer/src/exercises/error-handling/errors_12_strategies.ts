import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_12_strategies',
  title: 'Error Strategies',
  category: 'Error Handling',
  subcategory: 'Error Handling',
  difficulty: 'intermediate',
  order: 12,
  description: `Learn multiple error handling strategies for different scenarios. Different situations call for different error handling approaches.`,
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
    'Return errors for recoverable failures; let caller decide handling',
    'Panic for unrecoverable situations (invariant violations)',
    'Use middleware and interceptors to centralize error handling in servers',
  ],
}

export default exercise
