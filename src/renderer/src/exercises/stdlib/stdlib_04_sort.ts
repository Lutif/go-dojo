import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_04_sort',
  title: 'sort Package',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'beginner',
  order: 4,
  description: `Sort and search data with the sort package. Sort provides sorting algorithms and interfaces for custom types.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'sort.Ints(), sort.Strings(), sort.Float64s() sort built-in types',
    'sort.Sort(Interface) sorts custom types implementing Interface',
    'sort.Search() finds element using binary search',
  ],
}

export default exercise
