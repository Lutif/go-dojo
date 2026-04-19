import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_26_map_operations',
  title: 'Map Operations',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'intermediate',
  order: 26,
  description: `Master map operations including insertion, deletion, and checking key existence. Maps use a simple syntax for these operations.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Add/update: \`m[key] = value\`',
    'Delete: \`delete(m, key)\` removes a key from the map',
    'Check existence: \`value, ok := m[key]\` returns true if key exists',
  ],
}

export default exercise
