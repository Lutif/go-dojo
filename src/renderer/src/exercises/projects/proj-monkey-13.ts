import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-13',
  title: 'Parser — Function Literals',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 113,
  description: `Add array data type and indexing. Arrays are sequences of values.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Parse array literals: [1, 2, 3]',
    'Implement array indexing: array[index]',
    'Handle out-of-bounds access gracefully',
  ],
}

export default exercise
