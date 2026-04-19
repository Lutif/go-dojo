import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-13',
  title: 'Parser — Function Literals',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 113,
  description: `Add array data type and indexing. Arrays are sequences of values.`,
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
    'Parse array literals: [1, 2, 3]',
    'Implement array indexing: array[index]',
    'Handle out-of-bounds access gracefully',
  ],
}

export default exercise
