import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_17_for_range',
  title: 'For Range',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 17,
  description: `Use range to iterate over arrays, slices, maps, strings, and channels. Learn the different range patterns.`,
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
    'for i, value := range collection iterates with both index and value',
    'You can use _ to ignore the index or value: for _, v := range collection',
    'When iterating over a string with range, values are runes, not bytes',
  ],
}

export default exercise
