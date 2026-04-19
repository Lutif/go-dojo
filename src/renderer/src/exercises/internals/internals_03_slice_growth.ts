import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_03_slice_growth',
  title: 'Slice Growth',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'advanced',
  order: 3,
  description: `Learn how slices grow when appended to capacity limits. Understanding growth strategies helps predict memory allocation.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'When append() exceeds capacity, Go allocates a new larger array',
    'Growth strategy: double capacity up to 1024 bytes, then 25% growth',
    'Unused capacity is wasted; pre-allocate slices to avoid reallocations',
  ],
}

export default exercise
