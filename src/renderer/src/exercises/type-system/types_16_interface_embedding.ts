import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_16_interface_embedding',
  title: 'Interface Embedding',
  category: 'Type System',
  subcategory: 'Embedding',
  difficulty: 'intermediate',
  order: 16,
  description: `Just as structs can embed other structs, interfaces can embed other interfaces to compose larger contracts:

\`\`\`
type Sizer interface { Size() int }
type Namer interface { Name() string }
type SizedNamer interface {
    Sizer
    Namer
}
\`\`\`

The standard library uses this extensively: \`io.ReadWriter\` embeds \`io.Reader\` and \`io.Writer\`.

Your task: compose interfaces through embedding and implement them.`,
  code: `package main

import "fmt"

// Printer can print itself
type Printer interface {
	Print() string
}

// Saver can save itself
type Saver interface {
	Save() string
}

// Validator can validate itself
type Validator interface {
	Validate() error
}

// TODO: Define a Document interface that embeds Printer, Saver, and Validator

// Report implements Document
type Report struct {
	Title   string
	Content string
}

// TODO: Implement Print() — returns "Report: Title"
// TODO: Implement Save() — returns "Saved: Title"
// TODO: Implement Validate() — returns error if Title is empty, nil otherwise

// ProcessDocument takes any Document: validates, saves, and prints.
// Returns the print result if valid, or the error message if invalid.
func ProcessDocument(doc Document) string {
	// TODO: Call Validate(), return error message if err != nil
	// Otherwise call Save() then return Print()
	return ""
}

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestReportPrint(t *testing.T) {
	r := Report{Title: "Q4", Content: "Results"}
	if got := r.Print(); got != "Report: Q4" {
		t.Errorf("Print() = %q, want %q", got, "Report: Q4")
	}
}

func TestReportSave(t *testing.T) {
	r := Report{Title: "Q4", Content: "Results"}
	if got := r.Save(); got != "Saved: Q4" {
		t.Errorf("Save() = %q, want %q", got, "Saved: Q4")
	}
}

func TestReportValidateOk(t *testing.T) {
	r := Report{Title: "Q4", Content: "Results"}
	if err := r.Validate(); err != nil {
		t.Errorf("Validate() = %v, want nil", err)
	}
}

func TestReportValidateEmpty(t *testing.T) {
	r := Report{Title: "", Content: "stuff"}
	if err := r.Validate(); err == nil {
		t.Error("Validate() should return error for empty title")
	}
}

func TestDocumentInterface(t *testing.T) {
	// Verify Report satisfies Document
	var doc Document = Report{Title: "Test", Content: "body"}
	_ = doc
}

func TestProcessDocumentValid(t *testing.T) {
	r := Report{Title: "Annual", Content: "Report body"}
	got := ProcessDocument(r)
	if got != "Report: Annual" {
		t.Errorf("ProcessDocument = %q, want %q", got, "Report: Annual")
	}
}

func TestProcessDocumentInvalid(t *testing.T) {
	r := Report{Title: "", Content: "stuff"}
	got := ProcessDocument(r)
	if got == "" {
		t.Error("ProcessDocument should return error message for invalid doc")
	}
}`,
  solution: `package main

import "fmt"

type Printer interface {
	Print() string
}

type Saver interface {
	Save() string
}

type Validator interface {
	Validate() error
}

type Document interface {
	Printer
	Saver
	Validator
}

type Report struct {
	Title   string
	Content string
}

func (r Report) Print() string {
	return fmt.Sprintf("Report: %s", r.Title)
}

func (r Report) Save() string {
	return fmt.Sprintf("Saved: %s", r.Title)
}

func (r Report) Validate() error {
	if r.Title == "" {
		return fmt.Errorf("title is required")
	}
	return nil
}

func ProcessDocument(doc Document) string {
	if err := doc.Validate(); err != nil {
		return err.Error()
	}
	doc.Save()
	return doc.Print()
}`,
  hints: [
    'Compose interfaces: type Document interface { Printer; Saver; Validator }',
    'Report must implement all three methods (Print, Save, Validate) to satisfy Document.',
    'For Validate, return fmt.Errorf("message") for invalid, nil for valid.'
  ],
}

export default exercise
