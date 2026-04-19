import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_14_context_basic',
  title: 'Context Basic',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'intermediate',
  order: 14,
  description: `Understand context.Context for passing request-scoped values. Context is used to manage cancellation, deadlines, and values across API boundaries.`,
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
    'context.Background() creates a root context; use it as the top-level context',
    'Pass context through function calls to enable cancellation and timeouts',
    'context.WithValue() attaches request-scoped values to context',
  ],
}

export default exercise
