import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_13_generic_constraints',
  title: 'Generic Constraints',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'intermediate',
  order: 13,
  description: `Define constraints for generic types. Constraints restrict type parameters to types with specific methods or behaviors.`,
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
    'type Constraint interface { ... } defines a constraint',
    'Use in generics: func Func[T Constraint](arg T) { ... }',
    'Constraint can be an interface or a type set',
  ],
}

export default exercise
