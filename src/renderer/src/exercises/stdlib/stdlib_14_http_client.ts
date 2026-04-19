import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_14_http_client',
  title: 'HTTP Client',
  category: 'Standard Library',
  subcategory: 'HTTP',
  difficulty: 'intermediate',
  order: 14,
  description: `Go's \`net/http\` package includes a powerful HTTP client:

\`\`\`
resp, err := http.Get("https://example.com/api")
if err != nil { return err }
defer resp.Body.Close()

body, err := io.ReadAll(resp.Body)
\`\`\`

For testing, use \`httptest.NewServer\` to create a local test server:
\`\`\`
ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "hello")
}))
defer ts.Close()
resp, err := http.Get(ts.URL)
\`\`\`

Your task: work with HTTP clients using test servers.`,
  code: `package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// FetchBody makes a GET request and returns the response body as string.
func FetchBody(url string) (string, error) {
	// TODO: http.Get, read body, return as string
	return "", nil
}

// FetchJSON makes a GET request, parses the JSON response into result.
func FetchJSON(url string, result interface{}) error {
	// TODO: http.Get, json.NewDecoder(resp.Body).Decode(result)
	return nil
}

// FetchStatus makes a GET request and returns the status code.
func FetchStatus(url string) (int, error) {
	// TODO
	return 0, nil
}

var _ = fmt.Sprintf
var _ = io.ReadAll
var _ = http.Get
var _ = json.NewDecoder`,
  testCode: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestFetchBody(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "hello world")
	}))
	defer ts.Close()

	got, err := FetchBody(ts.URL)
	if err != nil {
		t.Fatal(err)
	}
	if got != "hello world" {
		t.Errorf("got %q", got)
	}
}

func TestFetchJSON(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"name": "Go"})
	}))
	defer ts.Close()

	var result map[string]string
	err := FetchJSON(ts.URL, &result)
	if err != nil {
		t.Fatal(err)
	}
	if result["name"] != "Go" {
		t.Errorf("got %v", result)
	}
}

func TestFetchStatus(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
	}))
	defer ts.Close()

	code, err := FetchStatus(ts.URL)
	if err != nil {
		t.Fatal(err)
	}
	if code != 404 {
		t.Errorf("got %d, want 404", code)
	}
}

func TestFetchStatusOK(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))
	defer ts.Close()

	code, err := FetchStatus(ts.URL)
	if err != nil {
		t.Fatal(err)
	}
	if code != 200 {
		t.Errorf("got %d, want 200", code)
	}
}`,
  solution: `package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func FetchBody(url string) (string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	return string(body), nil
}

func FetchJSON(url string, result interface{}) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return json.NewDecoder(resp.Body).Decode(result)
}

func FetchStatus(url string) (int, error) {
	resp, err := http.Get(url)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()
	return resp.StatusCode, nil
}

var _ = fmt.Sprintf
var _ = io.ReadAll
var _ = http.Get
var _ = json.NewDecoder`,
  hints: [
    'FetchBody: http.Get(url), defer resp.Body.Close(), io.ReadAll(resp.Body), convert to string.',
    'FetchJSON: use json.NewDecoder(resp.Body).Decode(result) instead of ReadAll + Unmarshal. More efficient for streams.',
    'Always defer resp.Body.Close() to prevent resource leaks.'
  ],
}

export default exercise
