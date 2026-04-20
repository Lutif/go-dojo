import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_21_health_check',
  title: 'Health Check',
  category: 'Patterns',
  subcategory: 'Application Patterns',
  difficulty: 'intermediate',
  order: 21,
  description: `Build a health checker that registers multiple checks and aggregates their results.

Health checks let orchestration systems (like Kubernetes) know whether a service is ready to handle traffic. Each check verifies a dependency (database, cache, external API).

Your tasks:

1. Define status constants:

  StatusUp   = "up"
  StatusDown = "down"

2. Define a \`CheckResult\` struct with:
   - \`Name\` (string) - name of the check
   - \`Status\` (string) - "up" or "down"
   - \`Message\` (string) - optional detail message

3. Define a \`HealthReport\` struct with:
   - \`Status\` (string) - overall status: "up" if all checks pass, "down" if any fail
   - \`Checks\` ([]CheckResult) - individual results

4. Define a \`HealthChecker\` struct that stores named checks.

5. Implement \`NewHealthChecker() *HealthChecker\`.

6. Implement \`(h *HealthChecker) AddCheck(name string, check func() error)\`:
   - Registers a named check function
   - Checks are stored in order

7. Implement \`(h *HealthChecker) RunChecks() HealthReport\`:
   - Runs each check in registration order
   - If check returns nil: status is "up", message is ""
   - If check returns error: status is "down", message is the error string
   - Overall status is "up" only if ALL checks pass`,
  code: `package main

// Status constants
const (
	StatusUp   = "up"
	StatusDown = "down"
)

// TODO: Define CheckResult struct with Name, Status, Message string fields

// TODO: Define HealthReport struct with Status string and Checks []CheckResult

// TODO: Define a namedCheck struct to hold a name and check function together

// TODO: Define HealthChecker struct with a slice of named checks

// TODO: Implement NewHealthChecker() *HealthChecker

// TODO: Implement (h *HealthChecker) AddCheck(name string, check func() error)

// TODO: Implement (h *HealthChecker) RunChecks() HealthReport
// Run all checks, build CheckResult for each, determine overall status

func main() {}`,
  testCode: `package main

import (
	"errors"
	"testing"
)

func TestAllHealthy(t *testing.T) {
	hc := NewHealthChecker()
	hc.AddCheck("database", func() error { return nil })
	hc.AddCheck("cache", func() error { return nil })

	report := hc.RunChecks()

	if report.Status != StatusUp {
		t.Errorf("expected overall status up, got %s", report.Status)
	}
	if len(report.Checks) != 2 {
		t.Fatalf("expected 2 checks, got %d", len(report.Checks))
	}
	for _, c := range report.Checks {
		if c.Status != StatusUp {
			t.Errorf("check %s: expected up, got %s", c.Name, c.Status)
		}
	}
}

func TestOneUnhealthy(t *testing.T) {
	hc := NewHealthChecker()
	hc.AddCheck("database", func() error { return nil })
	hc.AddCheck("cache", func() error { return errors.New("connection refused") })

	report := hc.RunChecks()

	if report.Status != StatusDown {
		t.Errorf("expected overall status down, got %s", report.Status)
	}

	if report.Checks[0].Status != StatusUp {
		t.Errorf("database check should be up, got %s", report.Checks[0].Status)
	}
	if report.Checks[1].Status != StatusDown {
		t.Errorf("cache check should be down, got %s", report.Checks[1].Status)
	}
	if report.Checks[1].Message != "connection refused" {
		t.Errorf("expected error message, got %q", report.Checks[1].Message)
	}
}

func TestAllUnhealthy(t *testing.T) {
	hc := NewHealthChecker()
	hc.AddCheck("db", func() error { return errors.New("timeout") })
	hc.AddCheck("api", func() error { return errors.New("503") })

	report := hc.RunChecks()

	if report.Status != StatusDown {
		t.Errorf("expected down, got %s", report.Status)
	}
	for _, c := range report.Checks {
		if c.Status != StatusDown {
			t.Errorf("check %s should be down", c.Name)
		}
	}
}

func TestNoChecks(t *testing.T) {
	hc := NewHealthChecker()
	report := hc.RunChecks()

	if report.Status != StatusUp {
		t.Errorf("no checks should mean up, got %s", report.Status)
	}
	if len(report.Checks) != 0 {
		t.Errorf("expected 0 checks, got %d", len(report.Checks))
	}
}

func TestCheckOrder(t *testing.T) {
	hc := NewHealthChecker()
	hc.AddCheck("alpha", func() error { return nil })
	hc.AddCheck("beta", func() error { return nil })
	hc.AddCheck("gamma", func() error { return nil })

	report := hc.RunChecks()

	expected := []string{"alpha", "beta", "gamma"}
	for i, name := range expected {
		if report.Checks[i].Name != name {
			t.Errorf("expected check %d to be %s, got %s", i, name, report.Checks[i].Name)
		}
	}
}

func TestCheckResultMessages(t *testing.T) {
	hc := NewHealthChecker()
	hc.AddCheck("healthy", func() error { return nil })
	hc.AddCheck("sick", func() error { return errors.New("disk full") })

	report := hc.RunChecks()

	if report.Checks[0].Message != "" {
		t.Errorf("healthy check message should be empty, got %q", report.Checks[0].Message)
	}
	if report.Checks[1].Message != "disk full" {
		t.Errorf("expected 'disk full', got %q", report.Checks[1].Message)
	}
}`,
  solution: `package main

const (
	StatusUp   = "up"
	StatusDown = "down"
)

type CheckResult struct {
	Name    string
	Status  string
	Message string
}

type HealthReport struct {
	Status string
	Checks []CheckResult
}

type namedCheck struct {
	name  string
	check func() error
}

type HealthChecker struct {
	checks []namedCheck
}

func NewHealthChecker() *HealthChecker {
	return &HealthChecker{}
}

func (h *HealthChecker) AddCheck(name string, check func() error) {
	h.checks = append(h.checks, namedCheck{name: name, check: check})
}

func (h *HealthChecker) RunChecks() HealthReport {
	report := HealthReport{
		Status: StatusUp,
		Checks: make([]CheckResult, 0, len(h.checks)),
	}

	for _, nc := range h.checks {
		result := CheckResult{Name: nc.name}
		if err := nc.check(); err != nil {
			result.Status = StatusDown
			result.Message = err.Error()
			report.Status = StatusDown
		} else {
			result.Status = StatusUp
		}
		report.Checks = append(report.Checks, result)
	}

	return report
}

func main() {}`,
  hints: [
    'Store checks as a slice of structs (not a map) to preserve registration order.',
    'In RunChecks, start with overall status "up" and set it to "down" if any check fails.',
    'When a check returns an error, use err.Error() to get the message string for the CheckResult.',
    'An empty HealthChecker with no checks should report status "up" with an empty Checks slice.',
  ],
}

export default exercise
