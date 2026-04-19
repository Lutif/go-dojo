import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_07_custom_types',
  title: 'Custom Types',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'beginner',
  order: 7,
  description: `Define custom types for domain-specific semantics. Custom types wrap existing types with additional meaning and enable custom methods.`,
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
    'Define with `type Name BaseType` to create a new named type',
    'New type is distinct from its base even if structurally identical',
    'Enables adding methods and improving type safety',
  ],
}

export default exercise
