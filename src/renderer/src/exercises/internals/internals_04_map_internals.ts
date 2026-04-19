import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_04_map_internals',
  title: 'Map Internals',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'advanced',
  order: 4,
  description: `Understand how maps work internally. Maps use hash tables for fast key lookup.`,
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
    'Maps hash keys into buckets for O(1) average-case lookup',
    'Hash collisions are handled with chaining or probing',
    'Maps grow automatically when load factor exceeds threshold',
  ],
}

export default exercise
