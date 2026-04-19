import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_07_basic_types',
  title: 'Basic Types',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 7,
  description: `Work with Go's basic types: integers (int, int32, int64), floats (float32, float64), strings, and booleans. Learn the differences between these types.`,
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
    'Integer types come in different sizes; int is platform-dependent but int64 is always 64-bit',
    'Use float64 by default for floating point numbers unless you have a specific reason for float32',
    'Strings in Go are UTF-8 encoded by default',
  ],
}

export default exercise
