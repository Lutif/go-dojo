import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_03_channels_basic',
  title: 'Channels Basic',
  category: 'Concurrency',
  subcategory: 'Channels',
  difficulty: 'beginner',
  order: 3,
  description: `Channels are Go's mechanism for goroutine communication. An **unbuffered** channel synchronizes sender and receiver:

\`\`\`
ch := make(chan int)    // unbuffered channel
go func() { ch <- 42 }()  // send (blocks until someone receives)
val := <-ch               // receive (blocks until someone sends)
\`\`\`

- Sending blocks until a receiver is ready
- Receiving blocks until a sender is ready
- This makes unbuffered channels a synchronization point

Your task: use channels to communicate between goroutines.`,
  code: `package main

// Sum sends the sum of nums on the returned channel.
func Sum(nums []int) <-chan int {
	// TODO: Create channel, launch goroutine to compute sum, send it
	return nil
}

// Ping sends "ping" on the channel, Pong receives from ping
// and sends "pong" on its own channel.
func Ping() <-chan string {
	// TODO: Return a channel that will receive "ping"
	return nil
}

func Pong(ping <-chan string) <-chan string {
	// TODO: Read from ping, send "pong" on returned channel
	return nil
}

// Generator returns a channel that produces the values in items, then closes.
func Generator(items []int) <-chan int {
	// TODO
	return nil
}`,
  testCode: `package main

import (
	"testing"
	"time"
)

func TestSum(t *testing.T) {
	ch := Sum([]int{1, 2, 3, 4, 5})
	select {
	case got := <-ch:
		if got != 15 {
			t.Errorf("Sum = %d, want 15", got)
		}
	case <-time.After(time.Second):
		t.Fatal("Sum timed out")
	}
}

func TestSumEmpty(t *testing.T) {
	ch := Sum([]int{})
	select {
	case got := <-ch:
		if got != 0 {
			t.Errorf("Sum([]) = %d, want 0", got)
		}
	case <-time.After(time.Second):
		t.Fatal("timed out")
	}
}

func TestPingPong(t *testing.T) {
	ping := Ping()
	pong := Pong(ping)
	select {
	case msg := <-pong:
		if msg != "pong" {
			t.Errorf("got %q, want pong", msg)
		}
	case <-time.After(time.Second):
		t.Fatal("PingPong timed out")
	}
}

func TestGenerator(t *testing.T) {
	ch := Generator([]int{10, 20, 30})
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

func TestGeneratorEmpty(t *testing.T) {
	ch := Generator([]int{})
	var got []int
	for v := range ch {
		got = append(got, v)
	}
	if len(got) != 0 {
		t.Errorf("got %v, want empty", got)
	}
}`,
  solution: `package main

func Sum(nums []int) <-chan int {
	ch := make(chan int, 1)
	go func() {
		total := 0
		for _, n := range nums {
			total += n
		}
		ch <- total
	}()
	return ch
}

func Ping() <-chan string {
	ch := make(chan string, 1)
	go func() {
		ch <- "ping"
	}()
	return ch
}

func Pong(ping <-chan string) <-chan string {
	ch := make(chan string, 1)
	go func() {
		<-ping // consume the ping
		ch <- "pong"
	}()
	return ch
}

func Generator(items []int) <-chan int {
	ch := make(chan int)
	go func() {
		for _, item := range items {
			ch <- item
		}
		close(ch)
	}()
	return ch
}`,
  hints: [
    'Sum: create a buffered channel (size 1), compute the sum in a goroutine, send the result.',
    'Pong: read from the ping channel (<-ping), then send "pong" on your own channel. The read blocks until Ping sends.',
    'Generator: loop over items, send each one, then close(ch) so the receiver\'s range loop exits.'
  ],
}

export default exercise
