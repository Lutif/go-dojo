import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_14_multi_error',
  title: 'Multi-Error',
  category: 'Error Handling',
  subcategory: 'Error Handling',
  difficulty: 'advanced',
  order: 14,
  description: `Collect and propagate multiple errors. Multi-error handling aggregates errors from concurrent operations or multiple validation checks.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Collect errors in a slice, then return a multi-error if any occurred',
    'golang.org/x/exp/errors/fmt provides MultiError support',
    'AllErrors() iterates through the error chain to find all errors',
  ],
}

export default exercise
