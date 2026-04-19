import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_05_as',
  title: 'errors.As',
  category: 'Error Handling',
  subcategory: 'Error Handling',
  difficulty: 'intermediate',
  order: 5,
  description: `Extract underlying errors with errors.As(). As() unwraps the error chain to find a value of a specific type.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'errors.As(err, &target) checks if an error in the chain matches the target type',
    'Use for extracting custom error types from wrapped errors',
    'Allows accessing error details after confirming the type',
  ],
}

export default exercise
