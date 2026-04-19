import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_06_skip_list',
  title: 'Skip List',
  category: 'Data & Storage',
  subcategory: 'Data & Storage',
  difficulty: 'expert',
  order: 6,
  description: `Implement a skip list for efficient searching in sorted data. Skip lists provide O(log n) search with simpler code than balanced trees.`,
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
    'Skip lists are linked lists with multiple levels of "express lanes"',
    'Higher levels skip more nodes, enabling fast traversal',
    'Each node randomly gets promoted to higher levels (typically 50% chance)',
  ],
}

export default exercise
