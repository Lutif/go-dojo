import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_05_constants',
  title: 'Constants',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 5,
  description: `Master Go's constant declarations. Constants are immutable values that must be assigned at compile time and cannot be changed. Use \`const\` keyword to define them.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Constants are declared with the \`const\` keyword',
    'Constants must be assigned a value at declaration time',
    'Constants can be typed or untyped (ideal for expressions)',
  ],
}

export default exercise
