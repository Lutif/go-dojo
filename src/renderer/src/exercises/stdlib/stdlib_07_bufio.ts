import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_07_bufio',
  title: 'bufio Scanner',
  category: 'Standard Library',
  subcategory: 'I/O',
  difficulty: 'intermediate',
  order: 7,
  description: `\`bufio.Scanner\` reads data line-by-line (or by custom delimiters):

\`\`\`
scanner := bufio.NewScanner(reader)
for scanner.Scan() {
    line := scanner.Text()
    fmt.Println(line)
}
if err := scanner.Err(); err != nil {
    log.Fatal(err)
}
\`\`\`

Split functions control how scanning works:
- \`bufio.ScanLines\` — default, splits on \\n
- \`bufio.ScanWords\` — splits on whitespace
- \`bufio.ScanBytes\` — one byte at a time
- Custom split function for other delimiters

Your task: use bufio.Scanner to parse structured text.`,
  code: `package main

import (
	"bufio"
	"io"
	"strings"
)

// Lines splits reader content into lines.
func Lines(r io.Reader) []string {
	// TODO: Use bufio.Scanner with default (line) splitting
	return nil
}

// Words splits reader content into words.
func Words(r io.Reader) []string {
	// TODO: Use bufio.Scanner with ScanWords
	return nil
}

// GrepLines returns lines that contain the given substring.
func GrepLines(r io.Reader, pattern string) []string {
	// TODO: Scan lines, filter by strings.Contains
	return nil
}

// ParseCSVLine splits a simple CSV line (no quotes, no escaping).
// "a,b,c" → ["a", "b", "c"]
func ParseCSVLine(line string) []string {
	// TODO: Use strings.Split
	return nil
}

// ParseCSV parses multi-line CSV text into a 2D slice.
func ParseCSV(r io.Reader) [][]string {
	// TODO: Scan lines, split each by comma
	return nil
}

var _ = bufio.NewScanner
var _ = strings.Contains`,
  testCode: `package main

import (
	"strings"
	"testing"
)

func TestLines(t *testing.T) {
	r := strings.NewReader("hello\nworld\nfoo")
	got := Lines(r)
	want := []string{"hello", "world", "foo"}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %q", i, got[i])
		}
	}
}

func TestLinesEmpty(t *testing.T) {
	got := Lines(strings.NewReader(""))
	if len(got) != 0 {
		t.Errorf("got %v", got)
	}
}

func TestWords(t *testing.T) {
	r := strings.NewReader("hello  world\tfoo")
	got := Words(r)
	want := []string{"hello", "world", "foo"}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %q", i, got[i])
		}
	}
}

func TestGrepLines(t *testing.T) {
	input := "error: something failed\ninfo: all good\nerror: another issue"
	got := GrepLines(strings.NewReader(input), "error")
	if len(got) != 2 {
		t.Fatalf("got %d lines, want 2", len(got))
	}
}

func TestGrepLinesNoMatch(t *testing.T) {
	got := GrepLines(strings.NewReader("hello\nworld"), "xyz")
	if len(got) != 0 {
		t.Errorf("got %v, want empty", got)
	}
}

func TestParseCSVLine(t *testing.T) {
	got := ParseCSVLine("name,age,city")
	want := []string{"name", "age", "city"}
	if len(got) != 3 || got[0] != "name" || got[1] != "age" || got[2] != "city" {
		t.Errorf("got %v, want %v", got, want)
	}
}

func TestParseCSV(t *testing.T) {
	input := "a,b,c\n1,2,3\nx,y,z"
	got := ParseCSV(strings.NewReader(input))
	if len(got) != 3 {
		t.Fatalf("got %d rows, want 3", len(got))
	}
	if got[0][0] != "a" || got[1][1] != "2" || got[2][2] != "z" {
		t.Errorf("got %v", got)
	}
}`,
  solution: `package main

import (
	"bufio"
	"io"
	"strings"
)

func Lines(r io.Reader) []string {
	var lines []string
	scanner := bufio.NewScanner(r)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	return lines
}

func Words(r io.Reader) []string {
	var words []string
	scanner := bufio.NewScanner(r)
	scanner.Split(bufio.ScanWords)
	for scanner.Scan() {
		words = append(words, scanner.Text())
	}
	return words
}

func GrepLines(r io.Reader, pattern string) []string {
	var matches []string
	scanner := bufio.NewScanner(r)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.Contains(line, pattern) {
			matches = append(matches, line)
		}
	}
	return matches
}

func ParseCSVLine(line string) []string {
	return strings.Split(line, ",")
}

func ParseCSV(r io.Reader) [][]string {
	var rows [][]string
	scanner := bufio.NewScanner(r)
	for scanner.Scan() {
		rows = append(rows, ParseCSVLine(scanner.Text()))
	}
	return rows
}

var _ = bufio.NewScanner
var _ = strings.Contains`,
  hints: [
    'Lines: create bufio.NewScanner(r), loop scanner.Scan(), append scanner.Text().',
    'Words: same as Lines but call scanner.Split(bufio.ScanWords) before scanning.',
    'GrepLines: scan lines, check strings.Contains(line, pattern), append matches.'
  ],
}

export default exercise
