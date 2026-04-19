import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_27_structs',
  title: 'Structs',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 27,
  description: `Define and use struct types to group related data. Structs are the foundation of Go's approach to object-oriented programming.`,
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
    'Define a struct with type name struct { field Type; ... }',
    'Access struct fields with dot notation: variable.field',
    'Struct field names must be capitalized to be exported from a package',
  ],
}

export default exercise
