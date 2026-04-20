import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_01_tcp_server',
  title: 'TCP Echo Server',
  category: 'Networking',
  subcategory: 'TCP',
  difficulty: 'intermediate',
  order: 1,
  description: `Build a TCP echo server and client using Go's \`net\` package. A TCP server listens on a port for incoming connections, reads data from clients, and sends responses back.

Key concepts:
- \`net.Listen("tcp", addr)\` creates a TCP listener
- \`listener.Accept()\` blocks until a client connects
- \`net.Dial("tcp", addr)\` connects to a server
- Connections implement \`io.Reader\` and \`io.Writer\`

Your task:
1. Implement \`StartEchoServer(addr string) (net.Listener, error)\` that starts a TCP server echoing back anything received (handle each connection in a goroutine)
2. Implement \`SendMessage(addr, message string) (string, error)\` that connects to the server, sends a message, and returns the echoed response`,
  code: `package main

import (
	"net"
)

// StartEchoServer starts a TCP echo server on the given address.
// It should:
// 1. Listen on the given TCP address
// 2. Accept connections in a goroutine
// 3. For each connection, read data and write it back (echo)
// 4. Return the listener so it can be closed later
// TODO: Implement this function
func StartEchoServer(addr string) (net.Listener, error) {
	return nil, nil
}

// SendMessage connects to the TCP server at addr, sends the message,
// reads the response, and returns it.
// TODO: Implement this function
func SendMessage(addr, message string) (string, error) {
	return "", nil
}

func main() {}`,
  testCode: `package main

import (
	"testing"
)

func TestEchoServer(t *testing.T) {
	ln, err := StartEchoServer("127.0.0.1:0")
	if err != nil {
		t.Fatalf("failed to start server: %v", err)
	}
	defer ln.Close()

	addr := ln.Addr().String()

	tests := []struct {
		name    string
		message string
	}{
		{"simple", "hello"},
		{"with spaces", "hello world"},
		{"numbers", "12345"},
		{"special chars", "foo@bar#baz"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			resp, err := SendMessage(addr, tt.message)
			if err != nil {
				t.Fatalf("SendMessage failed: %v", err)
			}
			if resp != tt.message {
				t.Errorf("got %q, want %q", resp, tt.message)
			}
		})
	}
}

func TestMultipleClients(t *testing.T) {
	ln, err := StartEchoServer("127.0.0.1:0")
	if err != nil {
		t.Fatalf("failed to start server: %v", err)
	}
	defer ln.Close()

	addr := ln.Addr().String()

	done := make(chan error, 3)
	messages := []string{"client1", "client2", "client3"}

	for _, msg := range messages {
		go func(m string) {
			resp, err := SendMessage(addr, m)
			if err != nil {
				done <- err
				return
			}
			if resp != m {
				done <- fmt.Errorf("got %q, want %q", resp, m)
				return
			}
			done <- nil
		}(msg)
	}

	for range messages {
		if err := <-done; err != nil {
			t.Errorf("client error: %v", err)
		}
	}
}`,
  solution: `package main

import (
	"bufio"
	"fmt"
	"io"
	"net"
)

// StartEchoServer starts a TCP echo server on the given address.
func StartEchoServer(addr string) (net.Listener, error) {
	ln, err := net.Listen("tcp", addr)
	if err != nil {
		return nil, fmt.Errorf("listen: %w", err)
	}

	go func() {
		for {
			conn, err := ln.Accept()
			if err != nil {
				return // listener closed
			}
			go func(c net.Conn) {
				defer c.Close()
				io.Copy(c, c)
			}(conn)
		}
	}()

	return ln, nil
}

// SendMessage connects to the TCP server at addr, sends the message,
// reads the response, and returns it.
func SendMessage(addr, message string) (string, error) {
	conn, err := net.Dial("tcp", addr)
	if err != nil {
		return "", fmt.Errorf("dial: %w", err)
	}
	defer conn.Close()

	_, err = fmt.Fprintln(conn, message)
	if err != nil {
		return "", fmt.Errorf("write: %w", err)
	}

	scanner := bufio.NewScanner(conn)
	if scanner.Scan() {
		return scanner.Text(), nil
	}
	if err := scanner.Err(); err != nil {
		return "", fmt.Errorf("read: %w", err)
	}
	return "", fmt.Errorf("no response")
}

func main() {}`,
  hints: [
    'Use net.Listen("tcp", "127.0.0.1:0") to listen on a random available port.',
    'Use io.Copy(conn, conn) for a simple echo -- it copies everything read from the connection back to it.',
    'Handle each connection in a separate goroutine so multiple clients can connect simultaneously.',
    'For SendMessage, use fmt.Fprintln to send and bufio.Scanner to read the response line.',
  ],
}

export default exercise
