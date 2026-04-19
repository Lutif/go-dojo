import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_16_circuit_breaker',
  title: 'Circuit Breaker',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 16,
  description: `Implement circuit breaker to prevent cascading failures. Circuit breakers stop requests to failing services.`,
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
    'Track failures; open circuit after threshold',
    'Return errors immediately when circuit open',
    'Periodically test service; close circuit when it recovers',
  ],
}

export default exercise
