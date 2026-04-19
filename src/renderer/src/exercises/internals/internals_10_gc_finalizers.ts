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

func TestImplementation(t *testing.T) {
	// Verify the implementation matches the exercise requirements
	// Refer to the exercise description and hints for specific test cases
	t.Skip("Implement test based on exercise requirements")
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'runtime.SetFinalizer(obj, finalizer) registers cleanup function',
    'Finalizers are unpredictable; don\'t rely on timing',
    'Prefer explicit cleanup (defer, Close()) when possible',
  ],
}

export default exercise
