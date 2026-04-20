import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_16_circuit_breaker',
  title: 'Circuit Breaker',
  category: 'Patterns',
  subcategory: 'Resilience Patterns',
  difficulty: 'advanced',
  order: 16,
  description: `Implement a circuit breaker to prevent cascading failures in distributed systems.

A circuit breaker monitors calls to an external service and stops making calls when failures exceed a threshold, giving the service time to recover.

The circuit breaker has three states:

  StateClosed   = "closed"      // Normal operation, requests pass through
  StateOpen     = "open"        // Failures exceeded threshold, requests are rejected
  StateHalfOpen = "half-open"   // Testing if service recovered, allows one request

Your tasks:

1. Define a \`CircuitBreaker\` struct with:
   - \`state\` (string) - current state
   - \`failures\` (int) - consecutive failure count
   - \`threshold\` (int) - max failures before opening
   - \`timeout\` (time.Duration) - how long to stay open before half-open
   - \`lastFailure\` (time.Time) - when the last failure occurred
   - A mutex for thread safety

2. Implement \`NewCircuitBreaker(threshold int, timeout time.Duration) *CircuitBreaker\` - creates a breaker starting in closed state.

3. Implement \`(cb *CircuitBreaker) Call(fn func() error) error\`:
   - If open and timeout has not elapsed, return \`ErrCircuitOpen\`
   - If open and timeout has elapsed, transition to half-open
   - In closed or half-open state, call fn
   - On success: reset to closed state with zero failures
   - On failure: increment failures; if failures >= threshold, open the circuit

4. Implement \`(cb *CircuitBreaker) State() string\` to return current state.

5. Implement \`(cb *CircuitBreaker) Failures() int\` to return current failure count.

Define a package-level error:

  var ErrCircuitOpen = errors.New("circuit breaker is open")`,
  code: `package main

import (
	"errors"
	"sync"
	"time"
)

// Circuit breaker states
const (
	StateClosed   = "closed"
	StateOpen     = "open"
	StateHalfOpen = "half-open"
)

// TODO: Define ErrCircuitOpen error

// TODO: Define CircuitBreaker struct with state, failures, threshold,
// timeout, lastFailure, and a sync.Mutex

// TODO: Implement NewCircuitBreaker(threshold int, timeout time.Duration) *CircuitBreaker

// TODO: Implement (cb *CircuitBreaker) Call(fn func() error) error
// - If open and timeout not elapsed: return ErrCircuitOpen
// - If open and timeout elapsed: move to half-open
// - In closed/half-open: call fn
// - On success: reset to closed, zero failures
// - On failure: increment failures, open if >= threshold

// TODO: Implement (cb *CircuitBreaker) State() string

// TODO: Implement (cb *CircuitBreaker) Failures() int

var _ = errors.New
var _ = sync.Mutex{}
var _ time.Duration

func main() {}`,
  testCode: `package main

import (
	"errors"
	"testing"
	"time"
)

func TestClosedStatePassesThrough(t *testing.T) {
	cb := NewCircuitBreaker(3, 1*time.Second)

	called := false
	err := cb.Call(func() error {
		called = true
		return nil
	})

	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
	if !called {
		t.Error("function should have been called")
	}
	if cb.State() != StateClosed {
		t.Errorf("expected closed state, got %s", cb.State())
	}
}

func TestOpensAfterThreshold(t *testing.T) {
	cb := NewCircuitBreaker(3, 1*time.Second)
	fail := errors.New("service down")

	for i := 0; i < 3; i++ {
		cb.Call(func() error { return fail })
	}

	if cb.State() != StateOpen {
		t.Errorf("expected open state after %d failures, got %s", 3, cb.State())
	}
	if cb.Failures() != 3 {
		t.Errorf("expected 3 failures, got %d", cb.Failures())
	}
}

func TestOpenStateRejectsRequests(t *testing.T) {
	cb := NewCircuitBreaker(2, 1*time.Second)
	fail := errors.New("fail")

	cb.Call(func() error { return fail })
	cb.Call(func() error { return fail })

	err := cb.Call(func() error { return nil })
	if err != ErrCircuitOpen {
		t.Errorf("expected ErrCircuitOpen, got %v", err)
	}
}

func TestHalfOpenAfterTimeout(t *testing.T) {
	cb := NewCircuitBreaker(2, 50*time.Millisecond)
	fail := errors.New("fail")

	cb.Call(func() error { return fail })
	cb.Call(func() error { return fail })

	if cb.State() != StateOpen {
		t.Fatalf("expected open, got %s", cb.State())
	}

	time.Sleep(60 * time.Millisecond)

	// Next call should go through (half-open allows one attempt)
	err := cb.Call(func() error { return nil })
	if err != nil {
		t.Errorf("expected success in half-open, got %v", err)
	}
	if cb.State() != StateClosed {
		t.Errorf("expected closed after success in half-open, got %s", cb.State())
	}
}

func TestHalfOpenFailureReopens(t *testing.T) {
	cb := NewCircuitBreaker(2, 50*time.Millisecond)
	fail := errors.New("fail")

	cb.Call(func() error { return fail })
	cb.Call(func() error { return fail })

	time.Sleep(60 * time.Millisecond)

	// Fail again in half-open state
	cb.Call(func() error { return fail })

	if cb.State() != StateOpen {
		t.Errorf("expected open after half-open failure, got %s", cb.State())
	}
}

func TestSuccessResetsFailures(t *testing.T) {
	cb := NewCircuitBreaker(3, 1*time.Second)
	fail := errors.New("fail")

	cb.Call(func() error { return fail })
	cb.Call(func() error { return fail })
	cb.Call(func() error { return nil }) // success resets

	if cb.Failures() != 0 {
		t.Errorf("expected 0 failures after success, got %d", cb.Failures())
	}
	if cb.State() != StateClosed {
		t.Errorf("expected closed, got %s", cb.State())
	}

	// Should be able to tolerate more failures now
	cb.Call(func() error { return fail })
	cb.Call(func() error { return fail })
	if cb.State() != StateClosed {
		t.Errorf("expected still closed after 2 failures, got %s", cb.State())
	}
}

func TestReturnsUnderlyingError(t *testing.T) {
	cb := NewCircuitBreaker(5, 1*time.Second)
	expected := errors.New("database timeout")

	err := cb.Call(func() error { return expected })
	if err != expected {
		t.Errorf("expected underlying error, got %v", err)
	}
}`,
  solution: `package main

import (
	"errors"
	"sync"
	"time"
)

const (
	StateClosed   = "closed"
	StateOpen     = "open"
	StateHalfOpen = "half-open"
)

var ErrCircuitOpen = errors.New("circuit breaker is open")

type CircuitBreaker struct {
	mu          sync.Mutex
	state       string
	failures    int
	threshold   int
	timeout     time.Duration
	lastFailure time.Time
}

func NewCircuitBreaker(threshold int, timeout time.Duration) *CircuitBreaker {
	return &CircuitBreaker{
		state:     StateClosed,
		threshold: threshold,
		timeout:   timeout,
	}
}

func (cb *CircuitBreaker) Call(fn func() error) error {
	cb.mu.Lock()

	if cb.state == StateOpen {
		if time.Since(cb.lastFailure) > cb.timeout {
			cb.state = StateHalfOpen
		} else {
			cb.mu.Unlock()
			return ErrCircuitOpen
		}
	}

	cb.mu.Unlock()

	err := fn()

	cb.mu.Lock()
	defer cb.mu.Unlock()

	if err != nil {
		cb.failures++
		cb.lastFailure = time.Now()
		if cb.failures >= cb.threshold {
			cb.state = StateOpen
		}
		return err
	}

	cb.failures = 0
	cb.state = StateClosed
	return nil
}

func (cb *CircuitBreaker) State() string {
	cb.mu.Lock()
	defer cb.mu.Unlock()
	return cb.state
}

func (cb *CircuitBreaker) Failures() int {
	cb.mu.Lock()
	defer cb.mu.Unlock()
	return cb.failures
}

func main() {}`,
  hints: [
    'Use a mutex to protect state changes. Lock before checking/changing state, unlock before calling fn to avoid holding the lock during the external call.',
    'In the Call method, check if state is open first. If timeout has elapsed, transition to half-open. Otherwise return ErrCircuitOpen.',
    'After calling fn, re-acquire the lock: on success reset failures to 0 and state to closed; on failure increment failures and open if >= threshold.',
    'State() and Failures() should also lock the mutex for thread-safe reads.',
  ],
}

export default exercise
