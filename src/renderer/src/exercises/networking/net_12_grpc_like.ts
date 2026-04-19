import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_12_grpc_like',
  title: 'RPC Protocol',
  category: 'Networking',
  subcategory: 'Networking',
  difficulty: 'expert',
  order: 12,
  description: `Implement a protocol similar to gRPC for efficient RPC. Structured protocols enable type-safe remote calls.`,
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
    'Define message formats with clear serialization (protobuf-like)',
    'Implement server that reads messages and dispatches to methods',
    'Implement client that sends messages and reads responses',
  ],
}

export default exercise
