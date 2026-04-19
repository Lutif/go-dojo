import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_05_channel_direction',
  title: 'Channel Direction',
  category: 'Concurrency',
  subcategory: 'Channels',
  difficulty: 'beginner',
  order: 5,
  description: `Channel types can specify direction, enforced at compile time:

\`\`\`
chan T      // bidirectional — can send and receive
chan<- T    // send-only — can only send
<-chan T    // receive-only — can only receive
\`\`\`

A bidirectional channel converts implicitly to either direction:
\`\`\`
func producer(out chan<- int) { out <- 42 }  // can only send
func consumer(in <-chan int)  { v := <-in }  // can only receive

ch := make(chan int)
go producer(ch)  // ch converts to chan<- int
go consumer(ch)  // ch converts to <-chan int
\`\`\`

This prevents bugs: a producer can't accidentally read, a consumer can't accidentally write.

Your task: use directional channels to enforce communication patterns.`,
  code: `package main

// Produce sends values 1..n on the send-only channel, then closes it.
func Produce(out chan<- int, n int) {
	// TODO: Send 1..n, then close
}

// Consume reads all values from the receive-only channel and returns their sum.
func Consume(in <-chan int) int {
	// TODO: Range over in, sum values
	return 0
}

// Transform reads from in, applies fn to each value, sends to out.
// Closes out when in is exhausted.
func Transform(in <-chan int, out chan<- int, fn func(int) int) {
	// TODO
}

// Pipeline connects Produce → Transform → Consume.
// Produces 1..n, doubles each value, returns the sum of doubled values.
func Pipeline(n int) int {
	// TODO: Wire up the three functions using channels
	return 0
}`,
  testCode: `package main

import (
	"testing"
	"time"
)

func TestProduceConsume(t *testing.T) {
	ch := make(chan int)
	go Produce(ch, 5)
	got := Consume(ch)
	if got != 15 {
		t.Errorf("sum = %d, want 15", got)
	}
}

func TestProduceConsumeOne(t *testing.T) {
	ch := make(chan int)
	go Produce(ch, 1)
	got := Consume(ch)
	if got != 1 {
		t.Errorf("sum = %d, want 1", got)
	}
}

func TestTransform(t *testing.T) {
	in := make(chan int, 3)
	out := make(chan int, 3)
	in <- 1
	in <- 2
	in <- 3
	close(in)
	Transform(in, out, func(x int) int { return x * 10 })
	got := []int{<-out, <-out, <-out}
	want := []int{10, 20, 30}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestPipeline(t *testing.T) {
	done := make(chan int, 1)
	go func() {
		done <- Pipeline(5)
	}()
	select {
	case got := <-done:
		// 1+2+3+4+5 = 15, doubled = 2+4+6+8+10 = 30
		if got != 30 {
			t.Errorf("Pipeline(5) = %d, want 30", got)
		}
	case <-time.After(2 * time.Second):
		t.Fatal("Pipeline timed out")
	}
}

func TestPipelineOne(t *testing.T) {
	done := make(chan int, 1)
	go func() {
		done <- Pipeline(1)
	}()
	select {
	case got := <-done:
		if got != 2 {
			t.Errorf("Pipeline(1) = %d, want 2", got)
		}
	case <-time.After(2 * time.Second):
		t.Fatal("timed out")
	}
}`,
  solution: `package main

func Produce(out chan<- int, n int) {
	for i := 1; i <= n; i++ {
		out <- i
	}
	close(out)
}

func Consume(in <-chan int) int {
	sum := 0
	for v := range in {
		sum += v
	}
	return sum
}

func Transform(in <-chan int, out chan<- int, fn func(int) int) {
	for v := range in {
		out <- fn(v)
	}
	close(out)
}

func Pipeline(n int) int {
	produced := make(chan int)
	transformed := make(chan int)

	go Produce(produced, n)
	go Transform(produced, transformed, func(x int) int { return x * 2 })
	return Consume(transformed)
}`,
  hints: [
    'Produce: loop from 1 to n, send each on out, then close(out). The chan<- type means you can only send.',
    'Transform: range over in, apply fn to each value, send to out. Close out when done.',
    'Pipeline: create two channels, launch Produce and Transform as goroutines, call Consume in the current goroutine (it blocks until done).'
  ],
}

export default exercise
