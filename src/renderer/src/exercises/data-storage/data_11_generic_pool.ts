import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_11_generic_pool',
  title: 'Object Pool',
  category: 'Data & Storage',
  subcategory: 'Resource Management',
  difficulty: 'advanced',
  order: 11,
  description: `Implement a generic object pool that manages reusable resources. Object pools reduce allocation overhead by recycling expensive-to-create objects like database connections or buffers.

The pool has a maximum size and uses a factory function to create new objects on demand:

\`\`\`
type Pool struct {
    pool    []any          // available objects
    factory func() any     // creates new objects
    reset   func(any)      // resets an object before reuse
    maxSize int
    inUse   int
}
\`\`\`

When \`Get()\` is called, return an available object from the pool, or create a new one if the pool is empty and under capacity. When \`Put()\` is called, reset the object and return it to the pool.

Implement:
- \`NewPool(maxSize int, factory func() any, reset func(any))\` - creates a pool
- \`Get() (any, bool)\` - gets an object (returns false if at max capacity with none available)
- \`Put(obj any)\` - returns an object to the pool after resetting it
- \`Available() int\` - returns the number of objects ready in the pool
- \`InUse() int\` - returns the number of objects currently checked out`,
  code: `package main

// Pool is a generic object pool with a fixed maximum size.
type Pool struct {
	// TODO: Add pool slice, factory func, reset func, maxSize, inUse
}

// NewPool creates a new object pool.
// factory creates new objects. reset prepares a returned object for reuse.
func NewPool(maxSize int, factory func() any, reset func(any)) *Pool {
	// TODO
	return nil
}

// Get retrieves an object from the pool or creates a new one.
// Returns (object, true) on success.
// Returns (nil, false) if at max capacity and no objects are available.
func (p *Pool) Get() (any, bool) {
	// TODO:
	// 1. If pool has available objects, pop one and return it
	// 2. If under max capacity, create a new one with factory
	// 3. Otherwise return nil, false
	return nil, false
}

// Put returns an object to the pool after calling reset on it.
func (p *Pool) Put(obj any) {
	// TODO: Reset the object and add it back to the pool
}

// Available returns the number of objects ready in the pool.
func (p *Pool) Available() int {
	// TODO
	return 0
}

// InUse returns the number of objects currently checked out.
func (p *Pool) InUse() int {
	// TODO
	return 0
}

func main() {}`,
  testCode: `package main

import "testing"

type Buffer struct {
	Data []byte
}

func newBuffer() any {
	return &Buffer{Data: make([]byte, 0, 1024)}
}

func resetBuffer(obj any) {
	buf := obj.(*Buffer)
	buf.Data = buf.Data[:0]
}

func TestPoolGet(t *testing.T) {
	pool := NewPool(3, newBuffer, resetBuffer)

	obj, ok := pool.Get()
	if !ok || obj == nil {
		t.Fatal("Get() should return an object")
	}
	buf := obj.(*Buffer)
	if cap(buf.Data) != 1024 {
		t.Errorf("buffer capacity = %d, want 1024", cap(buf.Data))
	}
}

func TestPoolPutAndReuse(t *testing.T) {
	pool := NewPool(3, newBuffer, resetBuffer)

	obj, _ := pool.Get()
	buf := obj.(*Buffer)
	buf.Data = append(buf.Data, []byte("hello")...)

	pool.Put(obj)

	// Get should return the same (reset) object
	obj2, ok := pool.Get()
	if !ok {
		t.Fatal("Get() after Put() should succeed")
	}
	buf2 := obj2.(*Buffer)
	if len(buf2.Data) != 0 {
		t.Errorf("reused buffer should be reset, len = %d", len(buf2.Data))
	}
}

func TestPoolMaxCapacity(t *testing.T) {
	pool := NewPool(2, newBuffer, resetBuffer)

	_, ok1 := pool.Get()
	_, ok2 := pool.Get()
	_, ok3 := pool.Get()

	if !ok1 || !ok2 {
		t.Error("first two Gets should succeed")
	}
	if ok3 {
		t.Error("third Get should fail (at max capacity)")
	}
}

func TestPoolInUse(t *testing.T) {
	pool := NewPool(3, newBuffer, resetBuffer)

	pool.Get()
	pool.Get()
	if pool.InUse() != 2 {
		t.Errorf("InUse() = %d, want 2", pool.InUse())
	}
}

func TestPoolAvailable(t *testing.T) {
	pool := NewPool(3, newBuffer, resetBuffer)

	obj1, _ := pool.Get()
	obj2, _ := pool.Get()
	pool.Put(obj1)
	pool.Put(obj2)

	if pool.Available() != 2 {
		t.Errorf("Available() = %d, want 2", pool.Available())
	}
	if pool.InUse() != 0 {
		t.Errorf("InUse() = %d, want 0", pool.InUse())
	}
}

func TestPoolReturnAndGetAgain(t *testing.T) {
	pool := NewPool(1, newBuffer, resetBuffer)

	obj, _ := pool.Get()
	_, ok := pool.Get() // should fail, at capacity
	if ok {
		t.Error("should fail when at capacity")
	}

	pool.Put(obj)
	_, ok = pool.Get() // should succeed now
	if !ok {
		t.Error("should succeed after Put")
	}
}

func TestPoolEmptyInitially(t *testing.T) {
	pool := NewPool(5, newBuffer, resetBuffer)
	if pool.Available() != 0 {
		t.Errorf("Available() = %d, want 0 initially", pool.Available())
	}
	if pool.InUse() != 0 {
		t.Errorf("InUse() = %d, want 0 initially", pool.InUse())
	}
}`,
  solution: `package main

type Pool struct {
	pool    []any
	factory func() any
	reset   func(any)
	maxSize int
	inUse   int
}

func NewPool(maxSize int, factory func() any, reset func(any)) *Pool {
	return &Pool{
		factory: factory,
		reset:   reset,
		maxSize: maxSize,
	}
}

func (p *Pool) Get() (any, bool) {
	if len(p.pool) > 0 {
		obj := p.pool[len(p.pool)-1]
		p.pool = p.pool[:len(p.pool)-1]
		p.inUse++
		return obj, true
	}
	if p.inUse >= p.maxSize {
		return nil, false
	}
	p.inUse++
	return p.factory(), true
}

func (p *Pool) Put(obj any) {
	p.reset(obj)
	p.pool = append(p.pool, obj)
	p.inUse--
}

func (p *Pool) Available() int {
	return len(p.pool)
}

func (p *Pool) InUse() int {
	return p.inUse
}

func main() {}`,
  hints: [
    'Use a slice as a stack for available objects: pop from the end on Get, push on Put.',
    'Track inUse count: increment on Get (whether from pool or factory), decrement on Put.',
    'Get fails when pool is empty AND inUse >= maxSize. It creates via factory when pool is empty but under capacity.',
  ],
}

export default exercise
