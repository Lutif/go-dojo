import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_11_named_returns',
  title: 'Named Returns',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 11,
  description: `Use named return values in function signatures. Named returns can make code more readable and allow implicit returns.`,
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
    'Name the return values in the function signature like (result int, err error)',
    'Named returns are automatically initialized to their zero values',
    'You can use a bare return statement to return the named values',
  ],
}

export default exercise
