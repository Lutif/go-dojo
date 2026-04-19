import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_24_errgroup',
  title: 'ErrGroup',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'expert',
  order: 24,
  description: `Use errgroup for synchronized goroutine execution with error handling. ErrGroup simplifies waiting for goroutines and propagates errors.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'g.Go(func() error) launches goroutines that can return errors',
    'g.Wait() waits for all goroutines and returns the first error',
    'Perfect for parallel tasks that should stop on first error',
  ],
}

export default exercise
