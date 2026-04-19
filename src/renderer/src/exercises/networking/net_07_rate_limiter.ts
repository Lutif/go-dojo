import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_07_rate_limiter',
  title: 'Rate Limiter',
  category: 'Networking',
  subcategory: 'Networking',
  difficulty: 'advanced',
  order: 7,
  description: `Add rate limiting to protect services from overload. Rate limiters control request flow to prevent overwhelming endpoints.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Token bucket rate limiter: send tokens at fixed rate, consume for requests',
    'Use time.Ticker for periodic token generation',
    'Reject requests when bucket is empty',
  ],
}

export default exercise
