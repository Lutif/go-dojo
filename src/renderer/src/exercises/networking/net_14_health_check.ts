import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_14_health_check',
  title: 'Health Check Endpoint',
  category: 'Networking',
  subcategory: 'HTTP',
  difficulty: 'intermediate',
  order: 14,
  description: `Build a health check HTTP endpoint that reports the status of a service and its dependencies. Health endpoints are used by load balancers and orchestrators (like Kubernetes) to determine if a service is ready to receive traffic.

Key concepts:
- A \`/health\` endpoint returns JSON with overall status and per-dependency status
- Dependencies are checked via user-provided check functions
- If all checks pass, return 200 with \`"status": "healthy"\`
- If any check fails, return 503 with \`"status": "unhealthy"\`
- Each dependency reports its own status and optional error message

Response format:

    {
      "status": "healthy",
      "checks": {
        "database": {"status": "healthy"},
        "cache":    {"status": "healthy"}
      }
    }

Your task:
1. Implement \`NewHealthChecker() *HealthChecker\`
2. Implement \`(*HealthChecker) AddCheck(name string, check func() error)\` -- registers a dependency check
3. Implement \`(*HealthChecker) Handler() http.Handler\` -- returns an HTTP handler for \`/health\`
4. The handler should run all checks, build the JSON response, and set the correct status code`,
  code: `package main

import (
	"net/http"
)

// CheckResult represents the result of a single health check.
type CheckResult struct {
	Status string ` + "`" + `json:"status"` + "`" + `
	Error  string ` + "`" + `json:"error,omitempty"` + "`" + `
}

// HealthResponse is the JSON response from the health endpoint.
type HealthResponse struct {
	Status string                 ` + "`" + `json:"status"` + "`" + `
	Checks map[string]CheckResult ` + "`" + `json:"checks"` + "`" + `
}

// HealthChecker manages health check functions for dependencies.
type HealthChecker struct {
	// TODO: Add fields for storing named check functions
}

// NewHealthChecker creates a new health checker.
// TODO: Implement this function
func NewHealthChecker() *HealthChecker {
	return nil
}

// AddCheck registers a named health check function.
// The function returns nil if healthy, or an error if unhealthy.
// TODO: Implement this function
func (hc *HealthChecker) AddCheck(name string, check func() error) {
}

// Handler returns an http.Handler that serves the health check endpoint.
// - Runs all registered checks
// - Returns 200 and {"status":"healthy",...} if all pass
// - Returns 503 and {"status":"unhealthy",...} if any fail
// TODO: Implement this function
func (hc *HealthChecker) Handler() http.Handler {
	return nil
}

func main() {}`,
  testCode: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHealthy(t *testing.T) {
	hc := NewHealthChecker()
	if hc == nil {
		t.Fatal("NewHealthChecker returned nil")
	}

	hc.AddCheck("database", func() error { return nil })
	hc.AddCheck("cache", func() error { return nil })

	srv := httptest.NewServer(hc.Handler())
	defer srv.Close()

	resp, err := http.Get(srv.URL + "/health")
	if err != nil {
		t.Fatalf("GET /health: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		t.Errorf("status = %d, want 200", resp.StatusCode)
	}

	var hr HealthResponse
	json.NewDecoder(resp.Body).Decode(&hr)

	if hr.Status != "healthy" {
		t.Errorf("status = %q, want healthy", hr.Status)
	}
	if len(hr.Checks) != 2 {
		t.Errorf("checks count = %d, want 2", len(hr.Checks))
	}
	if hr.Checks["database"].Status != "healthy" {
		t.Errorf("database status = %q, want healthy", hr.Checks["database"].Status)
	}
	if hr.Checks["cache"].Status != "healthy" {
		t.Errorf("cache status = %q, want healthy", hr.Checks["cache"].Status)
	}
}

func TestUnhealthy(t *testing.T) {
	hc := NewHealthChecker()
	hc.AddCheck("database", func() error { return nil })
	hc.AddCheck("cache", func() error { return fmt.Errorf("connection refused") })

	srv := httptest.NewServer(hc.Handler())
	defer srv.Close()

	resp, err := http.Get(srv.URL + "/health")
	if err != nil {
		t.Fatalf("GET /health: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 503 {
		t.Errorf("status = %d, want 503", resp.StatusCode)
	}

	var hr HealthResponse
	json.NewDecoder(resp.Body).Decode(&hr)

	if hr.Status != "unhealthy" {
		t.Errorf("status = %q, want unhealthy", hr.Status)
	}
	if hr.Checks["cache"].Status != "unhealthy" {
		t.Errorf("cache status = %q, want unhealthy", hr.Checks["cache"].Status)
	}
	if hr.Checks["cache"].Error != "connection refused" {
		t.Errorf("cache error = %q, want %q", hr.Checks["cache"].Error, "connection refused")
	}
	if hr.Checks["database"].Status != "healthy" {
		t.Errorf("database should still be healthy")
	}
}

func TestNoChecks(t *testing.T) {
	hc := NewHealthChecker()
	srv := httptest.NewServer(hc.Handler())
	defer srv.Close()

	resp, err := http.Get(srv.URL + "/health")
	if err != nil {
		t.Fatalf("GET: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		t.Errorf("no checks: status = %d, want 200", resp.StatusCode)
	}

	var hr HealthResponse
	json.NewDecoder(resp.Body).Decode(&hr)

	if hr.Status != "healthy" {
		t.Errorf("no checks: status = %q, want healthy", hr.Status)
	}
}

func TestContentType(t *testing.T) {
	hc := NewHealthChecker()
	srv := httptest.NewServer(hc.Handler())
	defer srv.Close()

	resp, err := http.Get(srv.URL + "/health")
	if err != nil {
		t.Fatalf("GET: %v", err)
	}
	defer resp.Body.Close()

	ct := resp.Header.Get("Content-Type")
	if ct != "application/json" {
		t.Errorf("Content-Type = %q, want application/json", ct)
	}
}`,
  solution: `package main

import (
	"encoding/json"
	"net/http"
)

// CheckResult represents the result of a single health check.
type CheckResult struct {
	Status string ` + "`" + `json:"status"` + "`" + `
	Error  string ` + "`" + `json:"error,omitempty"` + "`" + `
}

// HealthResponse is the JSON response from the health endpoint.
type HealthResponse struct {
	Status string                 ` + "`" + `json:"status"` + "`" + `
	Checks map[string]CheckResult ` + "`" + `json:"checks"` + "`" + `
}

// HealthChecker manages health check functions for dependencies.
type HealthChecker struct {
	checks map[string]func() error
}

// NewHealthChecker creates a new health checker.
func NewHealthChecker() *HealthChecker {
	return &HealthChecker{
		checks: make(map[string]func() error),
	}
}

// AddCheck registers a named health check function.
func (hc *HealthChecker) AddCheck(name string, check func() error) {
	hc.checks[name] = check
}

// Handler returns an http.Handler that serves the health check endpoint.
func (hc *HealthChecker) Handler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		response := HealthResponse{
			Status: "healthy",
			Checks: make(map[string]CheckResult),
		}

		for name, check := range hc.checks {
			if err := check(); err != nil {
				response.Status = "unhealthy"
				response.Checks[name] = CheckResult{
					Status: "unhealthy",
					Error:  err.Error(),
				}
			} else {
				response.Checks[name] = CheckResult{
					Status: "healthy",
				}
			}
		}

		w.Header().Set("Content-Type", "application/json")
		if response.Status == "unhealthy" {
			w.WriteHeader(http.StatusServiceUnavailable)
		} else {
			w.WriteHeader(http.StatusOK)
		}
		json.NewEncoder(w).Encode(response)
	})
}

func main() {}`,
  hints: [
    'Store checks as map[string]func() error where the key is the dependency name.',
    'In the handler, iterate over all checks and call each one. If any returns an error, mark the overall status as "unhealthy".',
    'Set the Content-Type header to "application/json" before writing the response.',
    'Use w.WriteHeader(http.StatusServiceUnavailable) for 503 -- call it before json.NewEncoder(w).Encode().',
  ],
}

export default exercise
