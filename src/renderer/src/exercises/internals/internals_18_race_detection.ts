import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_18_race_detection',
  title: 'Race Detection',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'expert',
  order: 18,
  description: `Use race detector to find data races. Race detector identifies concurrent access to shared data without synchronization.`,
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
    '`go test -race` or `go run -race` enables race detection',
    'Finds data races automatically; invaluable for concurrent code',
    'Performance overhead; use only during development and testing',
  ],
}

export default exercise
