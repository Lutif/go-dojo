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

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'os.Open(filename) opens file for reading',
    'file.Read() or ioutil.ReadFile() reads content',
    'Defer file.Close() to ensure file is closed',
  ],
}

export default exercise
