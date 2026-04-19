import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_20_runes',
  title: 'Runes',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'intermediate',
  order: 20,
  description: `Learn about runes, Go's way of handling Unicode characters. A rune is an alias for \`int32\` and represents a single Unicode code point.`,
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
    'A rune is an int32 representing a Unicode code point',
    'Convert a string to a slice of runes for proper Unicode handling',
    'When iterating strings with range, you get runes automatically',
  ],
}

export default exercise
