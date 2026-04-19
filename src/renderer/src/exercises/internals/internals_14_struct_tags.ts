import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_14_struct_tags',
  title: 'Reflect Struct Tags',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'advanced',
  order: 14,
  description: `Use struct tags for metadata. Struct tags provide key-value metadata that can be read via reflection.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Tags are strings after field definitions: \`json:"name" xml:"id"\`',
    'Read with reflect.StructTag.Get() or reflect.StructField.Tag',
    'Used by marshaling packages (json, xml) and validators',
  ],
}

export default exercise
