import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_21_time_ticker',
  title: 'time.Ticker & Timer',
  category: 'Standard Library',
  subcategory: 'Time',
  difficulty: 'intermediate',
  order: 21,
  description: `Tickers and timers schedule future or periodic events:

\`\`\`
// Timer fires once after a duration
timer := time.NewTimer(2 * time.Second)
<-timer.C  // blocks until timer fires

// Ticker fires repeatedly at an interval
ticker := time.NewTicker(500 * time.Millisecond)
defer ticker.Stop()  // always stop tickers!
for t := range ticker.C {
    fmt.Println("Tick at", t)
}
\`\`\`

\`time.After(d)\` is a shortcut that returns a channel:
\`\`\`
select {
case <-time.After(1 * time.Second):
    fmt.Println("timeout!")
}
\`\`\`

Your task: use tickers and timers to control timing.`,
  code: `package main

import (
	"time"
)

// CollectTicks collects n tick timestamps from a ticker with the given interval.
// Returns the collected times.
func CollectTicks(interval time.Duration, n int) []time.Time {
	// TODO: Create a ticker, collect n ticks, stop the ticker
	return nil
}

// TimeoutOr runs fn in a goroutine. If it completes before timeout,
// return its result and true. If timeout expires first, return "" and false.
func TimeoutOr(fn func() string, timeout time.Duration) (string, bool) {
	// TODO: Use select with time.After and a channel for fn's result
	return "", false
}

// Debounce returns a function that delays calling fn until after
// 'delay' has elapsed since the last call. Each new call resets the timer.
// The returned stop function cancels any pending call.
func Debounce(fn func(), delay time.Duration) (call func(), stop func()) {
	// TODO: Use a timer that resets on each call
	return nil, nil
}

var _ = time.Now`,
  testCode: `package main

import (
	"testing"
	"time"
)

func TestCollectTicks(t *testing.T) {
	start := time.Now()
	ticks := CollectTicks(50*time.Millisecond, 3)
	elapsed := time.Since(start)

	if len(ticks) != 3 {
		t.Fatalf("got %d ticks, want 3", len(ticks))
	}
	if elapsed < 140*time.Millisecond {
		t.Errorf("too fast: %v", elapsed)
	}
	// Each tick should be after the previous
	for i := 1; i < len(ticks); i++ {
		if !ticks[i].After(ticks[i-1]) {
			t.Errorf("tick %d not after tick %d", i, i-1)
		}
	}
}

func TestTimeoutOrSuccess(t *testing.T) {
	result, ok := TimeoutOr(func() string {
		time.Sleep(10 * time.Millisecond)
		return "done"
	}, 1*time.Second)
	if !ok || result != "done" {
		t.Errorf("got %q, %v", result, ok)
	}
}

func TestTimeoutOrTimeout(t *testing.T) {
	result, ok := TimeoutOr(func() string {
		time.Sleep(1 * time.Second)
		return "done"
	}, 50*time.Millisecond)
	if ok || result != "" {
		t.Errorf("expected timeout, got %q, %v", result, ok)
	}
}

func TestDebounce(t *testing.T) {
	count := 0
	call, stop := Debounce(func() { count++ }, 100*time.Millisecond)
	defer stop()

	// Rapid calls should only trigger once
	call()
	call()
	call()
	time.Sleep(200 * time.Millisecond)
	if count != 1 {
		t.Errorf("got count=%d, want 1 (debounced)", count)
	}
}

func TestDebounceStop(t *testing.T) {
	count := 0
	call, stop := Debounce(func() { count++ }, 100*time.Millisecond)

	call()
	stop()
	time.Sleep(200 * time.Millisecond)
	if count != 0 {
		t.Errorf("got count=%d, want 0 (stopped)", count)
	}
}`,
  solution: `package main

import (
	"time"
)

func CollectTicks(interval time.Duration, n int) []time.Time {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	ticks := make([]time.Time, 0, n)
	for i := 0; i < n; i++ {
		t := <-ticker.C
		ticks = append(ticks, t)
	}
	return ticks
}

func TimeoutOr(fn func() string, timeout time.Duration) (string, bool) {
	ch := make(chan string, 1)
	go func() {
		ch <- fn()
	}()
	select {
	case result := <-ch:
		return result, true
	case <-time.After(timeout):
		return "", false
	}
}

func Debounce(fn func(), delay time.Duration) (call func(), stop func()) {
	var timer *time.Timer
	call = func() {
		if timer != nil {
			timer.Stop()
		}
		timer = time.AfterFunc(delay, fn)
	}
	stop = func() {
		if timer != nil {
			timer.Stop()
		}
	}
	return call, stop
}

var _ = time.Now`,
  hints: [
    'CollectTicks: time.NewTicker(interval), read from ticker.C n times, defer ticker.Stop().',
    'TimeoutOr: run fn in a goroutine sending result on a channel. Use select with time.After(timeout).',
    'Debounce: use time.AfterFunc(delay, fn). On each call, stop the old timer and create a new one.'
  ],
}

export default exercise
