import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_30_pointers_and_structs',
  title: 'Pointers and Structs',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'intermediate',
  order: 30,
  description: `Learn how pointers work with structs. You can create pointers to structs and modify fields through the pointer, useful for passing structs to functions that need to modify them.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Create a pointer to a struct: \`p := &person\`',
    'Access struct fields through a pointer: \`p.Name\` (Go allows this shorthand)',
    'Use pointer receivers in methods when you need to modify the struct',
  ],
}

export default exercise
