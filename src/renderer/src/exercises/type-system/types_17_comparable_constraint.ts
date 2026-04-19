import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_17_comparable_constraint',
  title: 'Comparable Constraint',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'intermediate',
  order: 17,
  description: `Use comparable constraint for types supporting equality. The comparable constraint restricts to types that support == and != operators.`,
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
    'type MyGeneric[T comparable] restricts T to comparable types',
    'Allows using == and != on values of type T',
    'Slices and maps are not comparable; arrays and structs are (if elements are)',
  ],
}

export default exercise
