import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_03_http_middleware',
  title: 'HTTP Middleware',
  category: 'Networking',
  subcategory: 'Networking',
  difficulty: 'intermediate',
  order: 3,
  description: `Build middleware to wrap HTTP handlers. Middleware adds cross-cutting concerns like logging, authentication, and metrics.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Middleware wraps a handler and returns a wrapped handler',
    'Execute logic before handler, process response, execute after',
    'Chain multiple middleware for composition',
  ],
}

export default exercise
