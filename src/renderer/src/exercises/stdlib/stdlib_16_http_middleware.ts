import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_16_http_middleware',
  title: 'HTTP Middleware',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'advanced',
  order: 16,
  description: `Add middleware to HTTP servers. Middleware adds cross-cutting concerns to request handling.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Middleware wraps handler and adds behavior before/after',
    'Chain multiple middleware for composition',
    'Common middleware: logging, auth, CORS, compression',
  ],
}

export default exercise
