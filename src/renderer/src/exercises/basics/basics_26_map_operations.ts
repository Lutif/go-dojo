import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_26_map_operations',
  title: 'Map Operations',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'intermediate',
  order: 26,
  description: `Manipulate maps by adding, retrieving, and deleting key-value pairs. Learn how to iterate over maps.`,
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
    'Assign to a map with m[key] = value',
    'Delete from a map with delete(m, key)',
    'When accessing a key that doesn\'t exist, you get the zero value',
  ],
}

export default exercise
