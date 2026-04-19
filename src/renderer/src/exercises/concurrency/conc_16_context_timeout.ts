import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_16_context_timeout',
  title: 'Context Timeout',
  category: 'Concurrency',
  subcategory: 'Context',
  difficulty: 'intermediate',
  order: 16,
  description: `\`context.WithTimeout\` creates a context that auto-cancels after a duration:

\`\`\`
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel() // always defer cancel!

result, err := doSlowWork(ctx)
if err == context.DeadlineExceeded {
    fmt.Println("operation timed out")
}
\`\`\`

\`context.WithDeadline\` is similar but takes an absolute time:
\`\`\`
deadline := time.Now().Add(5 * time.Second)
ctx, cancel := context.WithDeadline(parent, deadline)
\`\`\`

Check remaining time with \`ctx.Deadline()\`:
\`\`\`
if deadline, ok := ctx.Deadline(); ok {
    remaining := time.Until(deadline)
}
\`\`\`

Your task: implement timeout-based patterns.`,
  code: `package main

import (
	"context"
	"errors"
	"time"
)

// SlowOperation simulates work that takes the given duration.
// Respects context — returns context error if cancelled/timed out.
func SlowOperation(ctx context.Context, duration time.Duration) (string, error) {
	// TODO: Use select with time.After(duration) and ctx.Done()
	return "", nil
}

// WithRetryTimeout retries fn until it succeeds or the timeout expires.
// Returns the first successful result or a timeout error.
func WithRetryTimeout(ctx context.Context, timeout time.Duration, fn func() (string, error)) (string, error) {
	// TODO: Create a timeout context, loop calling fn
	return "", nil
}

// RemainingTime returns the time remaining on the context's deadline.
// Returns 0 if no deadline is set.
func RemainingTime(ctx context.Context) time.Duration {
	// TODO: Use ctx.Deadline()
	return 0
}

var _ = errors.New
var _ = time.Second`,
  testCode: `package main

import (
	"context"
	"errors"
	"testing"
	"time"
)

func TestSlowOperationCompletes(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	got, err := SlowOperation(ctx, 10*time.Millisecond)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got != "completed" {
		t.Errorf("got %q, want completed", got)
	}
}

func TestSlowOperationTimeout(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
	defer cancel()
	_, err := SlowOperation(ctx, time.Second)
	if err == nil {
		t.Error("expected timeout error")
	}
}

func TestWithRetryTimeoutSuccess(t *testing.T) {
	ctx := context.Background()
	calls := 0
	got, err := WithRetryTimeout(ctx, time.Second, func() (string, error) {
		calls++
		if calls < 3 {
			return "", errors.New("not yet")
		}
		return "ok", nil
	})
	if err != nil || got != "ok" {
		t.Errorf("got (%q, %v), want (ok, nil)", got, err)
	}
}

func TestWithRetryTimeoutExpires(t *testing.T) {
	ctx := context.Background()
	_, err := WithRetryTimeout(ctx, 100*time.Millisecond, func() (string, error) {
		time.Sleep(50 * time.Millisecond)
		return "", errors.New("always fails")
	})
	if err == nil {
		t.Error("expected timeout error")
	}
}

func TestRemainingTimeWithDeadline(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	remaining := RemainingTime(ctx)
	if remaining <= 0 || remaining > time.Second {
		t.Errorf("remaining = %v, expected between 0 and 1s", remaining)
	}
}

func TestRemainingTimeNoDeadline(t *testing.T) {
	ctx := context.Background()
	remaining := RemainingTime(ctx)
	if remaining != 0 {
		t.Errorf("remaining = %v, want 0 for no deadline", remaining)
	}
}`,
  solution: `package main

import (
	"context"
	"errors"
	"time"
)

func SlowOperation(ctx context.Context, duration time.Duration) (string, error) {
	select {
	case <-time.After(duration):
		return "completed", nil
	case <-ctx.Done():
		return "", ctx.Err()
	}
}

func WithRetryTimeout(ctx context.Context, timeout time.Duration, fn func() (string, error)) (string, error) {
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	for {
		select {
		case <-ctx.Done():
			return "", ctx.Err()
		default:
		}
		val, err := fn()
		if err == nil {
			return val, nil
		}
	}
}

func RemainingTime(ctx context.Context) time.Duration {
	deadline, ok := ctx.Deadline()
	if !ok {
		return 0
	}
	remaining := time.Until(deadline)
	if remaining < 0 {
		return 0
	}
	return remaining
}

var _ = errors.New
var _ = time.Second`,
  hints: [
    'SlowOperation: select { case <-time.After(duration): return "completed", nil; case <-ctx.Done(): return "", ctx.Err() }',
    'WithRetryTimeout: create a timeout context, loop calling fn(). Check ctx.Done() before each call with a select/default.',
    'RemainingTime: deadline, ok := ctx.Deadline(). If !ok, return 0. Otherwise return time.Until(deadline).'
  ],
}

export default exercise
