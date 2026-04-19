import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_10_tls_config',
  title: 'TLS Configuration',
  category: 'Networking',
  subcategory: 'Networking',
  difficulty: 'advanced',
  order: 10,
  description: `Configure TLS/SSL for encrypted communication. TLS encrypts communication and verifies server identity.`,
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
    'tls.Config defines certificates and cipher suites',
    'LoadX509KeyPair() loads certificate and private key files',
    'http.ListenAndServeTLS() serves with TLS enabled',
  ],
}

export default exercise
