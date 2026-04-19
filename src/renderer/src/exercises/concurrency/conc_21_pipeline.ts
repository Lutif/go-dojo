import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_21_pipeline',
  title: 'Pipeline',
  category: 'Concurrency',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 21,
  description: `A **pipeline** is a series of stages connected by channels. Each stage is a goroutine that:
1. Receives values from an input channel
2. Processes them
3. Sends results to an output channel

\`\`\`
source → double → addOne → collect
  [1,2,3] → [2,4,6] → [3,5,7] → [3,5,7]
\`\`\`

Benefits:
- Each stage runs concurrently
- Stages are composable and reusable
- Natural backpressure — a slow stage automatically throttles upstream

Your task: build composable pipeline stages.`,
  code: `package main

// Stage is a pipeline stage: reads from in, processes, writes to out.
type Stage func(in <-chan int) <-chan int

// Source creates a stage that emits the given values.
func Source(values ...int) <-chan int {
	// TODO: Send values on channel, close it
	return nil
}

// Map creates a stage that applies fn to each value.
func Map(in <-chan int, fn func(int) int) <-chan int {
	// TODO
	return nil
}

// Filter creates a stage that only passes values where fn returns true.
func Filter(in <-chan int, fn func(int) bool) <-chan int {
	// TODO
	return nil
}

// Reduce consumes all values and returns a single result.
func Reduce(in <-chan int, initial int, fn func(acc, val int) int) int {
	// TODO
	return 0
}

// Chain connects Source → Map → Filter → Reduce into a pipeline.
// Given values, double each, keep only those > threshold, sum them.
func Chain(values []int, threshold int) int {
	// TODO: Wire the stages together
	return 0
}`,
  testCode: `package main

import "testing"

func TestSource(t *testing.T) {
	ch := Source(1, 2, 3)
	var got []int
	for v := range ch {
		got = append(got, v)
	}
	if len(got) != 3 || got[0] != 1 || got[1] != 2 || got[2] != 3 {
		t.Errorf("got %v, want [1 2 3]", got)
	}
}

func TestMap(t *testing.T) {
	src := Source(1, 2, 3)
	doubled := Map(src, func(x int) int { return x * 2 })
	var got []int
	for v := range doubled {
		got = append(got, v)
	}
	want := []int{2, 4, 6}
	if len(got) != 3 {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestFilter(t *testing.T) {
	src := Source(1, 2, 3, 4, 5)
	evens := Filter(src, func(x int) bool { return x%2 == 0 })
	var got []int
	for v := range evens {
		got = append(got, v)
	}
	want := []int{2, 4}
	if len(got) != 2 || got[0] != 2 || got[1] != 4 {
		t.Errorf("got %v, want %v", got, want)
	}
}

func TestReduce(t *testing.T) {
	src := Source(1, 2, 3, 4, 5)
	sum := Reduce(src, 0, func(acc, val int) int { return acc + val })
	if sum != 15 {
		t.Errorf("Reduce sum = %d, want 15", sum)
	}
}

func TestChain(t *testing.T) {
	// values: [1, 2, 3, 4, 5]
	// doubled: [2, 4, 6, 8, 10]
	// filter > 5: [6, 8, 10]
	// sum: 24
	got := Chain([]int{1, 2, 3, 4, 5}, 5)
	if got != 24 {
		t.Errorf("Chain = %d, want 24", got)
	}
}

func TestChainSmallThreshold(t *testing.T) {
	// values: [1, 2, 3], doubled: [2, 4, 6], filter > 0: [2, 4, 6], sum: 12
	got := Chain([]int{1, 2, 3}, 0)
	if got != 12 {
		t.Errorf("Chain = %d, want 12", got)
	}
}

func TestChainEmpty(t *testing.T) {
	got := Chain([]int{}, 0)
	if got != 0 {
		t.Errorf("Chain([]) = %d, want 0", got)
	}
}`,
  solution: `package main

type Stage func(in <-chan int) <-chan int

func Source(values ...int) <-chan int {
	out := make(chan int, len(values))
	for _, v := range values {
		out <- v
	}
	close(out)
	return out
}

func Map(in <-chan int, fn func(int) int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for v := range in {
			out <- fn(v)
		}
	}()
	return out
}

func Filter(in <-chan int, fn func(int) bool) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for v := range in {
			if fn(v) {
				out <- v
			}
		}
	}()
	return out
}

func Reduce(in <-chan int, initial int, fn func(acc, val int) int) int {
	acc := initial
	for v := range in {
		acc = fn(acc, v)
	}
	return acc
}

func Chain(values []int, threshold int) int {
	src := Source(values...)
	doubled := Map(src, func(x int) int { return x * 2 })
	filtered := Filter(doubled, func(x int) bool { return x > threshold })
	return Reduce(filtered, 0, func(acc, val int) int { return acc + val })
}`,
  hints: [
    'Source: create a buffered channel, send all values, close it. No goroutine needed since values fit in buffer.',
    'Map and Filter: launch a goroutine that ranges over in, processes, sends to out, then closes out.',
    'Chain: compose them — Source(values...) → Map(double) → Filter(> threshold) → Reduce(sum). Each stage starts processing as data flows through.'
  ],
}

export default exercise
