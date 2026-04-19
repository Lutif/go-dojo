import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_18_text_template',
  title: 'Template Functions',
  category: 'Standard Library',
  subcategory: 'Templates',
  difficulty: 'intermediate',
  order: 18,
  description: `Templates support custom functions via \`FuncMap\`:

\`\`\`
funcMap := template.FuncMap{
    "upper": strings.ToUpper,
    "add":   func(a, b int) int { return a + b },
}
tmpl := template.Must(
    template.New("").Funcs(funcMap).Parse("{{upper .Name}}"),
)
\`\`\`

Built-in functions: \`and\`, \`or\`, \`not\`, \`len\`, \`index\`, \`print\`, \`printf\`, \`println\`, \`call\`, \`eq\`, \`ne\`, \`lt\`, \`le\`, \`gt\`, \`ge\`.

Pipeline syntax chains functions:
\`\`\`
{{.Name | upper}}          // pipe Name to upper
{{.Price | printf "%.2f"}} // format price
\`\`\`

Your task: use template functions and pipelines.`,
  code: `package main

import (
	"bytes"
	"strings"
	"text/template"
)

// RenderWithFuncs renders a template with custom functions.
// Provide: upper (to uppercase), lower (to lowercase), repeat (string, n)
func RenderWithFuncs(tmplStr string, data interface{}) (string, error) {
	// TODO: Create FuncMap with upper, lower, repeat
	// Parse and execute
	return "", nil
}

// RenderConditional renders different output based on a condition.
// If score >= 60: "PASS: <name>", else "FAIL: <name>"
func RenderConditional(name string, score int) string {
	// TODO: Use {{if}} in template
	return ""
}

// RenderMap renders key-value pairs as "key: value\n" lines.
func RenderMap(data map[string]string) string {
	// TODO: Use {{range $k, $v := .}}
	return ""
}

var _ = template.Must
var _ = bytes.NewBuffer
var _ = strings.ToUpper`,
  testCode: `package main

import "testing"

func TestRenderWithFuncsUpper(t *testing.T) {
	got, err := RenderWithFuncs("{{upper .}}", "hello")
	if err != nil {
		t.Fatal(err)
	}
	if got != "HELLO" {
		t.Errorf("got %q", got)
	}
}

func TestRenderWithFuncsLower(t *testing.T) {
	got, err := RenderWithFuncs("{{lower .}}", "HELLO")
	if err != nil {
		t.Fatal(err)
	}
	if got != "hello" {
		t.Errorf("got %q", got)
	}
}

func TestRenderWithFuncsPipe(t *testing.T) {
	got, err := RenderWithFuncs("{{. | upper}}", "test")
	if err != nil {
		t.Fatal(err)
	}
	if got != "TEST" {
		t.Errorf("got %q", got)
	}
}

func TestRenderWithFuncsRepeat(t *testing.T) {
	got, err := RenderWithFuncs("{{repeat . 3}}", "ha")
	if err != nil {
		t.Fatal(err)
	}
	if got != "hahaha" {
		t.Errorf("got %q", got)
	}
}

func TestRenderConditionalPass(t *testing.T) {
	got := RenderConditional("Alice", 85)
	if got != "PASS: Alice" {
		t.Errorf("got %q", got)
	}
}

func TestRenderConditionalFail(t *testing.T) {
	got := RenderConditional("Bob", 45)
	if got != "FAIL: Bob" {
		t.Errorf("got %q", got)
	}
}

func TestRenderConditionalBoundary(t *testing.T) {
	got := RenderConditional("Eve", 60)
	if got != "PASS: Eve" {
		t.Errorf("got %q", got)
	}
}

func TestRenderMap(t *testing.T) {
	// Single key to avoid map ordering issues
	got := RenderMap(map[string]string{"name": "Go"})
	want := "name: Go\n"
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}`,
  solution: `package main

import (
	"bytes"
	"strings"
	"text/template"
)

func RenderWithFuncs(tmplStr string, data interface{}) (string, error) {
	funcMap := template.FuncMap{
		"upper":  strings.ToUpper,
		"lower":  strings.ToLower,
		"repeat": strings.Repeat,
	}
	tmpl, err := template.New("").Funcs(funcMap).Parse(tmplStr)
	if err != nil {
		return "", err
	}
	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, data); err != nil {
		return "", err
	}
	return buf.String(), nil
}

func RenderConditional(name string, score int) string {
	funcMap := template.FuncMap{
		"ge": func(a, b int) bool { return a >= b },
	}
	tmpl := template.Must(template.New("").Funcs(funcMap).Parse(
		"{{if ge .Score 60}}PASS{{else}}FAIL{{end}}: {{.Name}}",
	))
	var buf bytes.Buffer
	tmpl.Execute(&buf, struct {
		Name  string
		Score int
	}{name, score})
	return buf.String()
}

func RenderMap(data map[string]string) string {
	tmpl := template.Must(template.New("").Parse(
		"{{range $k, $v := .}}{{$k}}: {{$v}}\n{{end}}",
	))
	var buf bytes.Buffer
	tmpl.Execute(&buf, data)
	return buf.String()
}

var _ = template.Must
var _ = bytes.NewBuffer
var _ = strings.ToUpper`,
  hints: [
    'RenderWithFuncs: create FuncMap with "upper": strings.ToUpper, etc. Register with template.New("").Funcs(funcMap).Parse(...).',
    'RenderConditional: {{if ge .Score 60}}PASS{{else}}FAIL{{end}}. Register "ge" as a custom func since it needs int comparison.',
    'RenderMap: {{range $k, $v := .}}{{$k}}: {{$v}}\\n{{end}} iterates map entries.'
  ],
}

export default exercise
