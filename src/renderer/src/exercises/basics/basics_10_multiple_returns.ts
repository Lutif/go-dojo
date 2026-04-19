import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_10_multiple_returns',
  title: 'Multiple Returns',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 10,
  description: `Write functions that return multiple values. This is a common Go pattern especially for error handling.`,
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
    'List multiple return types in parentheses: func name() (Type1, Type2)',
    'Call a multi-return function and capture both values',
    'You can ignore return values using the blank identifier _',
  ],
}

export default exercise
