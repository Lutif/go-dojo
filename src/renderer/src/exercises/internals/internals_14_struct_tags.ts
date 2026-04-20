import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_14_struct_tags',
  title: 'Reflect Struct Tags',
  category: 'Internals',
  subcategory: 'Reflection',
  difficulty: 'advanced',
  order: 14,
  description: `Struct tags are string metadata attached to fields, read via reflection:

\`\`\`
type User struct {
    Name  string ` + "`" + `json:"name" validate:"required"` + "`" + `
    Email string ` + "`" + `json:"email,omitempty"` + "`" + `
}

t := reflect.TypeOf(User{})
f, _ := t.FieldByName("Name")
f.Tag.Get("json")      // "name"
f.Tag.Get("validate")  // "required"
\`\`\`

Your task: read and use struct tags via reflection.`,
  code: `package main

import "reflect"

// GetTag returns the value of a struct tag for a given field and key.
func GetTag(v interface{}, fieldName, tagKey string) string {
	// TODO: Use reflect.TypeOf, FieldByName, Tag.Get
	return ""
}

// GetAllTags returns all tag values for a given key across all fields.
// Returns a map of fieldName -> tagValue. Skips fields without the tag.
func GetAllTags(v interface{}, tagKey string) map[string]string {
	// TODO
	return nil
}

// FieldNames returns field names that have a specific tag key set.
func FieldNames(v interface{}, tagKey string) []string {
	// TODO
	return nil
}

var _ = reflect.TypeOf`,
  testCode: `package main

import "testing"

type Config struct {
	Host    string ` + "`" + `env:"APP_HOST" default:"localhost"` + "`" + `
	Port    int    ` + "`" + `env:"APP_PORT" default:"8080"` + "`" + `
	Debug   bool   ` + "`" + `env:"APP_DEBUG"` + "`" + `
	Version string
}

func TestGetTag(t *testing.T) {
	got := GetTag(Config{}, "Host", "env")
	if got != "APP_HOST" {
		t.Errorf("got %q", got)
	}
}

func TestGetTagDefault(t *testing.T) {
	got := GetTag(Config{}, "Host", "default")
	if got != "localhost" {
		t.Errorf("got %q", got)
	}
}

func TestGetTagMissing(t *testing.T) {
	got := GetTag(Config{}, "Version", "env")
	if got != "" {
		t.Errorf("got %q, want empty", got)
	}
}

func TestGetAllTags(t *testing.T) {
	tags := GetAllTags(Config{}, "env")
	if tags["Host"] != "APP_HOST" || tags["Port"] != "APP_PORT" || tags["Debug"] != "APP_DEBUG" {
		t.Errorf("got %v", tags)
	}
	if _, ok := tags["Version"]; ok {
		t.Error("Version should not have env tag")
	}
}

func TestFieldNames(t *testing.T) {
	names := FieldNames(Config{}, "default")
	if len(names) != 2 {
		t.Fatalf("got %v, want 2 fields", names)
	}
}`,
  solution: `package main

import "reflect"

func GetTag(v interface{}, fieldName, tagKey string) string {
	t := reflect.TypeOf(v)
	f, ok := t.FieldByName(fieldName)
	if !ok {
		return ""
	}
	return f.Tag.Get(tagKey)
}

func GetAllTags(v interface{}, tagKey string) map[string]string {
	t := reflect.TypeOf(v)
	result := make(map[string]string)
	for i := 0; i < t.NumField(); i++ {
		f := t.Field(i)
		tag := f.Tag.Get(tagKey)
		if tag != "" {
			result[f.Name] = tag
		}
	}
	return result
}

func FieldNames(v interface{}, tagKey string) []string {
	t := reflect.TypeOf(v)
	var names []string
	for i := 0; i < t.NumField(); i++ {
		f := t.Field(i)
		if f.Tag.Get(tagKey) != "" {
			names = append(names, f.Name)
		}
	}
	return names
}

var _ = reflect.TypeOf`,
  hints: [
    'GetTag: reflect.TypeOf(v).FieldByName(fieldName) returns the field. Use field.Tag.Get(key).',
    'GetAllTags: iterate t.NumField(), check each field Tag.Get(key) for non-empty value.',
    'FieldNames: same loop as GetAllTags but collect field names instead of tag values.'
  ],
}

export default exercise
