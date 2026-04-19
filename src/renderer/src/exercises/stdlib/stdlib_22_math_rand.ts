import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_22_math_rand',
  title: 'math/rand',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'beginner',
  order: 22,
  description: `Generate random numbers with math/rand package. Random numbers are useful for testing and algorithms.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'rand.Intn(n) returns int in [0, n)',
    'rand.Float64() returns float in [0, 1)',
    'rand.Seed() sets seed (not needed with global rand in Go 1.20+)',
  ],
}

export default exercise
