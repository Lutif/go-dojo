import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_01_kv_store',
  title: 'In-Memory KV Store',
  category: 'Data & Storage',
  subcategory: 'Data & Storage',
  difficulty: 'intermediate',
  order: 1,
  description: `Build a basic in-memory key-value store with Get, Set, and Delete operations. This is the foundation for understanding data structures and storage systems.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Use a map to store key-value pairs with proper mutex protection',
    'Implement Get() to retrieve values, Set() to store, Delete() to remove',
    'Ensure thread-safe access using sync.RWMutex for better read concurrency',
  ],
}

export default exercise
