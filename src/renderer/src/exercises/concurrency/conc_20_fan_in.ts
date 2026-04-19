import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_20_fan_in',
  title: 'Fan In',
  category: 'Concurrency',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 20,
  description: `**Fan-in** merges multiple channels into one:

\`\`\`
func FanIn(channels ...<-chan int) <-chan int {
    out := make(chan int)
    var wg sync.WaitGroup
    for _, ch := range channels {
        wg.Add(1)
        go func(c <-chan int) {
            defer wg.Done()
            for v := range c {
                out <- v
            }
        }(ch)
    }
    go func() {
        wg.Wait()
        close(out)
    }()
    return out
}
\`\`\`

Fan-in is the complement of fan-out. Together they form a powerful pattern:
\`source → fan-out → workers → fan-in → result\`

Your task: implement fan-in merging patterns.`,
  code: `package main

import "sync"

// FanIn merges multiple input channels into a single output channel.
// Closes the output when ALL inputs are closed.
func FanIn(channels ...<-chan int) <-chan int {
	// TODO
	return nil
}

// FanInOrdered reads one value from each channel in round-robin order.
// Returns results as a slice. Stops when any channel is closed.
func FanInOrdered(channels ...<-chan int) []int {
	// TODO: Read from channels[0], channels[1], ..., channels[0], ...
	return nil
}

// Tee splits one input channel into two output channels.
// Every value from in is sent to BOTH outputs.
func Tee(in <-chan int) (<-chan int, <-chan int) {
	// TODO
	return nil, nil
}

var _ = sync.WaitGroup{}`,
  testCode: `package main

import (
	"sort"
	"testing"
	"time"
)

func TestFanIn(t *testing.T) {
	ch1 := make(chan int, 2)
	ch2 := make(chan int, 2)
	ch3 := make(chan int, 2)
	ch1 <- 1; ch1 <- 2; close(ch1)
	ch2 <- 3; ch2 <- 4; close(ch2)
	ch3 <- 5; ch3 <- 6; close(ch3)

	out := FanIn(ch1, ch2, ch3)
	var got []int
	for v := range out {
		got = append(got, v)
	}
	sort.Ints(got)
	want := []int{1, 2, 3, 4, 5, 6}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestFanInEmpty(t *testing.T) {
	ch := make(chan int)
	close(ch)
	out := FanIn(ch)
	var got []int
	for v := range out {
		got = append(got, v)
	}
	if len(got) != 0 {
		t.Errorf("got %v, want empty", got)
	}
}

func TestFanInOrdered(t *testing.T) {
	ch1 := make(chan int, 3)
	ch2 := make(chan int, 3)
	ch1 <- 1; ch1 <- 3; ch1 <- 5
	ch2 <- 2; ch2 <- 4; ch2 <- 6

	got := FanInOrdered(ch1, ch2)
	// Round robin: ch1=1, ch2=2, ch1=3, ch2=4, ch1=5, ch2=6
	want := []int{1, 2, 3, 4, 5, 6}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestTee(t *testing.T) {
	in := make(chan int, 3)
	in <- 10
	in <- 20
	in <- 30
	close(in)

	out1, out2 := Tee(in)

	done := make(chan bool)
	var got1, got2 []int
	go func() {
		for v := range out1 {
			got1 = append(got1, v)
		}
		done <- true
	}()
	go func() {
		for v := range out2 {
			got2 = append(got2, v)
		}
		done <- true
	}()

	select {
	case <-done:
	case <-time.After(2 * time.Second):
		t.Fatal("timed out")
	}
	select {
	case <-done:
	case <-time.After(2 * time.Second):
		t.Fatal("timed out")
	}

	want := []int{10, 20, 30}
	if len(got1) != 3 || len(got2) != 3 {
		t.Fatalf("got1=%v got2=%v, both should have 3 elements", got1, got2)
	}
	for i := range want {
		if got1[i] != want[i] {
			t.Errorf("out1[%d] = %d, want %d", i, got1[i], want[i])
		}
		if got2[i] != want[i] {
			t.Errorf("out2[%d] = %d, want %d", i, got2[i], want[i])
		}
	}
}`,
  solution: `package main

import "sync"

func FanIn(channels ...<-chan int) <-chan int {
	out := make(chan int)
	var wg sync.WaitGroup

	for _, ch := range channels {
		wg.Add(1)
		go func(c <-chan int) {
			defer wg.Done()
			for v := range c {
				out <- v
			}
		}(ch)
	}

	go func() {
		wg.Wait()
		close(out)
	}()

	return out
}

func FanInOrdered(channels ...<-chan int) []int {
	var result []int
	for {
		allDone := true
		for _, ch := range channels {
			v, ok := <-ch
			if !ok {
				return result
			}
			allDone = false
			result = append(result, v)
		}
		if allDone {
			break
		}
	}
	return result
}

func Tee(in <-chan int) (<-chan int, <-chan int) {
	out1 := make(chan int)
	out2 := make(chan int)

	go func() {
		defer close(out1)
		defer close(out2)
		for v := range in {
			out1 <- v
			out2 <- v
		}
	}()

	return out1, out2
}`,
  hints: [
    'FanIn: launch one goroutine per input channel that forwards to the shared output. Use WaitGroup to close output when all inputs are done.',
    'FanInOrdered: loop through channels in order, reading one value from each. Stop when any channel is closed.',
    'Tee: read from in, send the same value to both out1 and out2. Both consumers must read before the next value can be sent.'
  ],
}

export default exercise
