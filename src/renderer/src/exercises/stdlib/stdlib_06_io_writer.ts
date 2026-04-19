import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_06_io_writer',
  title: 'io.Writer',
  category: 'Standard Library',
  subcategory: 'I/O',
  difficulty: 'intermediate',
  order: 6,
  description: `\`io.Writer\` is the output counterpart to Reader:

\`\`\`
type Writer interface {
    Write(p []byte) (n int, err error)
}
\`\`\`

Common writers: os.Stdout, files, HTTP responses, bytes.Buffer. Useful functions:

\`\`\`
fmt.Fprintln(w, "hello")              // write formatted string
io.WriteString(w, "hello")            // write string
io.Copy(dst, src)                     // copy Reader → Writer
io.MultiWriter(w1, w2)                // write to multiple writers
\`\`\`

\`bytes.Buffer\` is a Writer AND a Reader — great for tests:
\`\`\`
var buf bytes.Buffer
fmt.Fprintf(&buf, "x=%d", 42)
s := buf.String()  // "x=42"
\`\`\`

Your task: implement and compose io.Writers.`,
  code: `package main

import (
	"bytes"
	"fmt"
	"io"
	"strings"
)

// WriteLines writes each line to w followed by a newline.
// Returns total bytes written.
func WriteLines(w io.Writer, lines []string) (int, error) {
	// TODO: Use fmt.Fprintln or io.WriteString for each line
	return 0, nil
}

// CountWriter wraps a Writer and counts bytes written.
type CountWriter struct {
	// TODO: Embed or wrap an io.Writer, add a count field
}

// NewCountWriter wraps w with byte counting.
func NewCountWriter(w io.Writer) *CountWriter {
	// TODO
	return nil
}

// Write implements io.Writer and counts bytes.
func (cw *CountWriter) Write(p []byte) (int, error) {
	// TODO: Write to underlying writer, add to count
	return 0, nil
}

// BytesWritten returns total bytes written.
func (cw *CountWriter) BytesWritten() int {
	// TODO
	return 0
}

// TeeWrite writes data to both w1 and w2 (like Unix tee).
// Returns error if either write fails.
func TeeWrite(w1, w2 io.Writer, data string) error {
	// TODO: Use io.MultiWriter
	return nil
}

// Capture runs fn which writes to a Writer, and returns what was written.
func Capture(fn func(w io.Writer)) string {
	// TODO: Use bytes.Buffer
	return ""
}

var _ = bytes.NewBuffer
var _ = fmt.Fprintf
var _ = io.Copy
var _ = strings.NewReader`,
  testCode: `package main

import (
	"bytes"
	"io"
	"testing"
)

func TestWriteLines(t *testing.T) {
	var buf bytes.Buffer
	n, err := WriteLines(&buf, []string{"hello", "world"})
	if err != nil {
		t.Fatalf("error: %v", err)
	}
	got := buf.String()
	want := "hello\nworld\n"
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
	if n != len(want) {
		t.Errorf("wrote %d bytes, want %d", n, len(want))
	}
}

func TestWriteLinesEmpty(t *testing.T) {
	var buf bytes.Buffer
	WriteLines(&buf, []string{})
	if buf.Len() != 0 {
		t.Errorf("got %q, want empty", buf.String())
	}
}

func TestCountWriter(t *testing.T) {
	var buf bytes.Buffer
	cw := NewCountWriter(&buf)
	io.WriteString(cw, "hello")
	io.WriteString(cw, " world")
	if cw.BytesWritten() != 11 {
		t.Errorf("bytes written = %d, want 11", cw.BytesWritten())
	}
	if buf.String() != "hello world" {
		t.Errorf("content = %q", buf.String())
	}
}

func TestTeeWrite(t *testing.T) {
	var buf1, buf2 bytes.Buffer
	err := TeeWrite(&buf1, &buf2, "hello")
	if err != nil {
		t.Fatalf("error: %v", err)
	}
	if buf1.String() != "hello" || buf2.String() != "hello" {
		t.Errorf("buf1=%q buf2=%q", buf1.String(), buf2.String())
	}
}

func TestCapture(t *testing.T) {
	got := Capture(func(w io.Writer) {
		io.WriteString(w, "captured!")
	})
	if got != "captured!" {
		t.Errorf("got %q, want captured!", got)
	}
}`,
  solution: `package main

import (
	"bytes"
	"fmt"
	"io"
	"strings"
)

func WriteLines(w io.Writer, lines []string) (int, error) {
	total := 0
	for _, line := range lines {
		n, err := fmt.Fprintln(w, line)
		total += n
		if err != nil {
			return total, err
		}
	}
	return total, nil
}

type CountWriter struct {
	w     io.Writer
	count int
}

func NewCountWriter(w io.Writer) *CountWriter {
	return &CountWriter{w: w}
}

func (cw *CountWriter) Write(p []byte) (int, error) {
	n, err := cw.w.Write(p)
	cw.count += n
	return n, err
}

func (cw *CountWriter) BytesWritten() int {
	return cw.count
}

func TeeWrite(w1, w2 io.Writer, data string) error {
	mw := io.MultiWriter(w1, w2)
	_, err := io.WriteString(mw, data)
	return err
}

func Capture(fn func(w io.Writer)) string {
	var buf bytes.Buffer
	fn(&buf)
	return buf.String()
}

var _ = bytes.NewBuffer
var _ = fmt.Fprintf
var _ = io.Copy
var _ = strings.NewReader`,
  hints: [
    'WriteLines: use fmt.Fprintln(w, line) which adds a newline. Track total bytes from each write.',
    'CountWriter: wrap the underlying writer, count bytes in Write(). Delegate the actual writing to cw.w.Write(p).',
    'Capture: create a bytes.Buffer, pass it to fn, then return buf.String().'
  ],
}

export default exercise
