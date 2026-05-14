import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-pool-05',
  title: 'Connection Pool — Graceful Drain',
  category: 'Projects',
  subcategory: 'Connection Pool',
  difficulty: 'advanced',
  order: 141,
  projectId: 'proj-pool',
  step: 5,
  totalSteps: 6,
  description: `Add a Drain operation that gracefully shuts down the pool: stop accepting new connections and wait for all active (checked-out) connections to be returned.

**Implement DrainPool:**
- NewDrainPool(factory Factory, maxSize int) *DrainPool
- Get() (Conn, error) — returns ErrPoolDraining if a drain is in progress
- Put(conn Conn) — returns connection; if draining, close it and signal the drain waiter
- Active() int — number of connections currently checked out (not idle)
- Drain(ctx context.Context) error — stops new Gets, waits for all active to return, closes everything. Returns ctx.Err() if context expires before all connections return.

The pool tracks how many connections are currently checked out (active). Drain blocks until active reaches 0.`,
  code: `package main

import (
	"context"
	"errors"
	"sync"
)

// Conn represents a pooled connection.
type Conn interface {
	ID() int
	Close() error
	IsHealthy() bool
}

// Factory creates new connections.
type Factory func() (Conn, error)

var ErrPoolDraining = errors.New("pool is draining")

// TODO: Define DrainPool struct with:
//   - mu sync.Mutex
//   - factory, idle, maxSize, created (like previous steps)
//   - active int (checked-out count)
//   - draining bool
//   - drainDone chan struct{} (signaled when active reaches 0)

// TODO: Implement NewDrainPool(factory Factory, maxSize int) *DrainPool

// TODO: Implement Get() (Conn, error)

// TODO: Implement Put(conn Conn) — if draining, close conn and decrement active; signal drain if active == 0

// TODO: Implement Active() int

// TODO: Implement Drain(ctx context.Context) error

func main() {}
`,
  testCode: `package main

import (
	"context"
	"sync"
	"testing"
	"time"
)

type mockConn struct {
	id      int
	closed  bool
	healthy bool
}

func (c *mockConn) ID() int         { return c.id }
func (c *mockConn) Close() error    { c.closed = true; return nil }
func (c *mockConn) IsHealthy() bool { return c.healthy }

func mockFactory() Factory {
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

func TestDrainPoolBasic(t *testing.T) {
	p := NewDrainPool(mockFactory(), 5)
	c1, err := p.Get()
	if err != nil {
		t.Fatal(err)
	}
	c2, err := p.Get()
	if err != nil {
		t.Fatal(err)
	}
	if p.Active() != 2 {
		t.Fatalf("expected 2 active, got %d", p.Active())
	}
	p.Put(c1)
	p.Put(c2)
	if p.Active() != 0 {
		t.Fatalf("expected 0 active after puts, got %d", p.Active())
	}
}

func TestDrainWaitsForActive(t *testing.T) {
	p := NewDrainPool(mockFactory(), 5)
	c1, _ := p.Get()
	c2, _ := p.Get()

	done := make(chan error)
	go func() {
		done <- p.Drain(context.Background())
	}()

	// Drain should be blocking
	select {
	case <-done:
		t.Fatal("Drain should block while connections are active")
	case <-time.After(30 * time.Millisecond):
	}

	// Return connections
	p.Put(c1)
	p.Put(c2)

	select {
	case err := <-done:
		if err != nil {
			t.Fatalf("Drain should succeed, got %v", err)
		}
	case <-time.After(time.Second):
		t.Fatal("Drain should complete after all puts")
	}
}

func TestDrainRejectsNewGets(t *testing.T) {
	p := NewDrainPool(mockFactory(), 5)
	c1, _ := p.Get()

	go func() {
		time.Sleep(50 * time.Millisecond)
		p.Put(c1)
	}()

	go p.Drain(context.Background())
	time.Sleep(10 * time.Millisecond)

	_, err := p.Get()
	if err != ErrPoolDraining {
		t.Fatalf("expected ErrPoolDraining, got %v", err)
	}
}

func TestDrainTimeout(t *testing.T) {
	p := NewDrainPool(mockFactory(), 5)
	_, _ = p.Get() // checked out, never returned

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Millisecond)
	defer cancel()

	err := p.Drain(ctx)
	if err == nil {
		t.Fatal("Drain should fail on timeout")
	}
}

func TestDrainNoActive(t *testing.T) {
	p := NewDrainPool(mockFactory(), 5)
	c1, _ := p.Get()
	p.Put(c1)

	err := p.Drain(context.Background())
	if err != nil {
		t.Fatalf("Drain with no active should succeed immediately, got %v", err)
	}
}

func TestDrainClosesReturnedConns(t *testing.T) {
	p := NewDrainPool(mockFactory(), 5)
	c1, _ := p.Get()
	mc := c1.(*mockConn)

	go func() {
		time.Sleep(20 * time.Millisecond)
		p.Put(c1)
	}()

	p.Drain(context.Background())

	if !mc.closed {
		t.Fatal("Drain should close returned connections")
	}
}
`,
  solution: `package main

import (
	"context"
	"errors"
	"sync"
)

type Conn interface {
	ID() int
	Close() error
	IsHealthy() bool
}

type Factory func() (Conn, error)

var ErrPoolDraining = errors.New("pool is draining")

type DrainPool struct {
	mu        sync.Mutex
	factory   Factory
	idle      []Conn
	maxSize   int
	created   int
	active    int
	draining  bool
	drainDone chan struct{}
}

func NewDrainPool(factory Factory, maxSize int) *DrainPool {
	return &DrainPool{
		factory:   factory,
		maxSize:   maxSize,
		drainDone: make(chan struct{}),
	}
}

func (p *DrainPool) Get() (Conn, error) {
	p.mu.Lock()
	defer p.mu.Unlock()

	if p.draining {
		return nil, ErrPoolDraining
	}

	if len(p.idle) > 0 {
		conn := p.idle[len(p.idle)-1]
		p.idle = p.idle[:len(p.idle)-1]
		p.active++
		return conn, nil
	}

	if p.created < p.maxSize {
		conn, err := p.factory()
		if err != nil {
			return nil, err
		}
		p.created++
		p.active++
		return conn, nil
	}

	return nil, errors.New("pool exhausted")
}

func (p *DrainPool) Put(conn Conn) {
	p.mu.Lock()
	p.active--

	if p.draining {
		shouldSignal := p.active == 0
		p.mu.Unlock()
		conn.Close()
		if shouldSignal {
			close(p.drainDone)
		}
		return
	}

	p.idle = append(p.idle, conn)
	p.mu.Unlock()
}

func (p *DrainPool) Active() int {
	p.mu.Lock()
	defer p.mu.Unlock()
	return p.active
}

func (p *DrainPool) Drain(ctx context.Context) error {
	p.mu.Lock()
	p.draining = true

	// Close all idle connections
	for _, c := range p.idle {
		c.Close()
	}
	p.idle = nil

	if p.active == 0 {
		p.mu.Unlock()
		return nil
	}
	p.mu.Unlock()

	select {
	case <-p.drainDone:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

func main() {}
`,
  hints: [
    'Track active count: increment in Get(), decrement in Put().',
    'Use a `drainDone` channel. When Put() decrements active to 0 during a drain, close the channel to signal Drain().',
    'Drain() sets draining=true, closes idle connections, then waits on either drainDone or ctx.Done().',
    'If active is already 0 when Drain() is called, return immediately without waiting.',
  ],
}

export default exercise
