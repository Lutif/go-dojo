import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_02_custom',
  title: 'Custom Errors',
  category: 'Error Handling',
  subcategory: 'Error Handling',
  difficulty: 'beginner',
  order: 2,
  description: `Create custom error types implementing the error interface. Custom errors allow structured error information and specialized handling.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestCustomError(t *testing.T) {
	err := FindUser(-1)
	if err == nil {
		t.Fatal("expected error, got nil")
	}
	
	ne, ok := err.(*NotFoundError)
	if !ok {
		t.Fatalf("expected *NotFoundError, got %T", err)
	}
	
	if ne.Name != "user" || ne.ID != -1 {
		t.Errorf("error values mismatch")
	}
}

func TestFindValidUser(t *testing.T) {
	user, err := FindUser(1)
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}
	if user != "User1" {
		t.Errorf("got %q, want User1", user)
	}
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Implement the error interface by having an Error() string method',
    'Use custom types to encode additional error context or error codes',
    'Custom errors enable type-based error handling with type assertions',
  ],
}

export default exercise
