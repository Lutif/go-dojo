import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_08_consistent_hashing',
  title: 'Consistent Hashing',
  category: 'Data & Storage',
  subcategory: 'Data & Storage',
  difficulty: 'expert',
  order: 8,
  description: `Implement consistent hashing for distributed systems. Consistent hashing minimizes remap overhead when nodes are added/removed.`,
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
    'Map nodes and keys to a circular hash space (0 to 2^n)',
    'A key maps to the first node clockwise from it on the ring',
    'Adding/removing a node only affects keys between that node and its predecessor',
  ],
}

export default exercise
