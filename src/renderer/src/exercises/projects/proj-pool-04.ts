import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-pool-04',
  title: 'Connection Pool — Semaphore Blocking',
  category: 'Projects',
  subcategory: 'Connection Pool',
  difficulty: 'advanced',
  order: 140,
  projectId: 'proj-pool',
  step: 4,
  totalSteps: 6,
  description: `Replace the "pool exhausted" error with blocking behavior using a channel-based semaphore.

When the pool is at capacity and all connections are in use, callers should block until one is returned — or until their context expires.

**Implement BlockingPool:**
- NewBlockingPool(factory Factory, maxSize int) *BlockingPool
- Get(ctx context.Context) (Conn, error) — acquires a semaphore slot (blocks if full), then gets/creates a connection. Returns context.Canceled or context.DeadlineExceeded if ctx expires while waiting.
- Put(conn Conn) — returns connection to idle list and releases the semaphore slot
- Len() int — idle connection count
- Close() error — closes all idle connections, marks pool as closed. After Close(), Get returns ErrPoolClosed.

Use a buffered channel as the semaphore: \`make(chan struct{}, maxSize)\`.`,
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

var ErrPoolClosed = errors.New("pool is closed")

// TODO: Define BlockingPool struct with:
//   - mu sync.Mutex
//   - factory Factory
//   - idle []Conn
//   - sem chan struct{} (buffered channel as semaphore)
//   - closed bool

// TODO: Implement NewBlockingPool(factory Factory, maxSize int) *BlockingPool

// TODO: Implement Get(ctx context.Context) (Conn, error)
//   1. Check if pool is closed
//   2. Acquire semaphore: select on sem <- struct{}{} and ctx.Done()
//   3. Once acquired, check idle list; if empty, create via factory
//   4. If factory fails, release semaphore and return error

// TODO: Implement Put(conn Conn)
//   1. Lock, append to idle, unlock
//   2. Release semaphore: <-sem

// TODO: Implement Len() int

// TODO: Implement Close() error

func main() {}
`,
  testCode: `package main

import (
	"context"
	"fmt"
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

func TestBlockingPoolBasic(t *testing.T) {
	p := NewBlockingPool(mockFactory(), 3)
	ctx := context.Background()

	c1, err := p.Get(ctx)
	if err != nil {
		t.Fatal(err)
	}
	c2, err := p.Get(ctx)
	if err != nil {
		t.Fatal(err)
	}

	p.Put(c1)
	p.Put(c2)

	if p.Len() != 2 {
		t.Fatalf("expected 2 idle, got %d", p.Len())
	}
}

func TestBlockingPoolBlocksAndUnblocks(t *testing.T) {
	p := NewBlockingPool(mockFactory(), 1)
	ctx := context.Background()

	c1, err := p.Get(ctx)
	if err != nil {
		t.Fatal(err)
	}

	// Second Get should block since pool size is 1
	done := make(chan error)
	go func() {
		_, err := p.Get(ctx)
		done <- err
	}()

	// Should not complete yet
	select {
	case <-done:
		t.Fatal("Get should have blocked")
	case <-time.After(30 * time.Millisecond):
	}

	// Return the connection — should unblock
	p.Put(c1)

	select {
	case err := <-done:
		if err != nil {
			t.Fatal(err)
		}
	case <-time.After(time.Second):
		t.Fatal("Get should have unblocked after Put")
	}
}

func TestBlockingPoolContextTimeout(t *testing.T) {
	p := NewBlockingPool(mockFactory(), 1)
	ctx := context.Background()

	// Take the only slot
	_, err := p.Get(ctx)
	if err != nil {
		t.Fatal(err)
	}

	// Try to get with short timeout — should fail
	timeoutCtx, cancel := context.WithTimeout(ctx, 30*time.Millisecond)
	defer cancel()

	_, err = p.Get(timeoutCtx)
	if err == nil {
		t.Fatal("expected error from timeout")
	}
}

func TestBlockingPoolContextCancelled(t *testing.T) {
	p := NewBlockingPool(mockFactory(), 1)
	ctx := context.Background()

	_, err := p.Get(ctx)
	if err != nil {
		t.Fatal(err)
	}

	cancelCtx, cancel := context.WithCancel(ctx)
	done := make(chan error)
	go func() {
		_, err := p.Get(cancelCtx)
		done <- err
	}()

	time.Sleep(20 * time.Millisecond)
	cancel()

	err = <-done
	if err == nil {
		t.Fatal("expected error from cancelled context")
	}
}

func TestBlockingPoolConcurrent(t *testing.T) {
	p := NewBlockingPool(mockFactory(), 5)
	ctx := context.Background()
	var wg sync.WaitGroup

	for i := 0; i < 20; i++ {
		wg.Add(1)
		go func(n int) {
			defer wg.Done()
			c, err := p.Get(ctx)
			if err != nil {
				t.Errorf("goroutine %d: %v", n, err)
				return
			}
			time.Sleep(5 * time.Millisecond)
			p.Put(c)
		}(i)
	}
	wg.Wait()
}

func TestBlockingPoolClose(t *testing.T) {
	p := NewBlockingPool(mockFactory(), 3)
	ctx := context.Background()

	c1, _ := p.Get(ctx)
	p.Put(c1)

	if err := p.Close(); err != nil {
		t.Fatal(err)
	}

	_, err := p.Get(ctx)
	if err != ErrPoolClosed {
		t.Fatalf("expected ErrPoolClosed, got %v", err)
	}
}

var _ = fmt.Sprintf
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

var ErrPoolClosed = errors.New("pool is closed")

type BlockingPool struct {
	mu      sync.Mutex
	factory Factory
	idle    []Conn
	sem     chan struct{}
	closed  bool
}

func NewBlockingPool(factory Factory, maxSize int) *BlockingPool {
	return &BlockingPool{
		factory: factory,
		sem:     make(chan struct{}, maxSize),
	}
}

func (p *BlockingPool) Get(ctx context.Context) (Conn, error) {
	p.mu.Lock()
	if p.closed {
		p.mu.Unlock()
		return nil, ErrPoolClosed
	}
	p.mu.Unlock()

	select {
	case p.sem <- struct{}{}:
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	p.mu.Lock()
	if p.closed {
		p.mu.Unlock()
		<-p.sem
		return nil, ErrPoolClosed
	}
	if len(p.idle) > 0 {
		conn := p.idle[len(p.idle)-1]
		p.idle = p.idle[:len(p.idle)-1]
		p.mu.Unlock()
		return conn, nil
	}
	p.mu.Unlock()

	conn, err := p.factory()
	if err != nil {
		<-p.sem
		return nil, err
	}
	return conn, nil
}

func (p *BlockingPool) Put(conn Conn) {
	p.mu.Lock()
	p.idle = append(p.idle, conn)
	p.mu.Unlock()
	<-p.sem
}

func (p *BlockingPool) Len() int {
	p.mu.Lock()
	defer p.mu.Unlock()
	return len(p.idle)
}

func (p *BlockingPool) Close() error {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.closed = true
	for _, c := range p.idle {
		c.Close()
	}
	p.idle = nil
	return nil
}

func main() {}
`,
  hints: [
    'Use a buffered channel `make(chan struct{}, maxSize)` as a semaphore. Sending to it acquires a slot; receiving releases it.',
    'In Get, use select with `p.sem <- struct{}{}` and `ctx.Done()` to either acquire a slot or respect cancellation.',
    'If factory() fails after acquiring the semaphore, release it with `<-p.sem` before returning the error.',
    'Put appends to idle (under lock) then releases the semaphore with `<-p.sem` — this order prevents deadlocks.',
  ],
}

export default exercise
