import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_02_variables',
  title: 'Variables',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 2,
  description: `Understand how to declare and use variables in Go. Variables must be declared with a type or initialized with a value so the compiler can infer the type.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Use the \`var\` keyword to declare variables with a specific type',
    'You can declare multiple variables at once with \`var x, y, z int\`',
    'Variables must be used after declaration or the compiler will produce an error',
  ],
}

export default exercise
