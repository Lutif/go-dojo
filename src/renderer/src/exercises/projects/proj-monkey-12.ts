import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-12',
  title: 'Parser — If-Else Expressions',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 112,
  description: `Implement string data type and concatenation. Strings are a fundamental data type.`,
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
    'Parse string literals with escape sequences',
    'Evaluate string concatenation with +',
    'String operations: length, indexing',
  ],
}

export default exercise
