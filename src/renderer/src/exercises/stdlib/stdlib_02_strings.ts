import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_02_strings',
  title: 'strings Package',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'beginner',
  order: 2,
  description: `Master string manipulation with the strings package. Strings provides functions for searching, replacing, and splitting.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'strings.Split() splits on delimiter; returns slice',
    'strings.Contains() checks if substring exists',
    'strings.ToUpper(), ToLower(), TrimSpace() modify strings',
  ],
}

export default exercise
