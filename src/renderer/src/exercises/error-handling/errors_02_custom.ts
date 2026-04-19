import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_02_custom',
  title: 'Custom Errors',
  category: 'Error Handling',
  subcategory: 'Errors',
  difficulty: 'beginner',
  order: 2,
  description: `Any type implementing \`Error() string\` satisfies the \`error\` interface. Custom error types let you carry structured context:

\`\`\`
type NotFoundError struct {
    Name string
    ID   int
}
func (e *NotFoundError) Error() string {
    return fmt.Sprintf("%s %d not found", e.Name, e.ID)
}
\`\`\`

Callers can use type assertions to inspect error details.

Your task: define custom error types and use them.`,
  code: `package main

import "fmt"

// TODO: Define a NotFoundError with fields Name (string) and ID (int)
// Implement Error() → "Name with id ID not found"

// TODO: Define a PermissionError with fields User (string) and Action (string)
// Implement Error() → "User not allowed to Action"

// FindUser returns User1/User2 for id 1/2, or NotFoundError otherwise
func FindUser(id int) (string, error) {
	// TODO
	return "", nil
}

// CheckPermission returns nil if user is "admin",
// PermissionError otherwise.
func CheckPermission(user, action string) error {
	// TODO
	return nil
}

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestFindUserValid(t *testing.T) {
	user, err := FindUser(1)
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}
	if user != "User1" {
		t.Errorf("got %q, want User1", user)
	}
}

func TestFindUserNotFound(t *testing.T) {
	_, err := FindUser(-1)
	if err == nil {
		t.Fatal("expected error, got nil")
	}
	ne, ok := err.(*NotFoundError)
	if !ok {
		t.Fatalf("expected *NotFoundError, got %T", err)
	}
	if ne.Name != "user" || ne.ID != -1 {
		t.Errorf("error = {%q, %d}, want {user, -1}", ne.Name, ne.ID)
	}
}

func TestFindUserNotFoundMessage(t *testing.T) {
	_, err := FindUser(99)
	if err == nil {
		t.Fatal("expected error")
	}
	want := "user with id 99 not found"
	if got := err.Error(); got != want {
		t.Errorf("Error() = %q, want %q", got, want)
	}
}

func TestCheckPermissionAdmin(t *testing.T) {
	if err := CheckPermission("admin", "delete"); err != nil {
		t.Errorf("admin should be allowed, got %v", err)
	}
}

func TestCheckPermissionDenied(t *testing.T) {
	err := CheckPermission("guest", "delete")
	if err == nil {
		t.Fatal("guest should not be allowed")
	}
	pe, ok := err.(*PermissionError)
	if !ok {
		t.Fatalf("expected *PermissionError, got %T", err)
	}
	if pe.User != "guest" || pe.Action != "delete" {
		t.Errorf("error = {%q, %q}, want {guest, delete}", pe.User, pe.Action)
	}
}`,
  solution: `package main

import "fmt"

type NotFoundError struct {
	Name string
	ID   int
}

func (e *NotFoundError) Error() string {
	return fmt.Sprintf("%s with id %d not found", e.Name, e.ID)
}

type PermissionError struct {
	User   string
	Action string
}

func (e *PermissionError) Error() string {
	return fmt.Sprintf("%s not allowed to %s", e.User, e.Action)
}

func FindUser(id int) (string, error) {
	users := map[int]string{1: "User1", 2: "User2"}
	if user, ok := users[id]; ok {
		return user, nil
	}
	return "", &NotFoundError{Name: "user", ID: id}
}

func CheckPermission(user, action string) error {
	if user == "admin" {
		return nil
	}
	return &PermissionError{User: user, Action: action}
}`,
  hints: [
    'Define a struct, add Error() string method on its pointer: func (e *NotFoundError) Error() string { ... }',
    'Return the error as a pointer: return &NotFoundError{Name: "user", ID: id}',
    'Callers can type-assert: if ne, ok := err.(*NotFoundError); ok { /* use ne.ID */ }'
  ],
}

export default exercise
