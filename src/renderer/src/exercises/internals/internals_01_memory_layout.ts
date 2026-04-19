import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_01_memory_layout',
  title: 'Memory Layout',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'advanced',
  order: 1,
  description: `Learn how Go stores values in memory. Understanding memory layout helps optimize performance and prevents subtle bugs.`,
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
    'Structs lay out fields sequentially in memory',
    'Field order affects struct size due to alignment',
    'Use `unsafe.Sizeof()` to check type sizes',
  ],
}

export default exercise
