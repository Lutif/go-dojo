import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_13_json_custom',
  title: 'JSON Custom Encoding',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'advanced',
  order: 13,
  description: `Implement custom JSON marshaling for special types. Custom marshaling handles non-standard serialization.`,
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
    'MarshalJSON() method customizes marshaling',
    'UnmarshalJSON() method customizes unmarshaling',
    'Useful for time.Time, custom types, computed fields',
  ],
}

export default exercise
