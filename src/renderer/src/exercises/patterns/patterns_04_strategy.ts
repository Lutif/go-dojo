import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_04_strategy',
  title: 'Strategy Pattern',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 4,
  description: `Implement strategy pattern for algorithm selection. Strategies encapsulate interchangeable algorithms.`,
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
    'Define Strategy interface with Execute or Process method',
    'Create concrete strategy implementations',
    'Context type takes strategy and delegates to it',
  ],
}

export default exercise
