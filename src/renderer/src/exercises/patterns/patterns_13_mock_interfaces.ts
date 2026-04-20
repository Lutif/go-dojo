import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_13_mock_interfaces',
  title: 'Mock Interfaces',
  category: 'Patterns',
  subcategory: 'Testing',
  difficulty: 'intermediate',
  order: 13,
  description: `Mock implementations let you test code in isolation by replacing real dependencies with controllable fakes. The pattern:

\`\`\`go
type Sender interface {
    Send(to, body string) error
}

type MockSender struct {
    Calls []struct{ To, Body string }
    Err   error // configure what error to return
}

func (m *MockSender) Send(to, body string) error {
    m.Calls = append(m.Calls, struct{ To, Body string }{to, body})
    return m.Err
}
\`\`\`

The mock records every call for later verification and can be configured to return errors for testing error paths.

Your task: implement an \`Emailer\` interface with a mock, and a \`NotificationService\` that uses it.

1. Define an \`Emailer\` interface with \`SendEmail(to, subject, body string) error\`
2. Define a \`MockEmailer\` struct with:
   - \`Calls []EmailCall\` where \`EmailCall\` has fields \`To, Subject, Body string\`
   - \`ErrToReturn error\` -- the error to return from SendEmail
3. Implement \`SendEmail\` on MockEmailer: record the call and return ErrToReturn
4. Define \`NotificationService\` struct with an unexported \`emailer Emailer\` field
5. Implement \`NewNotificationService(e Emailer) *NotificationService\`
6. Implement \`(ns *NotificationService) NotifyUser(email, message string) error\`:
   - Calls \`emailer.SendEmail(email, "Notification", message)\`
   - Returns any error from SendEmail
7. Implement \`(ns *NotificationService) NotifyAll(emails []string, message string) (int, error)\`:
   - Sends to each email; on first error, returns (count sent so far, error)
   - On success, returns (len(emails), nil)`,
  code: `package main

// TODO: Define EmailCall struct with To, Subject, Body string

// TODO: Define Emailer interface with SendEmail(to, subject, body string) error

// TODO: Define MockEmailer struct with:
//   Calls []EmailCall
//   ErrToReturn error

// TODO: Implement SendEmail on MockEmailer
// Record the call in Calls, return ErrToReturn

// TODO: Define NotificationService struct with emailer Emailer field

// TODO: Implement NewNotificationService(e Emailer) *NotificationService

// TODO: Implement (ns *NotificationService) NotifyUser(email, message string) error
// Calls emailer.SendEmail(email, "Notification", message)

// TODO: Implement (ns *NotificationService) NotifyAll(emails []string, message string) (int, error)
// Sends to each email; on first error returns (sent count, error)
// On full success returns (len(emails), nil)

func main() {}`,
  testCode: `package main

import (
	"errors"
	"testing"
)

// Verify interface satisfaction
var _ Emailer = (*MockEmailer)(nil)

func TestMockEmailerRecordsCalls(t *testing.T) {
	mock := &MockEmailer{}
	err := mock.SendEmail("alice@test.com", "Hello", "Hi Alice")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(mock.Calls) != 1 {
		t.Fatalf("expected 1 call, got %d", len(mock.Calls))
	}
	call := mock.Calls[0]
	if call.To != "alice@test.com" {
		t.Errorf("To = %q, want %q", call.To, "alice@test.com")
	}
	if call.Subject != "Hello" {
		t.Errorf("Subject = %q, want %q", call.Subject, "Hello")
	}
	if call.Body != "Hi Alice" {
		t.Errorf("Body = %q, want %q", call.Body, "Hi Alice")
	}
}

func TestMockEmailerReturnsError(t *testing.T) {
	mock := &MockEmailer{ErrToReturn: errors.New("smtp down")}
	err := mock.SendEmail("bob@test.com", "Test", "Body")
	if err == nil {
		t.Fatal("expected error, got nil")
	}
	if err.Error() != "smtp down" {
		t.Errorf("error = %q, want %q", err.Error(), "smtp down")
	}
}

func TestNotifyUser(t *testing.T) {
	mock := &MockEmailer{}
	svc := NewNotificationService(mock)

	err := svc.NotifyUser("alice@test.com", "Your order shipped")
	if err != nil {
		t.Fatalf("NotifyUser() error = %v", err)
	}
	if len(mock.Calls) != 1 {
		t.Fatalf("expected 1 call, got %d", len(mock.Calls))
	}
	call := mock.Calls[0]
	if call.To != "alice@test.com" {
		t.Errorf("To = %q, want %q", call.To, "alice@test.com")
	}
	if call.Subject != "Notification" {
		t.Errorf("Subject = %q, want %q", call.Subject, "Notification")
	}
	if call.Body != "Your order shipped" {
		t.Errorf("Body = %q, want %q", call.Body, "Your order shipped")
	}
}

func TestNotifyUserError(t *testing.T) {
	mock := &MockEmailer{ErrToReturn: errors.New("connection refused")}
	svc := NewNotificationService(mock)

	err := svc.NotifyUser("alice@test.com", "msg")
	if err == nil {
		t.Fatal("expected error, got nil")
	}
	if err.Error() != "connection refused" {
		t.Errorf("error = %q, want %q", err.Error(), "connection refused")
	}
}

func TestNotifyAll(t *testing.T) {
	mock := &MockEmailer{}
	svc := NewNotificationService(mock)

	emails := []string{"a@test.com", "b@test.com", "c@test.com"}
	count, err := svc.NotifyAll(emails, "System update")
	if err != nil {
		t.Fatalf("NotifyAll() error = %v", err)
	}
	if count != 3 {
		t.Errorf("count = %d, want 3", count)
	}
	if len(mock.Calls) != 3 {
		t.Fatalf("expected 3 calls, got %d", len(mock.Calls))
	}
	for i, email := range emails {
		if mock.Calls[i].To != email {
			t.Errorf("call %d To = %q, want %q", i, mock.Calls[i].To, email)
		}
	}
}

func TestNotifyAllStopsOnError(t *testing.T) {
	callCount := 0
	mock := &MockEmailer{}
	// We will override behavior by checking call count
	svc := NewNotificationService(mock)

	// Set up mock to fail on second call
	failMock := &failOnNthEmailer{failOn: 2, err: errors.New("fail")}
	svc2 := NewNotificationService(failMock)

	emails := []string{"a@test.com", "b@test.com", "c@test.com"}
	count, err := svc2.NotifyAll(emails, "msg")
	if err == nil {
		t.Fatal("expected error, got nil")
	}
	if count != 1 {
		t.Errorf("count = %d, want 1 (should stop before the failing one)", count)
	}

	// Original mock should still work fine
	_, _ = callCount, svc
}

// Helper mock that fails on the nth call
type failOnNthEmailer struct {
	callCount int
	failOn    int
	err       error
}

func (f *failOnNthEmailer) SendEmail(to, subject, body string) error {
	f.callCount++
	if f.callCount == f.failOn {
		return f.err
	}
	return nil
}

func TestNotifyAllEmpty(t *testing.T) {
	mock := &MockEmailer{}
	svc := NewNotificationService(mock)

	count, err := svc.NotifyAll([]string{}, "msg")
	if err != nil {
		t.Fatalf("NotifyAll() error = %v", err)
	}
	if count != 0 {
		t.Errorf("count = %d, want 0", count)
	}
	if len(mock.Calls) != 0 {
		t.Errorf("expected 0 calls, got %d", len(mock.Calls))
	}
}`,
  solution: `package main

type EmailCall struct {
	To      string
	Subject string
	Body    string
}

type Emailer interface {
	SendEmail(to, subject, body string) error
}

type MockEmailer struct {
	Calls       []EmailCall
	ErrToReturn error
}

func (m *MockEmailer) SendEmail(to, subject, body string) error {
	m.Calls = append(m.Calls, EmailCall{To: to, Subject: subject, Body: body})
	return m.ErrToReturn
}

type NotificationService struct {
	emailer Emailer
}

func NewNotificationService(e Emailer) *NotificationService {
	return &NotificationService{emailer: e}
}

func (ns *NotificationService) NotifyUser(email, message string) error {
	return ns.emailer.SendEmail(email, "Notification", message)
}

func (ns *NotificationService) NotifyAll(emails []string, message string) (int, error) {
	for i, email := range emails {
		if err := ns.emailer.SendEmail(email, "Notification", message); err != nil {
			return i, err
		}
	}
	return len(emails), nil
}

func main() {}`,
  hints: [
    'MockEmailer.SendEmail should append an EmailCall to the Calls slice and return ErrToReturn.',
    'NotifyUser calls emailer.SendEmail with subject "Notification".',
    'NotifyAll loops over emails; on error, return the current index as the count sent so far.',
    'The mock pattern: record calls in a slice, return a configurable error.',
  ],
}

export default exercise
