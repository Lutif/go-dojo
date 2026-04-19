import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_13_if_else',
  title: 'If/Else',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 13,
  description: `Learn conditional execution with if-else statements. Go supports if, else if, and else with an optional initialization statement that can declare variables.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Conditions don\'t need parentheses: \`if x > 0 { }\`',
    'You can initialize variables in the if condition: \`if x := getValue(); x > 0 { }\`',
    'An else block can appear after an if block without parentheses',
  ],
}

export default exercise
