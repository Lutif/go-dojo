import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_18_text_template',
  title: 'text/template',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 18,
  description: `Use text/template for generic text generation. Text templates enable flexible text output.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'template.New().Parse() or ParseFiles() loads template',
    'Execute(w, data) renders template with data',
    'No auto-escaping; use for non-HTML output',
  ],
}

export default exercise
