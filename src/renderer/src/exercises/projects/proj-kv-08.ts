import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-kv-08',
  title: 'KV Store — Benchmarking & Metrics',
  category: 'Projects',
  subcategory: 'Key-Value Store',
  difficulty: 'expert',
  order: 130,
  description: `Add benchmarking and operation metrics to the store.

Implement a BenchStore that wraps a SafeStore and counts operations:
- NewBenchStore() *BenchStore
- Set(key, value string) — delegate to inner store, count the set
- Get(key string) (string, bool) — delegate to inner store, count the get (and track hit vs miss)
- Delete(key string) bool — delegate to inner store, count the delete
- Stats() StoreStats — returns current counters
- Reset() — zero all counters

StoreStats has fields: Sets, Gets, Deletes, Hits, Misses int

A "hit" is a Get that found the key; a "miss" is a Get that did not.

Also implement:
- RunBenchmark(store *BenchStore, numOps int) BenchResult
  - BenchResult has: TotalOps int; Duration time.Duration; OpsPerSec float64
  - Runs numOps iterations: even-indexed iterations call Set("bench-N", "val"), odd call Get("bench-N") where N is the iteration index
  - Measures total wall time, calculates ops/sec as float64(numOps) / duration.Seconds()

Use sync/atomic (int64 fields + atomic.AddInt64) for thread-safe counters.`,
  code: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

// --- SafeStore from Step 3 (provided) ---

type SafeStore struct {
	mu   sync.RWMutex
	data map[string]string
}

func NewSafeStore() *SafeStore {
	return &SafeStore{data: make(map[string]string)}
}

func (s *SafeStore) Set(key, value string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.data[key] = value
}

func (s *SafeStore) Get(key string) (string, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	val, ok := s.data[key]
	return val, ok
}

func (s *SafeStore) Delete(key string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.data[key]; !ok {
		return false
	}
	delete(s.data, key)
	return true
}

func (s *SafeStore) Len() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.data)
}

// --- BenchStore ---

// TODO: Define StoreStats with Sets, Gets, Deletes, Hits, Misses int.

// TODO: Define BenchStore with a *SafeStore and int64 atomic counters
//   for sets, gets, deletes, hits, misses.

// TODO: Implement NewBenchStore() *BenchStore.

// TODO: Implement Set(key, value string) — delegate to inner store,
//   atomically increment the sets counter.

// TODO: Implement Get(key string) (string, bool) — delegate to inner store,
//   atomically increment gets, and increment hits or misses based on result.

// TODO: Implement Delete(key string) bool — delegate to inner store,
//   atomically increment deletes.

// TODO: Implement Stats() StoreStats — read all atomic counters and return them.

// TODO: Implement Reset() — set all atomic counters back to zero.

// TODO: Define BenchResult with TotalOps int, Duration time.Duration, OpsPerSec float64.

// TODO: Implement RunBenchmark(store *BenchStore, numOps int) BenchResult.
//   Even iterations: Set("bench-N", "val"). Odd iterations: Get("bench-N").
//   Measure wall time, compute ops/sec.

func main() {
	b := NewBenchStore()
	b.Set("hello", "world")
	val, _ := b.Get("hello")
	fmt.Println(val)
	stats := b.Stats()
	fmt.Printf("Sets: %d, Gets: %d, Hits: %d\\n", stats.Sets, stats.Gets, stats.Hits)
}
`,
  testCode: `package main

import (
	"sync"
	"testing"
	"fmt"
)

func TestBenchStoreBasicOps(t *testing.T) {
	b := NewBenchStore()
	b.Set("a", "1")
	b.Set("b", "2")
	val, ok := b.Get("a")
	if !ok || val != "1" {
		t.Fatalf("expected (1, true), got (%s, %v)", val, ok)
	}
	ok2 := b.Delete("b")
	if !ok2 {
		t.Fatal("expected Delete to return true")
	}
}

func TestBenchStoreStatsCounters(t *testing.T) {
	b := NewBenchStore()
	b.Set("a", "1")
	b.Set("b", "2")
	b.Set("c", "3")
	b.Get("a")
	b.Get("b")
	b.Delete("c")

	stats := b.Stats()
	if stats.Sets != 3 {
		t.Fatalf("expected Sets=3, got %d", stats.Sets)
	}
	if stats.Gets != 2 {
		t.Fatalf("expected Gets=2, got %d", stats.Gets)
	}
	if stats.Deletes != 1 {
		t.Fatalf("expected Deletes=1, got %d", stats.Deletes)
	}
}

func TestBenchStoreHitsMisses(t *testing.T) {
	b := NewBenchStore()
	b.Set("exists", "val")

	b.Get("exists")
	b.Get("nope")
	b.Get("also-nope")
	b.Get("exists")

	stats := b.Stats()
	if stats.Hits != 2 {
		t.Fatalf("expected Hits=2, got %d", stats.Hits)
	}
	if stats.Misses != 2 {
		t.Fatalf("expected Misses=2, got %d", stats.Misses)
	}
	if stats.Gets != 4 {
		t.Fatalf("expected Gets=4, got %d", stats.Gets)
	}
}

func TestBenchStoreReset(t *testing.T) {
	b := NewBenchStore()
	b.Set("a", "1")
	b.Get("a")
	b.Get("missing")
	b.Delete("a")

	b.Reset()
	stats := b.Stats()
	if stats.Sets != 0 || stats.Gets != 0 || stats.Deletes != 0 || stats.Hits != 0 || stats.Misses != 0 {
		t.Fatalf("expected all zeros after Reset, got %+v", stats)
	}
}

func TestRunBenchmark(t *testing.T) {
	b := NewBenchStore()
	result := RunBenchmark(b, 1000)

	if result.TotalOps != 1000 {
		t.Fatalf("expected TotalOps=1000, got %d", result.TotalOps)
	}
	if result.Duration <= 0 {
		t.Fatal("expected Duration > 0")
	}
	if result.OpsPerSec <= 0 {
		t.Fatal("expected OpsPerSec > 0")
	}
}

func TestRunBenchmarkOpsMatch(t *testing.T) {
	b := NewBenchStore()
	numOps := 100
	RunBenchmark(b, numOps)

	stats := b.Stats()
	expectedSets := 0
	expectedGets := 0
	for i := 0; i < numOps; i++ {
		if i%2 == 0 {
			expectedSets++
		} else {
			expectedGets++
		}
	}
	if stats.Sets != expectedSets {
		t.Fatalf("expected Sets=%d, got %d", expectedSets, stats.Sets)
	}
	if stats.Gets != expectedGets {
		t.Fatalf("expected Gets=%d, got %d", expectedGets, stats.Gets)
	}
}

func TestBenchStoreConcurrent(t *testing.T) {
	b := NewBenchStore()
	var wg sync.WaitGroup

	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func(n int) {
			defer wg.Done()
			key := fmt.Sprintf("key-%d", n)
			b.Set(key, "val")
			b.Get(key)
			b.Delete(key)
		}(i)
	}
	wg.Wait()

	stats := b.Stats()
	if stats.Sets != 100 {
		t.Fatalf("expected Sets=100, got %d", stats.Sets)
	}
	if stats.Gets != 100 {
		t.Fatalf("expected Gets=100, got %d", stats.Gets)
	}
	if stats.Deletes != 100 {
		t.Fatalf("expected Deletes=100, got %d", stats.Deletes)
	}
}
`,
  solution: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

// --- SafeStore from Step 3 ---

type SafeStore struct {
	mu   sync.RWMutex
	data map[string]string
}

func NewSafeStore() *SafeStore {
	return &SafeStore{data: make(map[string]string)}
}

func (s *SafeStore) Set(key, value string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.data[key] = value
}

func (s *SafeStore) Get(key string) (string, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	val, ok := s.data[key]
	return val, ok
}

func (s *SafeStore) Delete(key string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.data[key]; !ok {
		return false
	}
	delete(s.data, key)
	return true
}

func (s *SafeStore) Len() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.data)
}

// --- Benchmarking & Metrics ---

type StoreStats struct {
	Sets    int
	Gets    int
	Deletes int
	Hits    int
	Misses  int
}

type BenchStore struct {
	store   *SafeStore
	sets    int64
	gets    int64
	deletes int64
	hits    int64
	misses  int64
}

func NewBenchStore() *BenchStore {
	return &BenchStore{store: NewSafeStore()}
}

func (b *BenchStore) Set(key, value string) {
	b.store.Set(key, value)
	atomic.AddInt64(&b.sets, 1)
}

func (b *BenchStore) Get(key string) (string, bool) {
	val, ok := b.store.Get(key)
	atomic.AddInt64(&b.gets, 1)
	if ok {
		atomic.AddInt64(&b.hits, 1)
	} else {
		atomic.AddInt64(&b.misses, 1)
	}
	return val, ok
}

func (b *BenchStore) Delete(key string) bool {
	result := b.store.Delete(key)
	atomic.AddInt64(&b.deletes, 1)
	return result
}

func (b *BenchStore) Stats() StoreStats {
	return StoreStats{
		Sets:    int(atomic.LoadInt64(&b.sets)),
		Gets:    int(atomic.LoadInt64(&b.gets)),
		Deletes: int(atomic.LoadInt64(&b.deletes)),
		Hits:    int(atomic.LoadInt64(&b.hits)),
		Misses:  int(atomic.LoadInt64(&b.misses)),
	}
}

func (b *BenchStore) Reset() {
	atomic.StoreInt64(&b.sets, 0)
	atomic.StoreInt64(&b.gets, 0)
	atomic.StoreInt64(&b.deletes, 0)
	atomic.StoreInt64(&b.hits, 0)
	atomic.StoreInt64(&b.misses, 0)
}

type BenchResult struct {
	TotalOps  int
	Duration  time.Duration
	OpsPerSec float64
}

func RunBenchmark(store *BenchStore, numOps int) BenchResult {
	start := time.Now()
	for i := 0; i < numOps; i++ {
		key := fmt.Sprintf("bench-%d", i)
		if i%2 == 0 {
			store.Set(key, "val")
		} else {
			store.Get(key)
		}
	}
	dur := time.Since(start)
	return BenchResult{
		TotalOps:  numOps,
		Duration:  dur,
		OpsPerSec: float64(numOps) / dur.Seconds(),
	}
}

func main() {
	b := NewBenchStore()
	b.Set("hello", "world")
	val, _ := b.Get("hello")
	fmt.Println(val)
	stats := b.Stats()
	fmt.Printf("Sets: %d, Gets: %d, Hits: %d\\n", stats.Sets, stats.Gets, stats.Hits)
}
`,
  hints: [
    'Use int64 fields on BenchStore and sync/atomic.AddInt64(&field, 1) for thread-safe counting.',
    'In Get, call the inner store first, then increment gets. Check the bool to decide hits vs misses.',
    'Stats() reads all counters with atomic.LoadInt64 and returns them as plain ints in the StoreStats struct.',
    'Reset() uses atomic.StoreInt64(&field, 0) for each counter.',
    'RunBenchmark records time.Now() before the loop, time.Since(start) after, and divides numOps by duration.Seconds().',
  ],
  projectId: 'proj-kv',
  step: 8,
  totalSteps: 8,
}

export default exercise
