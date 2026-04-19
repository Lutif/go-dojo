import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_05_constants',
  title: 'Constants',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 5,
  description: `Master Go's constant declarations. Constants are immutable values that must be assigned at compile time and cannot be changed. Use \`const\` keyword to define them.`,
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
    'Use const instead of var to declare values that won\'t change',
    'Constants must be assigned a value at declaration time',
    'Constants can be strings, numbers, or booleans',
  ],
}

export default exercise
