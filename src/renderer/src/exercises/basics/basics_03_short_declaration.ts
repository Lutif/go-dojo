import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_03_short_declaration',
  title: 'Short Declaration',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 3,
  description: `Learn Go's concise \`:=\` operator for declaring and initializing variables in one step. This is the preferred way to create variables inside functions.`,
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
    'The := operator declares and initializes a variable in one step',
    'This syntax only works inside functions, not at package level',
    'Go infers the type automatically from the assigned value',
  ],
}

export default exercise
