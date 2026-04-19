import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_23_crypto_hash',
  title: 'crypto Hashing',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 23,
  description: `Compute cryptographic hashes with crypto package. Hashes are essential for security and integrity checking.`,
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
    'crypto/sha256 provides SHA-256 hashing',
    'hash.Hash interface: Write() accumulates data, Sum() gets hash',
    'Useful for checksums, password hashing (with bcrypt), signatures',
  ],
}

export default exercise
