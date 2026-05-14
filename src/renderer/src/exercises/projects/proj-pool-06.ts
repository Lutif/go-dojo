import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-pool-06',
  title: 'Connection Pool — Metrics & Observability',
  category: 'Projects',
  subcategory: 'Connection Pool',
  difficulty: 'expert',
  order: 142,
  projectId: 'proj-pool',
  step: 6,
  totalSteps: 6,
  description: `Wrap the pool with metrics tracking using atomic operations for thread safety.

**Implement MetricsPool:**
- NewMetricsPool(factory Factory, maxSize int) *MetricsPool
- Get() (Conn, error) — delegates to inner pool, tracks TotalGets and TotalFailed (on error)
- Put(conn Conn) — delegates, tracks TotalPuts
- Metrics() PoolMetrics — returns a snapshot of all counters
- ResetMetrics() — zeros all counters

**PoolMetrics struct:**
- TotalGets int64 — number of Get() calls
- TotalPuts int64 — number of Put() calls
- TotalCreated int64 — number of connections created by factory
- TotalClosed int64 — number of connections closed
- TotalFailed int64 — number of Get() calls that returned an error
- TotalHealthChecksFailed int64 — connections discarded for being unhealthy

Use sync/atomic (AddInt64/LoadInt64/StoreInt64) for all counters so reads and writes are lock-free.`,
  code: `package main

import (
	"errors"
	"sync"
	"sync/atomic"
)

// Conn represents a pooled connection.
type Conn interface {
	ID() int
	Close() error
	IsHealthy() bool
}

// Factory creates new connections.
type Factory func() (Conn, error)

// PoolMetrics holds atomic counters for pool activity.
type PoolMetrics struct {
	TotalGets                int64
	TotalPuts                int64
	TotalCreated             int64
	TotalClosed              int64
	TotalFailed              int64
	TotalHealthChecksFailed  int64
}

// TODO: Define MetricsPool struct that wraps a simple pool and adds PoolMetrics counters

// TODO: Implement NewMetricsPool(factory Factory, maxSize int) *MetricsPool
//   - The counting factory should increment TotalCreated on every successful create

// TODO: Implement Get() (Conn, error)
//   - Increment TotalGets
//   - If error, increment TotalFailed
//   - Discard unhealthy idle connections (increment TotalHealthChecksFailed and TotalClosed)

// TODO: Implement Put(conn Conn)
//   - Increment TotalPuts

// TODO: Implement Metrics() PoolMetrics — return snapshot using atomic.LoadInt64

// TODO: Implement ResetMetrics() — zero all using atomic.StoreInt64

// Suppress unused import warnings
var _ = atomic.AddInt64
var _ sync.Mutex

func main() {}
`,
  testCode: `package main

import (
	"errors"
	"sync"
	"testing"
)

type mockConn struct {
	id      int
	closed  bool
	healthy bool
}

func (c *mockConn) ID() int         { return c.id }
func (c *mockConn) Close() error    { c.closed = true; return nil }
func (c *mockConn) IsHealthy() bool { return c.healthy }

func healthyFactory() Factory {
	var mu sync.Mutex
	next := 0
	return func() (Conn, error) {
		mu.Lock()
		next++
		id := next
		mu.Unlock()
		return &mockConn{id: id, healthy: true}, nil
	}
}

func TestMetricsPoolGetPut(t *testing.T) {
	p := NewMetricsPool(healthyFactory(), 5)
	c1, err := p.Get()
	if err != nil {
		t.Fatal(err)
	}
	c2, err := p.Get()
	if err != nil {
		t.Fatal(err)
	}
	p.Put(c1)
	p.Put(c2)

	m := p.Metrics()
	if m.TotalGets != 2 {
		t.Fatalf("TotalGets: expected 2, got %d", m.TotalGets)
	}
	if m.TotalPuts != 2 {
		t.Fatalf("TotalPuts: expected 2, got %d", m.TotalPuts)
	}
}

func TestMetricsPoolCreated(t *testing.T) {
	p := NewMetricsPool(healthyFactory(), 5)
	c1, _ := p.Get()
	c2, _ := p.Get()
	p.Put(c1)
	p.Put(c2)
	// Reuse from idle
	c3, _ := p.Get()
	p.Put(c3)

	m := p.Metrics()
	if m.TotalCreated != 2 {
		t.Fatalf("TotalCreated: expected 2, got %d", m.TotalCreated)
	}
	if m.TotalGets != 3 {
		t.Fatalf("TotalGets: expected 3, got %d", m.TotalGets)
	}
}

func TestMetricsPoolFailed(t *testing.T) {
	failFactory := func() (Conn, error) {
		return nil, errors.New("factory error")
	}
	p := NewMetricsPool(failFactory, 5)
	_, err := p.Get()
	if err == nil {
		t.Fatal("expected error")
	}

	m := p.Metrics()
	if m.TotalGets != 1 {
		t.Fatalf("TotalGets: expected 1, got %d", m.TotalGets)
	}
	if m.TotalFailed != 1 {
		t.Fatalf("TotalFailed: expected 1, got %d", m.TotalFailed)
	}
}

func TestMetricsPoolHealthCheckFailed(t *testing.T) {
	created := 0
	factory := func() (Conn, error) {
		created++
		return &mockConn{id: created, healthy: true}, nil
	}

	p := NewMetricsPool(factory, 5)
	c1, _ := p.Get()
	// Make it unhealthy before returning
	c1.(*mockConn).healthy = false
	p.Put(c1)

	// Getting should discard unhealthy and create new
	c2, err := p.Get()
	if err != nil {
		t.Fatal(err)
	}
	_ = c2

	m := p.Metrics()
	if m.TotalHealthChecksFailed != 1 {
		t.Fatalf("TotalHealthChecksFailed: expected 1, got %d", m.TotalHealthChecksFailed)
	}
	if m.TotalClosed != 1 {
		t.Fatalf("TotalClosed: expected 1, got %d", m.TotalClosed)
	}
}

func TestMetricsPoolReset(t *testing.T) {
	p := NewMetricsPool(healthyFactory(), 5)
	c, _ := p.Get()
	p.Put(c)

	p.ResetMetrics()
	m := p.Metrics()
	if m.TotalGets != 0 || m.TotalPuts != 0 || m.TotalCreated != 0 {
		t.Fatalf("expected all zeros after reset, got %+v", m)
	}
}

func TestMetricsPoolConcurrent(t *testing.T) {
	p := NewMetricsPool(healthyFactory(), 10)
	var wg sync.WaitGroup

	for i := 0; i < 50; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			c, err := p.Get()
			if err != nil {
				return
			}
			p.Put(c)
		}()
	}
	wg.Wait()

	m := p.Metrics()
	if m.TotalGets != 50 {
		t.Fatalf("TotalGets: expected 50, got %d", m.TotalGets)
	}
	if m.TotalPuts != 50 {
		t.Fatalf("TotalPuts: expected 50, got %d", m.TotalPuts)
	}
}
`,
  solution: `package main

import (
	"errors"
	"sync"
	"sync/atomic"
)

type Conn interface {
	ID() int
	Close() error
	IsHealthy() bool
}

type Factory func() (Conn, error)

type PoolMetrics struct {
	TotalGets                int64
	TotalPuts                int64
	TotalCreated             int64
	TotalClosed              int64
	TotalFailed              int64
	TotalHealthChecksFailed  int64
}

type MetricsPool struct {
	mu      sync.Mutex
	factory Factory
	idle    []Conn
	maxSize int
	created int
	metrics PoolMetrics
}

func NewMetricsPool(factory Factory, maxSize int) *MetricsPool {
	p := &MetricsPool{maxSize: maxSize}
	p.factory = func() (Conn, error) {
		c, err := factory()
		if err != nil {
			return nil, err
		}
		atomic.AddInt64(&p.metrics.TotalCreated, 1)
		return c, nil
	}
	return p
}

func (p *MetricsPool) Get() (Conn, error) {
	atomic.AddInt64(&p.metrics.TotalGets, 1)

	p.mu.Lock()
	for len(p.idle) > 0 {
		conn := p.idle[len(p.idle)-1]
		p.idle = p.idle[:len(p.idle)-1]
		if conn.IsHealthy() {
			p.mu.Unlock()
			return conn, nil
		}
		conn.Close()
		p.created--
		atomic.AddInt64(&p.metrics.TotalHealthChecksFailed, 1)
		atomic.AddInt64(&p.metrics.TotalClosed, 1)
	}

	if p.created < p.maxSize {
		p.created++
		p.mu.Unlock()
		conn, err := p.factory()
		if err != nil {
			p.mu.Lock()
			p.created--
			p.mu.Unlock()
			atomic.AddInt64(&p.metrics.TotalFailed, 1)
			return nil, err
		}
		return conn, nil
	}
	p.mu.Unlock()

	atomic.AddInt64(&p.metrics.TotalFailed, 1)
	return nil, errors.New("pool exhausted")
}

func (p *MetricsPool) Put(conn Conn) {
	atomic.AddInt64(&p.metrics.TotalPuts, 1)
	p.mu.Lock()
	p.idle = append(p.idle, conn)
	p.mu.Unlock()
}

func (p *MetricsPool) Metrics() PoolMetrics {
	return PoolMetrics{
		TotalGets:               atomic.LoadInt64(&p.metrics.TotalGets),
		TotalPuts:               atomic.LoadInt64(&p.metrics.TotalPuts),
		TotalCreated:            atomic.LoadInt64(&p.metrics.TotalCreated),
		TotalClosed:             atomic.LoadInt64(&p.metrics.TotalClosed),
		TotalFailed:             atomic.LoadInt64(&p.metrics.TotalFailed),
		TotalHealthChecksFailed: atomic.LoadInt64(&p.metrics.TotalHealthChecksFailed),
	}
}

func (p *MetricsPool) ResetMetrics() {
	atomic.StoreInt64(&p.metrics.TotalGets, 0)
	atomic.StoreInt64(&p.metrics.TotalPuts, 0)
	atomic.StoreInt64(&p.metrics.TotalCreated, 0)
	atomic.StoreInt64(&p.metrics.TotalClosed, 0)
	atomic.StoreInt64(&p.metrics.TotalFailed, 0)
	atomic.StoreInt64(&p.metrics.TotalHealthChecksFailed, 0)
}

func main() {}
`,
  hints: [
    'Use atomic.AddInt64(&counter, 1) to increment counters without locks.',
    'Use atomic.LoadInt64 in Metrics() and atomic.StoreInt64(_, 0) in ResetMetrics().',
    'Wrap the factory to intercept successful creates and increment TotalCreated.',
    'In Get(), loop through idle connections checking health. Unhealthy ones get closed and counted.',
  ],
}

export default exercise
