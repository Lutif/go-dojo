import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_03_interface_composition',
  title: 'Interface Composition',
  category: 'Type System',
  subcategory: 'Interfaces',
  difficulty: 'intermediate',
  order: 3,
  description: `Interfaces can embed other interfaces to compose larger ones:

\`\`\`
type Reader interface { Read() string }
type Writer interface { Write(s string) }
type ReadWriter interface {
    Reader
    Writer
}
\`\`\`

A type satisfying \`ReadWriter\` must implement both \`Read()\` and \`Write()\`. This is how Go builds rich interfaces from small, focused ones — the standard library's \`io.ReadWriter\` works exactly this way.

Your task: define composed interfaces and a type that satisfies them.`,
  code: `package main

// Reader can read data
type Reader interface {
	Read() string
}

// Writer can write data
type Writer interface {
	Write(data string)
}

// Closer can close a resource
type Closer interface {
	Close() bool
}

// TODO: Define a ReadWriteCloser interface that embeds all three above

// Buffer implements ReadWriteCloser
type Buffer struct {
	data   string
	closed bool
}

// TODO: Implement Read() string — returns b.data
// TODO: Implement Write(data string) — sets b.data
// TODO: Implement Close() bool — sets b.closed to true, returns true

// NewBuffer creates a new empty Buffer
func NewBuffer() *Buffer {
	// TODO
	return nil
}`,
  testCode: `package main

import "testing"

func TestBufferRead(t *testing.T) {
	b := &Buffer{data: "hello"}
	if b.Read() != "hello" {
		t.Errorf("Read() = %q, want %q", b.Read(), "hello")
	}
}

func TestBufferWrite(t *testing.T) {
	b := &Buffer{}
	b.Write("world")
	if b.data != "world" {
		t.Errorf("after Write, data = %q, want %q", b.data, "world")
	}
}

func TestBufferClose(t *testing.T) {
	b := &Buffer{}
	if !b.Close() {
		t.Error("Close() should return true")
	}
	if !b.closed {
		t.Error("closed should be true after Close()")
	}
}

func TestReadWriteCloser(t *testing.T) {
	// Verify Buffer satisfies ReadWriteCloser
	var rwc ReadWriteCloser = NewBuffer()
	rwc.Write("test")
	if rwc.Read() != "test" {
		t.Errorf("Read() = %q, want %q", rwc.Read(), "test")
	}
	rwc.Close()
}

func TestNewBuffer(t *testing.T) {
	b := NewBuffer()
	if b == nil {
		t.Fatal("NewBuffer() returned nil")
	}
	if b.data != "" {
		t.Errorf("new buffer data = %q, want empty", b.data)
	}
}`,
  solution: `package main

type Reader interface {
	Read() string
}

type Writer interface {
	Write(data string)
}

type Closer interface {
	Close() bool
}

type ReadWriteCloser interface {
	Reader
	Writer
	Closer
}

type Buffer struct {
	data   string
	closed bool
}

func (b *Buffer) Read() string {
	return b.data
}

func (b *Buffer) Write(data string) {
	b.data = data
}

func (b *Buffer) Close() bool {
	b.closed = true
	return true
}

func NewBuffer() *Buffer {
	return &Buffer{}
}`,
  hints: [
    'Compose interfaces by embedding: type ReadWriteCloser interface { Reader; Writer; Closer }',
    'Buffer needs pointer receivers (*Buffer) since Write and Close modify the struct.',
    'NewBuffer returns &Buffer{} — the zero value of Buffer is a valid empty buffer.'
  ],
}

export default exercise
