import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_16_code_generation',
  title: 'Code Generation',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'advanced',
  order: 16,
  description: `Use go:generate for code generation. Go generate runs arbitrary commands during build to generate code.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    '//go:generate command in source triggers command during go generate',
    'Often used for: string constants, mock interfaces, serialization code',
    'Run \`go generate ./...\` to generate code for all packages',
  ],
}

export default exercise
