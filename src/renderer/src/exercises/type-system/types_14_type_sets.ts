import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_14_type_sets',
  title: 'Type Sets',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'advanced',
  order: 14,
  description: `Use type sets (union constraints) to restrict types. Type sets enable listing specific types rather than requiring interface compliance.`,
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
    'Type set: `type Numeric interface { int | float64 | complex128 }`',
    'Only listed types are allowed; useful for numeric/comparable operations',
    'Enables writing code that works for a limited set of types',
  ],
}

export default exercise
