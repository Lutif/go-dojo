import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_06_connection_pool',
  title: 'Connection Pool',
  category: 'Networking',
  subcategory: 'TCP',
  difficulty: 'advanced',
  order: 6,
  description: `Implement a connection pool that manages reusable TCP connections. Connection pools avoid the overhead of establishing a new connection for every request by keeping a pool of idle connections ready for use.

Key concepts:
- A pool has a maximum size and tracks idle connections
- \`Get()\` returns an idle connection or creates a new one (up to the max)
- \`Put(conn)\` returns a connection to the pool for reuse
- \`Close()\` shuts down the pool and closes all connections
- Thread safety is essential since multiple goroutines share the pool

Example pool usage pattern:

    pool := NewPool("127.0.0.1:8080", 5)
    defer pool.Close()

    conn, err := pool.Get()       // borrow a connection
    // ... use conn ...
    pool.Put(conn)                 // return it to pool

Your task:
1. Implement \`NewPool(addr string, maxConns int) *Pool\` -- creates a pool that dials the given address
2. Implement \`(*Pool) Get() (net.Conn, error)\` -- returns an idle connection or dials a new one (error if pool is closed or at max active connections)
3. Implement \`(*Pool) Put(conn net.Conn)\` -- returns a connection to the idle list (closes it if pool is closed)
4. Implement \`(*Pool) Close()\` -- closes all idle connections and marks pool closed
5. Implement \`(*Pool) Len() int\` -- returns the number of idle connections currently in the pool`,
  code: `package main

import (
	"net"
	"sync"
)

// Pool manages a pool of reusable TCP connections.
type Pool struct {
	addr     string
	maxConns int
	mu       sync.Mutex
	// TODO: Add fields for idle connections, active count, closed state
}

// NewPool creates a connection pool for the given address with a max connection limit.
// TODO: Implement this function
func NewPool(addr string, maxConns int) *Pool {
	return nil
}

// Get retrieves an idle connection from the pool or creates a new one.
// Returns an error if the pool is closed or max connections are reached.
// TODO: Implement this function
func (p *Pool) Get() (net.Conn, error) {
	return nil, nil
}

// Put returns a connection to the pool for reuse.
// If the pool is closed, the connection is closed instead.
// TODO: Implement this function
func (p *Pool) Put(conn net.Conn) {
}

// Close shuts down the pool and closes all idle connections.
// TODO: Implement this function
func (p *Pool) Close() {
}

// Len returns the number of idle connections in the pool.
// TODO: Implement this function
func (p *Pool) Len() int {
	return 0
}

func main() {}`,
  testCode: `package main

import (
	"fmt"
	"io"
	"net"
	"testing"
)

func startEchoServer(t *testing.T) net.Listener {
	t.Helper()
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("listen: %v", err)
	}
	go func() {
		for {
			conn, err := ln.Accept()
			if err != nil {
				return
			}
			go func(c net.Conn) {
				defer c.Close()
				io.Copy(c, c)
			}(conn)
		}
	}()
	return ln
}

func TestNewPool(t *testing.T) {
	pool := NewPool("127.0.0.1:0", 3)
	if pool == nil {
		t.Fatal("NewPool returned nil")
	}
	if pool.Len() != 0 {
		t.Errorf("new pool Len() = %d, want 0", pool.Len())
	}
}

func TestGetAndPut(t *testing.T) {
	ln := startEchoServer(t)
	defer ln.Close()

	pool := NewPool(ln.Addr().String(), 5)
	defer pool.Close()

	conn1, err := pool.Get()
	if err != nil {
		t.Fatalf("Get() error: %v", err)
	}

	// Write and read to verify connection works
	msg := "hello pool"
	fmt.Fprint(conn1, msg)
	buf := make([]byte, len(msg))
	_, err = io.ReadFull(conn1, buf)
	if err != nil {
		t.Fatalf("read error: %v", err)
	}
	if string(buf) != msg {
		t.Errorf("got %q, want %q", string(buf), msg)
	}

	// Return connection to pool
	pool.Put(conn1)
	if pool.Len() != 1 {
		t.Errorf("after Put, Len() = %d, want 1", pool.Len())
	}

	// Get should return the pooled connection
	conn2, err := pool.Get()
	if err != nil {
		t.Fatalf("second Get() error: %v", err)
	}
	if pool.Len() != 0 {
		t.Errorf("after second Get, Len() = %d, want 0", pool.Len())
	}

	// Verify reuse: conn2 should be the same underlying connection
	_ = conn2
	pool.Put(conn2)
}

func TestMaxConnections(t *testing.T) {
	ln := startEchoServer(t)
	defer ln.Close()

	pool := NewPool(ln.Addr().String(), 2)
	defer pool.Close()

	conn1, err := pool.Get()
	if err != nil {
		t.Fatalf("Get 1: %v", err)
	}
	conn2, err := pool.Get()
	if err != nil {
		t.Fatalf("Get 2: %v", err)
	}

	// Third Get should fail because max is 2 and both are active
	_, err = pool.Get()
	if err == nil {
		t.Error("expected error when exceeding max connections, got nil")
	}

	pool.Put(conn1)
	pool.Put(conn2)
}

func TestClosePool(t *testing.T) {
	ln := startEchoServer(t)
	defer ln.Close()

	pool := NewPool(ln.Addr().String(), 5)

	conn, err := pool.Get()
	if err != nil {
		t.Fatalf("Get: %v", err)
	}
	pool.Put(conn)

	pool.Close()

	// Get after close should fail
	_, err = pool.Get()
	if err == nil {
		t.Error("expected error after Close(), got nil")
	}

	if pool.Len() != 0 {
		t.Errorf("after Close, Len() = %d, want 0", pool.Len())
	}
}

func TestPutAfterClose(t *testing.T) {
	ln := startEchoServer(t)
	defer ln.Close()

	pool := NewPool(ln.Addr().String(), 5)

	conn, err := pool.Get()
	if err != nil {
		t.Fatalf("Get: %v", err)
	}

	pool.Close()

	// Put after close should close the connection, not panic
	pool.Put(conn)
	if pool.Len() != 0 {
		t.Errorf("Put after Close: Len() = %d, want 0", pool.Len())
	}
}`,
  solution: `package main

import (
	"errors"
	"net"
	"sync"
)

// Pool manages a pool of reusable TCP connections.
type Pool struct {
	addr     string
	maxConns int
	mu       sync.Mutex
	idle     []net.Conn
	active   int
	closed   bool
}

// NewPool creates a connection pool for the given address with a max connection limit.
func NewPool(addr string, maxConns int) *Pool {
	return &Pool{
		addr:     addr,
		maxConns: maxConns,
		idle:     make([]net.Conn, 0),
	}
}

// Get retrieves an idle connection from the pool or creates a new one.
func (p *Pool) Get() (net.Conn, error) {
	p.mu.Lock()
	defer p.mu.Unlock()

	if p.closed {
		return nil, errors.New("pool is closed")
	}

	// Return an idle connection if available
	if len(p.idle) > 0 {
		conn := p.idle[len(p.idle)-1]
		p.idle = p.idle[:len(p.idle)-1]
		p.active++
		return conn, nil
	}

	// Check if we can create a new connection
	if p.active >= p.maxConns {
		return nil, errors.New("max connections reached")
	}

	conn, err := net.Dial("tcp", p.addr)
	if err != nil {
		return nil, err
	}
	p.active++
	return conn, nil
}

// Put returns a connection to the pool for reuse.
func (p *Pool) Put(conn net.Conn) {
	p.mu.Lock()
	defer p.mu.Unlock()

	p.active--

	if p.closed {
		conn.Close()
		return
	}

	p.idle = append(p.idle, conn)
}

// Close shuts down the pool and closes all idle connections.
func (p *Pool) Close() {
	p.mu.Lock()
	defer p.mu.Unlock()

	p.closed = true
	for _, conn := range p.idle {
		conn.Close()
	}
	p.idle = nil
}

// Len returns the number of idle connections in the pool.
func (p *Pool) Len() int {
	p.mu.Lock()
	defer p.mu.Unlock()
	return len(p.idle)
}

func main() {}`,
  hints: [
    'Use a slice of net.Conn to store idle connections, and an integer to track active (checked-out) connections.',
    'In Get(), first check if there are idle connections to reuse before dialing a new one.',
    'Use a sync.Mutex to protect all pool state -- multiple goroutines will call Get/Put concurrently.',
    'In Put(), decrement the active count and append the connection to idle. If the pool is closed, close the connection instead.',
  ],
}

export default exercise
