import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_20_constraints_package',
  title: 'Constraints Package',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'advanced',
  order: 20,
  description: `Use constraints from the constraints package for common restrictions. The constraints package defines commonly-used constraint types.`,
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
    'constraints.Ordered for types supporting <, >, <=, >=',
    'constraints.Integer for all integer types',
    'constraints.Signed and constraints.Unsigned for signed/unsigned integers',
  ],
}

export default exercise
