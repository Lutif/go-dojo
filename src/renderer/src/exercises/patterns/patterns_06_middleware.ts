import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_06_middleware',
  title: 'Middleware Chain',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 6,
  description: `Create middleware for request/response processing pipelines. Middleware wraps handlers and adds behavior.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Middleware takes handler, returns wrapped handler',
    'Process request before passing to wrapped handler',
    'Process response after wrapped handler completes',
  ],
}

export default exercise
