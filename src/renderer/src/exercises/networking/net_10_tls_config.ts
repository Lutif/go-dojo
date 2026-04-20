import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_10_tls_config',
  title: 'TLS Configuration',
  category: 'Networking',
  subcategory: 'Security',
  difficulty: 'advanced',
  order: 10,
  description: `Build TLS configuration objects for secure communication. In production Go services you configure \`tls.Config\` to control which TLS versions and cipher suites are allowed. This exercise focuses on constructing and validating configuration -- not on establishing actual TLS connections.

Key concepts:
- \`crypto/tls\` defines \`tls.Config\` with fields like \`MinVersion\`, \`MaxVersion\`, \`CipherSuites\`
- TLS versions: \`tls.VersionTLS12\`, \`tls.VersionTLS13\`
- Cipher suites are uint16 constants (e.g., \`tls.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384\`)
- \`tls.InsecureSkipVerify\` disables certificate verification (testing only!)
- \`tls.CurvePreferences\` controls which elliptic curves are offered

Example:

    cfg := &tls.Config{
        MinVersion: tls.VersionTLS12,
    }

Your task:
1. Implement \`NewSecureConfig() *tls.Config\` -- returns a strict config: MinVersion = TLS 1.2, no InsecureSkipVerify
2. Implement \`NewStrictConfig() *tls.Config\` -- returns a TLS 1.3 only config (MinVersion = MaxVersion = TLS 1.3)
3. Implement \`NewCustomConfig(minVersion, maxVersion uint16, cipherSuites []uint16) *tls.Config\` -- returns a config with specified versions and cipher suites
4. Implement \`ValidateConfig(cfg *tls.Config) []string\` -- returns a list of security warnings (e.g., if InsecureSkipVerify is true, if MinVersion < TLS 1.2)`,
  code: `package main

import (
	"crypto/tls"
)

// NewSecureConfig returns a TLS config with sensible security defaults.
// MinVersion should be TLS 1.2, InsecureSkipVerify should be false.
// TODO: Implement this function
func NewSecureConfig() *tls.Config {
	return nil
}

// NewStrictConfig returns a TLS config that only allows TLS 1.3.
// Both MinVersion and MaxVersion should be set to TLS 1.3.
// TODO: Implement this function
func NewStrictConfig() *tls.Config {
	return nil
}

// NewCustomConfig returns a TLS config with the specified version range
// and cipher suites.
// TODO: Implement this function
func NewCustomConfig(minVersion, maxVersion uint16, cipherSuites []uint16) *tls.Config {
	return nil
}

// ValidateConfig checks a TLS config for security issues and returns
// a list of warning strings. Check for:
// - InsecureSkipVerify is true
// - MinVersion is 0 (not set) or less than TLS 1.2
// - MaxVersion is set and less than MinVersion
// TODO: Implement this function
func ValidateConfig(cfg *tls.Config) []string {
	return nil
}

func main() {}`,
  testCode: `package main

import (
	"crypto/tls"
	"testing"
)

func TestNewSecureConfig(t *testing.T) {
	cfg := NewSecureConfig()
	if cfg == nil {
		t.Fatal("NewSecureConfig returned nil")
	}
	if cfg.MinVersion != tls.VersionTLS12 {
		t.Errorf("MinVersion = %d, want %d (TLS 1.2)", cfg.MinVersion, tls.VersionTLS12)
	}
	if cfg.InsecureSkipVerify {
		t.Error("InsecureSkipVerify should be false")
	}
}

func TestNewStrictConfig(t *testing.T) {
	cfg := NewStrictConfig()
	if cfg == nil {
		t.Fatal("NewStrictConfig returned nil")
	}
	if cfg.MinVersion != tls.VersionTLS13 {
		t.Errorf("MinVersion = %d, want %d (TLS 1.3)", cfg.MinVersion, tls.VersionTLS13)
	}
	if cfg.MaxVersion != tls.VersionTLS13 {
		t.Errorf("MaxVersion = %d, want %d (TLS 1.3)", cfg.MaxVersion, tls.VersionTLS13)
	}
}

func TestNewCustomConfig(t *testing.T) {
	suites := []uint16{
		tls.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
		tls.TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,
	}
	cfg := NewCustomConfig(tls.VersionTLS12, tls.VersionTLS13, suites)
	if cfg == nil {
		t.Fatal("NewCustomConfig returned nil")
	}
	if cfg.MinVersion != tls.VersionTLS12 {
		t.Errorf("MinVersion = %d, want %d", cfg.MinVersion, tls.VersionTLS12)
	}
	if cfg.MaxVersion != tls.VersionTLS13 {
		t.Errorf("MaxVersion = %d, want %d", cfg.MaxVersion, tls.VersionTLS13)
	}
	if len(cfg.CipherSuites) != 2 {
		t.Errorf("CipherSuites length = %d, want 2", len(cfg.CipherSuites))
	}
}

func TestValidateConfig_Secure(t *testing.T) {
	cfg := NewSecureConfig()
	warnings := ValidateConfig(cfg)
	if len(warnings) != 0 {
		t.Errorf("secure config has warnings: %v", warnings)
	}
}

func TestValidateConfig_InsecureSkipVerify(t *testing.T) {
	cfg := &tls.Config{
		MinVersion:         tls.VersionTLS12,
		InsecureSkipVerify: true,
	}
	warnings := ValidateConfig(cfg)
	found := false
	for _, w := range warnings {
		if len(w) > 0 {
			found = true
		}
	}
	if !found {
		t.Error("expected warning for InsecureSkipVerify=true")
	}
}

func TestValidateConfig_LowMinVersion(t *testing.T) {
	cfg := &tls.Config{
		MinVersion: tls.VersionTLS10,
	}
	warnings := ValidateConfig(cfg)
	if len(warnings) == 0 {
		t.Error("expected warning for MinVersion < TLS 1.2")
	}
}

func TestValidateConfig_NoMinVersion(t *testing.T) {
	cfg := &tls.Config{}
	warnings := ValidateConfig(cfg)
	if len(warnings) == 0 {
		t.Error("expected warning when MinVersion is not set (0)")
	}
}

func TestValidateConfig_MaxLessThanMin(t *testing.T) {
	cfg := &tls.Config{
		MinVersion: tls.VersionTLS13,
		MaxVersion: tls.VersionTLS12,
	}
	warnings := ValidateConfig(cfg)
	if len(warnings) == 0 {
		t.Error("expected warning when MaxVersion < MinVersion")
	}
}`,
  solution: `package main

import (
	"crypto/tls"
)

// NewSecureConfig returns a TLS config with sensible security defaults.
func NewSecureConfig() *tls.Config {
	return &tls.Config{
		MinVersion: tls.VersionTLS12,
	}
}

// NewStrictConfig returns a TLS config that only allows TLS 1.3.
func NewStrictConfig() *tls.Config {
	return &tls.Config{
		MinVersion: tls.VersionTLS13,
		MaxVersion: tls.VersionTLS13,
	}
}

// NewCustomConfig returns a TLS config with the specified version range and cipher suites.
func NewCustomConfig(minVersion, maxVersion uint16, cipherSuites []uint16) *tls.Config {
	return &tls.Config{
		MinVersion:   minVersion,
		MaxVersion:   maxVersion,
		CipherSuites: cipherSuites,
	}
}

// ValidateConfig checks a TLS config for security issues.
func ValidateConfig(cfg *tls.Config) []string {
	var warnings []string

	if cfg.InsecureSkipVerify {
		warnings = append(warnings, "InsecureSkipVerify is enabled: certificate verification is disabled")
	}

	if cfg.MinVersion == 0 {
		warnings = append(warnings, "MinVersion is not set: defaults may allow insecure TLS versions")
	} else if cfg.MinVersion < tls.VersionTLS12 {
		warnings = append(warnings, "MinVersion is below TLS 1.2: older versions have known vulnerabilities")
	}

	if cfg.MaxVersion != 0 && cfg.MaxVersion < cfg.MinVersion {
		warnings = append(warnings, "MaxVersion is less than MinVersion: no valid TLS version can be negotiated")
	}

	return warnings
}

func main() {}`,
  hints: [
    'tls.VersionTLS12 and tls.VersionTLS13 are uint16 constants defined in crypto/tls.',
    'For NewSecureConfig, just set MinVersion to tls.VersionTLS12 -- InsecureSkipVerify defaults to false.',
    'In ValidateConfig, check cfg.MinVersion == 0 separately from cfg.MinVersion < tls.VersionTLS12.',
    'MaxVersion of 0 means "use the highest supported version", so only warn if MaxVersion is explicitly set AND less than MinVersion.',
  ],
}

export default exercise
