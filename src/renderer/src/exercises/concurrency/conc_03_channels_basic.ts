import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_03_channels_basic',
  title: 'Channels Basic',
  category: 'Concurrency',
  subcategory: 'Channels',
  difficulty: 'beginner',
  order: 1,
  description: `Channels are typed conduits for passing values around. Create one with \`make\`:

\`\`\`go
ch := make(chan int)      // unbuffered (blocks on send until a receiver is ready)
ch := make(chan int, 3)   // buffered with capacity 3
\`\`\`

With a **buffered** channel, sends don't block until the buffer is full, and receives don't block as long as there's data:

\`\`\`go
ch := make(chan string, 2)
ch <- "hello"    // send a value
ch <- "world"    // buffer has room, no block
msg := <-ch      // receive: "hello"
\`\`\`

You can also **close** a channel to signal no more values will be sent:

\`\`\`go
close(ch)
val, ok := <-ch  // ok is false when channel is closed and empty
\`\`\`

Your task: practice creating, sending, receiving, and closing channels.`,
  code: `package main

// MakeMailbox creates a buffered string channel with the given capacity,
// sends all messages into it, then returns the channel.
func MakeMailbox(messages []string, capacity int) chan string {
	// TODO: create a buffered channel, send each message, return the channel
	return nil
}

// Drain receives all values from ch until it is closed and returns them as a slice.
func Drain(ch chan int) []int {
	// TODO: use "for v := range ch" to collect values
	return nil
}

// Sum reads exactly count values from ch and returns their sum.
func Sum(ch chan int, count int) int {
	// TODO: receive count values from ch, add them up
	return 0
}`,
  testCode: `package main

import "testing"

func TestMakeMailbox(t *testing.T) {
	ch := MakeMailbox([]string{"a", "b", "c"}, 5)
	if got := <-ch; got != "a" {
		t.Errorf("first = %q, want %q", got, "a")
	}
	if got := <-ch; got != "b" {
		t.Errorf("second = %q, want %q", got, "b")
	}
	if got := <-ch; got != "c" {
		t.Errorf("third = %q, want %q", got, "c")
	}
}

func TestMakeMailboxEmpty(t *testing.T) {
	ch := MakeMailbox([]string{}, 1)
	if ch == nil {
		t.Fatal("returned nil channel")
	}
}

func TestDrain(t *testing.T) {
	ch := make(chan int, 3)
	ch <- 10
	ch <- 20
	ch <- 30
	close(ch)
	got := Drain(ch)
	want := []int{10, 20, 30}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestDrainEmpty(t *testing.T) {
	ch := make(chan int)
	close(ch)
	got := Drain(ch)
	if len(got) != 0 {
		t.Errorf("got %v, want empty", got)
	}
}

func TestSum(t *testing.T) {
	ch := make(chan int, 4)
	ch <- 1
	ch <- 2
	ch <- 3
	ch <- 4
	got := Sum(ch, 4)
	if got != 10 {
		t.Errorf("Sum = %d, want 10", got)
	}
}

func TestSumSingle(t *testing.T) {
	ch := make(chan int, 1)
	ch <- 42
	got := Sum(ch, 1)
	if got != 42 {
		t.Errorf("Sum = %d, want 42", got)
	}
}`,
  solution: `package main

func MakeMailbox(messages []string, capacity int) chan string {
	ch := make(chan string, capacity)
	for _, msg := range messages {
		ch <- msg
	}
	return ch
}

func Drain(ch chan int) []int {
	var result []int
	for v := range ch {
		result = append(result, v)
	}
	return result
}

func Sum(ch chan int, count int) int {
	total := 0
	for i := 0; i < count; i++ {
		total += <-ch
	}
	return total
}`,
  hints: [
    'MakeMailbox: make(chan string, capacity) creates the channel. Loop over messages and send each with ch <- msg.',
    'Drain: "for v := range ch" loops until the channel is closed. Append each v to a slice.',
    'Sum: use a for loop with count iterations. Each iteration receives from ch with <-ch and adds to a running total.',
  ],
}

export default exercise
