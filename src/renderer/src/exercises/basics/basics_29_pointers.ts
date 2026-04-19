import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_29_pointers',
  title: 'Pointers',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'intermediate',
  order: 29,
  description: `Master pointers, which hold memory addresses of values. Pointers allow you to pass values by reference and create shared references to data.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Declare a pointer: \`var p *int\` or \`p := &value\`',
    'Dereference a pointer: \`*p\` accesses the value the pointer points to',
    'Take the address of a value: \`&value\` creates a pointer to it',
  ],
}

export default exercise
