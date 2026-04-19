import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_15_context_cancel',
  title: 'Context Cancel',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'intermediate',
  order: 15,
  description: `Learn context cancellation for graceful shutdown. WithCancel returns a context that can be cancelled, signaling all goroutines listening on it.`,
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
    'context.WithCancel(parent) returns a context and a cancel function',
    'Call cancel() to signal all goroutines waiting on that context',
    'Check ctx.Done() to know when cancellation is requested',
  ],
}

export default exercise
