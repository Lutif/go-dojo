import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_02_slice_header',
  title: 'Slice Header',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'advanced',
  order: 2,
  description: `Understand the internal structure of slices. Slices consist of a pointer, length, and capacity that Go manages.`,
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
    'Slice header contains: pointer to data, length, capacity',
    'Multiple slices can reference the same underlying array',
    'Modifying one slice\'s data affects other slices pointing to same array',
  ],
}

export default exercise
