import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_25_testing',
  title: 'Table-Driven Tests',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 25,
  description: `Write tests with the testing package. Testing is built-in to Go; write tests in *_test.go files.`,
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
    'Test functions: func TestName(t *testing.T) in *_test.go files',
    't.Error()/t.Errorf() report test failure',
    't.Run(name, func(t *testing.T)) creates subtests',
  ],
}

export default exercise
