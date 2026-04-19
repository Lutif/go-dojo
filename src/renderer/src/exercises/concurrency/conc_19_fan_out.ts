import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_19_fan_out',
  title: 'Fan Out',
  category: 'Concurrency',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 19,
  description: `**Fan-out** distributes work from one channel to multiple goroutines:

\`\`\`
// One producer, multiple consumers
jobs := produce()
for i := 0; i < numWorkers; i++ {
    go worker(jobs, results)  // all read from same channel
}
\`\`\`

When multiple goroutines read from the same channel, Go distributes values — each value goes to exactly one receiver. This naturally load-balances work.

Use fan-out when:
- Processing is CPU-bound and benefits from parallelism
- Tasks are independent (no ordering requirement)
- You want to increase throughput

Your task: implement fan-out patterns for parallel processing.`,
  code: `package main

import "sync"

// FanOut distributes values from in to n worker goroutines.
// Each worker applies fn to its values and sends results to the output.
// Returns a single output channel with all results.
func FanOut(in <-chan int, n int, fn func(int) int) <-chan int {
	// TODO: Launch n workers reading from 'in', writing to shared output
	// Close output when all workers are done
	return nil
}

// FanOutCollect is like FanOut but collects all results into a slice.
func FanOutCollect(items []int, workers int, fn func(int) int) []int {
	// TODO: Create input channel, use FanOut, collect results
	return nil
}

var _ = sync.WaitGroup{}`,
  testCode: `package main

import (
	"sort"
	"testing"
)

func TestFanOut(t *testing.T) {
	in := make(chan int, 5)
	for i := 1; i <= 5; i++ {
		in <- i
	}
	close(in)

	out := FanOut(in, 3, func(x int) int { return x * x })
	var got []int
	for v := range out {
		got = append(got, v)
	}
	sort.Ints(got)
	want := []int{1, 4, 9, 16, 25}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestFanOutEmpty(t *testing.T) {
	in := make(chan int)
	close(in)
	out := FanOut(in, 3, func(x int) int { return x })
	var got []int
	for v := range out {
		got = append(got, v)
	}
	if len(got) != 0 {
		t.Errorf("got %v, want empty", got)
	}
}

func TestFanOutCollect(t *testing.T) {
	items := []int{1, 2, 3, 4, 5, 6}
	got := FanOutCollect(items, 3, func(x int) int { return x * 10 })
	sort.Ints(got)
	want := []int{10, 20, 30, 40, 50, 60}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestFanOutCollectEmpty(t *testing.T) {
	got := FanOutCollect([]int{}, 3, func(x int) int { return x })
	if len(got) != 0 {
		t.Errorf("got %v, want empty", got)
	}
}`,
  solution: `package main

import "sync"

func FanOut(in <-chan int, n int, fn func(int) int) <-chan int {
	out := make(chan int)
	var wg sync.WaitGroup

	for i := 0; i < n; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for v := range in {
				out <- fn(v)
			}
		}()
	}

	go func() {
		wg.Wait()
		close(out)
	}()

	return out
}

func FanOutCollect(items []int, workers int, fn func(int) int) []int {
	in := make(chan int, len(items))
	for _, item := range items {
		in <- item
	}
	close(in)

	out := FanOut(in, workers, fn)
	var results []int
	for v := range out {
		results = append(results, v)
	}
	return results
}`,
  hints: [
    'FanOut: all n workers read from the same input channel. Go distributes values automatically — one value per reader.',
    'Use WaitGroup to track workers. When all finish, close the output channel in a separate goroutine.',
    'FanOutCollect: load all items into a buffered channel, close it, pass to FanOut, range over the output.'
  ],
}

export default exercise
