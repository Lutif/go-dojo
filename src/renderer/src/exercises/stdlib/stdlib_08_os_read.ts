import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_08_os_read',
  title: 'Reading Files',
  category: 'Standard Library',
  subcategory: 'File I/O',
  difficulty: 'intermediate',
  order: 8,
  description: `Go provides several ways to read files:

\`\`\`
// Read entire file at once (simplest)
data, err := os.ReadFile("config.txt")
content := string(data)

// Open and read with more control
f, err := os.Open("data.txt")
if err != nil { return err }
defer f.Close()

scanner := bufio.NewScanner(f)
for scanner.Scan() {
    fmt.Println(scanner.Text())
}
\`\`\`

For this exercise, we'll simulate file reading using \`io.Reader\` since Go Dojo runs in a sandbox. The patterns are identical — everything accepts \`io.Reader\`.

Your task: implement file-reading patterns.`,
  code: `package main

import (
	"bufio"
	"io"
	"strings"
)

// ReadContent reads all content from reader and returns it as string.
func ReadContent(r io.Reader) (string, error) {
	// TODO: Use io.ReadAll
	return "", nil
}

// HeadLines returns the first n lines from reader.
func HeadLines(r io.Reader, n int) ([]string, error) {
	// TODO: Use bufio.Scanner, stop after n lines
	return nil, nil
}

// TailLines returns the last n lines from reader.
func TailLines(r io.Reader, n int) ([]string, error) {
	// TODO: Read all lines, return last n
	return nil, nil
}

// WordFrequency counts how many times each word appears.
func WordFrequency(r io.Reader) map[string]int {
	// TODO: Scan words, count in map
	return nil
}

// FindLine returns the first line containing substr, or "" if not found.
func FindLine(r io.Reader, substr string) string {
	// TODO
	return ""
}

var _ = bufio.NewScanner
var _ = strings.NewReader`,
  testCode: `package main

import (
	"strings"
	"testing"
)

func TestReadContent(t *testing.T) {
	got, err := ReadContent(strings.NewReader("hello world"))
	if err != nil || got != "hello world" {
		t.Errorf("got (%q, %v)", got, err)
	}
}

func TestHeadLines(t *testing.T) {
	input := "line1\nline2\nline3\nline4\nline5"
	got, err := HeadLines(strings.NewReader(input), 3)
	if err != nil {
		t.Fatal(err)
	}
	want := []string{"line1", "line2", "line3"}
	if len(got) != 3 {
		t.Fatalf("got %v", got)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %q", i, got[i])
		}
	}
}

func TestHeadLinesFewerThanN(t *testing.T) {
	got, _ := HeadLines(strings.NewReader("one\ntwo"), 5)
	if len(got) != 2 {
		t.Errorf("got %d lines, want 2", len(got))
	}
}

func TestTailLines(t *testing.T) {
	input := "line1\nline2\nline3\nline4\nline5"
	got, err := TailLines(strings.NewReader(input), 2)
	if err != nil {
		t.Fatal(err)
	}
	if len(got) != 2 || got[0] != "line4" || got[1] != "line5" {
		t.Errorf("got %v, want [line4 line5]", got)
	}
}

func TestWordFrequency(t *testing.T) {
	input := "go is great go is fast"
	freq := WordFrequency(strings.NewReader(input))
	if freq["go"] != 2 || freq["is"] != 2 || freq["great"] != 1 || freq["fast"] != 1 {
		t.Errorf("got %v", freq)
	}
}

func TestFindLine(t *testing.T) {
	input := "hello world\nerror: not found\nall good"
	got := FindLine(strings.NewReader(input), "error")
	if got != "error: not found" {
		t.Errorf("got %q", got)
	}
}

func TestFindLineNotFound(t *testing.T) {
	got := FindLine(strings.NewReader("hello\nworld"), "xyz")
	if got != "" {
		t.Errorf("got %q, want empty", got)
	}
}`,
  solution: `package main

import (
	"bufio"
	"io"
	"strings"
)

func ReadContent(r io.Reader) (string, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

func HeadLines(r io.Reader, n int) ([]string, error) {
	var lines []string
	scanner := bufio.NewScanner(r)
	for i := 0; i < n && scanner.Scan(); i++ {
		lines = append(lines, scanner.Text())
	}
	return lines, scanner.Err()
}

func TailLines(r io.Reader, n int) ([]string, error) {
	var all []string
	scanner := bufio.NewScanner(r)
	for scanner.Scan() {
		all = append(all, scanner.Text())
	}
	if err := scanner.Err(); err != nil {
		return nil, err
	}
	if n > len(all) {
		n = len(all)
	}
	return all[len(all)-n:], nil
}

func WordFrequency(r io.Reader) map[string]int {
	freq := make(map[string]int)
	scanner := bufio.NewScanner(r)
	scanner.Split(bufio.ScanWords)
	for scanner.Scan() {
		freq[scanner.Text()]++
	}
	return freq
}

func FindLine(r io.Reader, substr string) string {
	scanner := bufio.NewScanner(r)
	for scanner.Scan() {
		if strings.Contains(scanner.Text(), substr) {
			return scanner.Text()
		}
	}
	return ""
}

var _ = bufio.NewScanner
var _ = strings.NewReader`,
  hints: [
    'HeadLines: scan up to n lines with a counter: for i := 0; i < n && scanner.Scan(); i++',
    'TailLines: read all lines into a slice, then return all[len(all)-n:].',
    'WordFrequency: use scanner.Split(bufio.ScanWords) to scan by word, increment freq[word]++.'
  ],
}

export default exercise
