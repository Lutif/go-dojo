import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_07_decorator',
  title: 'Decorator Pattern',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 7,
  description: `Use decorator pattern to add behavior dynamically. Decorators wrap objects and add new functionality.`,
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
    'Decorator struct holds the decorated object',
    'Decorator implements same interface as decorated object',
    'Add behavior in decorator methods, delegate to wrapped object',
  ],
}

export default exercise
