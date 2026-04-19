import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_29_pointers',
  title: 'Pointers',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'intermediate',
  order: 29,
  description: `Understand pointers, addresses, and pointer dereferencing. Pointers are essential for passing values by reference.`,
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
    '& gives the address of a variable, creating a pointer',
    '* dereferences a pointer to access the value it points to',
    'nil is the zero value for pointers',
  ],
}

export default exercise
