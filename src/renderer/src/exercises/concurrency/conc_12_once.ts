import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_12_once',
  title: 'Once',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'intermediate',
  order: 12,
  description: `Master sync.Once for one-time initialization. Once ensures a function executes exactly once, even when called from multiple goroutines simultaneously.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Once.Do(func) executes the function exactly once across all goroutine calls',
    'Subsequent Do() calls are no-ops; useful for singleton initialization',
    'Perfect for lazy initialization of expensive resources',
  ],
}

export default exercise
