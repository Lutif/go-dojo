import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_01_functional_options',
  title: 'Functional Options',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 1,
  description: `Master functional options pattern for flexible construction. Functional options enable building objects with many optional fields.`,
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
    'Define Option type as a function: type Option func(*Config)',
    'Implement constructors as functions returning Option values',
    'Pass options to build function: Build(opts...Option)',
  ],
}

export default exercise
