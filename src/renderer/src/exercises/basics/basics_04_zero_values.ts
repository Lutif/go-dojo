import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_04_zero_values',
  title: 'Zero Values',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 4,
  description: `Understand Go's zero values for different types. Every declared variable has a default value if not explicitly initialized.`,
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
    'Zero values depend on the type: 0 for numbers, false for bool, empty string for string',
    'Declared but uninitialized variables still have valid values',
    'This is different from uninitialized variables in some other languages',
  ],
}

export default exercise
