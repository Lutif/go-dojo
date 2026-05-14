import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-pool-01',
  title: 'Connection Pool — Basic Pool with Factory',
  category: 'Projects',
  subcategory: 'Connection Pool',
  difficulty: 'intermediate',
  order: 137,
  projectId: 'proj-pool',
  projectTitle: 'Connection Pool',
  step: 1,
  totalSteps: 6,
  description: `Build a production-grade connection pool from scratch! In this first step, implement the core
pool structure with a factory pattern for creating connections.

**Interfaces & Types:**
- \`Conn\` interface with \`ID() int\`, \`Close() error\`, \`IsHealthy() bool\`
- \`Factory\` type: \`func() (Conn, error)\`

**Pool Implementation:**
- \`NewPool(factory Factory, maxSize int) *Pool\`
- \`Get() (Conn, error)\` — retrieve an idle connection, or create one via factory if under max capacity
- \`Put(conn Conn)\` — return a connection to the idle pool
- \`Len() int\` — number of idle connections currently in the pool

**Rules:**
- If the pool has reached \`maxSize\` total connections and none are idle, return an error \`"pool exhausted"\`
- Track total created connections to enforce the max
- Use a mutex for thread safety`,
  code: `package main

import (
\t"errors"
\t"sync"
)

// Conn represents a pooled connection.
type Conn interface {
\tID() int
\tClose() error
\tIsHealthy() bool
}

// Factory creates new connections.
type Factory func() (Conn, error)

// Pool manages a set of reusable connections.
type Pool struct {
\tmu      sync.Mutex
\tfactory Factory
\tidle    []Conn
\tmaxSize int
\tcreated int
}

// TODO: Implement NewPool(factory Factory, maxSize int) *Pool

// TODO: Implement Get() (Conn, error)
// - If idle connections exist, return one
// - If under maxSize, create a new one via factory
// - Otherwise return errors.New("pool exhausted")

// TODO: Implement Put(conn Conn)
// - Return the connection to the idle slice

// TODO: Implement Len() int
// - Return the number of idle connections

func main() {}
`,
  testCode: `package main

import (
\t"fmt"
\t"sync"
\t"testing"
)

// mockConn is a test double for Conn.
type mockConn struct {
\tid      int
\tclosed  bool
\thealthy bool
}

func (c *mockConn) ID() int        { return c.id }
func (c *mockConn) Close() error   { c.closed = true; return nil }
func (c *mockConn) IsHealthy() bool { return c.healthy }

func mockFactory() Factory {
\tvar mu sync.Mutex
\tnext := 0
\treturn func() (Conn, error) {
\t\tmu.Lock()
\t\tnext++
\t\tid := next
\t\tmu.Unlock()
\t\treturn &mockConn{id: id, healthy: true}, nil
\t}
}

func TestNewPool(t *testing.T) {
\tp := NewPool(mockFactory(), 5)
\tif p == nil {
\t\tt.Fatal("NewPool returned nil")
\t}
\tif p.Len() != 0 {
\t\tt.Errorf("new pool should have 0 idle, got %d", p.Len())
\t}
}

func TestGetCreatesConnection(t *testing.T) {
\tp := NewPool(mockFactory(), 5)
\tc, err := p.Get()
\tif err != nil {
\t\tt.Fatalf("Get failed: %v", err)
\t}
\tif c.ID() != 1 {
\t\tt.Errorf("expected ID 1, got %d", c.ID())
\t}
}

func TestPutAndReuse(t *testing.T) {
\tp := NewPool(mockFactory(), 5)
\tc, _ := p.Get()
\tp.Put(c)
\tif p.Len() != 1 {
\t\tt.Errorf("expected 1 idle, got %d", p.Len())
\t}
\tc2, _ := p.Get()
\tif c2.ID() != c.ID() {
\t\tt.Errorf("expected reused conn ID %d, got %d", c.ID(), c2.ID())
\t}
\tif p.Len() != 0 {
\t\tt.Errorf("expected 0 idle after Get, got %d", p.Len())
\t}
}

func TestPoolExhausted(t *testing.T) {
\tp := NewPool(mockFactory(), 2)
\t_, _ = p.Get()
\t_, _ = p.Get()
\t_, err := p.Get()
\tif err == nil {
\t\tt.Fatal("expected pool exhausted error")
\t}
\tif err.Error() != "pool exhausted" {
\t\tt.Errorf("expected \\"pool exhausted\\", got %q", err.Error())
\t}
}

func TestPutThenGetDoesNotExceedMax(t *testing.T) {
\tp := NewPool(mockFactory(), 2)
\tc1, _ := p.Get()
\tc2, _ := p.Get()
\tp.Put(c1)
\tc3, err := p.Get()
\tif err != nil {
\t\tt.Fatalf("Get after Put should succeed: %v", err)
\t}
\tif c3.ID() != c1.ID() {
\t\tt.Errorf("expected reused conn %d, got %d", c1.ID(), c3.ID())
\t}
\t_ = c2
}

func TestConcurrentAccess(t *testing.T) {
\tp := NewPool(mockFactory(), 10)
\tvar wg sync.WaitGroup
\terrs := make(chan error, 20)
\tfor i := 0; i < 10; i++ {
\t\twg.Add(1)
\t\tgo func() {
\t\t\tdefer wg.Done()
\t\t\tc, err := p.Get()
\t\t\tif err != nil {
\t\t\t\terrs <- err
\t\t\t\treturn
\t\t\t}
\t\t\tp.Put(c)
\t\t}()
\t}
\twg.Wait()
\tclose(errs)
\tfor err := range errs {
\t\tt.Errorf("concurrent error: %v", err)
\t}
}

func TestLenAccuracy(t *testing.T) {
\tp := NewPool(mockFactory(), 5)
\tconns := make([]Conn, 3)
\tfor i := 0; i < 3; i++ {
\t\tc, _ := p.Get()
\t\tconns[i] = c
\t}
\tif p.Len() != 0 {
\t\tt.Errorf("expected 0 idle while all checked out, got %d", p.Len())
\t}
\tfor _, c := range conns {
\t\tp.Put(c)
\t}
\tif p.Len() != 3 {
\t\tt.Errorf("expected 3 idle after returning all, got %d", p.Len())
\t}
}

// Silence the fmt import if needed.
var _ = fmt.Sprintf
`,
  solution: `package main

import (
\t"errors"
\t"sync"
)

// Conn represents a pooled connection.
type Conn interface {
\tID() int
\tClose() error
\tIsHealthy() bool
}

// Factory creates new connections.
type Factory func() (Conn, error)

// Pool manages a set of reusable connections.
type Pool struct {
\tmu      sync.Mutex
\tfactory Factory
\tidle    []Conn
\tmaxSize int
\tcreated int
}

// NewPool creates a new connection pool.
func NewPool(factory Factory, maxSize int) *Pool {
\treturn &Pool{
\t\tfactory: factory,
\t\tidle:    make([]Conn, 0),
\t\tmaxSize: maxSize,
\t}
}

// Get retrieves a connection from the pool.
func (p *Pool) Get() (Conn, error) {
\tp.mu.Lock()
\tdefer p.mu.Unlock()

\tif len(p.idle) > 0 {
\t\tc := p.idle[len(p.idle)-1]
\t\tp.idle = p.idle[:len(p.idle)-1]
\t\treturn c, nil
\t}

\tif p.created >= p.maxSize {
\t\treturn nil, errors.New("pool exhausted")
\t}

\tc, err := p.factory()
\tif err != nil {
\t\treturn nil, err
\t}
\tp.created++
\treturn c, nil
}

// Put returns a connection to the pool.
func (p *Pool) Put(conn Conn) {
\tp.mu.Lock()
\tdefer p.mu.Unlock()
\tp.idle = append(p.idle, conn)
}

// Len returns the number of idle connections.
func (p *Pool) Len() int {
\tp.mu.Lock()
\tdefer p.mu.Unlock()
\treturn len(p.idle)
}

func main() {}
`,
  hints: [
    'Use a slice to store idle connections — pop from the end for O(1) retrieval.',
    'Track `created` count separately from idle length to enforce maxSize across all connections (idle + active).',
    'Use sync.Mutex and defer p.mu.Unlock() after every Lock() for clean thread safety.',
    'When Get() finds idle connections, take from the end of the slice to avoid copying.',
  ],
}

export default exercise
