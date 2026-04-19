import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-03',
  title: 'Lexer — Whitespace Handling',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 103,
  description: `Parse statements (let, return, expression statements). Statements are the top-level program structure.`,
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
    'Parse let statements: let identifier = expression;',
    'Parse return statements: return expression;',
    'Parse expression statements for side effects',
  ],
}

export default exercise
