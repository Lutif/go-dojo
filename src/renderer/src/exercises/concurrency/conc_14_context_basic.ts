import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_14_context_basic',
  title: 'Context Basic',
  category: 'Concurrency',
  subcategory: 'Context',
  difficulty: 'intermediate',
  order: 14,
  description: `\`context.Context\` carries deadlines, cancellation signals, and request-scoped values across API boundaries:

\`\`\`
func handleRequest(ctx context.Context) {
    // Check if context is still valid
    select {
    case <-ctx.Done():
        fmt.Println("cancelled:", ctx.Err())
        return
    default:
        // continue working
    }
}
\`\`\`

Creating contexts:
- \`context.Background()\` — root context, never cancelled
- \`context.TODO()\` — placeholder when you're unsure which context to use
- \`context.WithCancel(parent)\` — cancellable context
- \`context.WithTimeout(parent, duration)\` — auto-cancels after duration

Convention: context is always the **first parameter**, named \`ctx\`.

Your task: use context to control goroutine lifetime.`,
  code: `package main

import (
	"context"
	"fmt"
)

// DoWork performs work respecting context cancellation.
// Returns "done" if work completes, or ctx.Err().Error() if cancelled.
// The work is: iterate count times, checking ctx each iteration.
func DoWork(ctx context.Context, count int) string {
	// TODO: Loop count times, check ctx.Done() each iteration
	// Return "done" if loop completes
	return ""
}

// FirstResponse launches n goroutines that each call fn.
// Returns the first result. Uses context to cancel remaining goroutines.
func FirstResponse(ctx context.Context, n int, fn func(ctx context.Context) string) string {
	// TODO: Create a child context with cancel
	// Launch n goroutines, return the first result
	return ""
}

// ChainWork runs workA, then workB, passing context through.
// If workA fails (returns error), don't run workB.
func ChainWork(ctx context.Context, workA, workB func(context.Context) error) error {
	// TODO
	return nil
}

var _ = context.Background
var _ = fmt.Sprintf`,
  testCode: `package main

import (
	"context"
	"errors"
	"testing"
	"time"
)

func TestDoWorkCompletes(t *testing.T) {
	ctx := context.Background()
	got := DoWork(ctx, 5)
	if got != "done" {
		t.Errorf("DoWork = %q, want done", got)
	}
}

func TestDoWorkCancelled(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel() // cancel immediately
	got := DoWork(ctx, 1000000)
	if got != "context canceled" {
		t.Errorf("DoWork = %q, want 'context canceled'", got)
	}
}

func TestFirstResponse(t *testing.T) {
	ctx := context.Background()
	got := FirstResponse(ctx, 5, func(ctx context.Context) string {
		return "result"
	})
	if got != "result" {
		t.Errorf("FirstResponse = %q, want result", got)
	}
}

func TestFirstResponseWithTimeout(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	got := FirstResponse(ctx, 3, func(ctx context.Context) string {
		return "fast"
	})
	if got != "fast" {
		t.Errorf("got %q, want fast", got)
	}
}

func TestChainWorkBothSucceed(t *testing.T) {
	ctx := context.Background()
	err := ChainWork(ctx,
		func(ctx context.Context) error { return nil },
		func(ctx context.Context) error { return nil },
	)
	if err != nil {
		t.Errorf("expected nil, got %v", err)
	}
}

func TestChainWorkFirstFails(t *testing.T) {
	ctx := context.Background()
	bCalled := false
	err := ChainWork(ctx,
		func(ctx context.Context) error { return errors.New("fail A") },
		func(ctx context.Context) error { bCalled = true; return nil },
	)
	if err == nil {
		t.Error("expected error")
	}
	if bCalled {
		t.Error("workB should not run when workA fails")
	}
}

func TestChainWorkSecondFails(t *testing.T) {
	ctx := context.Background()
	err := ChainWork(ctx,
		func(ctx context.Context) error { return nil },
		func(ctx context.Context) error { return errors.New("fail B") },
	)
	if err == nil {
		t.Error("expected error from workB")
	}
}`,
  solution: `package main

import (
	"context"
	"fmt"
)

func DoWork(ctx context.Context, count int) string {
	for i := 0; i < count; i++ {
		select {
		case <-ctx.Done():
			return ctx.Err().Error()
		default:
		}
	}
	return "done"
}

func FirstResponse(ctx context.Context, n int, fn func(ctx context.Context) string) string {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	ch := make(chan string, n)
	for i := 0; i < n; i++ {
		go func() {
			ch <- fn(ctx)
		}()
	}
	return <-ch
}

func ChainWork(ctx context.Context, workA, workB func(context.Context) error) error {
	if err := workA(ctx); err != nil {
		return err
	}
	return workB(ctx)
}

var _ = context.Background
var _ = fmt.Sprintf`,
  hints: [
    'DoWork: in each loop iteration, use select { case <-ctx.Done(): return ctx.Err().Error(); default: } to check for cancellation.',
    'FirstResponse: create a buffered channel (size n), launch n goroutines, return <-ch for the first result. Defer cancel() to clean up others.',
    'ChainWork: call workA(ctx), check error, then call workB(ctx). Simple sequential chaining with context passed through.'
  ],
}

export default exercise
