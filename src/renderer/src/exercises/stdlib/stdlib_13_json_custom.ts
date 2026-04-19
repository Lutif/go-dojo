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

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'MarshalJSON() method customizes marshaling',
    'UnmarshalJSON() method customizes unmarshaling',
    'Useful for time.Time, custom types, computed fields',
  ],
}

export default exercise
