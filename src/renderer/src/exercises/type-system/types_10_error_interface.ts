import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_10_error_interface',
  title: 'Error Interface',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'intermediate',
  order: 10,
  description: `Implement the error interface for custom error types. Any type with Error() string method satisfies the error interface.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Implement Error() string method to create an error type',
    'Can add fields to carry additional context (code, details, etc.)',
    'Can be used with errors.Is() and errors.As() if properly wrapped',
  ],
}

export default exercise
