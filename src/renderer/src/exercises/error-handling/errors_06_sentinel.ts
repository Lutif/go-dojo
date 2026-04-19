import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_06_sentinel',
  title: 'Sentinel Errors',
  category: 'Error Handling',
  subcategory: 'Error Handling',
  difficulty: 'intermediate',
  order: 6,
  description: `Use sentinel errors for precise error checking. Sentinel errors are specific error values used for comparison with errors.Is().`,
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
    'Define package-level error variables: `var ErrNotFound = errors.New(...)`',
    'Compare using errors.Is() rather than == which fails with wrapped errors',
    'Sentinel errors enable callers to handle specific failure modes',
  ],
}

export default exercise
