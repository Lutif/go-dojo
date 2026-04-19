import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_01_hello',
  title: 'Hello World',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 1,
  description: `Learn the basics of a Go program structure. Every Go program must have a \`main\` package and a \`main()\` function, which is the entry point for execution.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Every Go program starts with a package declaration',
    'The \`main\` function is where your program execution begins',
    'Use \`fmt.Println()\` to print output to the console',
  ],
}

export default exercise
