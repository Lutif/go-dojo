import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_12_reflect_basics',
  title: 'Reflect Basics',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'advanced',
  order: 12,
  description: `Learn reflection to inspect types at runtime. Reflection allows examining type information dynamically.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'reflect.TypeOf(v) returns the type of v',
    'reflect.ValueOf(v) returns the value for manipulation',
    'Reflection enables generic data processing and serialization',
  ],
}

export default exercise
