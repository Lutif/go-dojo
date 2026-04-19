import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_03_wrapping',
  title: 'Error Wrapping',
  category: 'Error Handling',
  subcategory: 'Error Handling',
  difficulty: 'beginner',
  order: 3,
  description: `Wrap errors to add context while preserving the original error. Error wrapping creates a chain showing where errors originated.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Use \`fmt.Errorf("%w", err)\` to wrap errors with context',
    'Wrapped errors preserve the original error for inspection',
    'Build error chains that show the full path from root cause to caller',
  ],
}

export default exercise
