import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_02_waitgroup',
  title: 'WaitGroup',
  category: 'Concurrency',
  subcategory: 'Goroutines',
  difficulty: 'beginner',
  order: 2,
  description: `\`sync.WaitGroup\` waits for a collection of goroutines to finish:

\`\`\`
var wg sync.WaitGroup
for i := 0; i < 5; i++ {
    wg.Add(1)
    go func(id int) {
        defer wg.Done()
        fmt.Println("worker", id)
    }(i)
}
wg.Wait() // blocks until all goroutines call Done()
\`\`\`

Rules:
- Call \`Add(n)\` **before** launching the goroutine
- Call \`Done()\` when the goroutine finishes (use \`defer\`)
- Call \`Wait()\` to block until all are done
- Never copy a WaitGroup after first use (pass by pointer)

Your task: use WaitGroup to coordinate concurrent work.`,
  code: `package main

import "sync"

// ConcurrentSum adds all numbers concurrently, one goroutine per number.
// Have each goroutine write its value into a unique slot of a partials slice
// (so no synchronization is needed), then sum the slice after Wait returns.
// Use WaitGroup to wait for all goroutines.
func ConcurrentSum(nums []int) int {
	// TODO
	return 0
}

// ParallelMap applies fn to each element concurrently.
// Returns results in the same order as input.
// Use WaitGroup to wait for all goroutines.
func ParallelMap(items []string, fn func(string) string) []string {
	// TODO
	return nil
}

// Barrier waits for n goroutines to all reach a point,
// then returns. Sends true on the returned channel when all arrive.
func Barrier(n int) <-chan bool {
	// TODO: Launch n goroutines, use WaitGroup, signal when all done
	return nil
}

var _ = sync.WaitGroup{}`,
  testCode: `package main

import (
	"fmt"
	"strings"
	"testing"
	"time"
)

func TestConcurrentSum(t *testing.T) {
	got := ConcurrentSum([]int{1, 2, 3, 4, 5})
	if got != 15 {
		t.Errorf("ConcurrentSum = %d, want 15", got)
	}
}

func TestConcurrentSumEmpty(t *testing.T) {
	got := ConcurrentSum([]int{})
	if got != 0 {
		t.Errorf("ConcurrentSum([]) = %d, want 0", got)
	}
}

func TestConcurrentSumSingle(t *testing.T) {
	got := ConcurrentSum([]int{42})
	if got != 42 {
		t.Errorf("ConcurrentSum([42]) = %d, want 42", got)
	}
}

func TestParallelMap(t *testing.T) {
	got := ParallelMap(
		[]string{"hello", "world"},
		strings.ToUpper,
	)
	want := []string{"HELLO", "WORLD"}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %q, want %q", i, got[i], want[i])
		}
	}
}

func TestParallelMapEmpty(t *testing.T) {
	got := ParallelMap([]string{}, strings.ToUpper)
	if len(got) != 0 {
		t.Errorf("got %v, want empty", got)
	}
}

func TestParallelMapPreservesOrder(t *testing.T) {
	items := []string{"a", "b", "c", "d", "e"}
	got := ParallelMap(items, func(s string) string {
		return fmt.Sprintf("[%s]", s)
	})
	for i, item := range items {
		want := fmt.Sprintf("[%s]", item)
		if got[i] != want {
			t.Errorf("got[%d] = %q, want %q", i, got[i], want)
		}
	}
}

func TestBarrier(t *testing.T) {
	ch := Barrier(5)
	select {
	case v := <-ch:
		if !v {
			t.Error("expected true")
		}
	case <-time.After(2 * time.Second):
		t.Fatal("Barrier timed out")
	}
}`,
  solution: `package main

import "sync"

func ConcurrentSum(nums []int) int {
	partials := make([]int, len(nums))
	var wg sync.WaitGroup

	for i, n := range nums {
		wg.Add(1)
		go func(idx, val int) {
			defer wg.Done()
			partials[idx] = val
		}(i, n)
	}

	wg.Wait()

	sum := 0
	for _, p := range partials {
		sum += p
	}
	return sum
}

func ParallelMap(items []string, fn func(string) string) []string {
	results := make([]string, len(items))
	var wg sync.WaitGroup

	for i, item := range items {
		wg.Add(1)
		go func(idx int, val string) {
			defer wg.Done()
			results[idx] = fn(val)
		}(i, item)
	}

	wg.Wait()
	return results
}

func Barrier(n int) <-chan bool {
	done := make(chan bool, 1)
	var wg sync.WaitGroup
	wg.Add(n)

	for i := 0; i < n; i++ {
		go func() {
			defer wg.Done()
		}()
	}

	go func() {
		wg.Wait()
		done <- true
	}()

	return done
}`,
  hints: [
    'ConcurrentSum: pre-allocate a partials slice the same length as nums. Each goroutine writes its value to partials[i] — different indices, so no synchronization is needed. After Wait, fold the slice into a sum.',
    'ParallelMap: pre-allocate the results slice, write to results[idx] in each goroutine — no mutex needed since each writes to a different index.',
    'Barrier: create n goroutines with wg.Add(n), launch another goroutine that calls wg.Wait() then sends on the channel.'
  ],
}

export default exercise
