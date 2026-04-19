import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_08_os_read',
  title: 'Reading Files',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 8,
  description: `Read files with the os package. Os provides file handling operations.`,
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
    'os.Open(filename) opens file for reading',
    'file.Read() or ioutil.ReadFile() reads content',
    'Defer file.Close() to ensure file is closed',
  ],
}

export default exercise
