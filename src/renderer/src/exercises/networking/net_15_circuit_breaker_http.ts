import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_15_circuit_breaker_http',
  title: 'HTTP Circuit Breaker',
  category: 'Networking',
  subcategory: 'Patterns',
  difficulty: 'expert',
  order: 15,
  description: `Implement the circuit breaker pattern for an HTTP client. A circuit breaker prevents cascading failures by stopping requests to a failing service once a failure threshold is reached, and periodically allowing a test request to check if the service has recovered.

States:
- **Closed** (normal): Requests flow through. Failures are counted. When failures reach the threshold, the circuit opens.
- **Open**: All requests fail immediately without being sent. After a timeout period, the circuit moves to half-open.
- **Half-Open**: One test request is allowed through. If it succeeds, the circuit closes. If it fails, the circuit reopens.

Example:

    cb := NewCircuitBreaker(3, 5*time.Second)  // open after 3 failures, 5s timeout

    resp, err := cb.Do(req)  // normal request (closed state)
    // After 3 consecutive failures, circuit opens
    // cb.Do(req) returns error immediately (open state)
    // After 5 seconds, allows one test request (half-open)

Your task:
1. Implement \`NewCircuitBreaker(threshold int, timeout time.Duration) *CircuitBreaker\`
2. Implement \`(*CircuitBreaker) Do(req *http.Request) (*http.Response, error)\` -- executes the request respecting circuit state
3. Implement \`(*CircuitBreaker) State() string\` -- returns "closed", "open", or "half-open"
4. Implement \`(*CircuitBreaker) Failures() int\` -- returns current failure count
5. Implement \`(*CircuitBreaker) Reset()\` -- manually resets to closed state`,
  code: `package main

import (
	"net/http"
	"sync"
	"time"
)

// CircuitBreaker wraps an HTTP client with circuit breaker logic.
type CircuitBreaker struct {
	mu sync.Mutex
	// TODO: Add fields for threshold, timeout, failure count, state, timestamps, and http client
}

// NewCircuitBreaker creates a circuit breaker that opens after 'threshold'
// consecutive failures and stays open for 'timeout' duration.
// TODO: Implement this function
func NewCircuitBreaker(threshold int, timeout time.Duration) *CircuitBreaker {
	_ = http.DefaultClient
	_ = time.Now
	return nil
}

// Do executes an HTTP request through the circuit breaker.
// - Closed: forward the request; on failure increment count; open if threshold reached
// - Open: return error immediately; move to half-open if timeout has elapsed
// - Half-Open: allow one request; close on success, reopen on failure
// TODO: Implement this function
func (cb *CircuitBreaker) Do(req *http.Request) (*http.Response, error) {
	return nil, nil
}

// State returns the current circuit state: "closed", "open", or "half-open".
// TODO: Implement this function
func (cb *CircuitBreaker) State() string {
	return ""
}

// Failures returns the current failure count.
// TODO: Implement this function
func (cb *CircuitBreaker) Failures() int {
	return 0
}

// Reset manually resets the circuit breaker to the closed state.
// TODO: Implement this function
func (cb *CircuitBreaker) Reset() {
}

func main() {}`,
  testCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestCircuitBreakerClosed(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(200)
		w.Write([]byte("ok"))
	}))
	defer srv.Close()

	cb := NewCircuitBreaker(3, time.Second)
	if cb == nil {
		t.Fatal("NewCircuitBreaker returned nil")
	}

	if cb.State() != "closed" {
		t.Errorf("initial state = %q, want closed", cb.State())
	}

	req, _ := http.NewRequest("GET", srv.URL, nil)
	resp, err := cb.Do(req)
	if err != nil {
		t.Fatalf("Do: %v", err)
	}
	if resp.StatusCode != 200 {
		t.Errorf("status = %d, want 200", resp.StatusCode)
	}
	resp.Body.Close()
}

func TestCircuitOpensAfterThreshold(t *testing.T) {
	failCount := 0
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		failCount++
		w.WriteHeader(500)
	}))
	defer srv.Close()

	cb := NewCircuitBreaker(3, time.Second)

	// Make 3 failing requests
	for i := 0; i < 3; i++ {
		req, _ := http.NewRequest("GET", srv.URL, nil)
		resp, _ := cb.Do(req)
		if resp != nil {
			resp.Body.Close()
		}
	}

	if cb.State() != "open" {
		t.Errorf("after %d failures, state = %q, want open", cb.Failures(), cb.State())
	}

	// Next request should fail fast
	req, _ := http.NewRequest("GET", srv.URL, nil)
	_, err := cb.Do(req)
	if err == nil {
		t.Error("expected error in open state, got nil")
	}
}

func TestCircuitHalfOpen(t *testing.T) {
	callCount := 0
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		callCount++
		if callCount <= 3 {
			w.WriteHeader(500)
		} else {
			w.WriteHeader(200)
		}
	}))
	defer srv.Close()

	cb := NewCircuitBreaker(3, 100*time.Millisecond)

	// Trigger open
	for i := 0; i < 3; i++ {
		req, _ := http.NewRequest("GET", srv.URL, nil)
		resp, _ := cb.Do(req)
		if resp != nil {
			resp.Body.Close()
		}
	}

	if cb.State() != "open" {
		t.Fatalf("state = %q, want open", cb.State())
	}

	// Wait for timeout to trigger half-open
	time.Sleep(150 * time.Millisecond)

	if cb.State() != "half-open" {
		t.Errorf("after timeout, state = %q, want half-open", cb.State())
	}

	// Successful request in half-open should close circuit
	req, _ := http.NewRequest("GET", srv.URL, nil)
	resp, err := cb.Do(req)
	if err != nil {
		t.Fatalf("half-open Do: %v", err)
	}
	resp.Body.Close()

	if cb.State() != "closed" {
		t.Errorf("after success in half-open, state = %q, want closed", cb.State())
	}

	if cb.Failures() != 0 {
		t.Errorf("failures = %d, want 0 after reset", cb.Failures())
	}
}

func TestCircuitReopensFromHalfOpen(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(500) // always fail
	}))
	defer srv.Close()

	cb := NewCircuitBreaker(2, 100*time.Millisecond)

	// Open the circuit
	for i := 0; i < 2; i++ {
		req, _ := http.NewRequest("GET", srv.URL, nil)
		resp, _ := cb.Do(req)
		if resp != nil {
			resp.Body.Close()
		}
	}

	// Wait for half-open
	time.Sleep(150 * time.Millisecond)

	// Fail in half-open state
	req, _ := http.NewRequest("GET", srv.URL, nil)
	resp, _ := cb.Do(req)
	if resp != nil {
		resp.Body.Close()
	}

	if cb.State() != "open" {
		t.Errorf("after failure in half-open, state = %q, want open", cb.State())
	}
}

func TestManualReset(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(500)
	}))
	defer srv.Close()

	cb := NewCircuitBreaker(2, time.Minute)

	for i := 0; i < 2; i++ {
		req, _ := http.NewRequest("GET", srv.URL, nil)
		resp, _ := cb.Do(req)
		if resp != nil {
			resp.Body.Close()
		}
	}

	if cb.State() != "open" {
		t.Fatalf("state = %q, want open", cb.State())
	}

	cb.Reset()

	if cb.State() != "closed" {
		t.Errorf("after Reset, state = %q, want closed", cb.State())
	}
	if cb.Failures() != 0 {
		t.Errorf("after Reset, failures = %d, want 0", cb.Failures())
	}
}

func TestSuccessResetsFailureCount(t *testing.T) {
	callCount := 0
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		callCount++
		if callCount == 2 {
			w.WriteHeader(200) // second call succeeds
		} else {
			w.WriteHeader(500)
		}
	}))
	defer srv.Close()

	cb := NewCircuitBreaker(3, time.Second)

	// First call fails
	req, _ := http.NewRequest("GET", srv.URL, nil)
	resp, _ := cb.Do(req)
	if resp != nil {
		resp.Body.Close()
	}
	if cb.Failures() != 1 {
		t.Errorf("failures = %d, want 1", cb.Failures())
	}

	// Second call succeeds - should reset failures
	req, _ = http.NewRequest("GET", srv.URL, nil)
	resp, _ = cb.Do(req)
	if resp != nil {
		resp.Body.Close()
	}
	if cb.Failures() != 0 {
		t.Errorf("after success, failures = %d, want 0", cb.Failures())
	}
}`,
  solution: `package main

import (
	"errors"
	"net/http"
	"sync"
	"time"
)

// CircuitBreaker wraps an HTTP client with circuit breaker logic.
type CircuitBreaker struct {
	mu        sync.Mutex
	client    *http.Client
	threshold int
	timeout   time.Duration
	failures  int
	state     string
	openedAt  time.Time
}

// NewCircuitBreaker creates a circuit breaker that opens after 'threshold'
// consecutive failures and stays open for 'timeout' duration.
func NewCircuitBreaker(threshold int, timeout time.Duration) *CircuitBreaker {
	return &CircuitBreaker{
		client:    &http.Client{},
		threshold: threshold,
		timeout:   timeout,
		state:     "closed",
	}
}

// Do executes an HTTP request through the circuit breaker.
func (cb *CircuitBreaker) Do(req *http.Request) (*http.Response, error) {
	cb.mu.Lock()

	switch cb.state {
	case "open":
		if time.Since(cb.openedAt) >= cb.timeout {
			cb.state = "half-open"
		} else {
			cb.mu.Unlock()
			return nil, errors.New("circuit breaker is open")
		}
	}

	state := cb.state
	cb.mu.Unlock()

	resp, err := cb.client.Do(req)

	cb.mu.Lock()
	defer cb.mu.Unlock()

	if err != nil || resp.StatusCode >= 500 {
		cb.failures++
		if state == "half-open" || cb.failures >= cb.threshold {
			cb.state = "open"
			cb.openedAt = time.Now()
		}
		if err != nil {
			return nil, err
		}
		return resp, nil
	}

	// Success
	cb.failures = 0
	cb.state = "closed"
	return resp, nil
}

// State returns the current circuit state.
func (cb *CircuitBreaker) State() string {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	if cb.state == "open" && time.Since(cb.openedAt) >= cb.timeout {
		return "half-open"
	}
	return cb.state
}

// Failures returns the current failure count.
func (cb *CircuitBreaker) Failures() int {
	cb.mu.Lock()
	defer cb.mu.Unlock()
	return cb.failures
}

// Reset manually resets the circuit breaker to the closed state.
func (cb *CircuitBreaker) Reset() {
	cb.mu.Lock()
	defer cb.mu.Unlock()
	cb.failures = 0
	cb.state = "closed"
}

func main() {}`,
  hints: [
    'Use a string field for state ("closed", "open", "half-open") and track when the circuit opened with a time.Time field.',
    'In Do(), check the state first: if open and timeout has not elapsed, return an error immediately.',
    'If open and timeout has elapsed, transition to half-open and allow the request through.',
    'On success, reset failures to 0 and set state to "closed". On failure in half-open, reopen the circuit.',
    'Consider HTTP status codes >= 500 as failures, even though http.Client.Do returns no error.',
  ],
}

export default exercise
