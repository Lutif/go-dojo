import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_16_for_loop',
  title: 'For Loop',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 16,
  description: `Master the for loop, Go's only looping construct. Learn the three-part for loop syntax: init; condition; post.`,
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
    'Traditional for loop: for i := 0; i < n; i++ { ... }',
    'The init and post statements are optional',
    'You can omit the condition to create an infinite loop',
  ],
}

export default exercise
