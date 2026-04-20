import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_07_rate_limiter',
  title: 'Rate Limiter',
  category: 'Networking',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 7,
  description: `Implement a token bucket rate limiter. The token bucket algorithm controls the rate of requests by maintaining a bucket of tokens that refills at a steady rate. Each request consumes one token; if no tokens are available, the request is denied.

Key concepts:
- The bucket holds up to \`capacity\` tokens
- Tokens are added at a rate of \`refillRate\` tokens per \`refillInterval\`
- \`Allow()\` returns true if a token is available (and consumes it), false otherwise
- The bucket starts full
- Tokens are calculated lazily -- compute how many tokens should have been added since the last access

Example usage:

    // 10 tokens max, refill 1 token every 100ms
    rl := NewRateLimiter(10, 1, 100*time.Millisecond)

    if rl.Allow() {
        // process request
    } else {
        // reject: rate limited
    }

Your task:
1. Implement \`NewRateLimiter(capacity int, refillRate int, refillInterval time.Duration) *RateLimiter\`
2. Implement \`(*RateLimiter) Allow() bool\` -- returns true and consumes a token if available, false if bucket is empty
3. Implement \`(*RateLimiter) Tokens() int\` -- returns current number of tokens (after computing refill)`,
  code: `package main

import (
	"sync"
	"time"
)

// RateLimiter implements the token bucket algorithm.
type RateLimiter struct {
	mu sync.Mutex
	// TODO: Add fields for capacity, tokens, refill rate, interval, and last refill time
}

// NewRateLimiter creates a rate limiter with the given capacity, refill rate, and interval.
// The bucket starts full.
// TODO: Implement this function
func NewRateLimiter(capacity int, refillRate int, refillInterval time.Duration) *RateLimiter {
	return nil
}

// Allow checks if a request is allowed. Returns true and consumes a token
// if tokens are available, false otherwise.
// TODO: Implement this function
func (r *RateLimiter) Allow() bool {
	return false
}

// Tokens returns the current number of tokens available.
// TODO: Implement this function
func (r *RateLimiter) Tokens() int {
	return 0
}

func main() {}`,
  testCode: `package main

import (
	"testing"
	"time"
)

func TestNewRateLimiter(t *testing.T) {
	rl := NewRateLimiter(10, 1, 100*time.Millisecond)
	if rl == nil {
		t.Fatal("NewRateLimiter returned nil")
	}
	if rl.Tokens() != 10 {
		t.Errorf("initial tokens = %d, want 10", rl.Tokens())
	}
}

func TestAllowConsumesTokens(t *testing.T) {
	rl := NewRateLimiter(3, 1, time.Second)

	for i := 0; i < 3; i++ {
		if !rl.Allow() {
			t.Errorf("Allow() call %d returned false, want true", i+1)
		}
	}

	if rl.Tokens() != 0 {
		t.Errorf("tokens after 3 Allow() = %d, want 0", rl.Tokens())
	}

	// Fourth call should be denied
	if rl.Allow() {
		t.Error("Allow() returned true when bucket should be empty")
	}
}

func TestRefill(t *testing.T) {
	rl := NewRateLimiter(5, 2, 50*time.Millisecond)

	// Drain all tokens
	for i := 0; i < 5; i++ {
		rl.Allow()
	}
	if rl.Tokens() != 0 {
		t.Fatalf("tokens = %d, want 0", rl.Tokens())
	}

	// Wait for refill: 2 tokens per 50ms
	time.Sleep(75 * time.Millisecond)

	tokens := rl.Tokens()
	if tokens < 2 {
		t.Errorf("after 75ms, tokens = %d, want at least 2", tokens)
	}
}

func TestRefillDoesNotExceedCapacity(t *testing.T) {
	rl := NewRateLimiter(3, 10, 10*time.Millisecond)

	// Use one token
	rl.Allow()

	// Wait long enough for many refills
	time.Sleep(100 * time.Millisecond)

	tokens := rl.Tokens()
	if tokens > 3 {
		t.Errorf("tokens = %d, exceeds capacity 3", tokens)
	}
}

func TestConcurrentAccess(t *testing.T) {
	rl := NewRateLimiter(100, 1, time.Second)

	done := make(chan bool, 50)
	for i := 0; i < 50; i++ {
		go func() {
			rl.Allow()
			done <- true
		}()
	}

	for i := 0; i < 50; i++ {
		<-done
	}

	tokens := rl.Tokens()
	if tokens != 50 {
		t.Errorf("after 50 concurrent Allow(), tokens = %d, want 50", tokens)
	}
}`,
  solution: `package main

import (
	"sync"
	"time"
)

// RateLimiter implements the token bucket algorithm.
type RateLimiter struct {
	mu             sync.Mutex
	capacity       int
	tokens         int
	refillRate     int
	refillInterval time.Duration
	lastRefill     time.Time
}

// NewRateLimiter creates a rate limiter with the given capacity, refill rate, and interval.
func NewRateLimiter(capacity int, refillRate int, refillInterval time.Duration) *RateLimiter {
	return &RateLimiter{
		capacity:       capacity,
		tokens:         capacity,
		refillRate:     refillRate,
		refillInterval: refillInterval,
		lastRefill:     time.Now(),
	}
}

// refill adds tokens based on elapsed time. Must be called with lock held.
func (r *RateLimiter) refill() {
	now := time.Now()
	elapsed := now.Sub(r.lastRefill)
	intervals := int(elapsed / r.refillInterval)
	if intervals > 0 {
		r.tokens += intervals * r.refillRate
		if r.tokens > r.capacity {
			r.tokens = r.capacity
		}
		r.lastRefill = r.lastRefill.Add(time.Duration(intervals) * r.refillInterval)
	}
}

// Allow checks if a request is allowed.
func (r *RateLimiter) Allow() bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.refill()

	if r.tokens > 0 {
		r.tokens--
		return true
	}
	return false
}

// Tokens returns the current number of tokens available.
func (r *RateLimiter) Tokens() int {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.refill()
	return r.tokens
}

func main() {}`,
  hints: [
    'Store the last refill time and compute elapsed intervals lazily in Allow() and Tokens().',
    'Use int(elapsed / refillInterval) to calculate how many intervals have passed since the last refill.',
    'Cap tokens at capacity after refilling to prevent exceeding the bucket size.',
    'Use sync.Mutex to protect all state since Allow() may be called from multiple goroutines.',
  ],
}

export default exercise
