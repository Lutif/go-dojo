import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-pool-03',
  title: 'Connection Pool — Idle Timeout',
  category: 'Projects',
  subcategory: 'Connection Pool',
  difficulty: 'advanced',
  order: 139,
  projectId: 'proj-pool',
  step: 3,
  totalSteps: 6,
  description: `Add idle timeout to the pool. Connections that sit idle too long become stale and should be
closed rather than reused.

**New types:**
- \`idleConn\` struct wrapping a \`Conn\` and a \`returnedAt time.Time\`

**New constructor:**
- \`NewPoolWithTimeout(factory Factory, maxSize int, idleTimeout time.Duration) *Pool\`

**Changes to Get():**
- Before checking health, check if the connection has been idle longer than \`idleTimeout\`
- Expired connections are closed and the created count decremented

**New method:**
- \`CleanIdle() int\` — proactively scan idle connections, close expired ones, return the number removed

**Tip:** Store idle connections as \`idleConn\` structs instead of bare \`Conn\` so each one carries its timestamp.`,
  code: `package main

import (
\t"errors"
\t"sync"
\t"time"
)

// Conn represents a pooled connection.
type Conn interface {
\tID() int
\tClose() error
\tIsHealthy() bool
}

// Factory creates new connections.
type Factory func() (Conn, error)

// idleConn wraps a connection with the time it was returned to the pool.
type idleConn struct {
\tconn       Conn
\treturnedAt time.Time
}

// Pool manages a set of reusable connections with idle timeout.
type Pool struct {
\tmu          sync.Mutex
\tfactory     Factory
\tidle        []idleConn
\tmaxSize     int
\tcreated     int
\tidleTimeout time.Duration
}

// TODO: Implement NewPoolWithTimeout(factory Factory, maxSize int, idleTimeout time.Duration) *Pool

// TODO: Implement Get() (Conn, error)
// - Skip connections that have been idle longer than idleTimeout
// - Skip unhealthy connections
// - Close and decrement created for skipped connections
// - Create new if under max, else return "pool exhausted"

// TODO: Implement Put(conn Conn)
// - Wrap conn with current time and append to idle

// TODO: Implement Len() int

// TODO: Implement ActiveCount() int

// TODO: Implement CleanIdle() int
// - Remove and close all expired idle connections
// - Return the count of removed connections

func main() {}
`,
  testCode: `package main

import (
\t"sync"
\t"testing"
\t"time"
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

func TestFreshConnectionSurvives(t *testing.T) {
\tp := NewPoolWithTimeout(mockFactory(), 5, 1*time.Hour)
\tc, _ := p.Get()
\torigID := c.ID()
\tp.Put(c)
\t// Should be reused — well within timeout
\tc2, err := p.Get()
\tif err != nil {
\t\tt.Fatalf("Get failed: %v", err)
\t}
\tif c2.ID() != origID {
\t\tt.Errorf("expected reused conn %d, got %d", origID, c2.ID())
\t}
}

func TestExpiredConnectionDiscarded(t *testing.T) {
\tp := NewPoolWithTimeout(mockFactory(), 5, 50*time.Millisecond)
\tc, _ := p.Get()
\tp.Put(c)
\ttime.Sleep(100 * time.Millisecond)

\tc2, err := p.Get()
\tif err != nil {
\t\tt.Fatalf("Get failed: %v", err)
\t}
\tif c2.ID() == c.ID() {
\t\tt.Error("should not reuse expired connection")
\t}
\tif !c.(*mockConn).closed {
\t\tt.Error("expired connection should be closed")
\t}
}

func TestCleanIdleRemovesExpired(t *testing.T) {
\tp := NewPoolWithTimeout(mockFactory(), 5, 50*time.Millisecond)
\tconns := make([]Conn, 3)
\tfor i := 0; i < 3; i++ {
\t\tc, _ := p.Get()
\t\tconns[i] = c
\t}
\tfor _, c := range conns {
\t\tp.Put(c)
\t}
\ttime.Sleep(100 * time.Millisecond)

\tremoved := p.CleanIdle()
\tif removed != 3 {
\t\tt.Errorf("expected 3 removed, got %d", removed)
\t}
\tif p.Len() != 0 {
\t\tt.Errorf("expected 0 idle after clean, got %d", p.Len())
\t}
\tfor _, c := range conns {
\t\tif !c.(*mockConn).closed {
\t\t\tt.Errorf("conn %d should be closed", c.ID())
\t\t}
\t}
}

func TestCleanIdleKeepsFresh(t *testing.T) {
\tp := NewPoolWithTimeout(mockFactory(), 5, 1*time.Hour)
\tc, _ := p.Get()
\tp.Put(c)
\tremoved := p.CleanIdle()
\tif removed != 0 {
\t\tt.Errorf("expected 0 removed, got %d", removed)
\t}
\tif p.Len() != 1 {
\t\tt.Errorf("expected 1 idle, got %d", p.Len())
\t}
}

func TestMixedFreshAndExpired(t *testing.T) {
\tp := NewPoolWithTimeout(mockFactory(), 5, 50*time.Millisecond)
\tc1, _ := p.Get()
\tp.Put(c1)
\ttime.Sleep(100 * time.Millisecond)
\t// c1 is now expired

\tc2, _ := p.Get() // should discard c1, create new
\tp.Put(c2)        // c2 is fresh

\tif p.Len() != 1 {
\t\tt.Fatalf("expected 1 idle, got %d", p.Len())
\t}
\tremoved := p.CleanIdle()
\tif removed != 0 {
\t\tt.Errorf("fresh conn should survive, removed %d", removed)
\t}
}

func TestExpiredDoesNotBlockMax(t *testing.T) {
\tp := NewPoolWithTimeout(mockFactory(), 1, 50*time.Millisecond)
\tc, _ := p.Get()
\tp.Put(c)
\ttime.Sleep(100 * time.Millisecond)

\tc2, err := p.Get()
\tif err != nil {
\t\tt.Fatalf("Get should succeed after expired conn is cleaned: %v", err)
\t}
\tif c2.ID() == c.ID() {
\t\tt.Error("should not reuse expired connection")
\t}
}
`,
  solution: `package main

import (
\t"errors"
\t"sync"
\t"time"
)

// Conn represents a pooled connection.
type Conn interface {
\tID() int
\tClose() error
\tIsHealthy() bool
}

// Factory creates new connections.
type Factory func() (Conn, error)

// idleConn wraps a connection with the time it was returned to the pool.
type idleConn struct {
\tconn       Conn
\treturnedAt time.Time
}

// Pool manages a set of reusable connections with idle timeout.
type Pool struct {
\tmu          sync.Mutex
\tfactory     Factory
\tidle        []idleConn
\tmaxSize     int
\tcreated     int
\tidleTimeout time.Duration
}

// NewPoolWithTimeout creates a pool with idle connection timeout.
func NewPoolWithTimeout(factory Factory, maxSize int, idleTimeout time.Duration) *Pool {
\treturn &Pool{
\t\tfactory:     factory,
\t\tidle:        make([]idleConn, 0),
\t\tmaxSize:     maxSize,
\t\tidleTimeout: idleTimeout,
\t}
}

// Get retrieves a healthy, non-expired connection from the pool.
func (p *Pool) Get() (Conn, error) {
\tp.mu.Lock()
\tdefer p.mu.Unlock()

\tnow := time.Now()
\tfor len(p.idle) > 0 {
\t\tic := p.idle[len(p.idle)-1]
\t\tp.idle = p.idle[:len(p.idle)-1]
\t\tif now.Sub(ic.returnedAt) > p.idleTimeout {
\t\t\tic.conn.Close()
\t\t\tp.created--
\t\t\tcontinue
\t\t}
\t\tif !ic.conn.IsHealthy() {
\t\t\tic.conn.Close()
\t\t\tp.created--
\t\t\tcontinue
\t\t}
\t\treturn ic.conn, nil
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
\tp.idle = append(p.idle, idleConn{conn: conn, returnedAt: time.Now()})
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

// CleanIdle removes and closes expired idle connections.
func (p *Pool) CleanIdle() int {
\tp.mu.Lock()
\tdefer p.mu.Unlock()

\tnow := time.Now()
\tremoved := 0
\tkept := make([]idleConn, 0, len(p.idle))
\tfor _, ic := range p.idle {
\t\tif now.Sub(ic.returnedAt) > p.idleTimeout {
\t\t\tic.conn.Close()
\t\t\tp.created--
\t\t\tremoved++
\t\t} else {
\t\t\tkept = append(kept, ic)
\t\t}
\t}
\tp.idle = kept
\treturn removed
}

func main() {}
`,
  hints: [
    'Wrap each idle connection in a struct that records time.Now() when Put() is called.',
    'In Get(), check time.Since(ic.returnedAt) > idleTimeout before checking health.',
    'For CleanIdle(), iterate all idle connections — keep fresh ones in a new slice, close expired ones.',
    'Remember to decrement `created` for every connection you close (expired or unhealthy).',
  ],
}

export default exercise
