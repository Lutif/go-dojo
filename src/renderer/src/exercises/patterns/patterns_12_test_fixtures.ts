import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_12_test_fixtures',
  title: 'Test Fixtures',
  category: 'Patterns',
  subcategory: 'Testing',
  difficulty: 'intermediate',
  order: 12,
  description: `Test fixtures provide reusable setup and teardown logic. In Go, the common patterns are:

**Helper functions with t.Helper():**
\`\`\`go
func newTestUser(t *testing.T) *User {
    t.Helper() // marks this as a helper; errors report caller's line
    return &User{Name: "test", Email: "test@test.com"}
}
\`\`\`

**Setup/teardown with cleanup:**
\`\`\`go
func setupStore(t *testing.T) *Store {
    t.Helper()
    s := NewStore()
    t.Cleanup(func() {
        s.Close()
    })
    return s
}
\`\`\`

Your task: implement a simple \`UserStore\` and write test helpers for it.

1. Define a \`UserStore\` struct with fields: \`users map[int]*User\` and \`closed bool\`
2. Define \`User\` struct with fields: \`ID int\`, \`Name string\`, \`Active bool\`
3. Implement \`NewUserStore() *UserStore\`
4. Implement \`(s *UserStore) Add(u *User) error\` -- returns error if store is closed
5. Implement \`(s *UserStore) Get(id int) (*User, error)\` -- returns error if closed or not found
6. Implement \`(s *UserStore) Close()\` -- sets closed to true
7. Implement \`(s *UserStore) IsClosed() bool\`
8. Implement a helper function \`seedUsers(store *UserStore, n int)\` that adds n users with IDs 1..n, Name "User-1".."User-n", all Active`,
  code: `package main

import "fmt"

// Ensure fmt is used
var _ = fmt.Errorf

// TODO: Define User struct with ID (int), Name (string), Active (bool)

// TODO: Define UserStore struct with users (map[int]*User) and closed (bool)

// TODO: Implement NewUserStore() *UserStore

// TODO: Implement (s *UserStore) Add(u *User) error
// Return fmt.Errorf("store is closed") if closed

// TODO: Implement (s *UserStore) Get(id int) (*User, error)
// Return error if closed or if user not found

// TODO: Implement (s *UserStore) Close() -- sets closed = true

// TODO: Implement (s *UserStore) IsClosed() bool

// TODO: Implement seedUsers(store *UserStore, n int)
// Add n users: ID=1..n, Name="User-1".."User-n", Active=true

func main() {}`,
  testCode: `package main

import (
	"fmt"
	"testing"
)

// Test helper: creates a new UserStore and registers cleanup
func setupStore(t *testing.T) *UserStore {
	t.Helper()
	store := NewUserStore()
	t.Cleanup(func() {
		store.Close()
	})
	return store
}

// Test helper: creates a store with n seeded users
func setupStoreWithUsers(t *testing.T, n int) *UserStore {
	t.Helper()
	store := setupStore(t)
	seedUsers(store, n)
	return store
}

// Test helper: asserts a user exists with expected name
func assertUser(t *testing.T, store *UserStore, id int, expectedName string) {
	t.Helper()
	u, err := store.Get(id)
	if err != nil {
		t.Fatalf("Get(%d) unexpected error: %v", id, err)
	}
	if u.Name != expectedName {
		t.Errorf("user %d Name = %q, want %q", id, u.Name, expectedName)
	}
}

func TestNewUserStore(t *testing.T) {
	store := setupStore(t)
	if store.IsClosed() {
		t.Error("new store should not be closed")
	}
}

func TestAddAndGet(t *testing.T) {
	store := setupStore(t)
	user := &User{ID: 1, Name: "Alice", Active: true}
	if err := store.Add(user); err != nil {
		t.Fatalf("Add() error = %v", err)
	}
	assertUser(t, store, 1, "Alice")
}

func TestGetNotFound(t *testing.T) {
	store := setupStore(t)
	_, err := store.Get(99)
	if err == nil {
		t.Error("Get() on missing user should return error")
	}
}

func TestSeedUsers(t *testing.T) {
	store := setupStoreWithUsers(t, 5)
	for i := 1; i <= 5; i++ {
		expectedName := fmt.Sprintf("User-%d", i)
		assertUser(t, store, i, expectedName)

		u, _ := store.Get(i)
		if !u.Active {
			t.Errorf("user %d should be Active", i)
		}
	}
}

func TestAddToClosedStore(t *testing.T) {
	store := NewUserStore()
	store.Close()

	err := store.Add(&User{ID: 1, Name: "Bob", Active: true})
	if err == nil {
		t.Error("Add() on closed store should return error")
	}
}

func TestGetFromClosedStore(t *testing.T) {
	store := NewUserStore()
	store.Add(&User{ID: 1, Name: "Alice", Active: true})
	store.Close()

	_, err := store.Get(1)
	if err == nil {
		t.Error("Get() on closed store should return error")
	}
}

func TestCleanupCloses(t *testing.T) {
	var store *UserStore
	t.Run("sub", func(t *testing.T) {
		store = setupStore(t)
		store.Add(&User{ID: 1, Name: "Test", Active: true})
	})
	// After subtest completes, cleanup should have run
	if !store.IsClosed() {
		t.Error("store should be closed after cleanup")
	}
}

func TestMultipleUsers(t *testing.T) {
	store := setupStore(t)
	users := []struct {
		id   int
		name string
	}{
		{1, "Alice"},
		{2, "Bob"},
		{3, "Charlie"},
	}

	for _, u := range users {
		store.Add(&User{ID: u.id, Name: u.name, Active: true})
	}

	for _, u := range users {
		assertUser(t, store, u.id, u.name)
	}
}`,
  solution: `package main

import "fmt"

type User struct {
	ID     int
	Name   string
	Active bool
}

type UserStore struct {
	users  map[int]*User
	closed bool
}

func NewUserStore() *UserStore {
	return &UserStore{users: make(map[int]*User)}
}

func (s *UserStore) Add(u *User) error {
	if s.closed {
		return fmt.Errorf("store is closed")
	}
	s.users[u.ID] = u
	return nil
}

func (s *UserStore) Get(id int) (*User, error) {
	if s.closed {
		return nil, fmt.Errorf("store is closed")
	}
	u, ok := s.users[id]
	if !ok {
		return nil, fmt.Errorf("user not found: %d", id)
	}
	return u, nil
}

func (s *UserStore) Close() {
	s.closed = true
}

func (s *UserStore) IsClosed() bool {
	return s.closed
}

func seedUsers(store *UserStore, n int) {
	for i := 1; i <= n; i++ {
		store.Add(&User{
			ID:     i,
			Name:   fmt.Sprintf("User-%d", i),
			Active: true,
		})
	}
}

func main() {}`,
  hints: [
    't.Helper() marks a function as a test helper so failures report the caller line number.',
    't.Cleanup(func()) registers a function to run when the test (or subtest) finishes.',
    'seedUsers should loop from 1 to n, creating users with fmt.Sprintf("User-%d", i).',
    'Check the closed field at the start of Add and Get to return an error if the store is closed.',
  ],
}

export default exercise
