import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_23_slices',
  title: 'Slices',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 23,
  description: `Master slices, Go's dynamic array type. Slices are flexible views into arrays that can grow and shrink. They're more powerful and commonly used than arrays.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Slice syntax: \`var s []int\` creates a slice without specifying length',
    'Slice from an array: \`arr[1:3]\` creates a slice from index 1 to 3',
    'Slices have length (\`len\`) and capacity (\`cap\`)',
  ],
}

export default exercise
