import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_10_defer_closures',
  title: 'Defer with Closures',
  category: 'Error Handling',
  subcategory: 'Error Handling',
  difficulty: 'intermediate',
  order: 10,
  description: `Understand variable capture in deferred closures. Deferred closures capture variables, which can lead to surprising behavior if not careful.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Variables captured by closures are captured by reference, not value',
    'Use parameters in deferred functions for value capture',
    'Be careful with loops: defer in loops often captures the final loop variable',
  ],
}

export default exercise
