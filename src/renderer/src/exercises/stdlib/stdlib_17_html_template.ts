import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_17_html_template',
  title: 'html/template',
  category: 'Standard Library',
  subcategory: 'Templates',
  difficulty: 'intermediate',
  order: 17,
  description: `\`text/template\` renders data-driven text output:

\`\`\`
tmpl := template.Must(template.New("").Parse("Hello, {{.Name}}!"))
tmpl.Execute(os.Stdout, map[string]string{"Name": "Go"})
// Output: Hello, Go!
\`\`\`

Template syntax:
- \`{{.Field}}\` — access a field
- \`{{range .Items}}...{{end}}\` — loop
- \`{{if .Cond}}...{{else}}...{{end}}\` — conditional
- \`{{.}}\` — current value (useful in range)

Your task: render data using templates.`,
  code: `package main

import (
	"bytes"
	"text/template"
)

// RenderGreeting returns "Hello, <name>!" using a template.
func RenderGreeting(name string) string {
	// TODO: Parse and execute a template
	return ""
}

// RenderList renders items as a numbered list:
// "1. item1\n2. item2\n"
func RenderList(items []string) string {
	// TODO: Use {{range}} with index
	return ""
}

// RenderTable renders rows as "| col1 | col2 |\n" format.
func RenderTable(headers []string, rows [][]string) string {
	// TODO
	return ""
}

var _ = template.Must
var _ = bytes.NewBuffer`,
  testCode: `package main

import "testing"

func TestRenderGreeting(t *testing.T) {
	got := RenderGreeting("Alice")
	if got != "Hello, Alice!" {
		t.Errorf("got %q", got)
	}
}

func TestRenderList(t *testing.T) {
	got := RenderList([]string{"go", "rust", "python"})
	want := "1. go\n2. rust\n3. python\n"
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}

func TestRenderListEmpty(t *testing.T) {
	got := RenderList([]string{})
	if got != "" {
		t.Errorf("got %q, want empty", got)
	}
}

func TestRenderTable(t *testing.T) {
	headers := []string{"Name", "Age"}
	rows := [][]string{{"Alice", "30"}, {"Bob", "25"}}
	got := RenderTable(headers, rows)
	want := "| Name | Age |\n| Alice | 30 |\n| Bob | 25 |\n"
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}`,
  solution: `package main

import (
	"bytes"
	"text/template"
)

func RenderGreeting(name string) string {
	tmpl := template.Must(template.New("").Parse("Hello, {{.}}!"))
	var buf bytes.Buffer
	tmpl.Execute(&buf, name)
	return buf.String()
}

func RenderList(items []string) string {
	tmpl := template.Must(template.New("").Parse(
		"{{range $i, $v := .}}{{add $i 1}}. {{$v}}\n{{end}}",
	))
	tmpl = tmpl.Funcs(template.FuncMap{
		"add": func(a, b int) int { return a + b },
	})
	// Rebuild with funcs
	tmpl = template.Must(template.New("").Funcs(template.FuncMap{
		"add": func(a, b int) int { return a + b },
	}).Parse("{{range $i, $v := .}}{{add $i 1}}. {{$v}}\n{{end}}"))

	var buf bytes.Buffer
	tmpl.Execute(&buf, items)
	return buf.String()
}

func RenderTable(headers []string, rows [][]string) string {
	tmpl := template.Must(template.New("").Parse(
		"| {{range $i, $v := .Headers}}{{if $i}} | {{end}}{{$v}}{{end}} |\n" +
			"{{range .Rows}}| {{range $i, $v := .}}{{if $i}} | {{end}}{{$v}}{{end}} |\n{{end}}",
	))
	var buf bytes.Buffer
	tmpl.Execute(&buf, struct {
		Headers []string
		Rows    [][]string
	}{headers, rows})
	return buf.String()
}

var _ = template.Must
var _ = bytes.NewBuffer`,
  hints: [
    'RenderGreeting: template.Must(template.New("").Parse("Hello, {{.}}!")). Execute into a bytes.Buffer.',
    'RenderList: use {{range $i, $v := .}} to get index and value. Register a custom "add" func to make 1-based index.',
    'RenderTable: structure data into a struct with Headers and Rows fields. Use nested {{range}} for rows and columns.'
  ],
}

export default exercise
