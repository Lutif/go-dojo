import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_12_once',
  title: 'Once',
  category: 'Concurrency',
  subcategory: 'Sync Primitives',
  difficulty: 'intermediate',
  order: 12,
  description: `\`sync.Once\` ensures a function runs exactly once, even from multiple goroutines:

\`\`\`
var once sync.Once
var instance *Database

func GetDB() *Database {
    once.Do(func() {
        instance = connectToDatabase()  // runs exactly once
    })
    return instance
}
\`\`\`

\`once.Do(f)\` blocks all callers until \`f\` completes. This guarantees:
- The function runs **exactly once**
- All subsequent calls see the result of the first execution
- It's safe from multiple goroutines simultaneously

Common use: **lazy singleton initialization**.

Your task: implement lazy initialization patterns with sync.Once.`,
  code: `package main

import "sync"

// LazyValue holds a value that is computed only on first access.
type LazyValue struct {
	// TODO: Add sync.Once and fields for the value
	compute func() string
}

// NewLazyValue creates a LazyValue with the given compute function.
func NewLazyValue(compute func() string) *LazyValue {
	// TODO
	return nil
}

// Get returns the computed value. The compute function runs only once.
func (l *LazyValue) Get() string {
	// TODO: Use once.Do
	return ""
}

// Registry is a thread-safe registry where each key is initialized at most once.
type Registry struct {
	// TODO: Add sync.Mutex, map of key → value, map of key → *sync.Once
}

// NewRegistry creates a new Registry.
func NewRegistry() *Registry {
	// TODO
	return nil
}

// GetOrInit returns the value for key. If not initialized,
// calls init() exactly once per key to set it.
func (r *Registry) GetOrInit(key string, init func() string) string {
	// TODO
	return ""
}

var _ = sync.Once{}`,
  testCode: `package main

import (
	"sync"
	"sync/atomic"
	"testing"
)

func TestLazyValueComputesOnce(t *testing.T) {
	var calls int64
	lv := NewLazyValue(func() string {
		atomic.AddInt64(&calls, 1)
		return "hello"
	})

	// Call Get multiple times
	for i := 0; i < 10; i++ {
		got := lv.Get()
		if got != "hello" {
			t.Errorf("Get() = %q, want hello", got)
		}
	}

	if c := atomic.LoadInt64(&calls); c != 1 {
		t.Errorf("compute called %d times, want 1", c)
	}
}

func TestLazyValueConcurrent(t *testing.T) {
	var calls int64
	lv := NewLazyValue(func() string {
		atomic.AddInt64(&calls, 1)
		return "result"
	})

	var wg sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			got := lv.Get()
			if got != "result" {
				t.Errorf("got %q", got)
			}
		}()
	}
	wg.Wait()

	if c := atomic.LoadInt64(&calls); c != 1 {
		t.Errorf("compute called %d times, want 1", c)
	}
}

func TestRegistryGetOrInit(t *testing.T) {
	r := NewRegistry()
	var calls int64
	init := func() string {
		atomic.AddInt64(&calls, 1)
		return "initialized"
	}

	v1 := r.GetOrInit("key1", init)
	v2 := r.GetOrInit("key1", init)
	if v1 != "initialized" || v2 != "initialized" {
		t.Errorf("got %q, %q", v1, v2)
	}
	if c := atomic.LoadInt64(&calls); c != 1 {
		t.Errorf("init called %d times for same key, want 1", c)
	}
}

func TestRegistryDifferentKeys(t *testing.T) {
	r := NewRegistry()
	a := r.GetOrInit("a", func() string { return "alpha" })
	b := r.GetOrInit("b", func() string { return "beta" })
	if a != "alpha" || b != "beta" {
		t.Errorf("got a=%q b=%q", a, b)
	}
}

func TestRegistryConcurrent(t *testing.T) {
	r := NewRegistry()
	var calls int64
	var wg sync.WaitGroup

	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			r.GetOrInit("shared", func() string {
				atomic.AddInt64(&calls, 1)
				return "value"
			})
		}()
	}
	wg.Wait()

	if c := atomic.LoadInt64(&calls); c != 1 {
		t.Errorf("init called %d times, want 1", c)
	}
}`,
  solution: `package main

import "sync"

type LazyValue struct {
	once    sync.Once
	compute func() string
	value   string
}

func NewLazyValue(compute func() string) *LazyValue {
	return &LazyValue{compute: compute}
}

func (l *LazyValue) Get() string {
	l.once.Do(func() {
		l.value = l.compute()
	})
	return l.value
}

type Registry struct {
	mu     sync.Mutex
	values map[string]string
	onces  map[string]*sync.Once
}

func NewRegistry() *Registry {
	return &Registry{
		values: make(map[string]string),
		onces:  make(map[string]*sync.Once),
	}
}

func (r *Registry) GetOrInit(key string, init func() string) string {
	r.mu.Lock()
	once, ok := r.onces[key]
	if !ok {
		once = &sync.Once{}
		r.onces[key] = once
	}
	r.mu.Unlock()

	once.Do(func() {
		val := init()
		r.mu.Lock()
		r.values[key] = val
		r.mu.Unlock()
	})

	r.mu.Lock()
	defer r.mu.Unlock()
	return r.values[key]
}`,
  hints: [
    'LazyValue: store sync.Once, the compute func, and the cached value. In Get(), call once.Do(func() { l.value = l.compute() }).',
    'Registry: use a mutex to protect the map of *sync.Once per key. Get or create the Once, then call once.Do outside the mutex.',
    'Important: don\'t hold the mutex while calling once.Do — that could deadlock if the init function also calls GetOrInit.'
  ],
}

export default exercise
