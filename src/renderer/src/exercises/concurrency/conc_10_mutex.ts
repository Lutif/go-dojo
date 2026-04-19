import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_10_mutex',
  title: 'Mutex',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'intermediate',
  order: 10,
  description: `Understand mutual exclusion locks to protect shared state. Mutex ensures only one goroutine can access protected data at a time, preventing race conditions.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Lock() acquires the mutex, Unlock() releases it',
    'Always pair Lock() and Unlock(); consider defer Unlock() for safety',
    'Use -race flag to detect data races: \`go test -race\`',
  ],
}

export default exercise
