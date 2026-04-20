import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_18_graceful_shutdown',
  title: 'Graceful Shutdown',
  category: 'Patterns',
  subcategory: 'Resilience Patterns',
  difficulty: 'advanced',
  order: 18,
  description: `Implement graceful shutdown that waits for in-progress work to complete before exiting.

In production systems, abrupt shutdowns can corrupt data or leave operations half-finished. Graceful shutdown signals workers to stop, waits for them to finish, then exits cleanly.

Your tasks:

1. Define a \`Server\` struct that manages workers using context cancellation and a WaitGroup:
   - \`ctx\` (context.Context) - for cancellation
   - \`cancel\` (context.CancelFunc) - to trigger shutdown
   - \`wg\` (sync.WaitGroup) - to wait for workers
   - \`running\` (bool) - whether server is running
   - A mutex for thread safety

2. Implement \`NewServer() *Server\` - creates a server with a cancellable context.

3. Implement \`(s *Server) AddWorker(name string, work func(ctx context.Context))\`:
   - Increments the WaitGroup
   - Launches a goroutine that calls work(ctx)
   - When work returns, calls wg.Done()
   - Sets running to true

4. Implement \`(s *Server) Shutdown() []string\`:
   - Calls cancel() to signal all workers
   - Waits for all workers to finish (wg.Wait)
   - Sets running to false
   - Returns the names of workers that were registered (in order added)

5. Implement \`(s *Server) IsRunning() bool\`.`,
  code: `package main

import (
	"context"
	"sync"
)

// TODO: Define Server struct with ctx, cancel, wg, running, mu, and workerNames []string

// TODO: Implement NewServer() *Server
// Create a context with cancel and return initialized Server

// TODO: Implement (s *Server) AddWorker(name string, work func(ctx context.Context))
// Add wg, launch goroutine, track worker name

// TODO: Implement (s *Server) Shutdown() []string
// Cancel context, wait for workers, set running=false, return worker names

// TODO: Implement (s *Server) IsRunning() bool

var _ context.Context
var _ = sync.WaitGroup{}

func main() {}`,
  testCode: `package main

import (
	"context"
	"sync"
	"testing"
	"time"
)

func TestNewServer(t *testing.T) {
	s := NewServer()
	if s.IsRunning() {
		t.Error("new server should not be running")
	}
}

func TestAddWorkerAndShutdown(t *testing.T) {
	s := NewServer()
	var done bool
	var mu sync.Mutex

	s.AddWorker("worker1", func(ctx context.Context) {
		<-ctx.Done()
		mu.Lock()
		done = true
		mu.Unlock()
	})

	if !s.IsRunning() {
		t.Error("server should be running after adding worker")
	}

	names := s.Shutdown()

	mu.Lock()
	if !done {
		t.Error("worker should have completed")
	}
	mu.Unlock()

	if !s.IsRunning() == true {
		// server should not be running after shutdown
	}
	if s.IsRunning() {
		t.Error("server should not be running after shutdown")
	}

	if len(names) != 1 || names[0] != "worker1" {
		t.Errorf("expected [worker1], got %v", names)
	}
}

func TestMultipleWorkers(t *testing.T) {
	s := NewServer()
	results := make([]string, 0)
	var mu sync.Mutex

	s.AddWorker("alpha", func(ctx context.Context) {
		<-ctx.Done()
		mu.Lock()
		results = append(results, "alpha")
		mu.Unlock()
	})

	s.AddWorker("beta", func(ctx context.Context) {
		<-ctx.Done()
		mu.Lock()
		results = append(results, "beta")
		mu.Unlock()
	})

	names := s.Shutdown()

	mu.Lock()
	if len(results) != 2 {
		t.Errorf("expected 2 workers done, got %d", len(results))
	}
	mu.Unlock()

	if len(names) != 2 {
		t.Errorf("expected 2 names, got %d", len(names))
	}
	if names[0] != "alpha" || names[1] != "beta" {
		t.Errorf("expected [alpha, beta], got %v", names)
	}
}

func TestWorkerDoesWorkBeforeShutdown(t *testing.T) {
	s := NewServer()
	counter := 0
	var mu sync.Mutex

	s.AddWorker("counter", func(ctx context.Context) {
		for {
			select {
			case <-ctx.Done():
				return
			default:
				mu.Lock()
				counter++
				mu.Unlock()
				time.Sleep(10 * time.Millisecond)
			}
		}
	})

	time.Sleep(55 * time.Millisecond)
	s.Shutdown()

	mu.Lock()
	if counter < 3 {
		t.Errorf("expected counter >= 3, got %d", counter)
	}
	mu.Unlock()
}

func TestShutdownReturnsWorkerNames(t *testing.T) {
	s := NewServer()

	s.AddWorker("db", func(ctx context.Context) { <-ctx.Done() })
	s.AddWorker("cache", func(ctx context.Context) { <-ctx.Done() })
	s.AddWorker("queue", func(ctx context.Context) { <-ctx.Done() })

	names := s.Shutdown()
	expected := []string{"db", "cache", "queue"}
	if len(names) != len(expected) {
		t.Fatalf("expected %d names, got %d", len(expected), len(names))
	}
	for i, name := range expected {
		if names[i] != name {
			t.Errorf("expected name %q at index %d, got %q", name, i, names[i])
		}
	}
}`,
  solution: `package main

import (
	"context"
	"sync"
)

type Server struct {
	ctx         context.Context
	cancel      context.CancelFunc
	wg          sync.WaitGroup
	running     bool
	mu          sync.Mutex
	workerNames []string
}

func NewServer() *Server {
	ctx, cancel := context.WithCancel(context.Background())
	return &Server{
		ctx:    ctx,
		cancel: cancel,
	}
}

func (s *Server) AddWorker(name string, work func(ctx context.Context)) {
	s.mu.Lock()
	s.workerNames = append(s.workerNames, name)
	s.running = true
	s.mu.Unlock()

	s.wg.Add(1)
	go func() {
		defer s.wg.Done()
		work(s.ctx)
	}()
}

func (s *Server) Shutdown() []string {
	s.cancel()
	s.wg.Wait()

	s.mu.Lock()
	defer s.mu.Unlock()
	s.running = false
	names := make([]string, len(s.workerNames))
	copy(names, s.workerNames)
	return names
}

func (s *Server) IsRunning() bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.running
}

func main() {}`,
  hints: [
    'Use context.WithCancel(context.Background()) to create a cancellable context in NewServer.',
    'In AddWorker, call wg.Add(1) before launching the goroutine, and defer wg.Done() inside the goroutine.',
    'Workers should select on ctx.Done() to know when to stop. The test workers use <-ctx.Done() to block until shutdown.',
    'In Shutdown, call cancel() first, then wg.Wait() to ensure all workers finish before returning.',
  ],
}

export default exercise
