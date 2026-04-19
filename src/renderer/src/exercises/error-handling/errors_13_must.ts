import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_13_must',
  title: 'Must Pattern',
  category: 'Error Handling',
  subcategory: 'Error Handling',
  difficulty: 'intermediate',
  order: 13,
  description: `Implement "must" helpers for assertions. Must functions panic if the underlying operation returns an error, useful for known-safe operations.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Create helpers like \`func must(err error) { if err != nil { panic(err) } }\`',
    'Use in tests and initialization where you expect no errors',
    'Document clearly why errors are not expected to make assumptions explicit',
  ],
}

export default exercise
