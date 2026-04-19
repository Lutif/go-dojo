import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_13_atomic',
  title: 'Atomic Operations',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'intermediate',
  order: 13,
  description: `Learn atomic operations for lock-free synchronization of integers and pointers. Atomic operations are faster than mutexes for simple counters and flags.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'sync/atomic provides Lock-free atomic operations on integers and pointers',
    'Common operations: Load(), Store(), Add(), CompareAndSwap()',
    'Use atomics for simple counters and flags; mutex for complex data structures',
  ],
}

export default exercise
