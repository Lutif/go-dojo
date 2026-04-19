import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-15',
  title: 'Evaluator — Integer & Boolean Values',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 115,
  description: `Add hash (map) data type with key-value pairs. Hashes enable dictionary-like data structures.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Parse hash literals: {key: value, key: value}',
    'Implement hash indexing: hash[key]',
    'Support string and integer keys',
  ],
}

export default exercise
