import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_05_type_assertions',
  title: 'Type Assertions',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'intermediate',
  order: 5,
  description: `Extract concrete types from interface values using assertions. Type assertions allow you to use specific type methods on interface values.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'v.(T) asserts that v holds concrete type T',
    'Use \`v, ok := x.(T)\` to safely check if assertion succeeds',
    'Panic if assertion fails without checking ok; always use comma-ok form',
  ],
}

export default exercise
