import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_10_gc_finalizers',
  title: 'Garbage Collector',
  category: 'Internals',
  subcategory: 'Runtime',
  difficulty: 'expert',
  order: 10,
  description: `Go uses a **concurrent, tri-color mark-and-sweep** garbage collector. You can interact with it through the \`runtime\` package:

\`\`\`
// Force a garbage collection cycle
runtime.GC()

// Register a finalizer — called when obj is unreachable
runtime.SetFinalizer(obj, func(o *MyType) {
    // cleanup
})

// Read memory statistics
var m runtime.MemStats
runtime.ReadMemStats(&m)
fmt.Println(m.Alloc)       // bytes of allocated heap
fmt.Println(m.TotalAlloc)  // cumulative bytes allocated
fmt.Println(m.NumGC)       // number of completed GC cycles
\`\`\`

Key points:
- **Finalizers** run when an object becomes unreachable, but timing is non-deterministic
- \`runtime.GC()\` triggers a collection but finalizers may run asynchronously
- \`runtime.MemStats\` gives detailed memory usage info
- Prefer explicit cleanup (\`defer\`, \`Close()\`) over finalizers

Your task: write functions that read memory stats, track allocations, and count GC cycles.`,
  code: `package main

import "runtime"

// GetHeapAlloc returns the current heap allocation in bytes.
func GetHeapAlloc() uint64 {
	// TODO: Use runtime.ReadMemStats to get current heap allocation
	// Return m.Alloc
	return 0
}

// GetNumGC returns the number of completed GC cycles.
func GetNumGC() uint32 {
	// TODO: Use runtime.ReadMemStats to get the number of GC cycles
	// Return m.NumGC
	return 0
}

// ForceGC runs a garbage collection and returns the new GC count.
func ForceGC() uint32 {
	// TODO: Call runtime.GC() then return the GC count
	return 0
}

// AllocateAndMeasure allocates n byte slices of the given size,
// and returns (allocBefore, allocAfter) heap alloc values.
func AllocateAndMeasure(n, size int) (uint64, uint64) {
	// TODO: Read heap alloc before, allocate n slices of 'size' bytes
	// (store them so they aren't collected), read heap alloc after
	// Return (before, after)
	return 0, 0
}

// GCReducesHeap allocates memory, measures heap, runs GC,
// and returns (heapBefore, heapAfter).
func GCReducesHeap() (uint64, uint64) {
	// TODO: Allocate some data in a local scope, read heap,
	// then set reference to nil and call runtime.GC(),
	// read heap again and return both values
	return 0, 0
}`,
  testCode: `package main

import (
	"runtime"
	"testing"
)

func TestGetHeapAlloc(t *testing.T) {
	alloc := GetHeapAlloc()
	if alloc == 0 {
		t.Error("heap alloc should be > 0")
	}
}

func TestGetNumGC(t *testing.T) {
	runtime.GC()
	n := GetNumGC()
	if n == 0 {
		t.Error("after forcing GC, NumGC should be > 0")
	}
}

func TestForceGC(t *testing.T) {
	before := GetNumGC()
	after := ForceGC()
	if after <= before {
		t.Errorf("ForceGC should increase GC count: before=%d, after=%d", before, after)
	}
}

func TestAllocateAndMeasure(t *testing.T) {
	before, after := AllocateAndMeasure(100, 1024)
	if after <= before {
		t.Errorf("allocating should increase heap: before=%d, after=%d", before, after)
	}
}

func TestGCReducesHeap(t *testing.T) {
	before, after := GCReducesHeap()
	if before == 0 {
		t.Error("before should be > 0")
	}
	// After GC with freed data, heap should not have grown
	// (it might not be strictly less due to runtime overhead, but it should be close)
	if after > before*2 {
		t.Errorf("GC should have freed memory: before=%d, after=%d", before, after)
	}
}`,
  solution: `package main

import "runtime"

func GetHeapAlloc() uint64 {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	return m.Alloc
}

func GetNumGC() uint32 {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	return m.NumGC
}

func ForceGC() uint32 {
	runtime.GC()
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	return m.NumGC
}

func AllocateAndMeasure(n, size int) (uint64, uint64) {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	before := m.Alloc

	data := make([][]byte, n)
	for i := 0; i < n; i++ {
		data[i] = make([]byte, size)
	}
	_ = data

	runtime.ReadMemStats(&m)
	after := m.Alloc
	return before, after
}

func GCReducesHeap() (uint64, uint64) {
	data := make([]byte, 10*1024*1024)
	_ = data

	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	before := m.Alloc

	data = nil
	runtime.GC()

	runtime.ReadMemStats(&m)
	after := m.Alloc
	return before, after
}`,
  hints: [
    'Use var m runtime.MemStats and runtime.ReadMemStats(&m) to read memory stats.',
    'runtime.GC() triggers garbage collection; check m.NumGC before and after.',
    'To measure allocation, read m.Alloc before and after allocating data. Keep references alive so GC does not collect them.',
  ],
}

export default exercise
