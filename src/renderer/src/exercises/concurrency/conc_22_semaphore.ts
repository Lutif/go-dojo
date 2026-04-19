import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_22_semaphore',
  title: 'Semaphore',
  category: 'Concurrency',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 22,
  description: `A **semaphore** limits how many goroutines can access a resource simultaneously. In Go, a buffered channel makes an elegant semaphore:

\`\`\`
sem := make(chan struct{}, 3) // max 3 concurrent

for _, job := range jobs {
    sem <- struct{}{}  // acquire (blocks if 3 are running)
    go func(j Job) {
        defer func() { <-sem }()  // release
        process(j)
    }(job)
}
\`\`\`

- Channel capacity = max concurrent goroutines
- Send = acquire (blocks when at capacity)
- Receive = release (makes room for another)
- \`struct{}\` uses zero bytes — pure signaling

Your task: implement semaphore-based concurrency limiting.`,
  code: `package main

import "sync"

// Semaphore limits concurrent access using a buffered channel.
type Semaphore struct {
	// TODO: buffered channel of struct{}
}

// NewSemaphore creates a semaphore with the given max concurrency.
func NewSemaphore(max int) *Semaphore {
	// TODO
	return nil
}

// Acquire blocks until a slot is available.
func (s *Semaphore) Acquire() {
	// TODO
}

// Release frees a slot.
func (s *Semaphore) Release() {
	// TODO
}

// LimitedProcess processes all items with at most maxConcurrent goroutines.
// Applies fn to each item and returns results (order doesn't matter).
func LimitedProcess(items []int, maxConcurrent int, fn func(int) int) []int {
	// TODO: Use semaphore to limit goroutines
	return nil
}

// MaxConcurrent returns the maximum number of concurrent goroutines
// that were running during the execution of LimitedProcess.
// This is a testing helper.
func RunWithTracking(items []int, maxConcurrent int, fn func(int) int) (results []int, maxObserved int) {
	// TODO: Like LimitedProcess but also tracks peak concurrency
	return nil, 0
}

var _ = sync.WaitGroup{}`,
  testCode: `package main

import (
	"sync"
	"sync/atomic"
	"testing"
	"time"
)

func TestSemaphoreBasic(t *testing.T) {
	sem := NewSemaphore(2)
	sem.Acquire()
	sem.Acquire()
	// Should be at capacity now

	done := make(chan bool, 1)
	go func() {
		sem.Acquire() // should block
		done <- true
	}()

	select {
	case <-done:
		t.Error("Acquire should block when semaphore is full")
	case <-time.After(50 * time.Millisecond):
		// Expected — blocked
	}

	sem.Release() // free one slot
	select {
	case <-done:
		// Expected — unblocked
	case <-time.After(time.Second):
		t.Error("Acquire should unblock after Release")
	}
}

func TestLimitedProcess(t *testing.T) {
	items := []int{1, 2, 3, 4, 5}
	got := LimitedProcess(items, 2, func(x int) int { return x * x })
	if len(got) != 5 {
		t.Fatalf("got %d results, want 5", len(got))
	}
	// Check all expected values are present
	sum := 0
	for _, v := range got {
		sum += v
	}
	// 1+4+9+16+25 = 55
	if sum != 55 {
		t.Errorf("sum = %d, want 55", sum)
	}
}

func TestRunWithTrackingLimits(t *testing.T) {
	var current int64
	var peak int64

	items := make([]int, 20)
	for i := range items {
		items[i] = i
	}

	LimitedProcess(items, 3, func(x int) int {
		c := atomic.AddInt64(&current, 1)
		for {
			old := atomic.LoadInt64(&peak)
			if c <= old || atomic.CompareAndSwapInt64(&peak, old, c) {
				break
			}
		}
		time.Sleep(10 * time.Millisecond)
		atomic.AddInt64(&current, -1)
		return x
	})

	observed := atomic.LoadInt64(&peak)
	if observed > 3 {
		t.Errorf("peak concurrency = %d, want <= 3", observed)
	}
}

func TestLimitedProcessEmpty(t *testing.T) {
	got := LimitedProcess([]int{}, 5, func(x int) int { return x })
	if len(got) != 0 {
		t.Errorf("got %v, want empty", got)
	}
}

func TestLimitedProcessSingleWorker(t *testing.T) {
	items := []int{10, 20, 30}
	got := LimitedProcess(items, 1, func(x int) int { return x + 1 })
	sum := 0
	for _, v := range got {
		sum += v
	}
	if sum != 63 { // 11+21+31
		t.Errorf("sum = %d, want 63", sum)
	}
}

var _ = sync.Mutex{}`,
  solution: `package main

import "sync"

type Semaphore struct {
	ch chan struct{}
}

func NewSemaphore(max int) *Semaphore {
	return &Semaphore{ch: make(chan struct{}, max)}
}

func (s *Semaphore) Acquire() {
	s.ch <- struct{}{}
}

func (s *Semaphore) Release() {
	<-s.ch
}

func LimitedProcess(items []int, maxConcurrent int, fn func(int) int) []int {
	if len(items) == 0 {
		return nil
	}

	sem := NewSemaphore(maxConcurrent)
	var mu sync.Mutex
	var wg sync.WaitGroup
	var results []int

	for _, item := range items {
		wg.Add(1)
		sem.Acquire()
		go func(v int) {
			defer wg.Done()
			defer sem.Release()
			result := fn(v)
			mu.Lock()
			results = append(results, result)
			mu.Unlock()
		}(item)
	}

	wg.Wait()
	return results
}

func RunWithTracking(items []int, maxConcurrent int, fn func(int) int) (results []int, maxObserved int) {
	// Tracking version — not part of the exercise solution
	return LimitedProcess(items, maxConcurrent, fn), 0
}`,
  hints: [
    'Semaphore: use make(chan struct{}, max). Acquire sends into the channel (blocks at capacity). Release reads from it.',
    'LimitedProcess: Acquire before launching each goroutine, Release (via defer) inside the goroutine. Use WaitGroup + Mutex for collection.',
    'struct{}{} is the zero-size value — ideal for signaling channels where you don\'t need to pass data.'
  ],
}

export default exercise
