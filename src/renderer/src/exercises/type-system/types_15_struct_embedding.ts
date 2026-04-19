import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_15_struct_embedding',
  title: 'Struct Embedding',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'intermediate',
  order: 15,
  description: `Embed structs to create hierarchies and share behavior. Embedding is Go's way of code reuse and composition.`,
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
    'Embed struct by using its type as field without a name: type Child struct { Parent }',
    'Parent fields and methods are promoted to Child',
    'Prefer composition over inheritance; embedding is a form of composition',
  ],
}

export default exercise
