import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_11_json_marshal',
  title: 'JSON Marshal',
  category: 'Standard Library',
  subcategory: 'JSON',
  difficulty: 'intermediate',
  order: 11,
  description: `\`json.Marshal\` converts Go values to JSON:

\`\`\`
type User struct {
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
    Age   int    \`json:"age,omitempty"\`
}

user := User{Name: "Alice", Email: "alice@example.com"}
data, err := json.Marshal(user)
// {"name":"Alice","email":"alice@example.com"}
\`\`\`

Struct tags control JSON field names:
- \`json:"name"\` — custom field name
- \`json:"name,omitempty"\` — skip if zero value
- \`json:"-"\` — always skip this field

Your task: marshal Go structs to JSON.`,
  code: `package main

import "encoding/json"

// Product has JSON tags for serialization.
type Product struct {
	// TODO: Add fields with JSON tags:
	// Name (string, json:"name")
	// Price (float64, json:"price")
	// InStock (bool, json:"in_stock")
	// SKU (string, json:"-")  — hidden from JSON
}

// ToJSON marshals any value to a JSON string.
func ToJSON(v interface{}) (string, error) {
	// TODO
	return "", nil
}

// ToPrettyJSON marshals with indentation (2 spaces).
func ToPrettyJSON(v interface{}) (string, error) {
	// TODO: Use json.MarshalIndent
	return "", nil
}

// MapToJSON converts a map[string]interface{} to JSON string.
func MapToJSON(m map[string]interface{}) (string, error) {
	// TODO
	return "", nil
}

var _ = json.Marshal`,
  testCode: `package main

import (
	"encoding/json"
	"testing"
)

func TestProductToJSON(t *testing.T) {
	p := Product{Name: "Widget", Price: 9.99, InStock: true, SKU: "secret123"}
	got, err := ToJSON(p)
	if err != nil {
		t.Fatal(err)
	}
	// SKU should not appear
	var m map[string]interface{}
	json.Unmarshal([]byte(got), &m)
	if m["name"] != "Widget" {
		t.Errorf("name = %v", m["name"])
	}
	if m["price"] != 9.99 {
		t.Errorf("price = %v", m["price"])
	}
	if m["in_stock"] != true {
		t.Errorf("in_stock = %v", m["in_stock"])
	}
	if _, ok := m["SKU"]; ok {
		t.Error("SKU should be hidden")
	}
	if _, ok := m["sku"]; ok {
		t.Error("sku should be hidden")
	}
}

func TestToJSON(t *testing.T) {
	got, err := ToJSON(map[string]int{"a": 1})
	if err != nil {
		t.Fatal(err)
	}
	if got != "{\"a\":1}" {
		t.Errorf("got %q", got)
	}
}

func TestToPrettyJSON(t *testing.T) {
	got, err := ToPrettyJSON(map[string]int{"x": 1})
	if err != nil {
		t.Fatal(err)
	}
	want := "{\n  \"x\": 1\n}"
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}

func TestMapToJSON(t *testing.T) {
	m := map[string]interface{}{"name": "Go", "version": 1.21}
	got, err := MapToJSON(m)
	if err != nil {
		t.Fatal(err)
	}
	var parsed map[string]interface{}
	json.Unmarshal([]byte(got), &parsed)
	if parsed["name"] != "Go" {
		t.Errorf("name = %v", parsed["name"])
	}
}`,
  solution: `package main

import "encoding/json"

type Product struct {
	Name    string  \`json:"name"\`
	Price   float64 \`json:"price"\`
	InStock bool    \`json:"in_stock"\`
	SKU     string  \`json:"-"\`
}

func ToJSON(v interface{}) (string, error) {
	data, err := json.Marshal(v)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

func ToPrettyJSON(v interface{}) (string, error) {
	data, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		return "", err
	}
	return string(data), nil
}

func MapToJSON(m map[string]interface{}) (string, error) {
	return ToJSON(m)
}

var _ = json.Marshal`,
  hints: [
    'Product: use struct tags like Name string `json:"name"`. SKU uses `json:"-"` to exclude it.',
    'ToJSON: json.Marshal(v) returns []byte. Convert to string.',
    'ToPrettyJSON: json.MarshalIndent(v, "", "  ") for 2-space indentation.'
  ],
}

export default exercise
