import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_19_config_loading',
  title: 'Config Loading',
  category: 'Patterns',
  subcategory: 'Application Patterns',
  difficulty: 'intermediate',
  order: 19,
  description: `Implement a configuration loading system with defaults, environment variable overrides, and validation.

A robust config system layers values: defaults first, then environment variables override them. Finally, validation ensures all required values are present and valid.

Your tasks:

1. Define a \`Config\` struct with fields:
   - \`Host\` (string)
   - \`Port\` (int)
   - \`Debug\` (bool)
   - \`DatabaseURL\` (string)
   - \`MaxConns\` (int)

2. Implement \`DefaultConfig() Config\` returning:
   - Host: "localhost"
   - Port: 8080
   - Debug: false
   - DatabaseURL: "" (empty)
   - MaxConns: 10

3. Implement \`LoadFromEnv(cfg Config, getenv func(string) string) Config\`:
   - Check APP_HOST, APP_PORT, APP_DEBUG, DATABASE_URL, APP_MAX_CONNS
   - Only override if the env var is non-empty
   - Parse port and maxConns as integers; ignore invalid values (keep current)
   - Parse debug as "true"/"1" for true, anything else for false

4. Implement \`Validate(cfg Config) []string\`:
   - Return a slice of error messages (empty if valid)
   - Port must be between 1 and 65535: "port must be between 1 and 65535"
   - DatabaseURL must not be empty: "database URL is required"
   - MaxConns must be positive: "max connections must be positive"

5. Implement \`LoadConfig(getenv func(string) string) (Config, []string)\`:
   - Start with defaults, apply env overrides, validate, return config and errors`,
  code: `package main

import "strconv"

// TODO: Define Config struct with Host, Port, Debug, DatabaseURL, MaxConns

// TODO: Implement DefaultConfig() Config
// Returns config with sensible defaults

// TODO: Implement LoadFromEnv(cfg Config, getenv func(string) string) Config
// Override config fields from environment variables:
// APP_HOST, APP_PORT, APP_DEBUG, DATABASE_URL, APP_MAX_CONNS

// TODO: Implement Validate(cfg Config) []string
// Returns slice of validation error messages

// TODO: Implement LoadConfig(getenv func(string) string) (Config, []string)
// Combines: defaults -> env overrides -> validation

var _ = strconv.Atoi

func main() {}`,
  testCode: `package main

import (
	"testing"
)

func TestDefaultConfig(t *testing.T) {
	cfg := DefaultConfig()

	if cfg.Host != "localhost" {
		t.Errorf("expected host localhost, got %s", cfg.Host)
	}
	if cfg.Port != 8080 {
		t.Errorf("expected port 8080, got %d", cfg.Port)
	}
	if cfg.Debug != false {
		t.Error("expected debug false")
	}
	if cfg.DatabaseURL != "" {
		t.Errorf("expected empty database URL, got %s", cfg.DatabaseURL)
	}
	if cfg.MaxConns != 10 {
		t.Errorf("expected 10 max conns, got %d", cfg.MaxConns)
	}
}

func TestLoadFromEnvOverrides(t *testing.T) {
	env := map[string]string{
		"APP_HOST":      "0.0.0.0",
		"APP_PORT":      "3000",
		"APP_DEBUG":     "true",
		"DATABASE_URL":  "postgres://localhost/mydb",
		"APP_MAX_CONNS": "50",
	}
	getenv := func(key string) string { return env[key] }

	cfg := LoadFromEnv(DefaultConfig(), getenv)

	if cfg.Host != "0.0.0.0" {
		t.Errorf("expected host 0.0.0.0, got %s", cfg.Host)
	}
	if cfg.Port != 3000 {
		t.Errorf("expected port 3000, got %d", cfg.Port)
	}
	if cfg.Debug != true {
		t.Error("expected debug true")
	}
	if cfg.DatabaseURL != "postgres://localhost/mydb" {
		t.Errorf("expected postgres URL, got %s", cfg.DatabaseURL)
	}
	if cfg.MaxConns != 50 {
		t.Errorf("expected 50 max conns, got %d", cfg.MaxConns)
	}
}

func TestLoadFromEnvPartial(t *testing.T) {
	env := map[string]string{
		"APP_PORT": "9090",
	}
	getenv := func(key string) string { return env[key] }

	cfg := LoadFromEnv(DefaultConfig(), getenv)

	if cfg.Host != "localhost" {
		t.Errorf("expected default host, got %s", cfg.Host)
	}
	if cfg.Port != 9090 {
		t.Errorf("expected port 9090, got %d", cfg.Port)
	}
}

func TestLoadFromEnvInvalidPort(t *testing.T) {
	env := map[string]string{
		"APP_PORT": "not-a-number",
	}
	getenv := func(key string) string { return env[key] }

	cfg := LoadFromEnv(DefaultConfig(), getenv)

	if cfg.Port != 8080 {
		t.Errorf("expected default port on invalid input, got %d", cfg.Port)
	}
}

func TestLoadFromEnvDebugValues(t *testing.T) {
	tests := []struct {
		val  string
		want bool
	}{
		{"true", true},
		{"1", true},
		{"false", false},
		{"0", false},
		{"yes", false},
	}

	for _, tt := range tests {
		env := map[string]string{"APP_DEBUG": tt.val}
		getenv := func(key string) string { return env[key] }
		cfg := LoadFromEnv(DefaultConfig(), getenv)
		if cfg.Debug != tt.want {
			t.Errorf("APP_DEBUG=%q: expected %v, got %v", tt.val, tt.want, cfg.Debug)
		}
	}
}

func TestValidateValid(t *testing.T) {
	cfg := Config{
		Host:        "localhost",
		Port:        8080,
		DatabaseURL: "postgres://localhost/db",
		MaxConns:    10,
	}
	errs := Validate(cfg)
	if len(errs) != 0 {
		t.Errorf("expected no errors, got %v", errs)
	}
}

func TestValidateInvalidPort(t *testing.T) {
	cfg := DefaultConfig()
	cfg.Port = 0
	cfg.DatabaseURL = "postgres://localhost/db"
	errs := Validate(cfg)

	found := false
	for _, e := range errs {
		if e == "port must be between 1 and 65535" {
			found = true
		}
	}
	if !found {
		t.Errorf("expected port validation error, got %v", errs)
	}
}

func TestValidateMissingDatabaseURL(t *testing.T) {
	cfg := DefaultConfig()
	errs := Validate(cfg)

	found := false
	for _, e := range errs {
		if e == "database URL is required" {
			found = true
		}
	}
	if !found {
		t.Errorf("expected database URL error, got %v", errs)
	}
}

func TestValidateInvalidMaxConns(t *testing.T) {
	cfg := DefaultConfig()
	cfg.DatabaseURL = "postgres://localhost/db"
	cfg.MaxConns = 0
	errs := Validate(cfg)

	found := false
	for _, e := range errs {
		if e == "max connections must be positive" {
			found = true
		}
	}
	if !found {
		t.Errorf("expected max connections error, got %v", errs)
	}
}

func TestLoadConfig(t *testing.T) {
	env := map[string]string{
		"DATABASE_URL": "postgres://localhost/db",
	}
	getenv := func(key string) string { return env[key] }

	cfg, errs := LoadConfig(getenv)
	if len(errs) != 0 {
		t.Errorf("expected no errors, got %v", errs)
	}
	if cfg.DatabaseURL != "postgres://localhost/db" {
		t.Errorf("expected database URL from env, got %s", cfg.DatabaseURL)
	}
	if cfg.Host != "localhost" {
		t.Errorf("expected default host, got %s", cfg.Host)
	}
}`,
  solution: `package main

import "strconv"

type Config struct {
	Host        string
	Port        int
	Debug       bool
	DatabaseURL string
	MaxConns    int
}

func DefaultConfig() Config {
	return Config{
		Host:     "localhost",
		Port:     8080,
		Debug:    false,
		MaxConns: 10,
	}
}

func LoadFromEnv(cfg Config, getenv func(string) string) Config {
	if v := getenv("APP_HOST"); v != "" {
		cfg.Host = v
	}
	if v := getenv("APP_PORT"); v != "" {
		if port, err := strconv.Atoi(v); err == nil {
			cfg.Port = port
		}
	}
	if v := getenv("APP_DEBUG"); v != "" {
		cfg.Debug = v == "true" || v == "1"
	}
	if v := getenv("DATABASE_URL"); v != "" {
		cfg.DatabaseURL = v
	}
	if v := getenv("APP_MAX_CONNS"); v != "" {
		if mc, err := strconv.Atoi(v); err == nil {
			cfg.MaxConns = mc
		}
	}
	return cfg
}

func Validate(cfg Config) []string {
	var errs []string
	if cfg.Port < 1 || cfg.Port > 65535 {
		errs = append(errs, "port must be between 1 and 65535")
	}
	if cfg.DatabaseURL == "" {
		errs = append(errs, "database URL is required")
	}
	if cfg.MaxConns < 1 {
		errs = append(errs, "max connections must be positive")
	}
	return errs
}

func LoadConfig(getenv func(string) string) (Config, []string) {
	cfg := DefaultConfig()
	cfg = LoadFromEnv(cfg, getenv)
	errs := Validate(cfg)
	return cfg, errs
}

func main() {}`,
  hints: [
    'Use strconv.Atoi to parse string environment variables to integers. If parsing fails, keep the current config value.',
    'For Debug, check if the env value is "true" or "1". Any other non-empty value sets Debug to false.',
    'Validate returns a slice of error messages. Append each error as you find it, then return the slice.',
    'LoadConfig simply chains: DefaultConfig() -> LoadFromEnv() -> Validate().',
  ],
}

export default exercise
