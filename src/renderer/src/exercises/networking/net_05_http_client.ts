import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_05_http_client',
  title: 'HTTP Client',
  category: 'Networking',
  subcategory: 'HTTP',
  difficulty: 'intermediate',
  order: 5,
  description: `Use \`http.Client\` to make HTTP requests to other services. Go's HTTP client supports GET, POST, custom headers, timeouts, and more.

Key concepts:
- \`http.Get(url)\` makes a simple GET request
- \`http.Post(url, contentType, body)\` makes a POST request
- \`http.Client{Timeout: ...}\` for custom timeouts
- Always defer \`resp.Body.Close()\`

Your task:
1. \`FetchBody(url string) (string, error)\` -- GET the URL and return the body as a string
2. \`PostJSON(url string, data interface{}) (int, string, error)\` -- POST JSON-encoded data, return (status code, response body, error)
3. \`FetchWithTimeout(url string, timeout time.Duration) (string, error)\` -- GET with a timeout; return an error if the request times out`,
  code: `package main

import (
	"net/http"
	"time"
)

// FetchBody performs a GET request and returns the response body as a string.
// TODO: Implement this function
func FetchBody(url string) (string, error) {
	_ = http.Get
	return "", nil
}

// PostJSON sends a POST request with JSON-encoded data.
// Returns (statusCode, responseBody, error).
// TODO: Implement this function
func PostJSON(url string, data interface{}) (int, string, error) {
	return 0, "", nil
}

// FetchWithTimeout performs a GET request with the given timeout.
// Returns an error if the request exceeds the timeout.
// TODO: Implement this function
func FetchWithTimeout(url string, timeout time.Duration) (string, error) {
	return "", nil
}

func main() {}`,
  testCode: `package main

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestFetchBody(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hello from server"))
	}))
	defer srv.Close()

	body, err := FetchBody(srv.URL)
	if err != nil {
		t.Fatalf("FetchBody failed: %v", err)
	}
	if body != "hello from server" {
		t.Errorf("body = %q, want %q", body, "hello from server")
	}
}

func TestPostJSON(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			t.Errorf("method = %s, want POST", r.Method)
		}
		ct := r.Header.Get("Content-Type")
		if ct != "application/json" {
			t.Errorf("content-type = %q, want application/json", ct)
		}

		var data map[string]interface{}
		json.NewDecoder(r.Body).Decode(&data)

		w.WriteHeader(http.StatusCreated)
		w.Write([]byte("created"))
	}))
	defer srv.Close()

	type Payload struct {
		Name string ` + "`" + `json:"name"` + "`" + `
	}

	status, body, err := PostJSON(srv.URL, Payload{Name: "test"})
	if err != nil {
		t.Fatalf("PostJSON failed: %v", err)
	}
	if status != 201 {
		t.Errorf("status = %d, want 201", status)
	}
	if body != "created" {
		t.Errorf("body = %q, want %q", body, "created")
	}
}

func TestFetchWithTimeout_Success(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("fast response"))
	}))
	defer srv.Close()

	body, err := FetchWithTimeout(srv.URL, 2*time.Second)
	if err != nil {
		t.Fatalf("FetchWithTimeout failed: %v", err)
	}
	if body != "fast response" {
		t.Errorf("body = %q, want %q", body, "fast response")
	}
}

func TestFetchWithTimeout_Timeout(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(2 * time.Second)
		w.Write([]byte("slow response"))
	}))
	defer srv.Close()

	_, err := FetchWithTimeout(srv.URL, 50*time.Millisecond)
	if err == nil {
		t.Error("expected timeout error, got nil")
	}
	_ = io.ReadAll
}`,
  solution: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

func FetchBody(url string) (string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", fmt.Errorf("GET failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("read body: %w", err)
	}
	return string(body), nil
}

func PostJSON(url string, data interface{}) (int, string, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return 0, "", fmt.Errorf("marshal: %w", err)
	}

	resp, err := http.Post(url, "application/json", bytes.NewReader(jsonData))
	if err != nil {
		return 0, "", fmt.Errorf("POST failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, "", fmt.Errorf("read body: %w", err)
	}
	return resp.StatusCode, string(body), nil
}

func FetchWithTimeout(url string, timeout time.Duration) (string, error) {
	client := &http.Client{Timeout: timeout}
	resp, err := client.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("read body: %w", err)
	}
	return string(body), nil
}

func main() {}`,
  hints: [
    'Use io.ReadAll(resp.Body) to read the entire response body into a byte slice.',
    'For PostJSON, use json.Marshal to encode the data, then pass bytes.NewReader(jsonData) as the body.',
    'Create an http.Client with a Timeout field for FetchWithTimeout.',
    'Always defer resp.Body.Close() after checking for errors on the response.',
  ],
}

export default exercise
