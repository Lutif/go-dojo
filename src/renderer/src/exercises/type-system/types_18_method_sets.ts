import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_18_method_sets',
  title: 'Method Sets',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'advanced',
  order: 18,
  description: `Understand which methods are available on pointer and value receivers. Method sets differ between types and pointers to types.`,
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
    'Value receiver: available on both values and pointers to values',
    'Pointer receiver: available only on pointers (not values)',
    'If any method has pointer receiver, only pointer satisfies interface',
  ],
}

export default exercise
