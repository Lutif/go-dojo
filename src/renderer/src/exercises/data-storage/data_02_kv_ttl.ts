import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_02_kv_ttl',
  title: 'KV Store with TTL',
  category: 'Data & Storage',
  subcategory: 'Data & Storage',
  difficulty: 'intermediate',
  order: 2,
  description: `Add time-to-live (TTL) expiration to key-value entries. TTL allows automatic cleanup of stale data, essential for caches and session storage.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Store expiration time with each value alongside the actual data',
    'Check expiration on Get(); remove expired entries automatically',
    'Use background goroutine with ticker for periodic cleanup of old entries',
  ],
}

export default exercise
