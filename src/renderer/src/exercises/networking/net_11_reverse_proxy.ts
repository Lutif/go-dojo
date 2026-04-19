import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_11_reverse_proxy',
  title: 'Reverse Proxy',
  category: 'Networking',
  subcategory: 'Networking',
  difficulty: 'advanced',
  order: 11,
  description: `Build a reverse proxy to forward requests. Reverse proxies intercept requests and forward to backend servers.`,
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
    'httputil.NewSingleHostReverseProxy() creates a reverse proxy',
    'Modify requests/responses in RoundTripper middleware',
    'Enable connection reuse for performance',
  ],
}

export default exercise
