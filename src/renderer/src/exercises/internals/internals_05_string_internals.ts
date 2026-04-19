import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_05_string_internals',
  title: 'String Internals',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'advanced',
  order: 5,
  description: `Learn how strings are represented in Go. Strings are immutable byte sequences with specific memory representation.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Strings are immutable; each string operation creates a new string',
    'String header contains: pointer to data, length',
    'Converting string to []byte allocates new memory',
  ],
}

export default exercise
