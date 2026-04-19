import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_23_rate_limiter',
  title: 'Rate Limiter',
  category: 'Concurrency',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 23,
  description: `A **rate limiter** controls how often an operation can occur. The simplest approach uses \`time.Ticker\`:

\`\`\`
limiter := time.NewTicker(100 * time.Millisecond)
defer limiter.Stop()
for _, req := range requests {
    <-limiter.C  // wait for next tick
    process(req)
}
\`\`\`

A **token bucket** allows bursts: tokens accumulate up to a max, each operation consumes one:
\`\`\`
bucket := make(chan struct{}, burstSize)
// Fill bucket initially
// Refill at a steady rate with a ticker
// Operations: <-bucket to consume a token
\`\`\`

Your task: implement rate limiting patterns.`,
  code: `package main

import "time"

// RateLimiter controls the rate of operations.
type RateLimiter struct {
	// TODO: ticker, interval, or token bucket fields
}

// NewRateLimiter creates a limiter allowing one operation per interval.
func NewRateLimiter(interval time.Duration) *RateLimiter {
	// TODO
	return nil
}

// Wait blocks until the next operation is allowed.
func (r *RateLimiter) Wait() {
	// TODO
}

// Stop cleans up the rate limiter.
func (r *RateLimiter) Stop() {
	// TODO
}

// RateLimitedProcess processes items with at most one per interval.
// Returns the results.
func RateLimitedProcess(items []int, interval time.Duration, fn func(int) int) []int {
	// TODO: Create limiter, process each item after waiting
	return nil
}

// BurstLimiter allows burst operations up to burstSize,
// then rate-limits at one per interval.
type BurstLimiter struct {
	// TODO
}

// NewBurstLimiter creates a limiter with burst capacity.
func NewBurstLimiter(burstSize int, interval time.Duration) *BurstLimiter {
	// TODO
	return nil
}

// Allow returns true if an operation is allowed (non-blocking).
func (b *BurstLimiter) Allow() bool {
	// TODO
	return false
}

// Stop cleans up the burst limiter.
func (b *BurstLimiter) Stop() {
	// TODO
}

var _ = time.NewTicker`,
  testCode: `package main

import (
	"testing"
	"time"
)

func TestRateLimiter(t *testing.T) {
	rl := NewRateLimiter(50 * time.Millisecond)
	defer rl.Stop()

	start := time.Now()
	for i := 0; i < 3; i++ {
		rl.Wait()
	}
	elapsed := time.Since(start)
	// 3 waits at 50ms each = ~150ms minimum
	if elapsed < 100*time.Millisecond {
		t.Errorf("3 waits took %v, expected >= 100ms", elapsed)
	}
}

func TestRateLimitedProcess(t *testing.T) {
	items := []int{1, 2, 3}
	got := RateLimitedProcess(items, 20*time.Millisecond, func(x int) int {
		return x * 2
	})
	want := []int{2, 4, 6}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestBurstLimiterInitialBurst(t *testing.T) {
	bl := NewBurstLimiter(3, 100*time.Millisecond)
	defer bl.Stop()

	// First 3 should be allowed (burst)
	for i := 0; i < 3; i++ {
		if !bl.Allow() {
			t.Errorf("burst request %d should be allowed", i)
		}
	}
	// Next should be denied (burst exhausted, no refill yet)
	if bl.Allow() {
		t.Error("should be denied after burst exhausted")
	}
}

func TestBurstLimiterRefill(t *testing.T) {
	bl := NewBurstLimiter(1, 50*time.Millisecond)
	defer bl.Stop()

	// Use the initial token
	if !bl.Allow() {
		t.Error("first should be allowed")
	}
	if bl.Allow() {
		t.Error("second should be denied")
	}

	// Wait for refill
	time.Sleep(70 * time.Millisecond)
	if !bl.Allow() {
		t.Error("should be allowed after refill")
	}
}`,
  solution: `package main

import "time"

type RateLimiter struct {
	ticker *time.Ticker
}

func NewRateLimiter(interval time.Duration) *RateLimiter {
	return &RateLimiter{
		ticker: time.NewTicker(interval),
	}
}

func (r *RateLimiter) Wait() {
	<-r.ticker.C
}

func (r *RateLimiter) Stop() {
	r.ticker.Stop()
}

func RateLimitedProcess(items []int, interval time.Duration, fn func(int) int) []int {
	rl := NewRateLimiter(interval)
	defer rl.Stop()

	results := make([]int, len(items))
	for i, item := range items {
		rl.Wait()
		results[i] = fn(item)
	}
	return results
}

type BurstLimiter struct {
	tokens chan struct{}
	ticker *time.Ticker
	stop   chan struct{}
}

func NewBurstLimiter(burstSize int, interval time.Duration) *BurstLimiter {
	bl := &BurstLimiter{
		tokens: make(chan struct{}, burstSize),
		ticker: time.NewTicker(interval),
		stop:   make(chan struct{}),
	}

	// Fill initial burst
	for i := 0; i < burstSize; i++ {
		bl.tokens <- struct{}{}
	}

	// Refill tokens at interval
	go func() {
		for {
			select {
			case <-bl.ticker.C:
				select {
				case bl.tokens <- struct{}{}:
				default: // bucket full
				}
			case <-bl.stop:
				return
			}
		}
	}()

	return bl
}

func (b *BurstLimiter) Allow() bool {
	select {
	case <-b.tokens:
		return true
	default:
		return false
	}
}

func (b *BurstLimiter) Stop() {
	b.ticker.Stop()
	close(b.stop)
}

var _ = time.NewTicker`,
  hints: [
    'RateLimiter: use time.NewTicker(interval). Wait() simply reads from ticker.C — it blocks until the next tick.',
    'BurstLimiter: use a buffered channel as a token bucket. Pre-fill with burstSize tokens. A background goroutine adds tokens at the refill rate.',
    'Allow(): non-blocking read from the token channel — select { case <-tokens: return true; default: return false }.'
  ],
}

export default exercise
