import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_15_switch_no_condition',
  title: 'Switch No Condition',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 15,
  description: `Understand switch statements without an expression, which act like multiple if-else statements. Each case contains a full boolean expression to evaluate.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'A switch without an expression evaluates cases that are boolean expressions',
    'This is equivalent to chaining multiple if-else statements',
    'The first case that evaluates to true is executed',
  ],
}

export default exercise
