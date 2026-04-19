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

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Function syntax: \`func functionName(param1 type1, param2 type2) returnType { }\`',
    'Parameters can share a type: \`func add(x, y int) int\`',
    'Functions in Go can return multiple values',
  ],
}

export default exercise
