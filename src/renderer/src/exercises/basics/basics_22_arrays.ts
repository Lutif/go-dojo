import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_22_arrays',
  title: 'Arrays',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 22,
  description: `Declare and use fixed-size arrays. Understand how arrays in Go have a fixed length determined at declaration.`,
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
    'Array syntax: [size]Type like [5]int for an array of 5 integers',
    'Array length is part of its type and cannot be changed',
    'Use ... for array literal initialization: [...]int{1, 2, 3}',
  ],
}

export default exercise
