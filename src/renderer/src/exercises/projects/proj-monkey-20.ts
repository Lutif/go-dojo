import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-20',
  title: 'Evaluator — Environment & Variables',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 120,
  description: `Implement reduce function for aggregation. Reduce combines array elements into a single value.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'reduce(array, accumulator, fn) applies function to accumulator and each element',
    'Function receives (previous, current); returns new accumulator',
    'Return final accumulator',
  ],
}

export default exercise
