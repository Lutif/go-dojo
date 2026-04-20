import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_07_goroutine_stack',
  title: 'Goroutine Stack',
  category: 'Internals',
  subcategory: 'Runtime',
  difficulty: 'advanced',
  order: 7,
  description: `Goroutines start with a small stack (~2-8 KB) that grows as needed:

\`\`\`
runtime.NumGoroutine()  // current count
runtime.Stack(buf, all) // capture stack traces
\`\`\`

Key properties:
- Goroutines are **multiplexed** onto OS threads (M:N scheduling)
- \`runtime.GOMAXPROCS(n)\` controls max OS threads for goroutines
- Stack growth is transparent: the runtime copies the stack when it grows
- \`runtime.Goexit()\` terminates the current goroutine (defers still run)

Your task: explore goroutine behavior and stack inspection.`,
  code: `package main

import (
	"runtime"
	"sync"
)

// CountGoroutines returns the current number of goroutines.
func CountGoroutines() int {
	// TODO
	return 0
}

// SpawnAndCount launches n goroutines that block on a channel,
// then returns the goroutine count. Cleans up before returning.
func SpawnAndCount(n int) int {
	// TODO: Launch n goroutines, count, then unblock them
	return 0
}

// StackTrace returns the stack trace of the current goroutine as a string.
func StackTrace() string {
	// TODO: Use runtime.Stack
	return ""
}

// ParallelSum computes the sum of a slice using n goroutines.
// Split the work evenly across goroutines.
func ParallelSum(nums []int, n int) int {
	// TODO: Use sync.WaitGroup
	return 0
}

var _ = runtime.NumGoroutine
var _ = sync.WaitGroup{}`,
  testCode: `package main

import (
	"strings"
	"testing"
)

func TestCountGoroutines(t *testing.T) {
	count := CountGoroutines()
	if count < 1 {
		t.Errorf("expected at least 1 goroutine, got %d", count)
	}
}

func TestSpawnAndCount(t *testing.T) {
	baseline := CountGoroutines()
	count := SpawnAndCount(10)
	if count < baseline+10 {
		t.Errorf("expected at least %d goroutines, got %d", baseline+10, count)
	}
}

func TestStackTrace(t *testing.T) {
	trace := StackTrace()
	if !strings.Contains(trace, "StackTrace") {
		t.Errorf("stack trace should contain function name, got: %s", trace[:min(len(trace), 200)])
	}
}

func TestParallelSum(t *testing.T) {
	nums := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
	got := ParallelSum(nums, 3)
	if got != 55 {
		t.Errorf("got %d, want 55", got)
	}
}

func TestParallelSumSingle(t *testing.T) {
	nums := []int{10, 20, 30}
	got := ParallelSum(nums, 1)
	if got != 60 {
		t.Errorf("got %d, want 60", got)
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}`,
  solution: `package main

import (
	"runtime"
	"sync"
	"sync/atomic"
)

func CountGoroutines() int {
	return runtime.NumGoroutine()
}

func SpawnAndCount(n int) int {
	done := make(chan struct{})
	var wg sync.WaitGroup
	wg.Add(n)
	for i := 0; i < n; i++ {
		go func() {
			wg.Done()
			<-done
		}()
	}
	wg.Wait() // wait until all goroutines are running
	count := runtime.NumGoroutine()
	close(done) // unblock all
	return count
}

func StackTrace() string {
	buf := make([]byte, 4096)
	n := runtime.Stack(buf, false)
	return string(buf[:n])
}

func ParallelSum(nums []int, n int) int {
	if n <= 0 {
		n = 1
	}
	var total int64
	var wg sync.WaitGroup
	chunkSize := (len(nums) + n - 1) / n

	for i := 0; i < n; i++ {
		start := i * chunkSize
		end := start + chunkSize
		if start >= len(nums) {
			break
		}
		if end > len(nums) {
			end = len(nums)
		}
		wg.Add(1)
		go func(slice []int) {
			defer wg.Done()
			var sum int64
			for _, v := range slice {
				sum += int64(v)
			}
			atomic.AddInt64(&total, sum)
		}(nums[start:end])
	}
	wg.Wait()
	return int(total)
}

var _ = runtime.NumGoroutine
var _ = sync.WaitGroup{}`,
  hints: [
    'CountGoroutines: runtime.NumGoroutine() returns the count.',
    'SpawnAndCount: launch goroutines that block on a channel, count, then close the channel.',
    'ParallelSum: split the slice into chunks, sum each in a goroutine, use atomic.AddInt64 for the total.'
  ],
}

export default exercise
