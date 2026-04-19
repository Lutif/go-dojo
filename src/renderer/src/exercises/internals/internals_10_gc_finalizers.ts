import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_10_gc_finalizers',
  title: 'Garbage Collector',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'expert',
  order: 10,
  description: `Use finalizers for cleanup when objects are garbage collected. Finalizers run after an object becomes unreachable.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'runtime.SetFinalizer(obj, finalizer) registers cleanup function',
    'Finalizers are unpredictable; don't rely on timing',
    'Prefer explicit cleanup (defer, Close()) when possible',
  ],
}

export default exercise
