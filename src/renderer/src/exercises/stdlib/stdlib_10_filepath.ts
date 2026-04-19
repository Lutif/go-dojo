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

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'filepath.Join() joins path components safely',
    'filepath.Abs() gets absolute path',
    'filepath.Base(), filepath.Dir() get filename and directory',
  ],
}

export default exercise
