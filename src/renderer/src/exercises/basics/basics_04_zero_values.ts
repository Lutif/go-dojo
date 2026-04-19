import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_04_zero_values',
  title: 'Zero Values',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 4,
  description: `Learn about Go's zero value concept. When variables are declared without initialization, they automatically receive their type's zero value (0 for numbers, empty string for strings, nil for pointers, etc.).`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Numeric types have a zero value of 0',
    'Strings have an empty string as their zero value',
    'Pointers and slices have nil as their zero value',
  ],
}

export default exercise
