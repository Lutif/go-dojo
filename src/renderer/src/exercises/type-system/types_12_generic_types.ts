import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_12_generic_types',
  title: 'Generic Types',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'intermediate',
  order: 12,
  description: `Create generic types with type parameters. Generic types allow building data structures that work with any type.`,
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
    'type Name[T Type] struct { value T } defines a generic struct',
    'Can reference T in methods: func (v Name[T]) Method() T { ... }',
    'Instantiate with: var x Name[int]',
  ],
}

export default exercise
