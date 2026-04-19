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

func TestHello(t *testing.T) {
	got := Hello()
	want := "Hello, World!"
	if got != want {
		t.Errorf("Hello() = %q, want %q", got, want)
	}
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Every executable Go program needs a main package and a main() function',
    'Use the fmt package\'s Println function to output text',
    'Remember to include the proper import statement at the top of your file',
  ],
}

export default exercise
