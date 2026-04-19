import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_23_rate_limiter',
  title: 'Rate Limiter',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'advanced',
  order: 23,
  description: `Control request rates using rate limiting. Rate limiters prevent overwhelming services by controlling the frequency of operations.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Use time.Ticker to limit operations to N per second',
    'Create a token bucket: send tokens at fixed rate, consume to perform actions',
    'golang.org/x/time/rate provides a Token Bucket rate limiter',
  ],
}

export default exercise
