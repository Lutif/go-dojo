import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_25_maps',
  title: 'Maps',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 25,
  description: `Create and use maps for key-value storage. Maps are Go's hash table implementation.`,
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
    'Map syntax: map[KeyType]ValueType like map[string]int',
    'Initialize maps using make() or map literal syntax',
    'Access values with m[key] and check existence with ok := m[key]',
  ],
}

export default exercise
