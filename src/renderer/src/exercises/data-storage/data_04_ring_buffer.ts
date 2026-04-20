import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_04_ring_buffer',
  title: 'Ring Buffer',
  category: 'Data & Storage',
  subcategory: 'Buffers',
  difficulty: 'intermediate',
  order: 4,
  description: `Create a fixed-size circular buffer (ring buffer) for streaming data. Ring buffers are used in logging, audio processing, and network I/O where you want a fixed-size window of recent data.

A ring buffer uses a pre-allocated slice with read and write positions that wrap around:

\`\`\`
type RingBuffer struct {
    data       []byte
    size       int
    readPos    int
    writePos   int
    count      int   // number of unread bytes
}
\`\`\`

When writing overflows the buffer, the oldest data is overwritten.

Implement:
- \`NewRingBuffer(size int)\` - creates a buffer with the given capacity
- \`Write(p []byte) int\` - writes bytes, overwriting oldest if full; returns bytes written
- \`Read(p []byte) int\` - reads up to len(p) bytes; returns bytes read
- \`Len() int\` - returns the number of unread bytes
- \`IsFull() bool\` - returns whether the buffer is at capacity
- \`IsEmpty() bool\` - returns whether there are no unread bytes`,
  code: `package main

// RingBuffer is a fixed-size circular buffer.
type RingBuffer struct {
	// TODO: Add data slice, size, readPos, writePos, count
}

// NewRingBuffer creates a ring buffer with the given capacity.
func NewRingBuffer(size int) *RingBuffer {
	// TODO
	return nil
}

// Write writes bytes into the buffer, overwriting oldest data if full.
// Returns the number of bytes written.
func (r *RingBuffer) Write(p []byte) int {
	// TODO: Write each byte, advancing writePos with wraparound.
	// If full, advance readPos too (overwrite oldest).
	return 0
}

// Read reads up to len(p) unread bytes from the buffer.
// Returns the number of bytes read.
func (r *RingBuffer) Read(p []byte) int {
	// TODO: Read from readPos, advance with wraparound.
	return 0
}

// Len returns the number of unread bytes in the buffer.
func (r *RingBuffer) Len() int {
	// TODO
	return 0
}

// IsFull returns true if the buffer is at capacity.
func (r *RingBuffer) IsFull() bool {
	// TODO
	return false
}

// IsEmpty returns true if there are no unread bytes.
func (r *RingBuffer) IsEmpty() bool {
	// TODO
	return false
}

func main() {}`,
  testCode: `package main

import "testing"

func TestRingBufferWriteRead(t *testing.T) {
	rb := NewRingBuffer(5)
	n := rb.Write([]byte("abc"))
	if n != 3 {
		t.Errorf("Write returned %d, want 3", n)
	}
	if rb.Len() != 3 {
		t.Errorf("Len() = %d, want 3", rb.Len())
	}

	buf := make([]byte, 10)
	n = rb.Read(buf)
	if n != 3 {
		t.Errorf("Read returned %d, want 3", n)
	}
	if string(buf[:n]) != "abc" {
		t.Errorf("Read got %q, want abc", string(buf[:n]))
	}
}

func TestRingBufferEmpty(t *testing.T) {
	rb := NewRingBuffer(5)
	if !rb.IsEmpty() {
		t.Error("new buffer should be empty")
	}
	buf := make([]byte, 5)
	n := rb.Read(buf)
	if n != 0 {
		t.Errorf("Read on empty buffer returned %d, want 0", n)
	}
}

func TestRingBufferFull(t *testing.T) {
	rb := NewRingBuffer(3)
	rb.Write([]byte("abc"))
	if !rb.IsFull() {
		t.Error("buffer should be full")
	}
	if rb.Len() != 3 {
		t.Errorf("Len() = %d, want 3", rb.Len())
	}
}

func TestRingBufferOverwrite(t *testing.T) {
	rb := NewRingBuffer(3)
	rb.Write([]byte("abc"))
	rb.Write([]byte("de")) // overwrites 'a' and 'b'

	buf := make([]byte, 10)
	n := rb.Read(buf)
	if n != 3 {
		t.Errorf("Read returned %d, want 3", n)
	}
	if string(buf[:n]) != "cde" {
		t.Errorf("after overwrite got %q, want cde", string(buf[:n]))
	}
}

func TestRingBufferWrapAround(t *testing.T) {
	rb := NewRingBuffer(4)
	rb.Write([]byte("ab"))
	buf := make([]byte, 2)
	rb.Read(buf) // read "ab", readPos advances

	rb.Write([]byte("cdef")) // wraps around, overwrites as needed
	buf = make([]byte, 10)
	n := rb.Read(buf)
	if n != 4 {
		t.Errorf("Read returned %d, want 4", n)
	}
	if string(buf[:n]) != "cdef" {
		t.Errorf("after wrap got %q, want cdef", string(buf[:n]))
	}
}

func TestRingBufferPartialRead(t *testing.T) {
	rb := NewRingBuffer(5)
	rb.Write([]byte("hello"))
	buf := make([]byte, 3)
	n := rb.Read(buf)
	if n != 3 || string(buf[:n]) != "hel" {
		t.Errorf("partial Read got %q, want hel", string(buf[:n]))
	}
	if rb.Len() != 2 {
		t.Errorf("Len() = %d, want 2", rb.Len())
	}
	n = rb.Read(buf)
	if n != 2 || string(buf[:n]) != "lo" {
		t.Errorf("second Read got %q, want lo", string(buf[:n]))
	}
}`,
  solution: `package main

type RingBuffer struct {
	data     []byte
	size     int
	readPos  int
	writePos int
	count    int
}

func NewRingBuffer(size int) *RingBuffer {
	return &RingBuffer{
		data: make([]byte, size),
		size: size,
	}
}

func (r *RingBuffer) Write(p []byte) int {
	for _, b := range p {
		if r.count == r.size {
			// overwrite oldest: advance readPos
			r.readPos = (r.readPos + 1) % r.size
			r.count--
		}
		r.data[r.writePos] = b
		r.writePos = (r.writePos + 1) % r.size
		r.count++
	}
	return len(p)
}

func (r *RingBuffer) Read(p []byte) int {
	n := 0
	for n < len(p) && r.count > 0 {
		p[n] = r.data[r.readPos]
		r.readPos = (r.readPos + 1) % r.size
		r.count--
		n++
	}
	return n
}

func (r *RingBuffer) Len() int {
	return r.count
}

func (r *RingBuffer) IsFull() bool {
	return r.count == r.size
}

func (r *RingBuffer) IsEmpty() bool {
	return r.count == 0
}

func main() {}`,
  hints: [
    'Use a count field to track unread bytes. This avoids ambiguity between empty and full states.',
    'Wrap positions using modulo: writePos = (writePos + 1) % size.',
    'On Write when full, advance readPos (discard oldest byte) before writing the new byte.',
  ],
}

export default exercise
