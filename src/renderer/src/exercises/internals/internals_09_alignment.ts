import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_09_alignment',
  title: 'Memory Alignment',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'expert',
  order: 9,
  description: `Learn about memory alignment and padding in structs. Alignment requirements can waste space if fields are poorly ordered.`,
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
    'CPU architectures require data to be aligned (multiples of word size)',
    'Go inserts padding between struct fields for alignment',
    'Order fields by size (largest first) to minimize padding',
  ],
}

export default exercise
