import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_08_type_conversion',
  title: 'Type Conversion',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 8,
  description: `Understand how to convert between different types in Go. Unlike some languages, Go does not allow implicit type conversion, so you must explicitly convert values using the \`Type(value)\` syntax.`,
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
    'Type conversion syntax is TypeName(value) like int(3.14) or string(65)',
    'Go requires explicit conversion; you cannot mix types without converting',
    'Numeric conversions may lose precision or cause overflow',
  ],
}

export default exercise
