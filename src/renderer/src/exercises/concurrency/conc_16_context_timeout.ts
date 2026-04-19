import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_16_context_timeout',
  title: 'Context Timeout',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'intermediate',
  order: 16,
  description: `Implement deadlines using context with timeouts. WithTimeout ensures operations complete within a time limit or are cancelled automatically.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestImplementation(t *testing.T) {
	// Verify the implementation matches the exercise requirements
	// Refer to the exercise description and hints for specific test cases
	t.Skip("Implement test based on exercise requirements")
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'context.WithTimeout(parent, duration) creates a context that cancels after duration',
    'The context automatically cancels when the deadline is reached',
    'Use select with ctx.Done() to respond to timeout',
  ],
}

export default exercise
