import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-pool-02',
  title: 'Connection Pool — Health Checks',
  category: 'Projects',
  subcategory: 'Connection Pool',
  difficulty: 'intermediate',
  order: 138,
  projectId: 'proj-pool',
  step: 2,
  totalSteps: 6,
  description: `Add health checking to the pool. When retrieving a connection, verify it is still healthy before
handing it out.

**Changes to Get():**
- When pulling an idle connection, call \`IsHealthy()\`
- If unhealthy, \`Close()\` it (decrement created count) and try the next idle connection
- If no healthy idle connections remain, create a new one via factory (if under max)

**New method:**
- \`ActiveCount() int\` — returns the number of connections currently checked out (created minus idle)

**Key insight:** Unhealthy connections must be closed AND the created counter decremented so the pool
can create replacements without hitting the max limit.`,
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
// - Check idle connections for health, closing unhealthy ones
// - Decrement created count for each closed unhealthy connection
// - Create new via factory if under max
// - Return "pool exhausted" if at max with no healthy idle conns

// TODO: Implement Put(conn Conn)

// TODO: Implement Len() int

// TODO: Implement ActiveCount() int
// - Return created - len(idle)

func main() {}
`,
  testCode: `package main

import (
\t"sync"
\t"testing"
)

type mockConn struct {
\tid      int
\tclosed  bool
\thealthy bool
}

func (c *mockConn) ID() int         { return c.id }
func (c *mockConn) Close() error    { c.closed = true; return nil }
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

func TestHealthyConnectionReused(t *testing.T) {
\tp := NewPool(mockFactory(), 5)
\tc, _ := p.Get()
\torigID := c.ID()
\tp.Put(c)
\tc2, err := p.Get()
\tif err != nil {
\t\tt.Fatalf("Get failed: %v", err)
\t}
\tif c2.ID() != origID {
\t\tt.Errorf("expected reused conn %d, got %d", origID, c2.ID())
\t}
}

func TestUnhealthyConnectionDiscarded(t *testing.T) {
\tp := NewPool(mockFactory(), 5)
\tc, _ := p.Get()
\t// Mark as unhealthy before returning
\tc.(*mockConn).healthy = false
\tp.Put(c)

\tc2, err := p.Get()
\tif err != nil {
\t\tt.Fatalf("Get failed: %v", err)
\t}
\tif c2.ID() == c.ID() {
\t\tt.Error("should not reuse unhealthy connection")
\t}
\t// Original should be closed
\tif !c.(*mockConn).closed {
\t\tt.Error("unhealthy connection should have been closed")
\t}
}

func TestMultipleUnhealthyDiscarded(t *testing.T) {
\tp := NewPool(mockFactory(), 5)
\tconns := make([]Conn, 3)
\tfor i := 0; i < 3; i++ {
\t\tc, _ := p.Get()
\t\tconns[i] = c
\t}
\t// Mark all as unhealthy
\tfor _, c := range conns {
\t\tc.(*mockConn).healthy = false
\t\tp.Put(c)
\t}

\t// Get should discard all 3 and create a new one
\tc, err := p.Get()
\tif err != nil {
\t\tt.Fatalf("Get failed: %v", err)
\t}
\tif c.ID() <= 3 {
\t\tt.Errorf("expected new conn with ID > 3, got %d", c.ID())
\t}
\tfor _, mc := range conns {
\t\tif !mc.(*mockConn).closed {
\t\t\tt.Errorf("conn %d should have been closed", mc.ID())
\t\t}
\t}
}

func TestActiveCount(t *testing.T) {
\tp := NewPool(mockFactory(), 5)
\tif p.ActiveCount() != 0 {
\t\tt.Errorf("expected 0 active, got %d", p.ActiveCount())
\t}
\tc1, _ := p.Get()
\tc2, _ := p.Get()
\tif p.ActiveCount() != 2 {
\t\tt.Errorf("expected 2 active, got %d", p.ActiveCount())
\t}
\tp.Put(c1)
\tif p.ActiveCount() != 1 {
\t\tt.Errorf("expected 1 active, got %d", p.ActiveCount())
\t}
\tp.Put(c2)
\tif p.ActiveCount() != 0 {
\t\tt.Errorf("expected 0 active, got %d", p.ActiveCount())
\t}
}

func TestUnhealthyDoesNotBlockMax(t *testing.T) {
\tp := NewPool(mockFactory(), 2)
\tc1, _ := p.Get()
\tc2, _ := p.Get()
\tc1.(*mockConn).healthy = false
\tp.Put(c1)
\tp.Put(c2)

\t// Get should discard c1, reuse c2 — created drops to 1 then stays
\tgot, err := p.Get()
\tif err != nil {
\t\tt.Fatalf("Get failed: %v", err)
\t}
\tif got.ID() != c2.ID() {
\t\tt.Errorf("expected healthy conn %d, got %d", c2.ID(), got.ID())
\t}
}

func TestExhaustedAfterHealthCheck(t *testing.T) {
\tp := NewPool(mockFactory(), 1)
\tc, _ := p.Get()
\t// Don't Put back — pool is at max with 0 idle
\t_, err := p.Get()
\tif err == nil {
\t\tt.Error("expected pool exhausted error")
\t}
\t_ = c
}
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

// Get retrieves a healthy connection from the pool.
func (p *Pool) Get() (Conn, error) {
\tp.mu.Lock()
\tdefer p.mu.Unlock()

\tfor len(p.idle) > 0 {
\t\tc := p.idle[len(p.idle)-1]
\t\tp.idle = p.idle[:len(p.idle)-1]
\t\tif c.IsHealthy() {
\t\t\treturn c, nil
\t\t}
\t\tc.Close()
\t\tp.created--
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

// ActiveCount returns the number of checked-out connections.
func (p *Pool) ActiveCount() int {
\tp.mu.Lock()
\tdefer p.mu.Unlock()
\treturn p.created - len(p.idle)
}

func main() {}
`,
  hints: [
    'Loop through idle connections from the end — discard unhealthy ones with Close() and decrement created.',
    'ActiveCount is simply created minus the number of idle connections.',
    'When an unhealthy connection is discarded, decrement `created` so new connections can be made within the max.',
    'Use a for loop (not just an if) since multiple idle connections might be unhealthy in a row.',
  ],
}

export default exercise
