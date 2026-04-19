import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_14_http_client',
  title: 'HTTP Client',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 14,
  description: `Make HTTP requests with http.Client. HTTP clients enable communication with web services.`,
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
    'http.Get(url) makes GET request; http.Post() for POST',
    'Response.Body should be closed to release connection',
    'Use Client for configuration (timeout, headers, redirects)',
  ],
}

export default exercise
