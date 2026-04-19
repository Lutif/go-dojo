import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_09_select_timeout',
  title: 'Select Timeout',
  category: 'Concurrency',
  subcategory: 'Select',
  difficulty: 'intermediate',
  order: 9,
  description: `\`time.After\` returns a channel that sends after a duration, perfect for timeouts:

\`\`\`
select {
case result := <-work:
    fmt.Println("got result:", result)
case <-time.After(3 * time.Second):
    fmt.Println("timed out!")
}
\`\`\`

For repeated operations, use \`time.NewTicker\`:
\`\`\`
ticker := time.NewTicker(500 * time.Millisecond)
defer ticker.Stop()
for {
    select {
    case <-ticker.C:
        fmt.Println("tick")
    case <-done:
        return
    }
}
\`\`\`

Your task: implement timeout and ticker patterns.`,
  code: `package main

import (
	"errors"
	"time"
)

// WithTimeout waits for a value from ch for at most the given duration.
// Returns the value and nil on success, or (zero, error) on timeout.
func WithTimeout(ch <-chan string, timeout time.Duration) (string, error) {
	// TODO: Use select with time.After
	return "", nil
}

// Debounce returns a function that, when called, waits for 'delay'
// before sending the latest value. If called again within the delay,
// the timer resets. Sends values on the returned channel.
// For simplicity: return channel and a send function.
func Debounce(delay time.Duration) (chan string, func(string)) {
	// TODO: This is a simplified version
	// Return a channel and a function that sends the value after delay
	return nil, nil
}

// TickCollect collects values from ch, batching them by interval.
// Every 'interval' duration, it sends the batch (as a slice) on the output channel.
// Stops when ch is closed, sending any remaining batch.
func TickCollect(ch <-chan int, interval time.Duration) <-chan []int {
	// TODO
	return nil
}

var _ = errors.New
var _ = time.After`,
  testCode: `package main

import (
	"testing"
	"time"
)

func TestWithTimeoutSuccess(t *testing.T) {
	ch := make(chan string, 1)
	ch <- "hello"
	val, err := WithTimeout(ch, time.Second)
	if err != nil || val != "hello" {
		t.Errorf("got (%q, %v), want (hello, nil)", val, err)
	}
}

func TestWithTimeoutExpired(t *testing.T) {
	ch := make(chan string)
	_, err := WithTimeout(ch, 50*time.Millisecond)
	if err == nil {
		t.Error("expected timeout error")
	}
}

func TestDebounce(t *testing.T) {
	ch, send := Debounce(100 * time.Millisecond)
	send("first")
	send("second")
	send("third") // only this should arrive
	select {
	case got := <-ch:
		if got != "third" {
			t.Errorf("got %q, want third", got)
		}
	case <-time.After(time.Second):
		t.Fatal("timed out waiting for debounced value")
	}
}

func TestTickCollect(t *testing.T) {
	in := make(chan int, 10)
	for i := 1; i <= 5; i++ {
		in <- i
	}
	close(in)

	out := TickCollect(in, 50*time.Millisecond)
	var batches [][]int
	for batch := range out {
		batches = append(batches, batch)
	}

	// All 5 values should appear across batches
	total := 0
	for _, batch := range batches {
		total += len(batch)
	}
	if total != 5 {
		t.Errorf("got %d total values, want 5", total)
	}
}`,
  solution: `package main

import (
	"errors"
	"time"
)

func WithTimeout(ch <-chan string, timeout time.Duration) (string, error) {
	select {
	case val := <-ch:
		return val, nil
	case <-time.After(timeout):
		return "", errors.New("timeout")
	}
}

func Debounce(delay time.Duration) (chan string, func(string)) {
	ch := make(chan string, 1)
	var timer *time.Timer

	send := func(val string) {
		if timer != nil {
			timer.Stop()
		}
		timer = time.AfterFunc(delay, func() {
			ch <- val
		})
	}

	return ch, send
}

func TickCollect(ch <-chan int, interval time.Duration) <-chan []int {
	out := make(chan []int)
	go func() {
		defer close(out)
		ticker := time.NewTicker(interval)
		defer ticker.Stop()
		var batch []int
		for {
			select {
			case v, ok := <-ch:
				if !ok {
					if len(batch) > 0 {
						out <- batch
					}
					return
				}
				batch = append(batch, v)
			case <-ticker.C:
				if len(batch) > 0 {
					out <- batch
					batch = nil
				}
			}
		}
	}()
	return out
}

var _ = time.After`,
  hints: [
    'WithTimeout: select { case val := <-ch: return val, nil; case <-time.After(timeout): return "", errors.New("timeout") }',
    'Debounce: use time.AfterFunc(delay, func() { ch <- val }). Stop the previous timer each time send is called.',
    'TickCollect: use select with ticker.C and ch. Accumulate values in a batch slice, flush on tick. Flush remaining when ch closes.'
  ],
}

export default exercise
