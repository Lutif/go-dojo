import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_12_json_unmarshal',
  title: 'JSON Unmarshal',
  category: 'Standard Library',
  subcategory: 'JSON',
  difficulty: 'intermediate',
  order: 12,
  description: `\`json.Unmarshal\` parses JSON into Go values:

\`\`\`
type Config struct {
    Host string \`json:"host"\`
    Port int    \`json:"port"\`
}

var cfg Config
err := json.Unmarshal([]byte(\`{"host":"localhost","port":8080}\`), &cfg)
\`\`\`

For dynamic JSON (unknown structure), unmarshal into \`map[string]interface{}\`:
\`\`\`
var data map[string]interface{}
json.Unmarshal(jsonBytes, &data)
name := data["name"].(string)  // type assert
\`\`\`

Your task: parse JSON into Go types.`,
  code: `package main

import "encoding/json"

// Person represents a person with JSON tags.
type Person struct {
	Name string \`json:"name"\`
	Age  int    \`json:"age"\`
	City string \`json:"city"\`
}

// ParsePerson parses a JSON string into a Person.
func ParsePerson(jsonStr string) (Person, error) {
	// TODO
	return Person{}, nil
}

// ParsePeople parses a JSON array of people.
func ParsePeople(jsonStr string) ([]Person, error) {
	// TODO
	return nil, nil
}

// GetField extracts a string field from arbitrary JSON.
// Returns the field value or "" if not found.
func GetField(jsonStr, field string) string {
	// TODO: Unmarshal to map[string]interface{}, extract field
	return ""
}

// ParseNested parses JSON with nested objects.
// Given: {"user": {"name": "Alice"}, "score": 95}
// Returns the user name and score.
func ParseNested(jsonStr string) (name string, score int, err error) {
	// TODO
	return "", 0, nil
}

var _ = json.Unmarshal`,
  testCode: `package main

import "testing"

func TestParsePerson(t *testing.T) {
	p, err := ParsePerson(\`{"name":"Alice","age":30,"city":"NYC"}\`)
	if err != nil {
		t.Fatal(err)
	}
	if p.Name != "Alice" || p.Age != 30 || p.City != "NYC" {
		t.Errorf("got %+v", p)
	}
}

func TestParsePersonPartial(t *testing.T) {
	p, err := ParsePerson(\`{"name":"Bob"}\`)
	if err != nil {
		t.Fatal(err)
	}
	if p.Name != "Bob" || p.Age != 0 {
		t.Errorf("got %+v", p)
	}
}

func TestParsePeople(t *testing.T) {
	people, err := ParsePeople(\`[{"name":"A","age":1,"city":"X"},{"name":"B","age":2,"city":"Y"}]\`)
	if err != nil {
		t.Fatal(err)
	}
	if len(people) != 2 || people[0].Name != "A" || people[1].Name != "B" {
		t.Errorf("got %+v", people)
	}
}

func TestGetField(t *testing.T) {
	got := GetField(\`{"name":"Go","version":"1.21"}\`, "name")
	if got != "Go" {
		t.Errorf("got %q, want Go", got)
	}
}

func TestGetFieldMissing(t *testing.T) {
	got := GetField(\`{"name":"Go"}\`, "missing")
	if got != "" {
		t.Errorf("got %q, want empty", got)
	}
}

func TestParseNested(t *testing.T) {
	input := \`{"user":{"name":"Alice"},"score":95}\`
	name, score, err := ParseNested(input)
	if err != nil {
		t.Fatal(err)
	}
	if name != "Alice" || score != 95 {
		t.Errorf("got name=%q score=%d", name, score)
	}
}`,
  solution: `package main

import "encoding/json"

type Person struct {
	Name string \`json:"name"\`
	Age  int    \`json:"age"\`
	City string \`json:"city"\`
}

func ParsePerson(jsonStr string) (Person, error) {
	var p Person
	err := json.Unmarshal([]byte(jsonStr), &p)
	return p, err
}

func ParsePeople(jsonStr string) ([]Person, error) {
	var people []Person
	err := json.Unmarshal([]byte(jsonStr), &people)
	return people, err
}

func GetField(jsonStr, field string) string {
	var m map[string]interface{}
	if err := json.Unmarshal([]byte(jsonStr), &m); err != nil {
		return ""
	}
	if v, ok := m[field]; ok {
		if s, ok := v.(string); ok {
			return s
		}
	}
	return ""
}

func ParseNested(jsonStr string) (name string, score int, err error) {
	var data struct {
		User  struct {
			Name string \`json:"name"\`
		} \`json:"user"\`
		Score int \`json:"score"\`
	}
	err = json.Unmarshal([]byte(jsonStr), &data)
	if err != nil {
		return "", 0, err
	}
	return data.User.Name, data.Score, nil
}

var _ = json.Unmarshal`,
  hints: [
    'ParsePerson: json.Unmarshal([]byte(jsonStr), &p). Always pass a pointer!',
    'GetField: unmarshal to map[string]interface{}, type-assert the value: v.(string).',
    'ParseNested: define an anonymous struct matching the JSON shape, or unmarshal to nested maps.'
  ],
}

export default exercise
