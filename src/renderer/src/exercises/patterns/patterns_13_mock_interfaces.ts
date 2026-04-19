import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_13_mock_interfaces',
  title: 'Mock Interfaces',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 13,
  description: `Create mocks using interfaces for testing. Mocks enable testing code in isolation.`,
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
    'Define mock struct implementing the interface being tested',
    'Track calls and return configured values',
    'Use to test error handling and edge cases',
  ],
}

export default exercise
