import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_06_range_channel',
  title: 'Range over Channel',
  category: 'Concurrency',
  subcategory: 'Channels',
  difficulty: 'beginner',
  order: 6,
  description: `\`for range\` on a channel reads values until it's closed:

\`\`\`
ch := make(chan int)
go func() {
    ch <- 1
    ch <- 2
    ch <- 3
    close(ch)
}()

for v := range ch {
    fmt.Println(v)  // prints 1, 2, 3
}
\`\`\`

Important rules:
- **Only the sender should close** a channel
- Sending on a closed channel **panics**
- Receiving from a closed channel returns the **zero value** immediately
- You can check: \`v, ok := <-ch\` — \`ok\` is false if closed and empty

Your task: use range and close to process streams of data.`,
  code: `package main

// Squares sends the squares of 1..n on the returned channel.
func Squares(n int) <-chan int {
	// TODO: Create channel, goroutine sends i*i for i=1..n, close
	return nil
}

// Filter reads from in, sends values where fn returns true, closes out.
func Filter(in <-chan int, fn func(int) bool) <-chan int {
	// TODO
	return nil
}

// Take reads at most n values from ch and returns them as a slice.
// Stops early if ch is closed.
func Take(ch <-chan int, n int) []int {
	// TODO: Read up to n values
	return nil
}

// Drain reads and discards all values from ch until it's closed.
// Returns the count of values drained.
func Drain(ch <-chan int) int {
	// TODO
	return 0
}`,
  testCode: `package main

import "testing"

func TestSquares(t *testing.T) {
	ch := Squares(5)
	var got []int
	for v := range ch {
		got = append(got, v)
	}
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

func TestSquaresZero(t *testing.T) {
	ch := Squares(0)
	var got []int
	for v := range ch {
		got = append(got, v)
	}
	if len(got) != 0 {
		t.Errorf("got %v, want empty", got)
	}
}

func TestFilter(t *testing.T) {
	src := Squares(6) // 1, 4, 9, 16, 25, 36
	evens := Filter(src, func(n int) bool { return n%2 == 0 })
	var got []int
	for v := range evens {
		got = append(got, v)
	}
	want := []int{4, 16, 36}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestTake(t *testing.T) {
	ch := Squares(10)
	got := Take(ch, 3)
	want := []int{1, 4, 9}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestTakeMoreThanAvailable(t *testing.T) {
	ch := Squares(2)
	got := Take(ch, 10)
	if len(got) != 2 {
		t.Errorf("got %d values, want 2", len(got))
	}
}

func TestDrain(t *testing.T) {
	ch := Squares(5)
	count := Drain(ch)
	if count != 5 {
		t.Errorf("drained %d, want 5", count)
	}
}

func TestDrainEmpty(t *testing.T) {
	ch := Squares(0)
	count := Drain(ch)
	if count != 0 {
		t.Errorf("drained %d, want 0", count)
	}
}`,
  solution: `package main

func Squares(n int) <-chan int {
	ch := make(chan int)
	go func() {
		for i := 1; i <= n; i++ {
			ch <- i * i
		}
		close(ch)
	}()
	return ch
}

func Filter(in <-chan int, fn func(int) bool) <-chan int {
	out := make(chan int)
	go func() {
		for v := range in {
			if fn(v) {
				out <- v
			}
		}
		close(out)
	}()
	return out
}

func Take(ch <-chan int, n int) []int {
	var result []int
	for i := 0; i < n; i++ {
		v, ok := <-ch
		if !ok {
			break
		}
		result = append(result, v)
	}
	return result
}

func Drain(ch <-chan int) int {
	count := 0
	for range ch {
		count++
	}
	return count
}`,
  hints: [
    'Squares: in a goroutine, send i*i for i = 1..n, then close the channel.',
    'Filter: range over in, check fn(v), send matching values to out. Close out when in is exhausted.',
    'Take: use v, ok := <-ch to detect if the channel is closed. Stop after n values or when ok is false.'
  ],
}

export default exercise
