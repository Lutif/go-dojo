import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_17_for_range',
  title: 'For Range',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 17,
  description: `Master the range-based for loop for iterating over collections. The range clause provides the index and value for each iteration over arrays, slices, strings, maps, and channels.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Syntax: \`for index, value := range collection { }\`',
    'You can ignore the index with \`_\`: \`for _, value := range collection\`',
    'Range over strings gives you runes (Unicode characters), not bytes',
  ],
}

export default exercise
