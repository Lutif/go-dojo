import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_24_pool',
  title: 'Pool Pattern',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 24,
  description: `Implement object pools for resource reuse. Pools minimize allocation overhead by reusing objects.`,
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
    'Maintain pool of available objects',
    'Hand out on request, return when done',
    'Reset state when returning to pool',
  ],
}

export default exercise
