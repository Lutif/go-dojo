import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_13_json_custom',
  title: 'JSON Custom Encoding',
  category: 'Standard Library',
  subcategory: 'JSON',
  difficulty: 'advanced',
  order: 13,
  description: `Implement \`json.Marshaler\` and \`json.Unmarshaler\` for custom serialization:

\`\`\`
type Color struct{ R, G, B uint8 }

func (c Color) MarshalJSON() ([]byte, error) {
    hex := fmt.Sprintf("\\"#%02x%02x%02x\\"", c.R, c.G, c.B)
    return []byte(hex), nil
}

func (c *Color) UnmarshalJSON(data []byte) error {
    var hex string
    json.Unmarshal(data, &hex)
    fmt.Sscanf(hex, "#%02x%02x%02x", &c.R, &c.G, &c.B)
    return nil
}
\`\`\`

Custom encoding is useful for: dates in specific formats, enums as strings, flattening nested structures.

Your task: implement custom JSON marshaling/unmarshaling.`,
  code: `package main

import (
	"encoding/json"
	"fmt"
	"strings"
)

// Status is an enum-like type that marshals as a string.
type Status int

const (
	StatusActive  Status = iota
	StatusPending
	StatusInactive
)

// TODO: Implement MarshalJSON for Status
// Active → "active", Pending → "pending", Inactive → "inactive"

// TODO: Implement UnmarshalJSON for Status
// "active" → StatusActive, etc.

// StringList marshals as a comma-separated string instead of JSON array.
// ["a","b","c"] → "a,b,c"
type StringList []string

// TODO: Implement MarshalJSON for StringList
// TODO: Implement UnmarshalJSON for StringList

var _ = json.Marshal
var _ = fmt.Sprintf
var _ = strings.Join`,
  testCode: `package main

import (
	"encoding/json"
	"testing"
)

func TestStatusMarshal(t *testing.T) {
	tests := []struct {
		s    Status
		want string
	}{
		{StatusActive, "\"active\""},
		{StatusPending, "\"pending\""},
		{StatusInactive, "\"inactive\""},
	}
	for _, tt := range tests {
		data, err := json.Marshal(tt.s)
		if err != nil {
			t.Fatal(err)
		}
		if string(data) != tt.want {
			t.Errorf("Marshal(%d) = %s, want %s", tt.s, data, tt.want)
		}
	}
}

func TestStatusUnmarshal(t *testing.T) {
	var s Status
	err := json.Unmarshal([]byte("\"active\""), &s)
	if err != nil || s != StatusActive {
		t.Errorf("got %d, want StatusActive", s)
	}
	err = json.Unmarshal([]byte("\"pending\""), &s)
	if err != nil || s != StatusPending {
		t.Errorf("got %d, want StatusPending", s)
	}
}

func TestStatusInStruct(t *testing.T) {
	type Item struct {
		Name   string \`json:"name"\`
		Status Status \`json:"status"\`
	}
	item := Item{Name: "task", Status: StatusActive}
	data, _ := json.Marshal(item)
	got := string(data)
	if got != "{\"name\":\"task\",\"status\":\"active\"}" {
		t.Errorf("got %s", got)
	}
}

func TestStringListMarshal(t *testing.T) {
	sl := StringList{"a", "b", "c"}
	data, err := json.Marshal(sl)
	if err != nil {
		t.Fatal(err)
	}
	if string(data) != "\"a,b,c\"" {
		t.Errorf("got %s, want \"a,b,c\"", data)
	}
}

func TestStringListUnmarshal(t *testing.T) {
	var sl StringList
	err := json.Unmarshal([]byte("\"x,y,z\""), &sl)
	if err != nil {
		t.Fatal(err)
	}
	if len(sl) != 3 || sl[0] != "x" || sl[1] != "y" || sl[2] != "z" {
		t.Errorf("got %v", sl)
	}
}

func TestStringListEmpty(t *testing.T) {
	var sl StringList
	err := json.Unmarshal([]byte("\"\""), &sl)
	if err != nil {
		t.Fatal(err)
	}
	// Empty string should produce empty or single-empty-element list
	data, _ := json.Marshal(StringList{})
	if string(data) != "\"\"" {
		t.Errorf("Marshal empty = %s", data)
	}
}`,
  solution: `package main

import (
	"encoding/json"
	"fmt"
	"strings"
)

type Status int

const (
	StatusActive  Status = iota
	StatusPending
	StatusInactive
)

var statusNames = map[Status]string{
	StatusActive:   "active",
	StatusPending:  "pending",
	StatusInactive: "inactive",
}

var statusValues = map[string]Status{
	"active":   StatusActive,
	"pending":  StatusPending,
	"inactive": StatusInactive,
}

func (s Status) MarshalJSON() ([]byte, error) {
	name, ok := statusNames[s]
	if !ok {
		return nil, fmt.Errorf("unknown status: %d", s)
	}
	return json.Marshal(name)
}

func (s *Status) UnmarshalJSON(data []byte) error {
	var name string
	if err := json.Unmarshal(data, &name); err != nil {
		return err
	}
	val, ok := statusValues[name]
	if !ok {
		return fmt.Errorf("unknown status: %q", name)
	}
	*s = val
	return nil
}

type StringList []string

func (sl StringList) MarshalJSON() ([]byte, error) {
	return json.Marshal(strings.Join(sl, ","))
}

func (sl *StringList) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}
	if s == "" {
		*sl = StringList{}
	} else {
		*sl = strings.Split(s, ",")
	}
	return nil
}

var _ = fmt.Sprintf`,
  hints: [
    'MarshalJSON must return valid JSON bytes — use json.Marshal(stringValue) to get properly quoted output.',
    'UnmarshalJSON: first unmarshal data into a string, then convert to your type.',
    'StringList: marshal joins with comma, unmarshal splits by comma. Handle empty string as empty list.'
  ],
}

export default exercise
