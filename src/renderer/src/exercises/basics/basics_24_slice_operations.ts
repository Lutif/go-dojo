import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_24_slice_operations',
  title: 'Slice Operations',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'intermediate',
  order: 24,
  description: `Learn essential slice operations including append, copy, and slicing. The \`append\` function grows slices dynamically, making it essential for working with variable-length data.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Use \`append(slice, value)\` to add elements to a slice',
    'Use \`copy(dest, src)\` to copy elements from one slice to another',
    'Reslicing: \`slice[start:end]\` creates a new slice view',
  ],
}

export default exercise
