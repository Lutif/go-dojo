import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_28_struct_methods',
  title: 'Struct Methods',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'intermediate',
  order: 28,
  description: `Define methods on struct types using a receiver. Learn how to associate behavior with data.`,
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
    'Method syntax: func (receiver Type) MethodName() { ... }',
    'The receiver appears between func and the method name',
    'Use a pointer receiver to modify the struct: func (p *Type) Method()',
  ],
}

export default exercise
