import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_11_named_returns',
  title: 'Named Returns',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 11,
  description: `Learn about named return values that act as variables in function bodies. Named returns are automatically initialized to their zero values and enable cleaner code with implicit returns.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Name return values in the function signature: \`func getValue() (value int, err error)\`',
    'Named returns can be modified like regular variables',
    'A bare \`return\` statement returns all named return values',
  ],
}

export default exercise
