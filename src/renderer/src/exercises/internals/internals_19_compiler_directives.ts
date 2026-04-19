import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_19_compiler_directives',
  title: 'Compiler Directives',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'expert',
  order: 19,
  description: `Use compiler directives to control compilation. Compiler directives are special comments that modify compilation behavior.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    '//go:nodinline disables inlining of a function',
    '//go:noinline same as nodinline (older name)',
    '//go:inline forces inlining (ignored; for documentation)',
  ],
}

export default exercise
