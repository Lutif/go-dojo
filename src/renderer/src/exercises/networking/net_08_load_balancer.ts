import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_08_load_balancer',
  title: 'Load Balancer',
  category: 'Networking',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 8,
  description: `Implement a round-robin load balancer that distributes requests across multiple backend servers. Round-robin cycles through backends in order, sending each successive request to the next backend in the list.

Key concepts:
- Backends are identified by their address (e.g., "http://localhost:8081")
- \`AddBackend(addr)\` registers a new backend
- \`RemoveBackend(addr)\` removes a backend
- \`NextBackend()\` returns the next backend address in round-robin order
- Thread safety is required for concurrent access

Example usage:

    lb := NewLoadBalancer()
    lb.AddBackend("http://server1:8080")
    lb.AddBackend("http://server2:8080")
    lb.AddBackend("http://server3:8080")

    lb.NextBackend() // "http://server1:8080"
    lb.NextBackend() // "http://server2:8080"
    lb.NextBackend() // "http://server3:8080"
    lb.NextBackend() // "http://server1:8080" (wraps around)

Your task:
1. Implement \`NewLoadBalancer() *LoadBalancer\`
2. Implement \`(*LoadBalancer) AddBackend(addr string)\` -- adds a backend (no duplicates)
3. Implement \`(*LoadBalancer) RemoveBackend(addr string)\` -- removes a backend by address
4. Implement \`(*LoadBalancer) NextBackend() (string, error)\` -- returns the next backend in round-robin order
5. Implement \`(*LoadBalancer) Backends() []string\` -- returns a copy of the current backend list`,
  code: `package main

import (
	"sync"
)

// LoadBalancer distributes requests across backends using round-robin.
type LoadBalancer struct {
	mu sync.Mutex
	// TODO: Add fields for backends list and current index
}

// NewLoadBalancer creates a new round-robin load balancer.
// TODO: Implement this function
func NewLoadBalancer() *LoadBalancer {
	return nil
}

// AddBackend adds a backend address to the pool. Duplicates are ignored.
// TODO: Implement this function
func (lb *LoadBalancer) AddBackend(addr string) {
}

// RemoveBackend removes a backend address from the pool.
// TODO: Implement this function
func (lb *LoadBalancer) RemoveBackend(addr string) {
}

// NextBackend returns the next backend address in round-robin order.
// Returns an error if no backends are available.
// TODO: Implement this function
func (lb *LoadBalancer) NextBackend() (string, error) {
	return "", nil
}

// Backends returns a copy of the current backend list.
// TODO: Implement this function
func (lb *LoadBalancer) Backends() []string {
	return nil
}

func main() {}`,
  testCode: `package main

import (
	"testing"
)

func TestNewLoadBalancer(t *testing.T) {
	lb := NewLoadBalancer()
	if lb == nil {
		t.Fatal("NewLoadBalancer returned nil")
	}
	backends := lb.Backends()
	if len(backends) != 0 {
		t.Errorf("new balancer has %d backends, want 0", len(backends))
	}
}

func TestAddBackend(t *testing.T) {
	lb := NewLoadBalancer()
	lb.AddBackend("http://server1:8080")
	lb.AddBackend("http://server2:8080")

	backends := lb.Backends()
	if len(backends) != 2 {
		t.Fatalf("backends count = %d, want 2", len(backends))
	}
}

func TestAddDuplicate(t *testing.T) {
	lb := NewLoadBalancer()
	lb.AddBackend("http://server1:8080")
	lb.AddBackend("http://server1:8080")

	backends := lb.Backends()
	if len(backends) != 1 {
		t.Errorf("backends count = %d, want 1 (duplicates should be ignored)", len(backends))
	}
}

func TestRoundRobin(t *testing.T) {
	lb := NewLoadBalancer()
	lb.AddBackend("http://a:80")
	lb.AddBackend("http://b:80")
	lb.AddBackend("http://c:80")

	expected := []string{"http://a:80", "http://b:80", "http://c:80", "http://a:80", "http://b:80"}
	for i, want := range expected {
		got, err := lb.NextBackend()
		if err != nil {
			t.Fatalf("call %d: NextBackend error: %v", i, err)
		}
		if got != want {
			t.Errorf("call %d: got %q, want %q", i, got, want)
		}
	}
}

func TestNextBackendNoBackends(t *testing.T) {
	lb := NewLoadBalancer()
	_, err := lb.NextBackend()
	if err == nil {
		t.Error("expected error when no backends, got nil")
	}
}

func TestRemoveBackend(t *testing.T) {
	lb := NewLoadBalancer()
	lb.AddBackend("http://a:80")
	lb.AddBackend("http://b:80")
	lb.AddBackend("http://c:80")

	lb.RemoveBackend("http://b:80")

	backends := lb.Backends()
	if len(backends) != 2 {
		t.Fatalf("after remove, backends = %d, want 2", len(backends))
	}

	for _, b := range backends {
		if b == "http://b:80" {
			t.Error("removed backend still present")
		}
	}
}

func TestRoundRobinAfterRemove(t *testing.T) {
	lb := NewLoadBalancer()
	lb.AddBackend("http://a:80")
	lb.AddBackend("http://b:80")

	lb.RemoveBackend("http://a:80")

	got, err := lb.NextBackend()
	if err != nil {
		t.Fatalf("NextBackend error: %v", err)
	}
	if got != "http://b:80" {
		t.Errorf("got %q, want %q", got, "http://b:80")
	}
}

func TestConcurrentAccess(t *testing.T) {
	lb := NewLoadBalancer()
	lb.AddBackend("http://a:80")
	lb.AddBackend("http://b:80")
	lb.AddBackend("http://c:80")

	done := make(chan bool, 30)
	for i := 0; i < 30; i++ {
		go func() {
			_, err := lb.NextBackend()
			done <- (err == nil)
		}()
	}

	for i := 0; i < 30; i++ {
		if !<-done {
			t.Error("concurrent NextBackend returned error")
		}
	}
}`,
  solution: `package main

import (
	"errors"
	"sync"
)

// LoadBalancer distributes requests across backends using round-robin.
type LoadBalancer struct {
	mu       sync.Mutex
	backends []string
	current  int
}

// NewLoadBalancer creates a new round-robin load balancer.
func NewLoadBalancer() *LoadBalancer {
	return &LoadBalancer{
		backends: make([]string, 0),
	}
}

// AddBackend adds a backend address to the pool. Duplicates are ignored.
func (lb *LoadBalancer) AddBackend(addr string) {
	lb.mu.Lock()
	defer lb.mu.Unlock()

	for _, b := range lb.backends {
		if b == addr {
			return
		}
	}
	lb.backends = append(lb.backends, addr)
}

// RemoveBackend removes a backend address from the pool.
func (lb *LoadBalancer) RemoveBackend(addr string) {
	lb.mu.Lock()
	defer lb.mu.Unlock()

	for i, b := range lb.backends {
		if b == addr {
			lb.backends = append(lb.backends[:i], lb.backends[i+1:]...)
			if lb.current >= len(lb.backends) {
				lb.current = 0
			}
			return
		}
	}
}

// NextBackend returns the next backend address in round-robin order.
func (lb *LoadBalancer) NextBackend() (string, error) {
	lb.mu.Lock()
	defer lb.mu.Unlock()

	if len(lb.backends) == 0 {
		return "", errors.New("no backends available")
	}

	if lb.current >= len(lb.backends) {
		lb.current = 0
	}

	backend := lb.backends[lb.current]
	lb.current = (lb.current + 1) % len(lb.backends)
	return backend, nil
}

// Backends returns a copy of the current backend list.
func (lb *LoadBalancer) Backends() []string {
	lb.mu.Lock()
	defer lb.mu.Unlock()

	result := make([]string, len(lb.backends))
	copy(result, lb.backends)
	return result
}

func main() {}`,
  hints: [
    'Store backends in a string slice and keep a current index that increments with each call to NextBackend.',
    'Use the modulo operator (%) to wrap around: lb.current = (lb.current + 1) % len(lb.backends).',
    'When removing a backend, reset the current index if it is now out of bounds.',
    'In AddBackend, loop through existing backends to check for duplicates before adding.',
  ],
}

export default exercise
