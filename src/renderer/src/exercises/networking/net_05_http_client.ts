import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_05_http_client',
  title: 'HTTP Client',
  category: 'Networking',
  subcategory: 'Networking',
  difficulty: 'intermediate',
  order: 5,
  description: `Use http.Client to make requests to other services. HTTP clients enable communication with external APIs.`,
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
    'http.Get(url) makes GET request; returns Response',
    'Defer response.Body.Close() to release connection',
    'http.Client allows customization (timeout, redirects, headers)',
  ],
}

export default exercise
