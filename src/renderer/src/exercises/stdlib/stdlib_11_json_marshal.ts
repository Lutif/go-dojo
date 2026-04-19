import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_11_json_marshal',
  title: 'JSON Marshal',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 11,
  description: `Convert structs to JSON with encoding/json. Marshaling enables JSON serialization of data.`,
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
    'json.Marshal() converts struct to JSON bytes',
    'Use struct tags: `json:"fieldName"`',
    'Unexported fields are ignored; use capitalized field names',
  ],
}

export default exercise
