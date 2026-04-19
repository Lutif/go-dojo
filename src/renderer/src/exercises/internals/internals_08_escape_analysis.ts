import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_08_escape_analysis',
  title: 'Escape Analysis',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'expert',
  order: 8,
  description: `Understand escape analysis and when variables are allocated on heap vs stack. Escape analysis optimizes memory allocation.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Compiler determines if a variable "escapes" outside its function',
    'Non-escaping variables allocated on stack (faster, no GC)',
    'Escaping variables allocated on heap (slower, requires GC)',
  ],
}

export default exercise
