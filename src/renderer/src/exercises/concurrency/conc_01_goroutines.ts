import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_01_goroutines',
  title: 'Goroutines Basic',
  category: 'Concurrency',
  subcategory: 'Goroutines',
  difficulty: 'beginner',
  order: 1,
  description: `A goroutine is a lightweight thread managed by the Go runtime. Launch one with the \`go\` keyword:

\`\`\`
go doWork()           // launch a goroutine
go func() {           // launch an anonymous goroutine
    fmt.Println("hi")
}()
\`\`\`

Key facts:
- Goroutines are **cheap** — thousands can run simultaneously
- They share the same address space (be careful with shared data!)
- The program exits when \`main()\` returns, even if goroutines are still running
- You need **synchronization** (channels, WaitGroup) to coordinate them

Your task: launch goroutines and collect their results via channels.`,
  code: `package main

// Compute launches a goroutine that sends n*2 on the returned channel.
func Compute(n int) <-chan int {
	// TODO: Create a channel, launch a goroutine to send n*2, return channel
	return nil
}

// ParallelDouble doubles each number concurrently using goroutines.
// Returns the results in the same order as the input.
func ParallelDouble(nums []int) []int {
	// TODO: Launch one goroutine per number
	// Collect results preserving order
	// Hint: use a slice of channels, one per goroutine
	return nil
}

// CountTo sends numbers 1 through n on the returned channel, then closes it.
func CountTo(n int) <-chan int {
	// TODO: Create channel, launch goroutine that sends 1..n, close channel
	return nil
}`,
  testCode: `package main

import (
	"testing"
	"time"
)

func TestCompute(t *testing.T) {
	ch := Compute(21)
	select {
	case val := <-ch:
		if val != 42 {
			t.Errorf("Compute(21) = %d, want 42", val)
		}
	case <-time.After(time.Second):
		t.Fatal("Compute timed out")
	}
}

func TestComputeZero(t *testing.T) {
	ch := Compute(0)
	select {
	case val := <-ch:
		if val != 0 {
			t.Errorf("Compute(0) = %d, want 0", val)
		}
	case <-time.After(time.Second):
		t.Fatal("timed out")
	}
}

func TestParallelDouble(t *testing.T) {
	got := ParallelDouble([]int{1, 2, 3, 4, 5})
	want := []int{2, 4, 6, 8, 10}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestParallelDoubleEmpty(t *testing.T) {
	got := ParallelDouble([]int{})
	if len(got) != 0 {
		t.Errorf("got %v, want empty", got)
	}
}

func TestCountTo(t *testing.T) {
	ch := CountTo(5)
	var got []int
	for v := range ch {
		got = append(got, v)
	}
	want := []int{1, 2, 3, 4, 5}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestCountToZero(t *testing.T) {
	ch := CountTo(0)
	var got []int
	for v := range ch {
		got = append(got, v)
	}
	if len(got) != 0 {
		t.Errorf("got %v, want empty", got)
	}
}`,
  solution: `package main

func Compute(n int) <-chan int {
	ch := make(chan int, 1)
	go func() {
		ch <- n * 2
	}()
	return ch
}

func ParallelDouble(nums []int) []int {
	channels := make([]<-chan int, len(nums))
	for i, n := range nums {
		channels[i] = Compute(n)
	}
	results := make([]int, len(nums))
	for i, ch := range channels {
		results[i] = <-ch
	}
	return results
}

func CountTo(n int) <-chan int {
	ch := make(chan int)
	go func() {
		for i := 1; i <= n; i++ {
			ch <- i
		}
		close(ch)
	}()
	return ch
}`,
  hints: [
    'Compute: create a buffered channel (make(chan int, 1)), launch go func() { ch <- n*2 }(), return the channel.',
    'ParallelDouble: launch all goroutines first (store their channels), then collect results in order. This ensures concurrency.',
    'CountTo: create an unbuffered channel, launch a goroutine that loops 1..n sending each value, then close(ch) when done.'
  ],
}

export default exercise
