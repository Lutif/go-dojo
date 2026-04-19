import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_25_graceful_shutdown',
  title: 'Graceful Shutdown',
  category: 'Concurrency',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 25,
  description: `Graceful shutdown lets in-progress work complete while rejecting new work. The pattern:

\`\`\`
ctx, cancel := context.WithCancel(context.Background())

// On shutdown signal:
cancel()              // 1. Signal workers to stop
wg.Wait()             // 2. Wait for in-progress work
close(results)        // 3. Clean up resources
\`\`\`

In real servers, you'd listen for OS signals:
\`\`\`
sig := make(chan os.Signal, 1)
signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
<-sig  // block until signal received
\`\`\`

Your task: implement a service with graceful shutdown.`,
  code: `package main

import (
	"context"
	"sync"
)

// Service processes jobs with graceful shutdown support.
type Service struct {
	// TODO: Add fields for context, cancel, WaitGroup, jobs channel
}

// NewService creates a service with numWorkers workers.
func NewService(numWorkers int) *Service {
	// TODO: Create context, launch workers
	return nil
}

// Submit sends a job to the service. Returns false if service is shut down.
func (s *Service) Submit(job int) bool {
	// TODO: Try to send job, return false if context is cancelled
	return false
}

// Shutdown signals workers to stop and waits for in-progress jobs.
// Returns all completed results.
func (s *Service) Shutdown() []int {
	// TODO: Cancel context, wait for workers, return results
	return nil
}

// ProcessWithShutdown runs a batch of jobs through a service.
// Shuts down after submitting all jobs.
func ProcessWithShutdown(jobs []int, workers int) []int {
	// TODO: Create service, submit all jobs, shutdown
	return nil
}

var _ = context.Background
var _ = sync.WaitGroup{}`,
  testCode: `package main

import (
	"sort"
	"testing"
	"time"
)

func TestServiceBasic(t *testing.T) {
	svc := NewService(2)
	for i := 1; i <= 5; i++ {
		ok := svc.Submit(i)
		if !ok {
			t.Errorf("Submit(%d) returned false", i)
		}
	}
	// Give workers time to process
	time.Sleep(50 * time.Millisecond)
	results := svc.Shutdown()
	sort.Ints(results)

	if len(results) < 1 {
		t.Fatal("expected at least some results")
	}
}

func TestServiceShutdownRejectsNew(t *testing.T) {
	svc := NewService(1)
	svc.Submit(1)
	svc.Shutdown()
	ok := svc.Submit(2)
	if ok {
		t.Error("Submit after Shutdown should return false")
	}
}

func TestProcessWithShutdown(t *testing.T) {
	jobs := []int{1, 2, 3, 4, 5}
	results := ProcessWithShutdown(jobs, 3)
	sort.Ints(results)

	// All jobs should be processed (each squared)
	if len(results) != 5 {
		t.Fatalf("got %d results, want 5: %v", len(results), results)
	}
	want := []int{1, 4, 9, 16, 25}
	for i := range want {
		if results[i] != want[i] {
			t.Errorf("results[%d] = %d, want %d", i, results[i], want[i])
		}
	}
}

func TestProcessWithShutdownEmpty(t *testing.T) {
	results := ProcessWithShutdown([]int{}, 2)
	if len(results) != 0 {
		t.Errorf("got %v, want empty", results)
	}
}

func TestServiceMultipleWorkers(t *testing.T) {
	svc := NewService(4)
	for i := 0; i < 20; i++ {
		svc.Submit(i)
	}
	time.Sleep(50 * time.Millisecond)
	results := svc.Shutdown()
	if len(results) < 1 {
		t.Error("expected at least some results")
	}
}`,
  solution: `package main

import (
	"context"
	"sync"
)

type Service struct {
	ctx     context.Context
	cancel  context.CancelFunc
	wg      sync.WaitGroup
	jobs    chan int
	mu      sync.Mutex
	results []int
}

func NewService(numWorkers int) *Service {
	ctx, cancel := context.WithCancel(context.Background())
	s := &Service{
		ctx:    ctx,
		cancel: cancel,
		jobs:   make(chan int, 100),
	}

	for i := 0; i < numWorkers; i++ {
		s.wg.Add(1)
		go func() {
			defer s.wg.Done()
			for {
				select {
				case job, ok := <-s.jobs:
					if !ok {
						return
					}
					result := job * job
					s.mu.Lock()
					s.results = append(s.results, result)
					s.mu.Unlock()
				case <-ctx.Done():
					// Drain remaining jobs
					for job := range s.jobs {
						result := job * job
						s.mu.Lock()
						s.results = append(s.results, result)
						s.mu.Unlock()
					}
					return
				}
			}
		}()
	}

	return s
}

func (s *Service) Submit(job int) bool {
	select {
	case <-s.ctx.Done():
		return false
	default:
	}
	select {
	case s.jobs <- job:
		return true
	case <-s.ctx.Done():
		return false
	}
}

func (s *Service) Shutdown() []int {
	s.cancel()
	close(s.jobs)
	s.wg.Wait()
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.results
}

func ProcessWithShutdown(jobs []int, workers int) []int {
	svc := NewService(workers)
	for _, job := range jobs {
		svc.Submit(job)
	}
	return svc.Shutdown()
}

var _ = context.Background
var _ = sync.WaitGroup{}`,
  hints: [
    'Service: use context.WithCancel for shutdown signaling, a buffered jobs channel, WaitGroup for workers, Mutex for results.',
    'Submit: check ctx.Done() first (non-blocking), then try to send on jobs channel. Return false if cancelled.',
    'Shutdown: cancel the context, close the jobs channel, wg.Wait(). Workers should drain remaining jobs from the channel before exiting.'
  ],
}

export default exercise
