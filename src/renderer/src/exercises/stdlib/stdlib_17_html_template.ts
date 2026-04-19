import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_17_html_template',
  title: 'html/template',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 17,
  description: `Generate HTML with html/template package. HTML templates safely generate HTML without injection vulnerabilities.`,
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
    'template.Parse() or ParseFiles() loads template',
    'Execute(w, data) renders template with data',
    'Auto-escapes HTML to prevent injection',
  ],
}

export default exercise
