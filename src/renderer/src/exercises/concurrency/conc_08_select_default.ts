import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_08_select_default',
  title: 'Select Default',
  category: 'Concurrency',
  subcategory: 'Select',
  difficulty: 'intermediate',
  order: 8,
  description: `A \`default\` case in select makes it **non-blocking**:

\`\`\`
select {
case msg := <-ch:
    fmt.Println("received:", msg)
default:
    fmt.Println("no message ready")
}
\`\`\`

Without \`default\`, select blocks until a case is ready.
With \`default\`, it runs the default case immediately if no channel is ready.

Common uses:
- **Non-blocking send**: try to send, skip if channel is full
- **Non-blocking receive**: check for a message without waiting
- **Polling loop**: check channels in a busy loop with work between checks

Your task: implement non-blocking channel operations.`,
  code: `package main

// TrySend attempts to send val on ch without blocking.
// Returns true if sent, false if channel was full.
func TrySend(ch chan<- int, val int) bool {
	// TODO: Use select with default
	return false
}

// TryReceive attempts to read from ch without blocking.
// Returns (value, true) if a value was available, (0, false) otherwise.
func TryReceive(ch <-chan int) (int, bool) {
	// TODO: Use select with default
	return 0, false
}

// FillChannel sends values 0, 1, 2, ... into ch until it's full.
// Returns how many values were sent.
func FillChannel(ch chan int) int {
	// TODO: Keep sending until TrySend returns false
	return 0
}

// DrainAvailable reads all immediately available values from ch.
// Returns them as a slice. Does NOT wait for new values.
func DrainAvailable(ch <-chan int) []int {
	// TODO: Keep reading with TryReceive until nothing available
	return nil
}`,
  testCode: `package main

import "testing"

func TestTrySendSuccess(t *testing.T) {
	ch := make(chan int, 1)
	if !TrySend(ch, 42) {
		t.Error("should succeed on empty buffered channel")
	}
	if v := <-ch; v != 42 {
		t.Errorf("got %d, want 42", v)
	}
}

func TestTrySendFull(t *testing.T) {
	ch := make(chan int, 1)
	ch <- 99
	if TrySend(ch, 42) {
		t.Error("should fail on full channel")
	}
}

func TestTryReceiveSuccess(t *testing.T) {
	ch := make(chan int, 1)
	ch <- 42
	val, ok := TryReceive(ch)
	if !ok || val != 42 {
		t.Errorf("got (%d, %v), want (42, true)", val, ok)
	}
}

func TestTryReceiveEmpty(t *testing.T) {
	ch := make(chan int, 1)
	_, ok := TryReceive(ch)
	if ok {
		t.Error("should return false on empty channel")
	}
}

func TestFillChannel(t *testing.T) {
	ch := make(chan int, 5)
	n := FillChannel(ch)
	if n != 5 {
		t.Errorf("filled %d, want 5", n)
	}
	if len(ch) != 5 {
		t.Errorf("channel has %d items, want 5", len(ch))
	}
}

func TestFillChannelZero(t *testing.T) {
	ch := make(chan int, 3)
	ch <- 1
	ch <- 2
	ch <- 3
	n := FillChannel(ch)
	if n != 0 {
		t.Errorf("filled %d, want 0 (already full)", n)
	}
}

func TestDrainAvailable(t *testing.T) {
	ch := make(chan int, 5)
	ch <- 10
	ch <- 20
	ch <- 30
	got := DrainAvailable(ch)
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

func TestDrainAvailableEmpty(t *testing.T) {
	ch := make(chan int, 5)
	got := DrainAvailable(ch)
	if len(got) != 0 {
		t.Errorf("got %v, want empty", got)
	}
}`,
  solution: `package main

func TrySend(ch chan<- int, val int) bool {
	select {
	case ch <- val:
		return true
	default:
		return false
	}
}

func TryReceive(ch <-chan int) (int, bool) {
	select {
	case v := <-ch:
		return v, true
	default:
		return 0, false
	}
}

func FillChannel(ch chan int) int {
	count := 0
	for i := 0; ; i++ {
		if !TrySend(ch, i) {
			break
		}
		count++
	}
	return count
}

func DrainAvailable(ch <-chan int) []int {
	var result []int
	for {
		v, ok := TryReceive(ch)
		if !ok {
			break
		}
		result = append(result, v)
	}
	return result
}`,
  hints: [
    'TrySend: select { case ch <- val: return true; default: return false }',
    'TryReceive: select { case v := <-ch: return v, true; default: return 0, false }',
    'FillChannel: loop calling TrySend(ch, i) until it returns false. Count successes.'
  ],
}

export default exercise
