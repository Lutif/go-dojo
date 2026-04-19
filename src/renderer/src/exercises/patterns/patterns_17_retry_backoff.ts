import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_17_retry_backoff',
  title: 'Retry with Backoff',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 17,
  description: `Add retry logic with exponential backoff. Retries with backoff handle transient failures gracefully.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Calculate delay: base * (2 ^ attempt) with random jitter',
    'Limit max retries to avoid infinite loops',
    'Useful for network calls and database operations',
  ],
}

export default exercise
