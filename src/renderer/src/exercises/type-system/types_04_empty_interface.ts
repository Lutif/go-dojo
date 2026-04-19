import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_04_empty_interface',
  title: 'Empty Interface',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'beginner',
  order: 4,
  description: `Use empty interface to accept any type. The empty interface \`interface{}\` is implemented by every type, allowing generic containers.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestEmptyInterface(t *testing.T) {
	var v interface{}
	
	v = 42
	if i, ok := v.(int); !ok || i != 42 {
		t.Error("Failed to assert int")
	}
	
	v = "hello"
	if s, ok := v.(string); !ok || s != "hello" {
		t.Error("Failed to assert string")
	}
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Empty interface `interface{}` matches any type',
    'Commonly used in generic containers (maps, slices of any type)',
    'Requires type assertions to use values: `value.(Type)`',
  ],
}

export default exercise
