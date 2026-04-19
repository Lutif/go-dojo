import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_09_functions',
  title: 'Functions',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 9,
  description: `Learn how to define and call functions in Go. Functions are declared with the \`func\` keyword followed by a name, parameter list, and optional return type.`,
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
    'Function syntax is: func functionName(param1 Type, param2 Type) ReturnType { ... }',
    'Parameters must have their types explicitly specified',
    'A function with a return type must have a return statement',
  ],
}

export default exercise
