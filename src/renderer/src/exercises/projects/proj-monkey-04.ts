import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-04',
  title: 'Lexer — Keywords',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 104,
  description: `Parse if-else expressions. If expressions are expressions that choose branches based on conditions.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Parse if ( condition ) { consequence } else { alternative }',
    'Branches are block statements',
    'If-else can appear in expression context',
  ],
}

export default exercise
