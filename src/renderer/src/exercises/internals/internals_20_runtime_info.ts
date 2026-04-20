import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_20_runtime_info',
  title: 'Runtime Introspection',
  category: 'Internals',
  subcategory: 'Runtime',
  difficulty: 'expert',
  order: 20,
  description: `The \`runtime\` package exposes information about the running program:

\`\`\`
runtime.NumGoroutine()  // number of goroutines
runtime.NumCPU()        // number of logical CPUs
runtime.GOOS            // "linux", "darwin", "windows"
runtime.GOARCH          // "amd64", "arm64"
runtime.Version()       // Go version, e.g. "go1.21.0"
runtime.GOMAXPROCS(0)   // current GOMAXPROCS (0 = query without changing)

var m runtime.MemStats
runtime.ReadMemStats(&m)
m.Alloc       // bytes allocated and in use
m.TotalAlloc  // cumulative bytes allocated
m.NumGC       // number of GC cycles
\`\`\`

Your task: query and report runtime information.`,
  code: `package main

import (
	"fmt"
	"runtime"
)

// RuntimeInfo holds information about the Go runtime.
type RuntimeInfo struct {
	GoVersion    string
	OS           string
	Arch         string
	NumCPU       int
	NumGoroutine int
	MaxProcs     int
}

// GetRuntimeInfo returns current runtime information.
func GetRuntimeInfo() RuntimeInfo {
	// TODO: Fill in all fields
	return RuntimeInfo{}
}

// MemoryInfo holds memory statistics.
type MemoryInfo struct {
	AllocMB      float64  // current allocation in MB
	TotalAllocMB float64  // total allocation in MB
	NumGC        uint32   // number of GC cycles
	HeapObjects  uint64   // number of heap objects
}

// GetMemoryInfo returns current memory statistics.
func GetMemoryInfo() MemoryInfo {
	// TODO: Use runtime.ReadMemStats
	return MemoryInfo{}
}

// GoroutinesDelta runs fn and returns the change in goroutine count.
func GoroutinesDelta(fn func()) int {
	// TODO: Count before, run fn, count after
	return 0
}

var _ = runtime.Version
var _ = fmt.Sprintf`,
  testCode: `package main

import (
	"runtime"
	"testing"
	"time"
)

func TestGetRuntimeInfo(t *testing.T) {
	info := GetRuntimeInfo()
	if info.GoVersion == "" {
		t.Error("GoVersion empty")
	}
	if info.OS == "" {
		t.Error("OS empty")
	}
	if info.Arch == "" {
		t.Error("Arch empty")
	}
	if info.NumCPU < 1 {
		t.Error("NumCPU < 1")
	}
	if info.NumGoroutine < 1 {
		t.Error("NumGoroutine < 1")
	}
	if info.MaxProcs < 1 {
		t.Error("MaxProcs < 1")
	}
	if info.OS != runtime.GOOS {
		t.Errorf("OS = %q, want %q", info.OS, runtime.GOOS)
	}
}

func TestGetMemoryInfo(t *testing.T) {
	info := GetMemoryInfo()
	if info.AllocMB <= 0 {
		t.Error("AllocMB should be > 0")
	}
	if info.TotalAllocMB <= 0 {
		t.Error("TotalAllocMB should be > 0")
	}
}

func TestGoroutinesDelta(t *testing.T) {
	blocker := make(chan struct{})
	delta := GoroutinesDelta(func() {
		for i := 0; i < 5; i++ {
			go func() { <-blocker }()
		}
		time.Sleep(50 * time.Millisecond)
	})
	close(blocker)
	if delta < 5 {
		t.Errorf("delta = %d, want >= 5", delta)
	}
}`,
  solution: `package main

import (
	"fmt"
	"runtime"
)

type RuntimeInfo struct {
	GoVersion    string
	OS           string
	Arch         string
	NumCPU       int
	NumGoroutine int
	MaxProcs     int
}

func GetRuntimeInfo() RuntimeInfo {
	return RuntimeInfo{
		GoVersion:    runtime.Version(),
		OS:           runtime.GOOS,
		Arch:         runtime.GOARCH,
		NumCPU:       runtime.NumCPU(),
		NumGoroutine: runtime.NumGoroutine(),
		MaxProcs:     runtime.GOMAXPROCS(0),
	}
}

type MemoryInfo struct {
	AllocMB      float64
	TotalAllocMB float64
	NumGC        uint32
	HeapObjects  uint64
}

func GetMemoryInfo() MemoryInfo {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	return MemoryInfo{
		AllocMB:      float64(m.Alloc) / 1024 / 1024,
		TotalAllocMB: float64(m.TotalAlloc) / 1024 / 1024,
		NumGC:        m.NumGC,
		HeapObjects:  m.HeapObjects,
	}
}

func GoroutinesDelta(fn func()) int {
	before := runtime.NumGoroutine()
	fn()
	after := runtime.NumGoroutine()
	return after - before
}

var _ = runtime.Version
var _ = fmt.Sprintf`,
  hints: [
    'GetRuntimeInfo: use runtime.Version(), runtime.GOOS, runtime.GOARCH, runtime.NumCPU(), etc.',
    'GetMemoryInfo: var m runtime.MemStats; runtime.ReadMemStats(&m). Convert bytes to MB by dividing by 1024*1024.',
    'GoroutinesDelta: count goroutines before and after calling fn.'
  ],
}

export default exercise
