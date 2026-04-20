import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_17_retry_backoff',
  title: 'Retry with Backoff',
  category: 'Patterns',
  subcategory: 'Resilience Patterns',
  difficulty: 'advanced',
  order: 17,
  description: `Implement retry logic with exponential backoff for handling transient failures.

Exponential backoff increases the delay between retries to avoid overwhelming a struggling service. The delay doubles each attempt: baseDelay, 2*baseDelay, 4*baseDelay, etc.

Your tasks:

1. Implement \`RetryWithBackoff(fn func() error, maxRetries int, baseDelay time.Duration) error\`:
   - Call fn up to maxRetries+1 times (1 initial + maxRetries retries)
   - If fn returns nil, return nil immediately
   - If fn returns an error and retries remain, wait for the delay then retry
   - Delay for attempt i (0-indexed) is: baseDelay * 2^i
   - If all attempts fail, return the last error

2. Implement \`RetryWithBackoffResult[T any](fn func() (T, error), maxRetries int, baseDelay time.Duration) (T, error)\`:
   - Same as above but for functions that return a value along with an error
   - On success, return the value and nil
   - On final failure, return the zero value and the last error

3. Implement \`Attempts(fn func() error, maxRetries int, baseDelay time.Duration) (int, error)\`:
   - Same retry logic as RetryWithBackoff
   - Returns the number of attempts made (1-indexed) and the error (nil on success)

Example delay schedule with baseDelay = 100ms:
  Attempt 0: immediate
  Attempt 1: wait 100ms
  Attempt 2: wait 200ms
  Attempt 3: wait 400ms`,
  code: `package main

import "time"

// TODO: Implement RetryWithBackoff(fn func() error, maxRetries int, baseDelay time.Duration) error
// Call fn, if it fails wait baseDelay * 2^attempt, then retry. Return last error if all fail.

// TODO: Implement RetryWithBackoffResult[T any](fn func() (T, error), maxRetries int, baseDelay time.Duration) (T, error)
// Same as RetryWithBackoff but for functions returning (T, error)

// TODO: Implement Attempts(fn func() error, maxRetries int, baseDelay time.Duration) (int, error)
// Returns (number of attempts made, error)

var _ time.Duration

func main() {}`,
  testCode: `package main

import (
	"errors"
	"testing"
	"time"
)

func TestRetrySucceedsImmediately(t *testing.T) {
	calls := 0
	err := RetryWithBackoff(func() error {
		calls++
		return nil
	}, 3, 10*time.Millisecond)

	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
	if calls != 1 {
		t.Errorf("expected 1 call, got %d", calls)
	}
}

func TestRetrySucceedsAfterFailures(t *testing.T) {
	calls := 0
	err := RetryWithBackoff(func() error {
		calls++
		if calls < 3 {
			return errors.New("transient error")
		}
		return nil
	}, 5, 10*time.Millisecond)

	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
	if calls != 3 {
		t.Errorf("expected 3 calls, got %d", calls)
	}
}

func TestRetryExhausted(t *testing.T) {
	calls := 0
	err := RetryWithBackoff(func() error {
		calls++
		return errors.New("persistent error")
	}, 3, 10*time.Millisecond)

	if err == nil {
		t.Error("expected error after exhausting retries")
	}
	if calls != 4 {
		t.Errorf("expected 4 calls (1 initial + 3 retries), got %d", calls)
	}
}

func TestBackoffDelayIncreases(t *testing.T) {
	var timestamps []time.Time
	RetryWithBackoff(func() error {
		timestamps = append(timestamps, time.Now())
		if len(timestamps) < 4 {
			return errors.New("fail")
		}
		return nil
	}, 3, 50*time.Millisecond)

	if len(timestamps) < 3 {
		t.Fatalf("expected at least 3 timestamps, got %d", len(timestamps))
	}

	delay1 := timestamps[1].Sub(timestamps[0])
	delay2 := timestamps[2].Sub(timestamps[1])

	if delay1 < 40*time.Millisecond {
		t.Errorf("first delay too short: %v", delay1)
	}
	if delay2 < 80*time.Millisecond {
		t.Errorf("second delay should be ~100ms, got: %v", delay2)
	}
}

func TestRetryWithBackoffResult(t *testing.T) {
	calls := 0
	val, err := RetryWithBackoffResult(func() (int, error) {
		calls++
		if calls < 3 {
			return 0, errors.New("not yet")
		}
		return 42, nil
	}, 5, 10*time.Millisecond)

	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
	if val != 42 {
		t.Errorf("expected 42, got %d", val)
	}
}

func TestRetryWithBackoffResultExhausted(t *testing.T) {
	val, err := RetryWithBackoffResult(func() (string, error) {
		return "", errors.New("always fails")
	}, 2, 10*time.Millisecond)

	if err == nil {
		t.Error("expected error")
	}
	if val != "" {
		t.Errorf("expected zero value, got %q", val)
	}
}

func TestAttempts(t *testing.T) {
	calls := 0
	attempts, err := Attempts(func() error {
		calls++
		if calls < 3 {
			return errors.New("fail")
		}
		return nil
	}, 5, 10*time.Millisecond)

	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
	if attempts != 3 {
		t.Errorf("expected 3 attempts, got %d", attempts)
	}
}

func TestAttemptsAllFail(t *testing.T) {
	attempts, err := Attempts(func() error {
		return errors.New("fail")
	}, 2, 10*time.Millisecond)

	if err == nil {
		t.Error("expected error")
	}
	if attempts != 3 {
		t.Errorf("expected 3 attempts (1+2 retries), got %d", attempts)
	}
}`,
  solution: `package main

import "time"

func RetryWithBackoff(fn func() error, maxRetries int, baseDelay time.Duration) error {
	var err error
	for i := 0; i <= maxRetries; i++ {
		if i > 0 {
			delay := baseDelay * (1 << (i - 1))
			time.Sleep(delay)
		}
		err = fn()
		if err == nil {
			return nil
		}
	}
	return err
}

func RetryWithBackoffResult[T any](fn func() (T, error), maxRetries int, baseDelay time.Duration) (T, error) {
	var zero T
	var lastErr error
	for i := 0; i <= maxRetries; i++ {
		if i > 0 {
			delay := baseDelay * (1 << (i - 1))
			time.Sleep(delay)
		}
		val, err := fn()
		if err == nil {
			return val, nil
		}
		lastErr = err
	}
	return zero, lastErr
}

func Attempts(fn func() error, maxRetries int, baseDelay time.Duration) (int, error) {
	for i := 0; i <= maxRetries; i++ {
		if i > 0 {
			delay := baseDelay * (1 << (i - 1))
			time.Sleep(delay)
		}
		err := fn()
		if err == nil {
			return i + 1, nil
		}
		if i == maxRetries {
			return i + 1, err
		}
	}
	return maxRetries + 1, nil
}

func main() {}`,
  hints: [
    'The delay for attempt i (0-indexed, where 0 is the first retry) is baseDelay * 2^i. Use bit shifting: baseDelay * (1 << i).',
    'Total calls = 1 initial + maxRetries retries. Loop from 0 to maxRetries inclusive, sleeping before attempts 1+.',
    'For RetryWithBackoffResult, declare a var zero T to return as the zero value on exhaustion. Go generics handle this automatically.',
    'In Attempts, track the loop counter and return i+1 since attempts are 1-indexed.',
  ],
}

export default exercise
