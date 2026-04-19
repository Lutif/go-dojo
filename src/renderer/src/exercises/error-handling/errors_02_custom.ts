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

import (
	"testing"
)

func TestFindUserValid(t *testing.T) {
	name, err := FindUser(1)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if name != "User1" {
		t.Errorf("FindUser(1) = %q, want %q", name, "User1")
	}
}

func TestFindUserInvalid(t *testing.T) {
	_, err := FindUser(0)
	if err == nil {
		t.Fatal("expected error for ID 0, got nil")
	}
	nfe, ok := err.(*NotFoundError)
	if !ok {
		t.Fatalf("expected *NotFoundError, got %T", err)
	}
	if nfe.Name != "user" || nfe.ID != 0 {
		t.Errorf("NotFoundError = {%q, %d}, want {%q, %d}", nfe.Name, nfe.ID, "user", 0)
	}
}

func TestFindUserNegative(t *testing.T) {
	_, err := FindUser(-5)
	if err == nil {
		t.Fatal("expected error for negative ID, got nil")
	}
	if err.Error() != "user with ID -5 not found" {
		t.Errorf("error message = %q, want %q", err.Error(), "user with ID -5 not found")
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
