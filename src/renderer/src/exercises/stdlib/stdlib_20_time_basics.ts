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

func TestImplementation(t *testing.T) {
	// Verify the implementation matches the exercise requirements
	// Refer to the exercise description and hints for specific test cases
	t.Skip("Implement test based on exercise requirements")
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'time.Now() gets current time',
    'time.Date() creates specific date/time',
    'time.Parse() parses strings in specific format',
  ],
}

export default exercise
