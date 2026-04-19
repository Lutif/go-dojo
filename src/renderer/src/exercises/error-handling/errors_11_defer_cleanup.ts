import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_11_defer_cleanup',
  title: 'Defer Cleanup',
  category: 'Error Handling',
  subcategory: 'Defer',
  difficulty: 'intermediate',
  order: 11,
  description: `Defer is Go's primary tool for resource cleanup. The pattern is: acquire → defer release → use.

\`\`\`
f, err := os.Open("data.txt")
if err != nil {
    return err
}
defer f.Close()  // guaranteed to run when function returns
\`\`\`

Important: always defer **after** the error check — don't defer \`Close()\` on a nil resource!

When closing can itself fail (e.g., buffered writes), capture the error:
\`\`\`
defer func() {
    if cerr := f.Close(); cerr != nil && err == nil {
        err = cerr
    }
}()
\`\`\`

Your task: implement resource cleanup patterns using defer.`,
  code: `package main

import (
	"errors"
	"fmt"
	"strings"
)

// Resource simulates something that must be opened and closed.
type Resource struct {
	name   string
	opened bool
	closed bool
	data   string
}

func OpenResource(name string) (*Resource, error) {
	if name == "" {
		return nil, errors.New("empty resource name")
	}
	return &Resource{name: name, opened: true}, nil
}

func (r *Resource) Write(data string) error {
	if !r.opened || r.closed {
		return errors.New("resource not open")
	}
	r.data += data
	return nil
}

func (r *Resource) Close() error {
	if r.closed {
		return errors.New("already closed")
	}
	r.closed = true
	r.opened = false
	return nil
}

// UseResource opens a resource, writes data to it, and ensures
// it gets closed even if Write fails. Returns the resource.
func UseResource(name, data string) (res *Resource, err error) {
	// TODO: Open resource, check error
	// Defer Close (capture close error if no prior error)
	// Write data
	// Return the resource
	return nil, nil
}

// UseTwoResources opens two resources and writes to both.
// Both must be closed even if the second open or a write fails.
func UseTwoResources(name1, name2 string) (r1, r2 *Resource, err error) {
	// TODO: Open first, defer close
	// Open second, defer close
	// Write to both
	return nil, nil, nil
}

// ProcessItems processes a list of items, collecting errors.
// Uses defer to ensure a "done" item is always appended to results.
// Hint: use named return so the deferred closure can modify it.
func ProcessItems(items []string) (results []string) {
	results = []string{}
	// TODO: Defer appending "done" to results
	// Loop through items:
	//   - if item is "bad", append "error: bad" and continue
	//   - otherwise append "processed: <item>"
	return results
}

var _ = fmt.Sprintf
var _ = strings.HasPrefix`,
  testCode: `package main

import "testing"

func TestUseResourceSuccess(t *testing.T) {
	res, err := UseResource("test", "hello")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !res.closed {
		t.Error("resource should be closed after UseResource")
	}
	if res.data != "hello" {
		t.Errorf("data = %q, want %q", res.data, "hello")
	}
}

func TestUseResourceEmptyName(t *testing.T) {
	_, err := UseResource("", "data")
	if err == nil {
		t.Error("expected error for empty name")
	}
}

func TestUseTwoResources(t *testing.T) {
	r1, r2, err := UseTwoResources("a", "b")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !r1.closed || !r2.closed {
		t.Errorf("both resources should be closed: r1.closed=%v, r2.closed=%v", r1.closed, r2.closed)
	}
}

func TestUseTwoResourcesFirstFails(t *testing.T) {
	_, _, err := UseTwoResources("", "b")
	if err == nil {
		t.Error("expected error when first resource fails")
	}
}

func TestUseTwoResourcesSecondFails(t *testing.T) {
	r1, _, err := UseTwoResources("a", "")
	if err == nil {
		t.Error("expected error when second resource fails")
	}
	if r1 != nil && !r1.closed {
		t.Error("first resource should still be closed")
	}
}

func TestProcessItems(t *testing.T) {
	got := ProcessItems([]string{"x", "bad", "y"})
	want := []string{"processed: x", "error: bad", "processed: y", "done"}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %q, want %q", i, got[i], want[i])
		}
	}
}

func TestProcessItemsEmpty(t *testing.T) {
	got := ProcessItems([]string{})
	if len(got) != 1 || got[0] != "done" {
		t.Errorf("got %v, want [done]", got)
	}
}`,
  solution: `package main

import (
	"errors"
	"fmt"
	"strings"
)

type Resource struct {
	name   string
	opened bool
	closed bool
	data   string
}

func OpenResource(name string) (*Resource, error) {
	if name == "" {
		return nil, errors.New("empty resource name")
	}
	return &Resource{name: name, opened: true}, nil
}

func (r *Resource) Write(data string) error {
	if !r.opened || r.closed {
		return errors.New("resource not open")
	}
	r.data += data
	return nil
}

func (r *Resource) Close() error {
	if r.closed {
		return errors.New("already closed")
	}
	r.closed = true
	r.opened = false
	return nil
}

func UseResource(name, data string) (res *Resource, err error) {
	res, err = OpenResource(name)
	if err != nil {
		return nil, err
	}
	defer func() {
		if cerr := res.Close(); cerr != nil && err == nil {
			err = cerr
		}
	}()
	err = res.Write(data)
	return res, err
}

func UseTwoResources(name1, name2 string) (r1, r2 *Resource, err error) {
	r1, err = OpenResource(name1)
	if err != nil {
		return nil, nil, err
	}
	defer func() {
		if cerr := r1.Close(); cerr != nil && err == nil {
			err = cerr
		}
	}()

	r2, err = OpenResource(name2)
	if err != nil {
		return r1, nil, err
	}
	defer func() {
		if cerr := r2.Close(); cerr != nil && err == nil {
			err = cerr
		}
	}()

	r1.Write("data1")
	r2.Write("data2")
	return r1, r2, nil
}

func ProcessItems(items []string) (results []string) {
	results = []string{}
	defer func() { results = append(results, "done") }()
	for _, item := range items {
		if item == "bad" {
			results = append(results, "error: bad")
			continue
		}
		results = append(results, "processed: "+item)
	}
	return results
}

var _ = fmt.Sprintf
var _ = strings.HasPrefix`,
  hints: [
    'Always check the error from Open before deferring Close — never defer on a nil resource.',
    'To capture Close() errors, use a deferred closure with named return: defer func() { if cerr := res.Close(); cerr != nil && err == nil { err = cerr } }()',
    'For ProcessItems, defer a closure that appends "done" — the deferred function modifies the slice via reference.'
  ],
}

export default exercise
