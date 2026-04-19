import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_03_lru_cache',
  title: 'LRU Cache',
  category: 'Data & Storage',
  subcategory: 'Data & Storage',
  difficulty: 'advanced',
  order: 3,
  description: `Implement an LRU (Least Recently Used) cache that evicts least-used items when full. LRU caches optimize memory by keeping hot data accessible.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Combine a map for O(1) lookup with a doubly-linked list for ordering',
    'Move accessed items to the front (most recent); evict from the back',
    'Track access order to implement the "least recently used" policy',
  ],
}

export default exercise
