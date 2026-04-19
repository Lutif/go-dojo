import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_09_os_write',
  title: 'Writing Files',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 9,
  description: `Write files with the os package. Os file writes are essential for data persistence.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'os.Create() creates/truncates file for writing',
    'file.Write() or file.WriteString() writes content',
    'os.WriteFile() writes entire content in one call',
  ],
}

export default exercise
