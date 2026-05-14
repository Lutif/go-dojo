import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-kv-02',
  title: 'KV Store — Command Protocol',
  category: 'Projects',
  subcategory: 'Key-Value Store',
  difficulty: 'intermediate',
  order: 124,
  description: `Add a text protocol parser so the store can be driven by string commands.

Implement an Execute function:
- Execute(store *Store, command string) string

Supported commands (case-sensitive):
- "SET key value" → sets the key, returns "OK"
- "GET key" → returns the value, or "ERROR: key not found"
- "DEL key" → deletes the key, returns "OK" if deleted, "ERROR: key not found" if missing
- "LEN" → returns the count as a string (e.g. "3")
- Unknown commands → "ERROR: unknown command"

Commands have exactly the right number of space-separated tokens. Extra or missing tokens return "ERROR: wrong number of arguments".`,
  code: `package main

// Store from Step 1 (provided)

type Store struct {
	data map[string]string
}

func NewStore() *Store {
	return &Store{data: make(map[string]string)}
}

func (s *Store) Set(key, value string) {
	s.data[key] = value
}

func (s *Store) Get(key string) (string, bool) {
	val, ok := s.data[key]
	return val, ok
}

func (s *Store) Delete(key string) bool {
	if _, ok := s.data[key]; !ok {
		return false
	}
	delete(s.data, key)
	return true
}

func (s *Store) Len() int {
	return len(s.data)
}

// TODO: Implement Execute(store *Store, command string) string
//   Parse the command string and dispatch to the appropriate Store method.

func main() {}
`,
  testCode: `package main

import "testing"

func TestExecuteSet(t *testing.T) {
	s := NewStore()
	result := Execute(s, "SET name Go")
	if result != "OK" {
		t.Fatalf("SET should return OK, got %q", result)
	}
	val, ok := s.Get("name")
	if !ok || val != "Go" {
		t.Fatalf("after SET, Get should return Go, got (%s, %v)", val, ok)
	}
}

func TestExecuteGet(t *testing.T) {
	s := NewStore()
	s.Set("lang", "Go")
	result := Execute(s, "GET lang")
	if result != "Go" {
		t.Fatalf("GET should return Go, got %q", result)
	}
}

func TestExecuteGetMissing(t *testing.T) {
	s := NewStore()
	result := Execute(s, "GET nope")
	if result != "ERROR: key not found" {
		t.Fatalf("GET missing key should return error, got %q", result)
	}
}

func TestExecuteDel(t *testing.T) {
	s := NewStore()
	s.Set("x", "1")
	result := Execute(s, "DEL x")
	if result != "OK" {
		t.Fatalf("DEL existing should return OK, got %q", result)
	}
	result = Execute(s, "DEL x")
	if result != "ERROR: key not found" {
		t.Fatalf("DEL missing should return error, got %q", result)
	}
}

func TestExecuteLen(t *testing.T) {
	s := NewStore()
	s.Set("a", "1")
	s.Set("b", "2")
	result := Execute(s, "LEN")
	if result != "2" {
		t.Fatalf("LEN should return 2, got %q", result)
	}
}

func TestExecuteUnknown(t *testing.T) {
	s := NewStore()
	result := Execute(s, "PING")
	if result != "ERROR: unknown command" {
		t.Fatalf("unknown command should return error, got %q", result)
	}
}

func TestExecuteWrongArgs(t *testing.T) {
	s := NewStore()
	tests := []string{
		"SET key",
		"SET",
		"GET",
		"DEL",
		"SET a b c",
		"GET a b",
		"DEL a b",
		"LEN extra",
	}
	for _, cmd := range tests {
		result := Execute(s, cmd)
		if result != "ERROR: wrong number of arguments" {
			t.Fatalf("command %q should return wrong args error, got %q", cmd, result)
		}
	}
}

func TestExecuteOverwrite(t *testing.T) {
	s := NewStore()
	Execute(s, "SET k v1")
	Execute(s, "SET k v2")
	result := Execute(s, "GET k")
	if result != "v2" {
		t.Fatalf("SET should overwrite, expected v2, got %q", result)
	}
}
`,
  solution: `package main

import (
	"fmt"
	"strings"
)

type Store struct {
	data map[string]string
}

func NewStore() *Store {
	return &Store{data: make(map[string]string)}
}

func (s *Store) Set(key, value string) {
	s.data[key] = value
}

func (s *Store) Get(key string) (string, bool) {
	val, ok := s.data[key]
	return val, ok
}

func (s *Store) Delete(key string) bool {
	if _, ok := s.data[key]; !ok {
		return false
	}
	delete(s.data, key)
	return true
}

func (s *Store) Len() int {
	return len(s.data)
}

func Execute(store *Store, command string) string {
	parts := strings.Fields(command)
	if len(parts) == 0 {
		return "ERROR: unknown command"
	}

	switch parts[0] {
	case "SET":
		if len(parts) != 3 {
			return "ERROR: wrong number of arguments"
		}
		store.Set(parts[1], parts[2])
		return "OK"
	case "GET":
		if len(parts) != 2 {
			return "ERROR: wrong number of arguments"
		}
		val, ok := store.Get(parts[1])
		if !ok {
			return "ERROR: key not found"
		}
		return val
	case "DEL":
		if len(parts) != 2 {
			return "ERROR: wrong number of arguments"
		}
		if !store.Delete(parts[1]) {
			return "ERROR: key not found"
		}
		return "OK"
	case "LEN":
		if len(parts) != 1 {
			return "ERROR: wrong number of arguments"
		}
		return fmt.Sprintf("%d", store.Len())
	default:
		return "ERROR: unknown command"
	}
}

func main() {}
`,
  hints: [
    'Use strings.Fields(command) to split on whitespace.',
    'Switch on parts[0] to dispatch to the right operation.',
    'Check len(parts) for each command to validate argument count before proceeding.',
    'Use fmt.Sprintf("%d", n) to convert Len() result to string.',
  ],
  projectId: 'proj-kv',
  step: 2,
  totalSteps: 8,
}

export default exercise
