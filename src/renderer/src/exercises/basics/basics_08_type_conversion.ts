import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_08_type_conversion',
  title: 'Type Conversion',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 8,
  description: `Understand how to convert between different types in Go. Unlike some languages, Go does not allow implicit type conversion, so you must explicitly convert values using the \`Type(value)\` syntax.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Use \`int(floatValue)\` to convert from float to int',
    'Use \`float64(intValue)\` to convert from int to float64',
    'Type conversion truncates float values when converting to integers',
  ],
}

export default exercise
