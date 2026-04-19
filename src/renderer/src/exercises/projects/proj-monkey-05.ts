import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-05',
  title: 'Lexer — String Literals',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 105,
  description: `Parse function literals and call expressions. Functions are first-class values in Monkey.`,
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
    'Parse fn ( params ) { body }',
    'Parse function calls: expression ( arguments )',
    'Handle parameter lists and argument lists',
  ],
}

export default exercise
