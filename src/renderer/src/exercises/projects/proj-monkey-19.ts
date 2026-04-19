import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-19',
  title: 'Evaluator — If-Else & Truthiness',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 119,
  description: `Add higher-order functions (map, select). Higher-order functions take functions as arguments.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'map(array, fn) applies function to each element',
    'select(array, fn) filters elements where fn is truthy',
    'Pass functions as arguments; call them',
  ],
}

export default exercise
