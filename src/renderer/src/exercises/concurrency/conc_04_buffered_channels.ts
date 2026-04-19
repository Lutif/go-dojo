import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_04_buffered_channels',
  title: 'Buffered Channels',
  category: 'Concurrency',
  subcategory: 'Channels',
  difficulty: 'beginner',
  order: 4,
  description: `Buffered channels have capacity — sends don't block until the buffer is full:

\`\`\`
ch := make(chan int, 3) // buffer of 3
ch <- 1  // doesn't block
ch <- 2  // doesn't block
ch <- 3  // doesn't block
ch <- 4  // BLOCKS — buffer is full
\`\`\`

Useful functions:
- \`len(ch)\` — number of elements currently buffered
- \`cap(ch)\` — total buffer capacity

Buffered channels decouple sender and receiver timing. Use them when:
- You know how many values will be sent
- You want to avoid goroutine leaks (a sender won't block forever)
- You want a "mailbox" pattern

Your task: work with buffered channels.`,
  code: `package main

// BatchSend sends all values into a buffered channel sized to fit them all,
// then closes the channel. No goroutine needed!
func BatchSend(values []int) <-chan int {
	// TODO: Create a buffered channel with capacity len(values)
	// Send all values (won't block), close, return
	return nil
}

// Collect reads all values from a channel into a slice.
func Collect(ch <-chan int) []int {
	// TODO: Range over ch, append to slice
	return nil
}

// ProducerConsumer: producer sends n items (0 to n-1) on a buffered channel
// of the given bufSize. Returns the channel.
func ProducerConsumer(n, bufSize int) <-chan int {
	// TODO: Create buffered channel, send 0..n-1 in a goroutine, close
	return nil
}`,
  testCode: `package main

import (
	"testing"
	"time"
)

func TestBatchSend(t *testing.T) {
	ch := BatchSend([]int{10, 20, 30})
	var got []int
	for v := range ch {
		got = append(got, v)
	}
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

func TestBatchSendEmpty(t *testing.T) {
	ch := BatchSend([]int{})
	var got []int
	for v := range ch {
		got = append(got, v)
	}
	if len(got) != 0 {
		t.Errorf("got %v, want empty", got)
	}
}

func TestCollect(t *testing.T) {
	ch := make(chan int, 3)
	ch <- 1
	ch <- 2
	ch <- 3
	close(ch)
	got := Collect(ch)
	if len(got) != 3 || got[0] != 1 || got[1] != 2 || got[2] != 3 {
		t.Errorf("got %v, want [1 2 3]", got)
	}
}

func TestCollectEmpty(t *testing.T) {
	ch := make(chan int)
	close(ch)
	got := Collect(ch)
	if len(got) != 0 {
		t.Errorf("got %v, want empty", got)
	}
}

func TestProducerConsumer(t *testing.T) {
	ch := ProducerConsumer(5, 3)
	var got []int
	done := make(chan bool)
	go func() {
		for v := range ch {
			got = append(got, v)
		}
		done <- true
	}()
	select {
	case <-done:
	case <-time.After(2 * time.Second):
		t.Fatal("timed out")
	}
	want := []int{0, 1, 2, 3, 4}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}`,
  solution: `package main

func BatchSend(values []int) <-chan int {
	ch := make(chan int, len(values))
	for _, v := range values {
		ch <- v
	}
	close(ch)
	return ch
}

func Collect(ch <-chan int) []int {
	var result []int
	for v := range ch {
		result = append(result, v)
	}
	return result
}

func ProducerConsumer(n, bufSize int) <-chan int {
	ch := make(chan int, bufSize)
	go func() {
		for i := 0; i < n; i++ {
			ch <- i
		}
		close(ch)
	}()
	return ch
}`,
  hints: [
    'BatchSend: make(chan int, len(values)) gives you enough buffer for all values. Send them all in a loop — no goroutine needed since they won\'t block.',
    'Collect: use for v := range ch to read until the channel is closed.',
    'ProducerConsumer: you need a goroutine because n may exceed bufSize. The goroutine blocks on send when the buffer is full, resuming when the consumer reads.'
  ],
}

export default exercise
