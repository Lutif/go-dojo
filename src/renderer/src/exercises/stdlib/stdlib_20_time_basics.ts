import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_20_time_basics',
  title: 'time Basics',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'beginner',
  order: 20,
  description: `Handle time with time package. Time package provides time/date operations.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'time.Now() gets current time',
    'time.Date() creates specific date/time',
    'time.Parse() parses strings in specific format',
  ],
}

export default exercise
