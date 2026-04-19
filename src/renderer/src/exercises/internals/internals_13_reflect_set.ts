import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_13_reflect_set',
  title: 'Reflect Values',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'expert',
  order: 13,
  description: `Use reflection to modify values at runtime. Reflection allows setting fields and calling methods dynamically.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'reflect.ValueOf(ptr).Elem().SetString(s) sets a string value',
    'Only settable values can be modified (must be addressable and exported)',
    'Use CanSet() to check if a value is settable before attempting',
  ],
}

export default exercise
