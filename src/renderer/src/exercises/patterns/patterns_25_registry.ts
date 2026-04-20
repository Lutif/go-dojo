import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_25_registry',
  title: 'Plugin Registry',
  category: 'Patterns',
  subcategory: 'Design Patterns',
  difficulty: 'advanced',
  order: 25,
  description: `Implement a plugin registry that allows registering and retrieving handlers by name using the factory pattern.

The Registry pattern provides a central place to register and look up implementations by name, enabling a plugin-like architecture without compile-time dependencies.

Your tasks:

1. Define a \`Handler\` interface with:
   - \`Name() string\` - returns the handler name
   - \`Handle(data string) string\` - processes data and returns result

2. Define \`ErrNotFound\` error: "handler not found"
   Define \`ErrAlreadyRegistered\` error: "handler already registered"

3. Define a \`Registry\` struct that maps names to factory functions:
   - \`factories\` (map[string]func() Handler) - stores factory functions by name

4. Implement \`NewRegistry() *Registry\`.

5. Implement \`(r *Registry) Register(name string, factory func() Handler) error\`:
   - If name is already registered, return ErrAlreadyRegistered
   - Otherwise store the factory and return nil

6. Implement \`(r *Registry) Get(name string) (Handler, error)\`:
   - If name is not registered, return nil and ErrNotFound
   - Otherwise call the factory to create a new Handler and return it

7. Implement \`(r *Registry) List() []string\`:
   - Returns sorted list of all registered handler names

8. Implement \`(r *Registry) Has(name string) bool\`:
   - Returns true if a handler with that name is registered

For testing, create two handler implementations:

  UpperHandler - Handle returns strings.ToUpper(data), Name returns "upper"
  EchoHandler  - Handle returns "echo: " + data, Name returns "echo"`,
  code: `package main

import (
	"errors"
	"sort"
	"strings"
)

// TODO: Define Handler interface with Name() string and Handle(data string) string

// TODO: Define ErrNotFound and ErrAlreadyRegistered errors

// TODO: Define Registry struct with factories map[string]func() Handler

// TODO: Implement NewRegistry() *Registry

// TODO: Implement (r *Registry) Register(name string, factory func() Handler) error

// TODO: Implement (r *Registry) Get(name string) (Handler, error)
// Call the factory to create a new instance each time

// TODO: Implement (r *Registry) List() []string
// Return sorted list of registered names

// TODO: Implement (r *Registry) Has(name string) bool

// TODO: Define UpperHandler struct
// Name() returns "upper", Handle() returns strings.ToUpper(data)

// TODO: Define EchoHandler struct
// Name() returns "echo", Handle() returns "echo: " + data

var _ = errors.New
var _ = sort.Strings
var _ = strings.ToUpper

func main() {}`,
  testCode: `package main

import (
	"testing"
)

func TestRegisterAndGet(t *testing.T) {
	r := NewRegistry()
	err := r.Register("upper", func() Handler { return &UpperHandler{} })
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}

	h, err := r.Get("upper")
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
	if h.Name() != "upper" {
		t.Errorf("expected name upper, got %s", h.Name())
	}

	result := h.Handle("hello")
	if result != "HELLO" {
		t.Errorf("expected HELLO, got %s", result)
	}
}

func TestGetNotFound(t *testing.T) {
	r := NewRegistry()

	_, err := r.Get("missing")
	if err != ErrNotFound {
		t.Errorf("expected ErrNotFound, got %v", err)
	}
}

func TestRegisterDuplicate(t *testing.T) {
	r := NewRegistry()
	r.Register("echo", func() Handler { return &EchoHandler{} })

	err := r.Register("echo", func() Handler { return &EchoHandler{} })
	if err != ErrAlreadyRegistered {
		t.Errorf("expected ErrAlreadyRegistered, got %v", err)
	}
}

func TestEchoHandler(t *testing.T) {
	r := NewRegistry()
	r.Register("echo", func() Handler { return &EchoHandler{} })

	h, _ := r.Get("echo")
	result := h.Handle("world")
	if result != "echo: world" {
		t.Errorf("expected 'echo: world', got %q", result)
	}
}

func TestGetCreatesNewInstances(t *testing.T) {
	r := NewRegistry()
	r.Register("upper", func() Handler { return &UpperHandler{} })

	h1, _ := r.Get("upper")
	h2, _ := r.Get("upper")

	// They should be different instances
	r1 := h1.Handle("a")
	r2 := h2.Handle("b")
	if r1 != "A" || r2 != "B" {
		t.Errorf("expected independent handlers, got %q and %q", r1, r2)
	}
}

func TestList(t *testing.T) {
	r := NewRegistry()
	r.Register("echo", func() Handler { return &EchoHandler{} })
	r.Register("upper", func() Handler { return &UpperHandler{} })

	names := r.List()
	if len(names) != 2 {
		t.Fatalf("expected 2 names, got %d", len(names))
	}
	if names[0] != "echo" || names[1] != "upper" {
		t.Errorf("expected [echo upper], got %v", names)
	}
}

func TestListEmpty(t *testing.T) {
	r := NewRegistry()
	names := r.List()
	if len(names) != 0 {
		t.Errorf("expected empty list, got %v", names)
	}
}

func TestHas(t *testing.T) {
	r := NewRegistry()
	r.Register("echo", func() Handler { return &EchoHandler{} })

	if !r.Has("echo") {
		t.Error("expected Has(echo) to be true")
	}
	if r.Has("missing") {
		t.Error("expected Has(missing) to be false")
	}
}

func TestMultipleHandlers(t *testing.T) {
	r := NewRegistry()
	r.Register("upper", func() Handler { return &UpperHandler{} })
	r.Register("echo", func() Handler { return &EchoHandler{} })

	h1, _ := r.Get("upper")
	h2, _ := r.Get("echo")

	if h1.Handle("test") != "TEST" {
		t.Errorf("upper handler failed")
	}
	if h2.Handle("test") != "echo: test" {
		t.Errorf("echo handler failed")
	}
}`,
  solution: `package main

import (
	"errors"
	"sort"
	"strings"
)

type Handler interface {
	Name() string
	Handle(data string) string
}

var ErrNotFound = errors.New("handler not found")
var ErrAlreadyRegistered = errors.New("handler already registered")

type Registry struct {
	factories map[string]func() Handler
}

func NewRegistry() *Registry {
	return &Registry{
		factories: make(map[string]func() Handler),
	}
}

func (r *Registry) Register(name string, factory func() Handler) error {
	if _, exists := r.factories[name]; exists {
		return ErrAlreadyRegistered
	}
	r.factories[name] = factory
	return nil
}

func (r *Registry) Get(name string) (Handler, error) {
	factory, exists := r.factories[name]
	if !exists {
		return nil, ErrNotFound
	}
	return factory(), nil
}

func (r *Registry) List() []string {
	names := make([]string, 0, len(r.factories))
	for name := range r.factories {
		names = append(names, name)
	}
	sort.Strings(names)
	return names
}

func (r *Registry) Has(name string) bool {
	_, exists := r.factories[name]
	return exists
}

type UpperHandler struct{}

func (h *UpperHandler) Name() string            { return "upper" }
func (h *UpperHandler) Handle(data string) string { return strings.ToUpper(data) }

type EchoHandler struct{}

func (h *EchoHandler) Name() string            { return "echo" }
func (h *EchoHandler) Handle(data string) string { return "echo: " + data }

func main() {}`,
  hints: [
    'The Registry stores factory functions (func() Handler), not Handler instances. Each Get() call creates a fresh instance.',
    'Use a map[string]func() Handler for factories. Check for existing keys in Register to prevent duplicates.',
    'For List(), extract keys from the map into a slice and use sort.Strings() to sort alphabetically.',
    'UpperHandler uses strings.ToUpper(data). EchoHandler concatenates "echo: " + data.',
  ],
}

export default exercise
