import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_15_context_cancel',
  title: 'Context Cancel',
  category: 'Concurrency',
  subcategory: 'Context',
  difficulty: 'intermediate',
  order: 15,
  description: `\`context.WithCancel\` creates a context that can be explicitly cancelled:

\`\`\`
ctx, cancel := context.WithCancel(context.Background())
defer cancel() // always call cancel to release resources!

go func(ctx context.Context) {
    for {
        select {
        case <-ctx.Done():
            fmt.Println("stopped:", ctx.Err())
            return
        default:
            doWork()
        }
    }
}(ctx)

// Later...
cancel() // signals all goroutines using this context
\`\`\`

Important: **always call cancel()**, even if the context expires naturally. This prevents resource leaks.

Cancellation is **propagated**: cancelling a parent cancels all children.

Your task: use context cancellation to control goroutine lifecycles.`,
  code: `package main

import (
	"context"
)

// Generate sends sequential numbers (0, 1, 2, ...) on the returned channel
// until the context is cancelled. Closes the channel on exit.
func Generate(ctx context.Context) <-chan int {
	// TODO
	return nil
}

// TakeUntilCancel reads from ch until ctx is cancelled.
// Returns all values read.
func TakeUntilCancel(ctx context.Context, ch <-chan int) []int {
	// TODO
	return nil
}

// CancelAfterN creates a context that auto-cancels after reading n values.
// Returns the cancel function and a channel that receives the values.
func CancelAfterN(parent context.Context, source <-chan int, n int) ([]int, context.CancelFunc) {
	// TODO: Create context with cancel
	// Read n values from source, cancel, return values and cancel func
	return nil, nil
}`,
  testCode: `package main

import (
	"context"
	"testing"
	"time"
)

func TestGenerate(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	ch := Generate(ctx)

	// Read a few values
	for i := 0; i < 5; i++ {
		select {
		case v := <-ch:
			if v != i {
				t.Errorf("got %d, want %d", v, i)
			}
		case <-time.After(time.Second):
			t.Fatalf("timed out at value %d", i)
		}
	}
	cancel()

	// Channel should eventually close
	time.Sleep(10 * time.Millisecond)
	_, ok := <-ch
	// After cancel, channel may have one more value buffered or be closed
	// Just verify it doesn't hang forever
	if ok {
		// drain one more
		select {
		case <-ch:
		case <-time.After(100 * time.Millisecond):
		}
	}
}

func TestTakeUntilCancel(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	ch := make(chan int, 10)
	for i := 0; i < 10; i++ {
		ch <- i
	}

	go func() {
		time.Sleep(50 * time.Millisecond)
		cancel()
	}()

	got := TakeUntilCancel(ctx, ch)
	if len(got) == 0 {
		t.Error("should have read some values before cancel")
	}
	if len(got) > 10 {
		t.Errorf("got %d values, max expected 10", len(got))
	}
}

func TestCancelAfterN(t *testing.T) {
	ctx := context.Background()
	src := make(chan int, 20)
	for i := 0; i < 20; i++ {
		src <- i
	}

	values, cancel := CancelAfterN(ctx, src, 5)
	defer cancel()

	if len(values) != 5 {
		t.Fatalf("got %d values, want 5", len(values))
	}
	for i := 0; i < 5; i++ {
		if values[i] != i {
			t.Errorf("values[%d] = %d, want %d", i, values[i], i)
		}
	}
}`,
  solution: `package main

import (
	"context"
)

func Generate(ctx context.Context) <-chan int {
	ch := make(chan int)
	go func() {
		defer close(ch)
		i := 0
		for {
			select {
			case <-ctx.Done():
				return
			case ch <- i:
				i++
			}
		}
	}()
	return ch
}

func TakeUntilCancel(ctx context.Context, ch <-chan int) []int {
	var result []int
	for {
		select {
		case <-ctx.Done():
			return result
		case v, ok := <-ch:
			if !ok {
				return result
			}
			result = append(result, v)
		}
	}
}

func CancelAfterN(parent context.Context, source <-chan int, n int) ([]int, context.CancelFunc) {
	ctx, cancel := context.WithCancel(parent)
	_ = ctx
	values := make([]int, 0, n)
	for i := 0; i < n; i++ {
		v, ok := <-source
		if !ok {
			break
		}
		values = append(values, v)
	}
	cancel()
	return values, cancel
}`,
  hints: [
    'Generate: use select with case ch <- i and case <-ctx.Done(). This sends values or stops when cancelled.',
    'TakeUntilCancel: select on ctx.Done() and ch. Return accumulated values when either the context is cancelled or the channel closes.',
    'CancelAfterN: create a child context with cancel, read n values, then call cancel() to signal completion.'
  ],
}

export default exercise
