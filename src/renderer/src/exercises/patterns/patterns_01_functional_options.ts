import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_01_functional_options',
  title: 'Functional Options',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 1,
  description: `Master functional options pattern for flexible construction. Functional options enable building objects with many optional fields.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestNewServerDefaults(t *testing.T) {
	s := NewServer("localhost")
	if s.Host != "localhost" {
		t.Errorf("Host = %q, want %q", s.Host, "localhost")
	}
	if s.Port != 8080 {
		t.Errorf("Port = %d, want 8080", s.Port)
	}
	if s.MaxConns != 100 {
		t.Errorf("MaxConns = %d, want 100", s.MaxConns)
	}
	if s.TLS != false {
		t.Errorf("TLS = %v, want false", s.TLS)
	}
}

func TestNewServerWithOptions(t *testing.T) {
	s := NewServer("example.com", WithPort(9090), WithMaxConns(50), WithTLS(true))
	if s.Port != 9090 {
		t.Errorf("Port = %d, want 9090", s.Port)
	}
	if s.MaxConns != 50 {
		t.Errorf("MaxConns = %d, want 50", s.MaxConns)
	}
	if s.TLS != true {
		t.Errorf("TLS = %v, want true", s.TLS)
	}
}

func TestNewServerPartialOptions(t *testing.T) {
	s := NewServer("partial.com", WithPort(3000))
	if s.Port != 3000 {
		t.Errorf("Port = %d, want 3000", s.Port)
	}
	if s.MaxConns != 100 {
		t.Errorf("MaxConns = %d, want 100 (default)", s.MaxConns)
	}
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Define Option type as a function: type Option func(*Config)',
    'Implement constructors as functions returning Option values',
    'Pass options to build function: Build(opts...Option)',
  ],
}

export default exercise
