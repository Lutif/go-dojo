import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_03_strconv',
  title: 'strconv Conversions',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'beginner',
  order: 3,
  description: `Convert between strings and other types with strconv. Strconv handles parsing and formatting of numbers.`,
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
    'strconv.Atoi(s) converts string to int; strconv.Itoa(i) does reverse',
    'strconv.ParseInt(s, base, bits) parses integers in any base',
    'strconv.FormatInt(i, base) formats integers in any base',
  ],
}

export default exercise
