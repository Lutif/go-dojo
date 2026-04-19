import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_20_runtime_info',
  title: 'Runtime Introspection',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'expert',
  order: 20,
  description: `Query runtime information about the program. The runtime package provides functions to inspect program behavior.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'runtime.NumGoroutine() returns count of running goroutines',
    'runtime.GOARCH, GOOS provide platform information',
    'runtime.ReadMemStats() provides detailed memory statistics',
  ],
}

export default exercise
