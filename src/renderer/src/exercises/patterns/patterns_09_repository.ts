import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_09_repository',
  title: 'Repository Pattern',
  category: 'Patterns',
  subcategory: 'Structural',
  difficulty: 'intermediate',
  order: 9,
  description: `The repository pattern abstracts data access behind an interface, letting you swap storage backends without changing business logic:

\`\`\`go
type BookRepository interface {
    FindByID(id int) (*Book, error)
    Save(book *Book) error
}
\`\`\`

This is especially useful in Go because interfaces are satisfied implicitly -- any struct with matching methods is a valid implementation.

Your task: implement a user repository with an in-memory backend.

1. Define a \`User\` struct with fields: \`ID int\`, \`Name string\`, \`Email string\`
2. Define a \`UserRepository\` interface with:
   - \`Find(id int) (*User, error)\` -- returns error if not found
   - \`Save(user *User) error\` -- inserts or updates by ID
   - \`Delete(id int) error\` -- returns error if not found
   - \`FindAll() ([]*User, error)\`
3. Implement \`InMemoryUserRepository\` struct with a \`map[int]*User\` field
4. Implement \`NewInMemoryUserRepository() *InMemoryUserRepository\`
5. For Find/Delete on missing IDs, return \`fmt.Errorf("user not found: %d", id)\``,
  code: `package main

import "fmt"

// Ensure fmt is used
var _ = fmt.Errorf

// TODO: Define User struct with ID (int), Name (string), Email (string)

// TODO: Define UserRepository interface with:
//   Find(id int) (*User, error)
//   Save(user *User) error
//   Delete(id int) error
//   FindAll() ([]*User, error)

// TODO: Define InMemoryUserRepository struct with a users map[int]*User field

// TODO: Implement NewInMemoryUserRepository() *InMemoryUserRepository
// Initialize the map

// TODO: Implement Find -- return error "user not found: <id>" if missing

// TODO: Implement Save -- store user by ID

// TODO: Implement Delete -- return error "user not found: <id>" if missing

// TODO: Implement FindAll -- return all users as a slice

func main() {}`,
  testCode: `package main

import (
	"strings"
	"testing"
)

// Verify InMemoryUserRepository satisfies UserRepository interface
var _ UserRepository = (*InMemoryUserRepository)(nil)

func TestSaveAndFind(t *testing.T) {
	repo := NewInMemoryUserRepository()
	user := &User{ID: 1, Name: "Alice", Email: "alice@example.com"}

	if err := repo.Save(user); err != nil {
		t.Fatalf("Save() error = %v", err)
	}

	found, err := repo.Find(1)
	if err != nil {
		t.Fatalf("Find() error = %v", err)
	}
	if found.Name != "Alice" {
		t.Errorf("Name = %q, want %q", found.Name, "Alice")
	}
	if found.Email != "alice@example.com" {
		t.Errorf("Email = %q, want %q", found.Email, "alice@example.com")
	}
}

func TestFindNotFound(t *testing.T) {
	repo := NewInMemoryUserRepository()
	_, err := repo.Find(99)
	if err == nil {
		t.Fatal("Find() expected error for missing user, got nil")
	}
	if !strings.Contains(err.Error(), "user not found") {
		t.Errorf("error = %q, want it to contain %q", err.Error(), "user not found")
	}
}

func TestSaveUpdate(t *testing.T) {
	repo := NewInMemoryUserRepository()
	user := &User{ID: 1, Name: "Alice", Email: "alice@example.com"}
	repo.Save(user)

	updated := &User{ID: 1, Name: "Alice Smith", Email: "alice.smith@example.com"}
	repo.Save(updated)

	found, err := repo.Find(1)
	if err != nil {
		t.Fatalf("Find() error = %v", err)
	}
	if found.Name != "Alice Smith" {
		t.Errorf("Name = %q, want %q", found.Name, "Alice Smith")
	}
	if found.Email != "alice.smith@example.com" {
		t.Errorf("Email = %q, want %q", found.Email, "alice.smith@example.com")
	}
}

func TestDelete(t *testing.T) {
	repo := NewInMemoryUserRepository()
	repo.Save(&User{ID: 1, Name: "Alice", Email: "a@b.com"})

	if err := repo.Delete(1); err != nil {
		t.Fatalf("Delete() error = %v", err)
	}

	_, err := repo.Find(1)
	if err == nil {
		t.Error("Find() after Delete should return error")
	}
}

func TestDeleteNotFound(t *testing.T) {
	repo := NewInMemoryUserRepository()
	err := repo.Delete(42)
	if err == nil {
		t.Fatal("Delete() expected error for missing user, got nil")
	}
	if !strings.Contains(err.Error(), "user not found") {
		t.Errorf("error = %q, want it to contain %q", err.Error(), "user not found")
	}
}

func TestFindAll(t *testing.T) {
	repo := NewInMemoryUserRepository()
	repo.Save(&User{ID: 1, Name: "Alice", Email: "a@b.com"})
	repo.Save(&User{ID: 2, Name: "Bob", Email: "b@b.com"})
	repo.Save(&User{ID: 3, Name: "Charlie", Email: "c@b.com"})

	users, err := repo.FindAll()
	if err != nil {
		t.Fatalf("FindAll() error = %v", err)
	}
	if len(users) != 3 {
		t.Errorf("FindAll() returned %d users, want 3", len(users))
	}
}

func TestFindAllEmpty(t *testing.T) {
	repo := NewInMemoryUserRepository()
	users, err := repo.FindAll()
	if err != nil {
		t.Fatalf("FindAll() error = %v", err)
	}
	if len(users) != 0 {
		t.Errorf("FindAll() returned %d users, want 0", len(users))
	}
}`,
  solution: `package main

import "fmt"

type User struct {
	ID    int
	Name  string
	Email string
}

type UserRepository interface {
	Find(id int) (*User, error)
	Save(user *User) error
	Delete(id int) error
	FindAll() ([]*User, error)
}

type InMemoryUserRepository struct {
	users map[int]*User
}

func NewInMemoryUserRepository() *InMemoryUserRepository {
	return &InMemoryUserRepository{users: make(map[int]*User)}
}

func (r *InMemoryUserRepository) Find(id int) (*User, error) {
	u, ok := r.users[id]
	if !ok {
		return nil, fmt.Errorf("user not found: %d", id)
	}
	return u, nil
}

func (r *InMemoryUserRepository) Save(user *User) error {
	r.users[user.ID] = user
	return nil
}

func (r *InMemoryUserRepository) Delete(id int) error {
	if _, ok := r.users[id]; !ok {
		return fmt.Errorf("user not found: %d", id)
	}
	delete(r.users, id)
	return nil
}

func (r *InMemoryUserRepository) FindAll() ([]*User, error) {
	result := make([]*User, 0, len(r.users))
	for _, u := range r.users {
		result = append(result, u)
	}
	return result, nil
}

func main() {}`,
  hints: [
    'Define UserRepository as an interface with Find, Save, Delete, and FindAll methods.',
    'InMemoryUserRepository stores users in a map[int]*User. Initialize it in NewInMemoryUserRepository.',
    'For Find and Delete, check if the key exists in the map with the comma-ok idiom: u, ok := r.users[id].',
    'FindAll iterates the map and appends each value to a slice.',
  ],
}

export default exercise
