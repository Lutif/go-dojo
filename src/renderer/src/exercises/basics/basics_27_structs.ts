import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_27_structs',
  title: 'Structs',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 27,
  description: `Learn structs, Go's way of grouping related data. Structs are collections of named fields, similar to classes in other languages but without inheritance.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Define a struct: \`type Person struct { Name string; Age int }\`',
    'Create instances: \`p := Person{Name: "John", Age: 30}\`',
    'Access fields: \`p.Name\` or \`p.Age\`',
  ],
}

export default exercise
