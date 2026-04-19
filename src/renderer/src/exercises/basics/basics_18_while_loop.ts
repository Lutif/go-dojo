import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_18_while_loop',
  title: 'While Loop',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 18,
  description: `Implement while loop behavior using for with just a condition. Go doesn't have a while keyword.`,
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
    'Use for condition { ... } to create a while-like loop',
    'This is semantically equivalent to while loops in other languages',
    'Remember to update the condition variable inside the loop',
  ],
}

export default exercise
