import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_09_os_write',
  title: 'Writing Files',
  category: 'Standard Library',
  subcategory: 'File I/O',
  difficulty: 'intermediate',
  order: 9,
  description: `Writing files in Go:

\`\`\`
// Write entire file at once (simplest)
err := os.WriteFile("output.txt", []byte("hello"), 0644)

// Create and write with more control
f, err := os.Create("output.txt")
if err != nil { return err }
defer f.Close()
fmt.Fprintln(f, "hello world")
\`\`\`

For this exercise, we write to \`io.Writer\` (same patterns, testable without actual files). We'll use \`bytes.Buffer\` as a stand-in for files.

Your task: implement file-writing patterns using io.Writer.`,
  code: `package main

import (
	"bytes"
	"fmt"
	"io"
	"strings"
)

// WriteCSV writes rows as CSV to the writer.
// Each row is a slice of strings joined by commas, followed by newline.
func WriteCSV(w io.Writer, rows [][]string) error {
	// TODO
	return nil
}

// WriteNumbered writes lines with line numbers: "1: line\n2: line\n"
func WriteNumbered(w io.Writer, lines []string) error {
	// TODO
	return nil
}

// WriteFiltered writes only lines that pass the filter function.
func WriteFiltered(w io.Writer, lines []string, filter func(string) bool) error {
	// TODO
	return nil
}

// FormatReport writes a simple report to w:
// "=== Report ===\n" + each item on its own line + "=== End ===\n"
func FormatReport(w io.Writer, title string, items []string) error {
	// TODO
	return nil
}

var _ = bytes.NewBuffer
var _ = fmt.Fprintf
var _ = strings.Join`,
  testCode: `package main

import (
	"bytes"
	"testing"
)

func TestWriteCSV(t *testing.T) {
	var buf bytes.Buffer
	rows := [][]string{{"name", "age"}, {"Alice", "30"}, {"Bob", "25"}}
	err := WriteCSV(&buf, rows)
	if err != nil {
		t.Fatal(err)
	}
	want := "name,age\nAlice,30\nBob,25\n"
	if buf.String() != want {
		t.Errorf("got %q, want %q", buf.String(), want)
	}
}

func TestWriteCSVEmpty(t *testing.T) {
	var buf bytes.Buffer
	WriteCSV(&buf, [][]string{})
	if buf.Len() != 0 {
		t.Errorf("got %q", buf.String())
	}
}

func TestWriteNumbered(t *testing.T) {
	var buf bytes.Buffer
	WriteNumbered(&buf, []string{"foo", "bar", "baz"})
	want := "1: foo\n2: bar\n3: baz\n"
	if buf.String() != want {
		t.Errorf("got %q, want %q", buf.String(), want)
	}
}

func TestWriteFiltered(t *testing.T) {
	var buf bytes.Buffer
	lines := []string{"error: bad", "info: ok", "error: worse", "debug: fine"}
	WriteFiltered(&buf, lines, func(s string) bool {
		return len(s) > 0 && s[0] == 'e'
	})
	want := "error: bad\nerror: worse\n"
	if buf.String() != want {
		t.Errorf("got %q, want %q", buf.String(), want)
	}
}

func TestFormatReport(t *testing.T) {
	var buf bytes.Buffer
	FormatReport(&buf, "Status", []string{"item1", "item2"})
	want := "=== Status ===\nitem1\nitem2\n=== End ===\n"
	if buf.String() != want {
		t.Errorf("got %q, want %q", buf.String(), want)
	}
}`,
  solution: `package main

import (
	"bytes"
	"fmt"
	"io"
	"strings"
)

func WriteCSV(w io.Writer, rows [][]string) error {
	for _, row := range rows {
		_, err := fmt.Fprintln(w, strings.Join(row, ","))
		if err != nil {
			return err
		}
	}
	return nil
}

func WriteNumbered(w io.Writer, lines []string) error {
	for i, line := range lines {
		_, err := fmt.Fprintf(w, "%d: %s\n", i+1, line)
		if err != nil {
			return err
		}
	}
	return nil
}

func WriteFiltered(w io.Writer, lines []string, filter func(string) bool) error {
	for _, line := range lines {
		if filter(line) {
			_, err := fmt.Fprintln(w, line)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func FormatReport(w io.Writer, title string, items []string) error {
	fmt.Fprintf(w, "=== %s ===\n", title)
	for _, item := range items {
		fmt.Fprintln(w, item)
	}
	fmt.Fprintln(w, "=== End ===")
	return nil
}

var _ = bytes.NewBuffer
var _ = fmt.Fprintf
var _ = strings.Join`,
  hints: [
    'WriteCSV: for each row, strings.Join(row, ",") then fmt.Fprintln(w, joined).',
    'WriteNumbered: fmt.Fprintf(w, "%d: %s\\n", i+1, line) for each line.',
    'FormatReport: write the header, loop items with Fprintln, write footer.'
  ],
}

export default exercise
