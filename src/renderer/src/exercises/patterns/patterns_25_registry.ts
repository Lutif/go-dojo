import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_25_registry',
  title: 'Registry Pattern',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 25,
  description: `Create registry pattern for dynamic component registration. Registries enable plugins and dynamic feature discovery.`,
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
    'Global registry map: type -> factory function',
    'Register() adds entries, Get() retrieves them',
    'Enables plugins and dynamic loading',
  ],
}

export default exercise
