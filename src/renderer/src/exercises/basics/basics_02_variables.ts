import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_02_variables',
  title: 'Variables',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 2,
  description: `Declare and use variables with explicit types using the var keyword. Understand how Go's type system works with variable declarations.`,
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
    'The var keyword is used to declare variables with their type',
    'You can declare a variable and optionally initialize it on the same line',
    'Multiple variables can be declared together using var parentheses syntax',
  ],
}

export default exercise
