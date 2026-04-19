import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_18_worker_pool',
  title: 'Worker Pool',
  category: 'Concurrency',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 18,
  description: `A worker pool limits concurrency by using a fixed number of goroutines to process jobs:

\`\`\`
func workerPool(numWorkers int, jobs <-chan Job, results chan<- Result) {
    var wg sync.WaitGroup
    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                results <- process(job)
            }
        }()
    }
    wg.Wait()
    close(results)
}
\`\`\`

Benefits:
- **Limits resource usage** (memory, CPU, connections)
- **Backpressure** — if workers are busy, job senders block
- **Graceful shutdown** — close the jobs channel to stop workers

Your task: implement a worker pool pattern.`,
  code: `package main

import "sync"

// Job represents work to be done.
type Job struct {
	ID    int
	Input int
}

// Result represents the output of a job.
type Result struct {
	JobID  int
	Output int
}

// WorkerPool processes jobs with a fixed number of workers.
// Each worker takes a Job and produces a Result where Output = Input * Input.
// Returns all results (order doesn't matter).
func WorkerPool(numWorkers int, jobs []Job) []Result {
	// TODO: Create job and result channels
	// Launch numWorkers goroutines
	// Send all jobs
	// Collect all results
	return nil
}

// MapPool applies fn to each item using numWorkers goroutines.
// Returns results in the same order as input.
func MapPool(numWorkers int, items []int, fn func(int) int) []int {
	// TODO
	return nil
}

var _ = sync.WaitGroup{}`,
  testCode: `package main

import (
	"sort"
	"testing"
)

func TestWorkerPool(t *testing.T) {
	jobs := []Job{
		{ID: 1, Input: 2},
		{ID: 2, Input: 3},
		{ID: 3, Input: 4},
		{ID: 4, Input: 5},
	}
	results := WorkerPool(2, jobs)
	if len(results) != 4 {
		t.Fatalf("got %d results, want 4", len(results))
	}

	// Sort by JobID for deterministic checking
	sort.Slice(results, func(i, j int) bool {
		return results[i].JobID < results[j].JobID
	})

	expected := []int{4, 9, 16, 25}
	for i, r := range results {
		if r.Output != expected[i] {
			t.Errorf("job %d: got %d, want %d", r.JobID, r.Output, expected[i])
		}
	}
}

func TestWorkerPoolEmpty(t *testing.T) {
	results := WorkerPool(3, []Job{})
	if len(results) != 0 {
		t.Errorf("got %d results, want 0", len(results))
	}
}

func TestWorkerPoolSingleWorker(t *testing.T) {
	jobs := []Job{{ID: 1, Input: 10}}
	results := WorkerPool(1, jobs)
	if len(results) != 1 || results[0].Output != 100 {
		t.Errorf("got %v, want [{1 100}]", results)
	}
}

func TestMapPool(t *testing.T) {
	items := []int{1, 2, 3, 4, 5}
	got := MapPool(3, items, func(x int) int { return x * 2 })
	want := []int{2, 4, 6, 8, 10}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestMapPoolPreservesOrder(t *testing.T) {
	items := []int{5, 4, 3, 2, 1}
	got := MapPool(2, items, func(x int) int { return x * 10 })
	want := []int{50, 40, 30, 20, 10}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestMapPoolEmpty(t *testing.T) {
	got := MapPool(3, []int{}, func(x int) int { return x })
	if len(got) != 0 {
		t.Errorf("got %v, want empty", got)
	}
}`,
  solution: `package main

import "sync"

type Job struct {
	ID    int
	Input int
}

type Result struct {
	JobID  int
	Output int
}

func WorkerPool(numWorkers int, jobs []Job) []Result {
	if len(jobs) == 0 {
		return nil
	}

	jobsCh := make(chan Job, len(jobs))
	resultsCh := make(chan Result, len(jobs))

	// Start workers
	var wg sync.WaitGroup
	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for job := range jobsCh {
				resultsCh <- Result{
					JobID:  job.ID,
					Output: job.Input * job.Input,
				}
			}
		}()
	}

	// Send jobs
	for _, job := range jobs {
		jobsCh <- job
	}
	close(jobsCh)

	// Wait and close results
	go func() {
		wg.Wait()
		close(resultsCh)
	}()

	// Collect results
	var results []Result
	for r := range resultsCh {
		results = append(results, r)
	}
	return results
}

func MapPool(numWorkers int, items []int, fn func(int) int) []int {
	if len(items) == 0 {
		return nil
	}

	type indexedJob struct {
		index int
		value int
	}

	jobs := make(chan indexedJob, len(items))
	results := make([]int, len(items))
	var wg sync.WaitGroup

	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for job := range jobs {
				results[job.index] = fn(job.value)
			}
		}()
	}

	for i, item := range items {
		jobs <- indexedJob{index: i, value: item}
	}
	close(jobs)
	wg.Wait()

	return results
}`,
  hints: [
    'WorkerPool: create a jobs channel and results channel. Launch workers that range over jobs. Send all jobs, close the channel, wait for workers, close results.',
    'MapPool: use an indexed job struct {index, value} so workers write to results[index]. This preserves input order without sorting.',
    'Key pattern: send jobs → close jobs channel → workers exit range loop → WaitGroup signals → close results channel.'
  ],
}

export default exercise
