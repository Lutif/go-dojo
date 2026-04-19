import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_05_io_reader',
  title: 'io.Reader',
  category: 'Standard Library',
  subcategory: 'I/O',
  difficulty: 'intermediate',
  order: 5,
  description: `\`io.Reader\` is Go's most important interface — one method:

\`\`\`
type Reader interface {
    Read(p []byte) (n int, err error)
}
\`\`\`

Everything reads through this: files, network connections, HTTP bodies, compressed streams, strings. Useful wrappers:

\`\`\`
strings.NewReader("hello")         // string → Reader
bytes.NewReader([]byte{1,2,3})     // []byte → Reader
io.LimitReader(r, 100)             // read at most 100 bytes
io.ReadAll(r)                      // read everything to []byte
\`\`\`

Your task: implement and use io.Reader.`,
  code: `package main

import (
	"io"
	"strings"
)

// ReadAll reads all content from a Reader and returns it as a string.
func ReadAll(r io.Reader) (string, error) {
	// TODO: Use io.ReadAll
	return "", nil
}

// CountLines counts the number of lines in a Reader's content.
func CountLines(r io.Reader) (int, error) {
	// TODO: Read content, count newlines
	return 0, nil
}

// RepeatReader is a custom Reader that repeats a byte sequence n times.
type RepeatReader struct {
	data    []byte
	repeats int
	// TODO: Add position tracking fields
}

// NewRepeatReader creates a RepeatReader.
func NewRepeatReader(data []byte, repeats int) *RepeatReader {
	// TODO
	return nil
}

// Read implements io.Reader for RepeatReader.
func (r *RepeatReader) Read(p []byte) (int, error) {
	// TODO: Fill p with repeated data, return io.EOF when done
	return 0, io.EOF
}

// LimitedRead reads at most maxBytes from r.
func LimitedRead(r io.Reader, maxBytes int64) (string, error) {
	// TODO: Use io.LimitReader
	return "", nil
}

var _ = strings.NewReader
var _ io.Reader = (*RepeatReader)(nil)`,
  testCode: `package main

import (
	"io"
	"strings"
	"testing"
)

func TestReadAll(t *testing.T) {
	r := strings.NewReader("hello world")
	got, err := ReadAll(r)
	if err != nil || got != "hello world" {
		t.Errorf("got (%q, %v)", got, err)
	}
}

func TestReadAllEmpty(t *testing.T) {
	got, err := ReadAll(strings.NewReader(""))
	if err != nil || got != "" {
		t.Errorf("got (%q, %v)", got, err)
	}
}

func TestCountLines(t *testing.T) {
	tests := []struct{ input string; want int }{
		{"hello\nworld\n", 2},
		{"single line", 1},
		{"a\nb\nc", 3},
		{"", 0},
	}
	for _, tt := range tests {
		got, err := CountLines(strings.NewReader(tt.input))
		if err != nil || got != tt.want {
			t.Errorf("CountLines(%q) = (%d, %v), want %d", tt.input, got, err, tt.want)
		}
	}
}

func TestRepeatReader(t *testing.T) {
	rr := NewRepeatReader([]byte("ab"), 3)
	data, err := io.ReadAll(rr)
	if err != nil {
		t.Fatalf("error: %v", err)
	}
	if string(data) != "ababab" {
		t.Errorf("got %q, want ababab", string(data))
	}
}

func TestRepeatReaderZero(t *testing.T) {
	rr := NewRepeatReader([]byte("x"), 0)
	data, _ := io.ReadAll(rr)
	if len(data) != 0 {
		t.Errorf("got %q, want empty", string(data))
	}
}

func TestLimitedRead(t *testing.T) {
	r := strings.NewReader("hello world, this is a long string")
	got, err := LimitedRead(r, 5)
	if err != nil || got != "hello" {
		t.Errorf("got (%q, %v), want (hello, nil)", got, err)
	}
}`,
  solution: `package main

import (
	"io"
	"strings"
)

func ReadAll(r io.Reader) (string, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

func CountLines(r io.Reader) (int, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return 0, err
	}
	s := string(data)
	if s == "" {
		return 0, nil
	}
	count := 1
	for _, c := range s {
		if c == '\n' {
			count++
		}
	}
	// If the string ends with a newline, don't count the empty line after it
	if s[len(s)-1] == '\n' {
		count--
	}
	return count, nil
}

type RepeatReader struct {
	data    []byte
	repeats int
	pos     int
	rep     int
}

func NewRepeatReader(data []byte, repeats int) *RepeatReader {
	return &RepeatReader{data: data, repeats: repeats}
}

func (r *RepeatReader) Read(p []byte) (int, error) {
	if r.rep >= r.repeats {
		return 0, io.EOF
	}

	n := 0
	for n < len(p) && r.rep < r.repeats {
		copied := copy(p[n:], r.data[r.pos:])
		n += copied
		r.pos += copied
		if r.pos >= len(r.data) {
			r.pos = 0
			r.rep++
		}
	}
	if r.rep >= r.repeats {
		return n, io.EOF
	}
	return n, nil
}

func LimitedRead(r io.Reader, maxBytes int64) (string, error) {
	limited := io.LimitReader(r, maxBytes)
	data, err := io.ReadAll(limited)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

var _ = strings.NewReader
var _ io.Reader = (*RepeatReader)(nil)`,
  hints: [
    'ReadAll: io.ReadAll(r) reads everything. Convert []byte to string.',
    'RepeatReader: track position within data and which repeat you\'re on. When pos reaches end of data, reset pos and increment rep.',
    'LimitedRead: io.LimitReader(r, maxBytes) wraps a reader to stop after maxBytes. Then io.ReadAll the limited reader.'
  ],
}

export default exercise
