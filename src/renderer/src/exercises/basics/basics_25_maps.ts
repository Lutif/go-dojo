import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_25_maps',
  title: 'Maps',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 25,
  description: `Understand maps, Go's implementation of hash tables or dictionaries. Maps store key-value pairs and provide fast lookups by key.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Declare a map: \`var m map[string]int\` or \`m := make(map[string]int)\`',
    'Access values: \`value := m[key]\` or \`value, ok := m[key]\` to check if key exists',
    'Maps are unordered and not safe for concurrent access',
  ],
}

export default exercise
