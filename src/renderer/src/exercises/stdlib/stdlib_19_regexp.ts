import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_19_regexp',
  title: 'Regular Expressions',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 19,
  description: `Pattern matching with regexp package. Regular expressions enable powerful text searching and manipulation.`,
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
    'regexp.Compile() creates regex; MustCompile() panics on error',
    'FindString(), FindAllString() find matches',
    'ReplaceAllString() replaces matches',
  ],
}

export default exercise
