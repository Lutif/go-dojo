import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_07_basic_types',
  title: 'Basic Types',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 7,
  description: `Learn Go's fundamental data types including integers, floats, strings, and booleans. Go provides both signed and unsigned integer variants of different sizes.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Integer types come in different sizes: int, int8, int16, int32, int64',
    'Use \`uint\` for unsigned integers (no negative values)',
    'Float types include float32 and float64; use float64 as the default',
  ],
}

export default exercise
