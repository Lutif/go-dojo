import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_19_type_parameters',
  title: 'Type Parameters',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'advanced',
  order: 19,
  description: `Master type parameters for flexible code. Type parameters enable writing code once that works with many types.`,
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
    'Parameters go in square brackets: func Name[T, U Type]()',
    'Can constrain multiple types with unions: [T int | string]',
    'Useful for containers, algorithms, and builders',
  ],
}

export default exercise
