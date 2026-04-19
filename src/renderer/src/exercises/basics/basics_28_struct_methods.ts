import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_28_struct_methods',
  title: 'Struct Methods',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'intermediate',
  order: 28,
  description: `Understand methods, which are functions with a receiver argument. Methods allow you to add behavior to structs without inheritance.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Method syntax: \`func (r Receiver) MethodName() ReturnType { }\`',
    'Methods can have value receivers or pointer receivers',
    'Use pointer receivers when you need to modify the receiver',
  ],
}

export default exercise
