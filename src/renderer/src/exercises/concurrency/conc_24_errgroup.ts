import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_24_errgroup',
  title: 'ErrGroup',
  category: 'Concurrency',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 24,
  description: `Go doesn't have a built-in ErrGroup, but you can build one! An ErrGroup combines WaitGroup + error collection:

\`\`\`
type ErrGroup struct { ... }

func (g *ErrGroup) Go(fn func() error)  // launch a goroutine
func (g *ErrGroup) Wait() error         // wait, return first error
\`\`\`

The standard library's version is in \`golang.org/x/sync/errgroup\`, but building your own teaches the pattern.

Key behavior:
- \`Go()\` launches a goroutine that can return an error
- \`Wait()\` blocks until all goroutines complete
- \`Wait()\` returns the **first** non-nil error (or nil if all succeed)

Your task: implement an ErrGroup from scratch.`,
  code: `package main

import (
	"errors"
	"sync"
)

// ErrGroup runs goroutines and collects the first error.
type ErrGroup struct {
	// TODO: Add WaitGroup, error storage, sync.Once for error
}

// NewErrGroup creates a new ErrGroup.
func NewErrGroup() *ErrGroup {
	// TODO
	return nil
}

// Go launches fn in a goroutine. If fn returns a non-nil error,
// it's stored as the group's error (only the first error is kept).
func (g *ErrGroup) Go(fn func() error) {
	// TODO
}

// Wait blocks until all goroutines complete.
// Returns the first error that occurred, or nil.
func (g *ErrGroup) Wait() error {
	// TODO
	return nil
}

// ParallelFetch simulates fetching data from multiple sources.
// Returns all results if successful, or the first error.
func ParallelFetch(sources []string, fetch func(string) (string, error)) ([]string, error) {
	// TODO: Use ErrGroup to fetch from all sources concurrently
	// Store results in a pre-allocated slice (index-based, no mutex needed)
	return nil, nil
}

var _ = errors.New
var _ = sync.Once{}`,
  testCode: `package main

import (
	"errors"
	"sync/atomic"
	"testing"
)

func TestErrGroupAllSucceed(t *testing.T) {
	g := NewErrGroup()
	var count int64
	for i := 0; i < 5; i++ {
		g.Go(func() error {
			atomic.AddInt64(&count, 1)
			return nil
		})
	}
	err := g.Wait()
	if err != nil {
		t.Errorf("expected nil, got %v", err)
	}
	if c := atomic.LoadInt64(&count); c != 5 {
		t.Errorf("count = %d, want 5", c)
	}
}

func TestErrGroupWithError(t *testing.T) {
	g := NewErrGroup()
	g.Go(func() error { return nil })
	g.Go(func() error { return errors.New("fail") })
	g.Go(func() error { return nil })
	err := g.Wait()
	if err == nil {
		t.Error("expected error")
	}
}

func TestErrGroupFirstError(t *testing.T) {
	g := NewErrGroup()
	g.Go(func() error { return errors.New("first") })
	g.Go(func() error { return errors.New("second") })
	err := g.Wait()
	if err == nil {
		t.Error("expected error")
	}
	// Should be one of the errors (first is non-deterministic with goroutines)
}

func TestErrGroupEmpty(t *testing.T) {
	g := NewErrGroup()
	err := g.Wait()
	if err != nil {
		t.Errorf("expected nil, got %v", err)
	}
}

func TestParallelFetchSuccess(t *testing.T) {
	sources := []string{"a", "b", "c"}
	results, err := ParallelFetch(sources, func(s string) (string, error) {
		return s + "_data", nil
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(results) != 3 {
		t.Fatalf("got %d results, want 3", len(results))
	}
	for i, s := range sources {
		if results[i] != s+"_data" {
			t.Errorf("results[%d] = %q, want %q", i, results[i], s+"_data")
		}
	}
}

func TestParallelFetchError(t *testing.T) {
	sources := []string{"good", "bad", "good"}
	_, err := ParallelFetch(sources, func(s string) (string, error) {
		if s == "bad" {
			return "", errors.New("fetch failed")
		}
		return s, nil
	})
	if err == nil {
		t.Error("expected error for bad source")
	}
}`,
  solution: `package main

import (
	"errors"
	"sync"
)

type ErrGroup struct {
	wg   sync.WaitGroup
	once sync.Once
	err  error
}

func NewErrGroup() *ErrGroup {
	return &ErrGroup{}
}

func (g *ErrGroup) Go(fn func() error) {
	g.wg.Add(1)
	go func() {
		defer g.wg.Done()
		if err := fn(); err != nil {
			g.once.Do(func() {
				g.err = err
			})
		}
	}()
}

func (g *ErrGroup) Wait() error {
	g.wg.Wait()
	return g.err
}

func ParallelFetch(sources []string, fetch func(string) (string, error)) ([]string, error) {
	results := make([]string, len(sources))
	g := NewErrGroup()

	for i, src := range sources {
		i, src := i, src
		g.Go(func() error {
			val, err := fetch(src)
			if err != nil {
				return err
			}
			results[i] = val
			return nil
		})
	}

	if err := g.Wait(); err != nil {
		return nil, err
	}
	return results, nil
}

var _ = errors.New
var _ = sync.Once{}`,
  hints: [
    'ErrGroup: use sync.WaitGroup for waiting, sync.Once to store only the first error.',
    'Go(): wg.Add(1), launch goroutine. In the goroutine: defer wg.Done(), if fn() returns error, once.Do(func() { g.err = err }).',
    'ParallelFetch: pre-allocate results slice, use ErrGroup. Each goroutine writes to results[i] — different indices, so no mutex needed.'
  ],
}

export default exercise
