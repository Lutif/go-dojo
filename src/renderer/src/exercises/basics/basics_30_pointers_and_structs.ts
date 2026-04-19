import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_30_pointers_and_structs',
  title: 'Pointers and Structs',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'intermediate',
  order: 30,
  description: `Use pointers to structs for efficient passing and modification. Learn how pointer receivers enable you to modify struct values.`,
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
    'Pointers to structs can be created with &variable or new(Type)',
    'Go automatically dereferences struct pointers for field access',
    'Methods with pointer receivers can modify the original struct',
  ],
}

export default exercise
