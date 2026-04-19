import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_15_circuit_breaker_http',
  title: 'HTTP Circuit Breaker',
  category: 'Networking',
  subcategory: 'Networking',
  difficulty: 'expert',
  order: 15,
  description: `Implement circuit breaker pattern for HTTP clients. Circuit breakers prevent cascading failures by stopping requests to failing services.`,
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
    'Track failure count; open circuit after threshold',
    'While open, fail fast without attempting requests',
    'Periodically try to close circuit (half-open state)',
    'Close circuit when request succeeds',
  ],
}

export default exercise
