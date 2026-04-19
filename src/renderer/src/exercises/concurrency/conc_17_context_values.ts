import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_17_context_values',
  title: 'Context Values',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'intermediate',
  order: 17,
  description: `Pass request-scoped data through context. Context.WithValue() stores key-value pairs that flow through the call chain, avoiding function parameter pollution.`,
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
    'Use context.WithValue(parent, key, value) to attach values',
    'Retrieve with ctx.Value(key); check if nil since key might not exist',
    'Define custom types for keys to avoid collisions and improve type safety',
  ],
}

export default exercise
