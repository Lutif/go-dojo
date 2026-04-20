import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_06_interface_internals',
  title: 'Interface Internals',
  category: 'Internals',
  subcategory: 'Memory',
  difficulty: 'expert',
  order: 6,
  description: `An interface value is a 2-word pair: \`{type pointer, data pointer}\`:

\`\`\`
// Non-empty interface (iface):
type iface struct {
    tab  *itab          // type + method table
    data unsafe.Pointer // pointer to concrete value
}

// Empty interface (eface):
type eface struct {
    _type *_type         // type info
    data  unsafe.Pointer // pointer to concrete value
}
\`\`\`

**Key insight**: a nil interface ≠ an interface holding a nil pointer:
\`\`\`
var err error           // nil interface (both words zero)
var p *MyError = nil
var err2 error = p      // non-nil! type word is set
err == nil              // true
err2 == nil             // false!
\`\`\`

Your task: explore interface value semantics.`,
  code: `package main

import "fmt"

// IsNilInterface returns true if the interface value is truly nil
// (both type and data are nil).
func IsNilInterface(v interface{}) bool {
	// TODO: v == nil checks this
	return false
}

// InterfaceHoldsNilPointer shows the nil interface trap.
// Return an error interface that holds a nil *MyError pointer.
type MyError struct{ Msg string }
func (e *MyError) Error() string { return e.Msg }

func InterfaceHoldsNilPointer() error {
	// TODO: Return a nil *MyError as error — the result is non-nil!
	return nil
}

// TypeName returns the concrete type name stored in an interface.
func TypeName(v interface{}) string {
	// TODO: Use fmt.Sprintf("%T", v)
	return ""
}

// SafeError returns err.Error() if err is truly non-nil,
// or "no error" if err is nil.
// Must handle the nil-pointer-in-interface case!
func SafeError(err error) string {
	// TODO: Check with reflect or type assertion
	return ""
}

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestIsNilInterfaceNil(t *testing.T) {
	if !IsNilInterface(nil) {
		t.Error("nil should be nil interface")
	}
}

func TestIsNilInterfaceValue(t *testing.T) {
	if IsNilInterface(42) {
		t.Error("42 is not nil")
	}
}

func TestInterfaceHoldsNilPointer(t *testing.T) {
	err := InterfaceHoldsNilPointer()
	if err == nil {
		t.Error("should be non-nil (interface holding nil pointer)")
	}
}

func TestTypeName(t *testing.T) {
	got := TypeName(42)
	if got != "int" {
		t.Errorf("got %q, want int", got)
	}
	got = TypeName("hello")
	if got != "string" {
		t.Errorf("got %q, want string", got)
	}
}

func TestSafeErrorNil(t *testing.T) {
	got := SafeError(nil)
	if got != "no error" {
		t.Errorf("got %q", got)
	}
}

func TestSafeErrorReal(t *testing.T) {
	got := SafeError(&MyError{Msg: "oops"})
	if got != "oops" {
		t.Errorf("got %q", got)
	}
}

func TestSafeErrorNilPointer(t *testing.T) {
	var p *MyError
	var err error = p
	got := SafeError(err)
	if got != "no error" {
		t.Errorf("got %q, want 'no error' for nil-pointer-in-interface", got)
	}
}`,
  solution: `package main

import (
	"fmt"
	"reflect"
)

func IsNilInterface(v interface{}) bool {
	return v == nil
}

type MyError struct{ Msg string }
func (e *MyError) Error() string { return e.Msg }

func InterfaceHoldsNilPointer() error {
	var p *MyError
	return p
}

func TypeName(v interface{}) string {
	return fmt.Sprintf("%T", v)
}

func SafeError(err error) string {
	if err == nil {
		return "no error"
	}
	v := reflect.ValueOf(err)
	if v.Kind() == reflect.Ptr && v.IsNil() {
		return "no error"
	}
	return err.Error()
}

var _ = fmt.Sprintf`,
  hints: [
    'IsNilInterface: v == nil is true only when both type and data are nil.',
    'InterfaceHoldsNilPointer: var p *MyError = nil; return p — the error interface is non-nil!',
    'SafeError: use reflect.ValueOf(err) to check if it is a nil pointer inside a non-nil interface.'
  ],
}

export default exercise
