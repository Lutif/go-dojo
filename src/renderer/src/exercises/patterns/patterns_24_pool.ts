import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_24_pool',
  title: 'Object Pool',
  category: 'Patterns',
  subcategory: 'Design Patterns',
  difficulty: 'advanced',
  order: 24,
  description: `Implement a generic object pool that reuses objects to reduce allocation overhead.

Object pools maintain a set of reusable objects. Instead of creating and destroying objects repeatedly, you Get one from the pool and Put it back when done.

Your tasks:

1. Define an \`ErrPoolExhausted\` error: "pool exhausted"

2. Define a \`Pool[T any]\` struct with:
   - \`items\` ([]T) - available objects
   - \`factory\` (func() T) - creates new objects
   - \`reset\` (func(T) T) - resets an object before reuse
   - \`maxSize\` (int) - maximum number of objects the pool can hold
   - \`created\` (int) - total objects created by the pool

3. Implement \`NewPool[T any](maxSize int, factory func() T, reset func(T) T) *Pool[T]\`.

4. Implement \`(p *Pool[T]) Get() (T, error)\`:
   - If an item is available in the pool, pop and return it
   - If pool is empty and created < maxSize, create a new one via factory
   - If pool is empty and created >= maxSize, return zero value and ErrPoolExhausted

5. Implement \`(p *Pool[T]) Put(item T)\`:
   - Call reset on the item
   - Add it back to the available pool
   - (Do not exceed maxSize in the pool)

6. Implement \`(p *Pool[T]) Available() int\` - returns count of items currently in the pool.

7. Implement \`(p *Pool[T]) Created() int\` - returns total objects ever created by the factory.`,
  code: `package main

import "errors"

// TODO: Define ErrPoolExhausted error

// TODO: Define Pool[T any] struct with items []T, factory func() T,
// reset func(T) T, maxSize int, created int

// TODO: Implement NewPool[T any](maxSize int, factory func() T, reset func(T) T) *Pool[T]

// TODO: Implement (p *Pool[T]) Get() (T, error)
// Return from pool if available, create if under max, error if exhausted

// TODO: Implement (p *Pool[T]) Put(item T)
// Reset the item and return it to the pool

// TODO: Implement (p *Pool[T]) Available() int

// TODO: Implement (p *Pool[T]) Created() int

var _ = errors.New

func main() {}`,
  testCode: `package main

import (
	"testing"
)

type Buffer struct {
	Data []byte
}

func newBuffer() Buffer {
	return Buffer{Data: make([]byte, 0, 1024)}
}

func resetBuffer(b Buffer) Buffer {
	b.Data = b.Data[:0]
	return b
}

func TestPoolGet(t *testing.T) {
	pool := NewPool(3, newBuffer, resetBuffer)

	buf, err := pool.Get()
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
	if cap(buf.Data) != 1024 {
		t.Errorf("expected capacity 1024, got %d", cap(buf.Data))
	}
}

func TestPoolGetCreatesNew(t *testing.T) {
	pool := NewPool(3, newBuffer, resetBuffer)

	pool.Get()
	pool.Get()
	pool.Get()

	if pool.Created() != 3 {
		t.Errorf("expected 3 created, got %d", pool.Created())
	}
}

func TestPoolExhausted(t *testing.T) {
	pool := NewPool(2, newBuffer, resetBuffer)

	pool.Get()
	pool.Get()
	_, err := pool.Get()

	if err != ErrPoolExhausted {
		t.Errorf("expected ErrPoolExhausted, got %v", err)
	}
}

func TestPoolPutAndReuse(t *testing.T) {
	pool := NewPool(2, newBuffer, resetBuffer)

	buf, _ := pool.Get()
	buf.Data = append(buf.Data, 1, 2, 3)

	pool.Put(buf)

	if pool.Available() != 1 {
		t.Errorf("expected 1 available, got %d", pool.Available())
	}

	reused, _ := pool.Get()
	if len(reused.Data) != 0 {
		t.Errorf("expected reset buffer with len 0, got %d", len(reused.Data))
	}
	if cap(reused.Data) != 1024 {
		t.Errorf("expected capacity preserved, got %d", cap(reused.Data))
	}
}

func TestPoolAvailable(t *testing.T) {
	pool := NewPool(5, newBuffer, resetBuffer)

	if pool.Available() != 0 {
		t.Errorf("expected 0 available initially, got %d", pool.Available())
	}

	b1, _ := pool.Get()
	b2, _ := pool.Get()

	pool.Put(b1)
	pool.Put(b2)

	if pool.Available() != 2 {
		t.Errorf("expected 2 available, got %d", pool.Available())
	}
}

func TestPoolDoesNotExceedMaxOnPut(t *testing.T) {
	pool := NewPool(2, newBuffer, resetBuffer)

	b1, _ := pool.Get()
	b2, _ := pool.Get()

	pool.Put(b1)
	pool.Put(b2)
	pool.Put(newBuffer()) // extra put

	if pool.Available() > 2 {
		t.Errorf("pool should not exceed maxSize, available: %d", pool.Available())
	}
}

func TestPoolCreatedCount(t *testing.T) {
	pool := NewPool(3, newBuffer, resetBuffer)

	b, _ := pool.Get()
	pool.Put(b)
	pool.Get() // should reuse, not create

	if pool.Created() != 1 {
		t.Errorf("expected 1 created (reused from pool), got %d", pool.Created())
	}
}

func TestPoolWithInts(t *testing.T) {
	pool := NewPool(3, func() int { return 0 }, func(n int) int { return 0 })

	val, err := pool.Get()
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
	if val != 0 {
		t.Errorf("expected 0, got %d", val)
	}
}`,
  solution: `package main

import "errors"

var ErrPoolExhausted = errors.New("pool exhausted")

type Pool[T any] struct {
	items   []T
	factory func() T
	reset   func(T) T
	maxSize int
	created int
}

func NewPool[T any](maxSize int, factory func() T, reset func(T) T) *Pool[T] {
	return &Pool[T]{
		items:   make([]T, 0),
		factory: factory,
		reset:   reset,
		maxSize: maxSize,
	}
}

func (p *Pool[T]) Get() (T, error) {
	if len(p.items) > 0 {
		item := p.items[len(p.items)-1]
		p.items = p.items[:len(p.items)-1]
		return item, nil
	}

	if p.created >= p.maxSize {
		var zero T
		return zero, ErrPoolExhausted
	}

	p.created++
	return p.factory(), nil
}

func (p *Pool[T]) Put(item T) {
	if len(p.items) >= p.maxSize {
		return
	}
	item = p.reset(item)
	p.items = append(p.items, item)
}

func (p *Pool[T]) Available() int {
	return len(p.items)
}

func (p *Pool[T]) Created() int {
	return p.created
}

func main() {}`,
  hints: [
    'Use a slice as a stack for available items: append to push, slice to pop from the end.',
    'In Get(), check the pool first, then check if you can create a new one, then return ErrPoolExhausted.',
    'In Put(), call the reset function on the item before adding it back. Check maxSize to avoid growing beyond capacity.',
    'The Created() count only increments when factory is called, not when items are reused from the pool.',
  ],
}

export default exercise
