import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_23_slices',
  title: 'Slices',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 23,
  description: `Work with slices, Go's flexible dynamic array type. Learn how slices are built on top of arrays.`,
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
    'Slice syntax: []Type without specifying a size',
    'Slices are dynamic and can grow as needed',
    'A slice has length (current elements) and capacity (allocated space)',
  ],
}

export default exercise
