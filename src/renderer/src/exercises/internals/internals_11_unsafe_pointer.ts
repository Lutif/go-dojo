import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_11_unsafe_pointer',
  title: 'Unsafe Pointer',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'expert',
  order: 11,
  description: `Use unsafe pointers for low-level memory manipulation. Unsafe operations bypass type safety; use only when necessary.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'unsafe.Pointer allows converting between any pointer types',
    'unsafe.Sizeof(), Alignof(), Offsetof() query type properties',
    'Unsafe code is platform-dependent and fragile; avoid unless necessary',
  ],
}

export default exercise
