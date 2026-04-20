import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_01_functional_options',
  title: 'Functional Options',
  category: 'Patterns',
  subcategory: 'Creational',
  difficulty: 'intermediate',
  order: 1,
  description: `The functional options pattern is one of Go's most idiomatic ways to handle optional configuration. Instead of huge parameter lists or config structs with many zero values, you define an \`Option\` type as a function that modifies a config:

\`\`\`go
type Option func(*Server)

func WithTimeout(d time.Duration) Option {
    return func(s *Server) {
        s.timeout = d
    }
}

srv := NewServer("localhost:8080", WithTimeout(30*time.Second))
\`\`\`

Your task: implement a functional options pattern for a \`Server\` struct with configurable \`timeout\` (int, in seconds), \`maxRetries\` (int), and \`verbose\` (bool). Provide:

1. A \`Server\` struct with fields: \`addr\` (string), \`timeout\` (int), \`maxRetries\` (int), \`verbose\` (bool)
2. \`WithTimeout(seconds int) Option\`
3. \`WithMaxRetries(n int) Option\`
4. \`WithVerbose(v bool) Option\`
5. \`NewServer(addr string, opts ...Option) *Server\` with defaults: timeout=30, maxRetries=3, verbose=false`,
  code: `package main

// TODO: Define the Option type as a function that modifies *Server

// TODO: Define the Server struct with fields: addr, timeout, maxRetries, verbose

// TODO: Implement WithTimeout(seconds int) Option

// TODO: Implement WithMaxRetries(n int) Option

// TODO: Implement WithVerbose(v bool) Option

// TODO: Implement NewServer(addr string, opts ...Option) *Server
// Defaults: timeout=30, maxRetries=3, verbose=false

func main() {}`,
  testCode: `package main

import "testing"

func TestNewServerDefaults(t *testing.T) {
	s := NewServer("localhost:8080")
	if s.addr != "localhost:8080" {
		t.Errorf("addr = %q, want %q", s.addr, "localhost:8080")
	}
	if s.timeout != 30 {
		t.Errorf("timeout = %d, want 30", s.timeout)
	}
	if s.maxRetries != 3 {
		t.Errorf("maxRetries = %d, want 3", s.maxRetries)
	}
	if s.verbose != false {
		t.Errorf("verbose = %v, want false", s.verbose)
	}
}

func TestWithTimeout(t *testing.T) {
	s := NewServer("localhost:9090", WithTimeout(60))
	if s.timeout != 60 {
		t.Errorf("timeout = %d, want 60", s.timeout)
	}
	if s.maxRetries != 3 {
		t.Errorf("maxRetries = %d, want 3 (default)", s.maxRetries)
	}
}

func TestWithMaxRetries(t *testing.T) {
	s := NewServer("localhost:9090", WithMaxRetries(5))
	if s.maxRetries != 5 {
		t.Errorf("maxRetries = %d, want 5", s.maxRetries)
	}
}

func TestWithVerbose(t *testing.T) {
	s := NewServer("localhost:9090", WithVerbose(true))
	if s.verbose != true {
		t.Errorf("verbose = %v, want true", s.verbose)
	}
}

func TestMultipleOptions(t *testing.T) {
	s := NewServer("0.0.0.0:443",
		WithTimeout(10),
		WithMaxRetries(1),
		WithVerbose(true),
	)
	if s.addr != "0.0.0.0:443" {
		t.Errorf("addr = %q, want %q", s.addr, "0.0.0.0:443")
	}
	if s.timeout != 10 {
		t.Errorf("timeout = %d, want 10", s.timeout)
	}
	if s.maxRetries != 1 {
		t.Errorf("maxRetries = %d, want 1", s.maxRetries)
	}
	if s.verbose != true {
		t.Errorf("verbose = %v, want true", s.verbose)
	}
}`,
  solution: `package main

type Option func(*Server)

type Server struct {
	addr       string
	timeout    int
	maxRetries int
	verbose    bool
}

func WithTimeout(seconds int) Option {
	return func(s *Server) {
		s.timeout = seconds
	}
}

func WithMaxRetries(n int) Option {
	return func(s *Server) {
		s.maxRetries = n
	}
}

func WithVerbose(v bool) Option {
	return func(s *Server) {
		s.verbose = v
	}
}

func NewServer(addr string, opts ...Option) *Server {
	s := &Server{
		addr:       addr,
		timeout:    30,
		maxRetries: 3,
		verbose:    false,
	}
	for _, opt := range opts {
		opt(s)
	}
	return s
}

func main() {}`,
  hints: [
    'Define Option as: type Option func(*Server)',
    'Each With* function returns a closure that sets a field on *Server.',
    'NewServer creates a Server with defaults, then applies each option in order.',
  ],
}

export default exercise
