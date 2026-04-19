import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_10_dependency_injection',
  title: 'Dependency Injection',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 10,
  description: `Implement dependency injection for loose coupling. Dependency injection passes dependencies to objects instead of having them create dependencies.`,
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
    'Accept dependencies as constructor parameters',
    'Store in struct fields for later use',
    'Enables easy testing with mock dependencies',
  ],
}

export default exercise
