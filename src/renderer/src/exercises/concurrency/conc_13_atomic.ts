import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_13_atomic',
  title: 'Atomic Operations',
  category: 'Concurrency',
  subcategory: 'Sync Primitives',
  difficulty: 'intermediate',
  order: 13,
  description: `The \`sync/atomic\` package provides low-level atomic operations — faster than mutexes for simple values:

\`\`\`
var counter int64

atomic.AddInt64(&counter, 1)        // atomic increment
val := atomic.LoadInt64(&counter)    // atomic read
atomic.StoreInt64(&counter, 0)       // atomic write
\`\`\`

Go 1.19+ introduced typed atomics:
\`\`\`
var counter atomic.Int64
counter.Add(1)
val := counter.Load()
counter.Store(0)
\`\`\`

Use atomics for:
- Simple counters and flags
- Statistics collection
- Lock-free algorithms

Use mutexes when you need to protect **multiple values** or **complex operations**.

Your task: use atomic operations for thread-safe counters and flags.`,
  code: `package main

import "sync/atomic"

// AtomicCounter is a lock-free counter using atomic.Int64.
type AtomicCounter struct {
	// TODO: Use atomic.Int64
}

func NewAtomicCounter() *AtomicCounter {
	return &AtomicCounter{}
}

// Add increments the counter by delta and returns the new value.
func (c *AtomicCounter) Add(delta int64) int64 {
	// TODO
	return 0
}

// Value returns the current count.
func (c *AtomicCounter) Value() int64 {
	// TODO
	return 0
}

// Reset sets the counter to 0 and returns the old value.
func (c *AtomicCounter) Reset() int64 {
	// TODO: Use Swap
	return 0
}

// Flag is an atomic boolean (thread-safe on/off switch).
type Flag struct {
	// TODO: Use atomic.Bool
}

func NewFlag() *Flag {
	return &Flag{}
}

func (f *Flag) Set()        { /* TODO */ }
func (f *Flag) Clear()      { /* TODO */ }
func (f *Flag) IsSet() bool { /* TODO */ return false }

// Toggle flips the flag and returns the NEW value.
func (f *Flag) Toggle() bool {
	// TODO: Use CompareAndSwap in a loop
	return false
}

var _ = atomic.Int64{}`,
  testCode: `package main

import (
	"sync"
	"testing"
)

func TestAtomicCounterBasic(t *testing.T) {
	c := NewAtomicCounter()
	if v := c.Value(); v != 0 {
		t.Errorf("initial = %d, want 0", v)
	}
	c.Add(5)
	c.Add(3)
	if v := c.Value(); v != 8 {
		t.Errorf("after adds = %d, want 8", v)
	}
}

func TestAtomicCounterAddReturns(t *testing.T) {
	c := NewAtomicCounter()
	got := c.Add(10)
	if got != 10 {
		t.Errorf("Add(10) returned %d, want 10", got)
	}
	got = c.Add(5)
	if got != 15 {
		t.Errorf("Add(5) returned %d, want 15", got)
	}
}

func TestAtomicCounterReset(t *testing.T) {
	c := NewAtomicCounter()
	c.Add(42)
	old := c.Reset()
	if old != 42 {
		t.Errorf("Reset returned %d, want 42", old)
	}
	if v := c.Value(); v != 0 {
		t.Errorf("after reset = %d, want 0", v)
	}
}

func TestAtomicCounterConcurrent(t *testing.T) {
	c := NewAtomicCounter()
	var wg sync.WaitGroup
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			c.Add(1)
		}()
	}
	wg.Wait()
	if v := c.Value(); v != 1000 {
		t.Errorf("concurrent count = %d, want 1000", v)
	}
}

func TestFlagBasic(t *testing.T) {
	f := NewFlag()
	if f.IsSet() {
		t.Error("new flag should not be set")
	}
	f.Set()
	if !f.IsSet() {
		t.Error("flag should be set after Set()")
	}
	f.Clear()
	if f.IsSet() {
		t.Error("flag should not be set after Clear()")
	}
}

func TestFlagToggle(t *testing.T) {
	f := NewFlag()
	got := f.Toggle() // false → true
	if !got {
		t.Error("Toggle should return true (new value)")
	}
	got = f.Toggle() // true → false
	if got {
		t.Error("Toggle should return false (new value)")
	}
}

func TestFlagConcurrent(t *testing.T) {
	f := NewFlag()
	var wg sync.WaitGroup
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			f.Toggle()
		}()
	}
	wg.Wait()
	// 1000 toggles (even) should return to original state
	if f.IsSet() {
		t.Error("1000 toggles should return to original (false)")
	}
}`,
  solution: `package main

import "sync/atomic"

type AtomicCounter struct {
	val atomic.Int64
}

func NewAtomicCounter() *AtomicCounter {
	return &AtomicCounter{}
}

func (c *AtomicCounter) Add(delta int64) int64 {
	return c.val.Add(delta)
}

func (c *AtomicCounter) Value() int64 {
	return c.val.Load()
}

func (c *AtomicCounter) Reset() int64 {
	return c.val.Swap(0)
}

type Flag struct {
	val atomic.Bool
}

func NewFlag() *Flag {
	return &Flag{}
}

func (f *Flag) Set()        { f.val.Store(true) }
func (f *Flag) Clear()      { f.val.Store(false) }
func (f *Flag) IsSet() bool { return f.val.Load() }

func (f *Flag) Toggle() bool {
	for {
		old := f.val.Load()
		if f.val.CompareAndSwap(old, !old) {
			return !old
		}
	}
}

var _ = atomic.Int64{}`,
  hints: [
    'AtomicCounter: use atomic.Int64. Add returns the new value, Swap returns the old value and sets the new one.',
    'Flag: use atomic.Bool. Set/Clear use Store(true)/Store(false), IsSet uses Load().',
    'Toggle: use a CAS loop: load current, try CompareAndSwap(old, !old), retry if it fails (another goroutine changed it).'
  ],
}

export default exercise
