import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_12_test_fixtures',
  title: 'Test Fixtures',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 12,
  description: `Use fixtures for test data and setup. Fixtures provide consistent test data and setup/teardown.`,
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
    'Create helper functions that return properly initialized test objects',
    'Use subtests with individual setup/teardown',
    'Avoid sharing state between tests',
  ],
}

export default exercise
