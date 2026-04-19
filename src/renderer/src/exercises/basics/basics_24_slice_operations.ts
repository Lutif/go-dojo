import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_24_slice_operations',
  title: 'Slice Operations',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'intermediate',
  order: 24,
  description: `Learn essential slice operations including append, copy, and slicing. The \`append\` function grows slices dynamically, making it essential for working with variable-length data.`,
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
    'append adds elements to a slice and returns a new slice',
    'When append exceeds capacity, a new underlying array is allocated',
    'copy copies elements from one slice to another and returns the number copied',
  ],
}

export default exercise
