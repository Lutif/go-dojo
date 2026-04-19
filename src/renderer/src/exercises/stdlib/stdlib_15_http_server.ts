import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_15_http_server',
  title: 'HTTP Server Handler',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 15,
  description: `Create HTTP servers with http package. HTTP servers respond to web requests.`,
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
    'http.HandleFunc(path, handler) registers endpoint',
    'Handler receives ResponseWriter and *Request',
    'http.ListenAndServe() starts server on port',
  ],
}

export default exercise
