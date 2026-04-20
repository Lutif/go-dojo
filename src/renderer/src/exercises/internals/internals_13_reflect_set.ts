import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_13_reflect_set',
  title: 'Reflect Values',
  category: 'Internals',
  subcategory: 'Reflection',
  difficulty: 'expert',
  order: 13,
  description: `Use \`reflect.Value\` to modify values at runtime. You must pass a pointer for the value to be settable:

\`\`\`
x := 42
v := reflect.ValueOf(&x).Elem()
v.SetInt(100)
fmt.Println(x) // 100

// Struct fields
type S struct{ Name string }
s := S{Name: "old"}
v = reflect.ValueOf(&s).Elem()
v.FieldByName("Name").SetString("new")
\`\`\`

Rules:
- \`v.CanSet()\` — only true for addressable, exported fields
- \`reflect.ValueOf(x)\` is NOT settable; \`reflect.ValueOf(&x).Elem()\` IS

Your task: modify values using reflection.`,
  code: `package main

import "reflect"

// SetInt sets *p to val using reflection.
func SetInt(p *int, val int) {
	// TODO: Use reflect.ValueOf(p).Elem().SetInt()
}

// SetField sets a struct field by name using reflection.
// The struct must be passed as a pointer.
func SetField(structPtr interface{}, fieldName string, value interface{}) error {
	// TODO: Get field by name, check CanSet, set value
	return nil
}

// ZeroFields sets all fields of a struct to their zero values.
func ZeroFields(structPtr interface{}) {
	// TODO: Iterate fields, set each to zero
}

// CopyFields copies matching field values from src to dst.
// Only copies fields that exist in both structs and have the same type.
func CopyFields(dst, src interface{}) {
	// TODO: Iterate src fields, find matching dst fields, copy
}

var _ = reflect.ValueOf`,
  testCode: `package main

import (
	"testing"
)

func TestSetInt(t *testing.T) {
	x := 42
	SetInt(&x, 100)
	if x != 100 {
		t.Errorf("got %d, want 100", x)
	}
}

type Person struct {
	Name string
	Age  int
}

func TestSetField(t *testing.T) {
	p := Person{Name: "Alice", Age: 30}
	err := SetField(&p, "Name", "Bob")
	if err != nil {
		t.Fatal(err)
	}
	if p.Name != "Bob" {
		t.Errorf("Name = %q", p.Name)
	}
}

func TestSetFieldInt(t *testing.T) {
	p := Person{Name: "Alice", Age: 30}
	err := SetField(&p, "Age", 25)
	if err != nil {
		t.Fatal(err)
	}
	if p.Age != 25 {
		t.Errorf("Age = %d", p.Age)
	}
}

func TestZeroFields(t *testing.T) {
	p := Person{Name: "Alice", Age: 30}
	ZeroFields(&p)
	if p.Name != "" || p.Age != 0 {
		t.Errorf("got %+v, want zero", p)
	}
}

type Src struct {
	Name string
	Age  int
	Extra string
}

type Dst struct {
	Name string
	Age  int
	Other int
}

func TestCopyFields(t *testing.T) {
	src := Src{Name: "Alice", Age: 30, Extra: "x"}
	dst := Dst{}
	CopyFields(&dst, &src)
	if dst.Name != "Alice" || dst.Age != 30 {
		t.Errorf("got %+v", dst)
	}
}`,
  solution: `package main

import (
	"fmt"
	"reflect"
)

func SetInt(p *int, val int) {
	reflect.ValueOf(p).Elem().SetInt(int64(val))
}

func SetField(structPtr interface{}, fieldName string, value interface{}) error {
	v := reflect.ValueOf(structPtr).Elem()
	f := v.FieldByName(fieldName)
	if !f.IsValid() {
		return fmt.Errorf("no field %q", fieldName)
	}
	if !f.CanSet() {
		return fmt.Errorf("cannot set %q", fieldName)
	}
	f.Set(reflect.ValueOf(value))
	return nil
}

func ZeroFields(structPtr interface{}) {
	v := reflect.ValueOf(structPtr).Elem()
	for i := 0; i < v.NumField(); i++ {
		f := v.Field(i)
		if f.CanSet() {
			f.Set(reflect.Zero(f.Type()))
		}
	}
}

func CopyFields(dst, src interface{}) {
	dv := reflect.ValueOf(dst).Elem()
	sv := reflect.ValueOf(src).Elem()
	st := sv.Type()
	for i := 0; i < sv.NumField(); i++ {
		name := st.Field(i).Name
		df := dv.FieldByName(name)
		sf := sv.Field(i)
		if df.IsValid() && df.CanSet() && df.Type() == sf.Type() {
			df.Set(sf)
		}
	}
}

var _ = reflect.ValueOf`,
  hints: [
    'SetInt: reflect.ValueOf(p).Elem().SetInt(int64(val)) — Elem() dereferences the pointer.',
    'SetField: v.FieldByName(name) gets the field. Check IsValid() and CanSet() before calling Set().',
    'ZeroFields: iterate v.NumField(), set each to reflect.Zero(f.Type()).'
  ],
}

export default exercise
