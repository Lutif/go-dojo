import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_06_type_switch',
  title: 'Type Switch',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'intermediate',
  order: 6,
  description: `Use type switches to handle multiple types in one expression. Type switches are like switch statements but for types.`,
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
    'switch x.(type) { case int: ... case string: ... }',
    'Type switches work with interfaces to branch on the concrete type',
    'More elegant than multiple if-statements with type assertions',
  ],
}

export default exercise
