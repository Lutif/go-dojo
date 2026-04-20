import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_16_code_generation',
  title: 'Code Generation',
  category: 'Internals',
  subcategory: 'Build System',
  difficulty: 'advanced',
  order: 16,
  description: `\`go generate\` runs commands to generate Go source code:

\`\`\`
//go:generate stringer -type=Color
\`\`\`

Common uses:
- \`stringer\` — generates String() methods for const enums
- \`mockgen\` — generates mock implementations
- Custom generators using \`text/template\`

Since we can't run \`go generate\` in the sandbox, your task: write generator functions that produce Go source code as strings — simulating what tools like \`stringer\` do.`,
  code: `package main

import "fmt"

// GenerateStringer generates a String() method for an enum type.
// Given type name "Color" and values ["Red", "Green", "Blue"],
// return Go source for a String() method using a switch.
func GenerateStringer(typeName string, values []string) string {
	// TODO: Generate a func (c Color) String() string { switch ... }
	return ""
}

// GenerateConstructor generates a NewXxx constructor function.
// Given type "Server" and fields [("host","string"),("port","int")],
// return Go source for func NewServer(host string, port int) *Server { ... }
func GenerateConstructor(typeName string, fields []FieldDef) string {
	// TODO
	return ""
}

type FieldDef struct {
	Name string
	Type string
}

// GenerateEnum generates const/iota declarations.
// Given type "Status" and values ["Active", "Inactive", "Deleted"],
// generate: type Status int; const ( Active Status = iota; ... )
func GenerateEnum(typeName string, values []string) string {
	// TODO
	return ""
}

var _ = fmt.Sprintf`,
  testCode: `package main

import (
	"strings"
	"testing"
)

func TestGenerateStringer(t *testing.T) {
	got := GenerateStringer("Color", []string{"Red", "Green", "Blue"})
	if !strings.Contains(got, "func (c Color) String() string") {
		t.Error("missing method signature")
	}
	if !strings.Contains(got, "Red") || !strings.Contains(got, "Green") {
		t.Error("missing values")
	}
	if !strings.Contains(got, "switch") || !strings.Contains(got, "case") {
		t.Error("should use switch/case")
	}
}

func TestGenerateConstructor(t *testing.T) {
	fields := []FieldDef{
		{Name: "Host", Type: "string"},
		{Name: "Port", Type: "int"},
	}
	got := GenerateConstructor("Server", fields)
	if !strings.Contains(got, "func NewServer") {
		t.Error("missing constructor name")
	}
	if !strings.Contains(got, "*Server") {
		t.Error("should return pointer")
	}
	if !strings.Contains(got, "Host") || !strings.Contains(got, "Port") {
		t.Error("missing fields")
	}
}

func TestGenerateEnum(t *testing.T) {
	got := GenerateEnum("Status", []string{"Active", "Inactive", "Deleted"})
	if !strings.Contains(got, "type Status int") {
		t.Error("missing type declaration")
	}
	if !strings.Contains(got, "iota") {
		t.Error("should use iota")
	}
	if !strings.Contains(got, "Active") || !strings.Contains(got, "Deleted") {
		t.Error("missing values")
	}
}`,
  solution: `package main

import (
	"fmt"
	"strings"
)

func GenerateStringer(typeName string, values []string) string {
	var b strings.Builder
	lower := strings.ToLower(typeName[:1])
	fmt.Fprintf(&b, "func (%s %s) String() string {\\n", lower, typeName)
	fmt.Fprintf(&b, "\\tswitch %s {\\n", lower)
	for _, v := range values {
		fmt.Fprintf(&b, "\\tcase %s:\\n", v)
		fmt.Fprintf(&b, "\\t\\treturn %q\\n", v)
	}
	b.WriteString("\\tdefault:\\n")
	fmt.Fprintf(&b, "\\t\\treturn fmt.Sprintf(\"%s(%%d)\", int(%s))\\n", typeName, lower)
	b.WriteString("\\t}\\n")
	b.WriteString("}\\n")
	return b.String()
}

type FieldDef struct {
	Name string
	Type string
}

func GenerateConstructor(typeName string, fields []FieldDef) string {
	var b strings.Builder
	// Build parameter list
	params := make([]string, len(fields))
	for i, f := range fields {
		params[i] = fmt.Sprintf("%s %s", strings.ToLower(f.Name[:1])+f.Name[1:], f.Type)
	}
	fmt.Fprintf(&b, "func New%s(%s) *%s {\\n", typeName, strings.Join(params, ", "), typeName)
	fmt.Fprintf(&b, "\\treturn &%s{\\n", typeName)
	for _, f := range fields {
		fmt.Fprintf(&b, "\\t\\t%s: %s,\\n", f.Name, strings.ToLower(f.Name[:1])+f.Name[1:])
	}
	b.WriteString("\\t}\\n")
	b.WriteString("}\\n")
	return b.String()
}

func GenerateEnum(typeName string, values []string) string {
	var b strings.Builder
	fmt.Fprintf(&b, "type %s int\\n\\n", typeName)
	b.WriteString("const (\\n")
	for i, v := range values {
		if i == 0 {
			fmt.Fprintf(&b, "\\t%s %s = iota\\n", v, typeName)
		} else {
			fmt.Fprintf(&b, "\\t%s\\n", v)
		}
	}
	b.WriteString(")\\n")
	return b.String()
}

var _ = fmt.Sprintf`,
  hints: [
    'GenerateStringer: use fmt.Fprintf to build a switch statement with one case per value.',
    'GenerateConstructor: build a "func NewX(params) *X { return &X{fields} }" string.',
    'GenerateEnum: first value gets "TypeName = iota", subsequent values just list the name.'
  ],
}

export default exercise
