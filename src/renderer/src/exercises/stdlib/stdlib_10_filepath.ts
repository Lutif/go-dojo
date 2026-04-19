import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_10_filepath',
  title: 'filepath Package',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'beginner',
  order: 10,
  description: `Handle file paths portably with filepath package. Filepath works cross-platform, unlike strings.`,
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
    'filepath.Join() joins path components safely',
    'filepath.Abs() gets absolute path',
    'filepath.Base(), filepath.Dir() get filename and directory',
  ],
}

export default exercise
