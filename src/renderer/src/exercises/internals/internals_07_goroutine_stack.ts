import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_07_goroutine_stack',
  title: 'Goroutine Stack',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'advanced',
  order: 7,
  description: `Learn about goroutine stacks and how they grow. Goroutines use segmented stacks for efficient concurrency.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Goroutines start with small stacks (usually 2KB)',
    'Stacks grow dynamically when space is needed',
    'Stack copying is transparent; function calls work normally',
  ],
}

export default exercise
