import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_19_strings',
  title: 'Strings',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 19,
  description: `Understand Go strings, which are sequences of bytes. Strings are immutable, and basic string operations include concatenation, indexing, and slicing.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Strings in Go are immutable sequences of UTF-8 encoded bytes',
    'Use \`+\` operator to concatenate strings',
    'Index a string to get a byte: \`str[0]\` returns a byte value',
  ],
}

export default exercise
