import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_22_arrays',
  title: 'Arrays',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 22,
  description: `Understand fixed-size arrays. Arrays in Go have a fixed length specified at declaration time and cannot grow. The length is part of the array's type.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Array syntax: \`var arr [5]int\` creates an array of exactly 5 integers',
    'Array length is fixed and cannot change after creation',
    'Arrays are passed by value; use pointers if you want to modify the original',
  ],
}

export default exercise
