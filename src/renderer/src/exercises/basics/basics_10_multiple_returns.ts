import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_10_multiple_returns',
  title: 'Multiple Returns',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 10,
  description: `Master returning multiple values from functions, a powerful Go feature. Functions can return multiple values by listing them in the return type specification.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Specify multiple return types in parentheses: \`func getValue() (int, error)\`',
    'Return multiple values separated by commas: \`return value, err\`',
    'This pattern is commonly used for error handling',
  ],
}

export default exercise
