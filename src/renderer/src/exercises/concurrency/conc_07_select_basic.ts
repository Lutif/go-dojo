import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_07_select_basic',
  title: 'Select Basic',
  category: 'Concurrency',
  subcategory: 'Select',
  difficulty: 'intermediate',
  order: 7,
  description: `\`select\` lets you wait on multiple channel operations simultaneously:

\`\`\`
select {
case msg := <-ch1:
    fmt.Println("from ch1:", msg)
case msg := <-ch2:
    fmt.Println("from ch2:", msg)
}
\`\`\`

Key behaviors:
- Blocks until **one** case is ready
- If **multiple** cases are ready, one is chosen **at random**
- Great for multiplexing multiple channels

Common pattern — first result wins:
\`\`\`
func fastest(a, b <-chan string) string {
    select {
    case v := <-a: return v
    case v := <-b: return v
    }
}
\`\`\`

Your task: use select to coordinate multiple channels.`,
  code: `package main

// First returns whichever channel produces a value first.
func First(a, b <-chan string) string {
	// TODO: Use select to return the first available value
	return ""
}

// Merge reads from two channels and sends all values on the returned channel.
// Closes the output when BOTH inputs are closed.
func Merge(a, b <-chan int) <-chan int {
	// TODO: Use select in a goroutine to read from both channels
	// Track when each is closed, close output when both are done
	return nil
}

// Either sends val on whichever channel (a or b) is ready first.
// Returns "a" or "b" indicating which channel accepted the value.
func Either(a, b chan<- int, val int) string {
	// TODO: Use select to send on whichever is ready
	return ""
}`,
  testCode: `package main

import (
	"testing"
	"time"
)

func TestFirstA(t *testing.T) {
	a := make(chan string, 1)
	b := make(chan string, 1)
	a <- "alpha"
	got := First(a, b)
	if got != "alpha" {
		t.Errorf("got %q, want alpha", got)
	}
}

func TestFirstB(t *testing.T) {
	a := make(chan string, 1)
	b := make(chan string, 1)
	b <- "beta"
	got := First(a, b)
	if got != "beta" {
		t.Errorf("got %q, want beta", got)
	}
}

func TestMerge(t *testing.T) {
	a := make(chan int, 3)
	b := make(chan int, 3)
	a <- 1
	a <- 2
	close(a)
	b <- 3
	b <- 4
	close(b)

	out := Merge(a, b)
	var got []int
	done := make(chan bool)
	go func() {
		for v := range out {
			got = append(got, v)
		}
		done <- true
	}()

	select {
	case <-done:
	case <-time.After(2 * time.Second):
		t.Fatal("Merge timed out")
	}

	if len(got) != 4 {
		t.Fatalf("got %d values, want 4: %v", len(got), got)
	}
	sum := 0
	for _, v := range got {
		sum += v
	}
	if sum != 10 {
		t.Errorf("sum = %d, want 10", sum)
	}
}

func TestEither(t *testing.T) {
	a := make(chan int, 1)
	b := make(chan int, 1)
	which := Either(a, b, 42)
	if which != "a" && which != "b" {
		t.Errorf("got %q, want a or b", which)
	}
	// Verify the value was actually sent
	if which == "a" {
		if v := <-a; v != 42 {
			t.Errorf("a received %d, want 42", v)
		}
	} else {
		if v := <-b; v != 42 {
			t.Errorf("b received %d, want 42", v)
		}
	}
}`,
  solution: `package main

func First(a, b <-chan string) string {
	select {
	case v := <-a:
		return v
	case v := <-b:
		return v
	}
}

func Merge(a, b <-chan int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for a != nil || b != nil {
			select {
			case v, ok := <-a:
				if !ok {
					a = nil
					continue
				}
				out <- v
			case v, ok := <-b:
				if !ok {
					b = nil
					continue
				}
				out <- v
			}
		}
	}()
	return out
}

func Either(a, b chan<- int, val int) string {
	select {
	case a <- val:
		return "a"
	case b <- val:
		return "b"
	}
}`,
  hints: [
    'First: select { case v := <-a: return v; case v := <-b: return v } — whichever is ready first wins.',
    'Merge: use select in a loop. When a channel is closed (ok == false), set it to nil — select skips nil channels. Exit when both are nil.',
    'Either: select on send operations: case a <- val: return "a"; case b <- val: return "b"'
  ],
}

export default exercise
