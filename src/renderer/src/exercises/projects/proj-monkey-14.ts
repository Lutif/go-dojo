import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-14',
  title: 'Parser — Call Expressions (Capstone)',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 114,
  description: `Implement array methods (push, len, first, last, rest). Methods provide operations on arrays.`,
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
    'len(array) returns length',
    'first(array) returns first element',
    'last(array) returns last element',
    'rest(array) returns all but first',
  ],
}

export default exercise
