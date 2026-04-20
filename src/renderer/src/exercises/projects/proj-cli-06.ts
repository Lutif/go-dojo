import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-cli-06',
  title: 'CLI Parser — Flag Validation & Defaults',
  category: 'Projects',
  subcategory: 'CLI Parser',
  difficulty: 'expert',
  order: 15,
  projectId: 'proj-cli',
  step: 6,
  totalSteps: 6,
  description: `Add flag validation, required flags, and default values. This is the capstone step for the CLI parser.

**Requirements:**
- FlagSpec struct: Name, Required (bool), Default, Validate func(string) error
- ValidateFlags(specs []FlagSpec, provided map[string]string) (map[string]string, error)
- Apply defaults for missing non-required flags
- Return error if a required flag is missing
- Run the Validate function if provided; return its error on failure
- Return the final merged map of flag values`,
  code: `package main

import "fmt"

// FlagSpec defines a flag with validation rules.
type FlagSpec struct {
	Name     string
	Required bool
	Default  string
	Validate func(string) error
}

// ValidateFlags checks provided flags against specs, applies defaults, and validates.
func ValidateFlags(specs []FlagSpec, provided map[string]string) (map[string]string, error) {
	// TODO: Implement validation
	// 1. Build result map starting from provided flags
	// 2. For each spec:
	//    a. If flag is missing and Required, return error
	//    b. If flag is missing and has Default, apply it
	//    c. If flag is present and Validate != nil, run Validate
	_ = fmt.Sprintf // avoid unused import
	return nil, nil
}

func main() {}
`,
  testCode: `package main

import (
	"fmt"
	"strconv"
	"strings"
	"testing"
)

func TestValidateDefaults(t *testing.T) {
	specs := []FlagSpec{
		{Name: "port", Default: "8080"},
		{Name: "host", Default: "localhost"},
	}
	result, err := ValidateFlags(specs, map[string]string{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result["port"] != "8080" {
		t.Errorf("expected port=8080, got %s", result["port"])
	}
	if result["host"] != "localhost" {
		t.Errorf("expected host=localhost, got %s", result["host"])
	}
}

func TestValidateProvidedOverridesDefault(t *testing.T) {
	specs := []FlagSpec{
		{Name: "port", Default: "8080"},
	}
	result, err := ValidateFlags(specs, map[string]string{"port": "3000"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result["port"] != "3000" {
		t.Errorf("expected port=3000, got %s", result["port"])
	}
}

func TestValidateRequired(t *testing.T) {
	specs := []FlagSpec{
		{Name: "token", Required: true},
	}
	_, err := ValidateFlags(specs, map[string]string{})
	if err == nil {
		t.Fatal("expected error for missing required flag")
	}
	if !strings.Contains(err.Error(), "token") {
		t.Errorf("error should mention flag name: %v", err)
	}
}

func TestValidateRequiredProvided(t *testing.T) {
	specs := []FlagSpec{
		{Name: "token", Required: true},
	}
	result, err := ValidateFlags(specs, map[string]string{"token": "abc123"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result["token"] != "abc123" {
		t.Errorf("expected token=abc123, got %s", result["token"])
	}
}

func TestValidateCustomValidator(t *testing.T) {
	specs := []FlagSpec{
		{Name: "port", Default: "8080", Validate: func(v string) error {
			n, err := strconv.Atoi(v)
			if err != nil {
				return fmt.Errorf("port must be a number")
			}
			if n < 1 || n > 65535 {
				return fmt.Errorf("port must be between 1 and 65535")
			}
			return nil
		}},
	}
	_, err := ValidateFlags(specs, map[string]string{"port": "abc"})
	if err == nil {
		t.Fatal("expected validation error")
	}
	if !strings.Contains(err.Error(), "port") {
		t.Errorf("error should mention flag name: %v", err)
	}
}

func TestValidateValidatorPasses(t *testing.T) {
	specs := []FlagSpec{
		{Name: "port", Validate: func(v string) error {
			_, err := strconv.Atoi(v)
			return err
		}},
	}
	result, err := ValidateFlags(specs, map[string]string{"port": "3000"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result["port"] != "3000" {
		t.Errorf("expected port=3000, got %s", result["port"])
	}
}

func TestValidateMixedScenario(t *testing.T) {
	specs := []FlagSpec{
		{Name: "host", Default: "localhost"},
		{Name: "port", Required: true, Validate: func(v string) error {
			_, err := strconv.Atoi(v)
			return err
		}},
		{Name: "debug", Default: "false"},
	}
	result, err := ValidateFlags(specs, map[string]string{"port": "9090", "debug": "true"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result["host"] != "localhost" {
		t.Errorf("expected host=localhost, got %s", result["host"])
	}
	if result["port"] != "9090" {
		t.Errorf("expected port=9090, got %s", result["port"])
	}
	if result["debug"] != "true" {
		t.Errorf("expected debug=true, got %s", result["debug"])
	}
}
`,
  solution: `package main

import "fmt"

// FlagSpec defines a flag with validation rules.
type FlagSpec struct {
	Name     string
	Required bool
	Default  string
	Validate func(string) error
}

// ValidateFlags checks provided flags against specs, applies defaults, and validates.
func ValidateFlags(specs []FlagSpec, provided map[string]string) (map[string]string, error) {
	result := make(map[string]string)
	// Copy provided flags
	for k, v := range provided {
		result[k] = v
	}

	for _, spec := range specs {
		val, exists := result[spec.Name]

		if !exists {
			if spec.Required {
				return nil, fmt.Errorf("required flag --%s is missing", spec.Name)
			}
			if spec.Default != "" {
				result[spec.Name] = spec.Default
				val = spec.Default
				exists = true
			}
		}

		if exists && spec.Validate != nil {
			if err := spec.Validate(val); err != nil {
				return nil, fmt.Errorf("invalid value for --%s: %w", spec.Name, err)
			}
		}
	}

	return result, nil
}

func main() {}
`,
  hints: [
    'Copy the provided map first so you do not mutate the input',
    'Check Required before applying Default -- a required flag with no value is an error',
    'Only run Validate when the flag actually has a value (provided or defaulted)',
  ],
}

export default exercise
