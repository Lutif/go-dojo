import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_09_websocket',
  title: 'Message Protocol over TCP',
  category: 'Networking',
  subcategory: 'TCP',
  difficulty: 'advanced',
  order: 9,
  description: `Build a simple length-prefixed message protocol over TCP. Real protocols (like WebSocket) frame messages so the receiver knows where one message ends and the next begins. The simplest approach is a length prefix: send the message length as a 4-byte big-endian integer, followed by the payload bytes.

Key concepts:
- \`binary.BigEndian.PutUint32\` writes a uint32 as 4 bytes
- \`binary.BigEndian.Uint32\` reads 4 bytes as a uint32
- \`io.ReadFull\` ensures you read exactly N bytes
- Framing prevents message boundaries from being lost in TCP streams

Wire format:

    [4 bytes: length][N bytes: payload]

Example:

    SendMessage(conn, "hello")  // sends [0,0,0,5,'h','e','l','l','o']
    msg := ReadMessage(conn)    // reads length, then payload -> "hello"

Your task:
1. Implement \`SendMessage(conn net.Conn, msg string) error\` -- writes a length-prefixed message
2. Implement \`ReadMessage(conn net.Conn) (string, error)\` -- reads a length-prefixed message
3. Implement \`StartFrameServer(addr string) (net.Listener, error)\` -- starts a TCP server that reads a message and echoes it back using the same framing protocol`,
  code: `package main

import (
	"encoding/binary"
	"io"
	"net"
)

// SendMessage writes a length-prefixed message to the connection.
// Format: [4 bytes big-endian length][payload bytes]
// TODO: Implement this function
func SendMessage(conn net.Conn, msg string) error {
	_ = binary.BigEndian
	return nil
}

// ReadMessage reads a length-prefixed message from the connection.
// TODO: Implement this function
func ReadMessage(conn net.Conn) (string, error) {
	_ = io.ReadFull
	return "", nil
}

// StartFrameServer starts a TCP server that echoes messages using
// the length-prefixed framing protocol.
// TODO: Implement this function
func StartFrameServer(addr string) (net.Listener, error) {
	return nil, nil
}

func main() {}`,
  testCode: `package main

import (
	"net"
	"testing"
)

func TestSendAndReadMessage(t *testing.T) {
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("listen: %v", err)
	}
	defer ln.Close()

	done := make(chan string, 1)
	go func() {
		conn, err := ln.Accept()
		if err != nil {
			return
		}
		defer conn.Close()
		msg, _ := ReadMessage(conn)
		done <- msg
	}()

	conn, err := net.Dial("tcp", ln.Addr().String())
	if err != nil {
		t.Fatalf("dial: %v", err)
	}
	defer conn.Close()

	err = SendMessage(conn, "hello framing")
	if err != nil {
		t.Fatalf("SendMessage: %v", err)
	}

	got := <-done
	if got != "hello framing" {
		t.Errorf("got %q, want %q", got, "hello framing")
	}
}

func TestMultipleMessages(t *testing.T) {
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("listen: %v", err)
	}
	defer ln.Close()

	messages := []string{"first", "second message", "third!"}
	done := make(chan []string, 1)

	go func() {
		conn, err := ln.Accept()
		if err != nil {
			return
		}
		defer conn.Close()
		var received []string
		for i := 0; i < len(messages); i++ {
			msg, err := ReadMessage(conn)
			if err != nil {
				return
			}
			received = append(received, msg)
		}
		done <- received
	}()

	conn, err := net.Dial("tcp", ln.Addr().String())
	if err != nil {
		t.Fatalf("dial: %v", err)
	}
	defer conn.Close()

	for _, msg := range messages {
		if err := SendMessage(conn, msg); err != nil {
			t.Fatalf("SendMessage(%q): %v", msg, err)
		}
	}

	received := <-done
	if len(received) != len(messages) {
		t.Fatalf("received %d messages, want %d", len(received), len(messages))
	}
	for i, want := range messages {
		if received[i] != want {
			t.Errorf("message %d: got %q, want %q", i, received[i], want)
		}
	}
}

func TestFrameServerEcho(t *testing.T) {
	ln, err := StartFrameServer("127.0.0.1:0")
	if err != nil {
		t.Fatalf("StartFrameServer: %v", err)
	}
	defer ln.Close()

	conn, err := net.Dial("tcp", ln.Addr().String())
	if err != nil {
		t.Fatalf("dial: %v", err)
	}
	defer conn.Close()

	tests := []string{"hello", "world", "length-prefixed framing"}
	for _, msg := range tests {
		if err := SendMessage(conn, msg); err != nil {
			t.Fatalf("send %q: %v", msg, err)
		}
		got, err := ReadMessage(conn)
		if err != nil {
			t.Fatalf("read: %v", err)
		}
		if got != msg {
			t.Errorf("echo: got %q, want %q", got, msg)
		}
	}
}

func TestEmptyMessage(t *testing.T) {
	ln, err := StartFrameServer("127.0.0.1:0")
	if err != nil {
		t.Fatalf("StartFrameServer: %v", err)
	}
	defer ln.Close()

	conn, err := net.Dial("tcp", ln.Addr().String())
	if err != nil {
		t.Fatalf("dial: %v", err)
	}
	defer conn.Close()

	if err := SendMessage(conn, ""); err != nil {
		t.Fatalf("send empty: %v", err)
	}
	got, err := ReadMessage(conn)
	if err != nil {
		t.Fatalf("read empty: %v", err)
	}
	if got != "" {
		t.Errorf("got %q, want empty string", got)
	}
}`,
  solution: `package main

import (
	"encoding/binary"
	"fmt"
	"io"
	"net"
)

// SendMessage writes a length-prefixed message to the connection.
func SendMessage(conn net.Conn, msg string) error {
	length := uint32(len(msg))
	header := make([]byte, 4)
	binary.BigEndian.PutUint32(header, length)

	if _, err := conn.Write(header); err != nil {
		return fmt.Errorf("write header: %w", err)
	}
	if length > 0 {
		if _, err := conn.Write([]byte(msg)); err != nil {
			return fmt.Errorf("write payload: %w", err)
		}
	}
	return nil
}

// ReadMessage reads a length-prefixed message from the connection.
func ReadMessage(conn net.Conn) (string, error) {
	header := make([]byte, 4)
	if _, err := io.ReadFull(conn, header); err != nil {
		return "", fmt.Errorf("read header: %w", err)
	}

	length := binary.BigEndian.Uint32(header)
	if length == 0 {
		return "", nil
	}

	payload := make([]byte, length)
	if _, err := io.ReadFull(conn, payload); err != nil {
		return "", fmt.Errorf("read payload: %w", err)
	}
	return string(payload), nil
}

// StartFrameServer starts a TCP server that echoes messages using
// the length-prefixed framing protocol.
func StartFrameServer(addr string) (net.Listener, error) {
	ln, err := net.Listen("tcp", addr)
	if err != nil {
		return nil, fmt.Errorf("listen: %w", err)
	}

	go func() {
		for {
			conn, err := ln.Accept()
			if err != nil {
				return
			}
			go func(c net.Conn) {
				defer c.Close()
				for {
					msg, err := ReadMessage(c)
					if err != nil {
						return
					}
					if err := SendMessage(c, msg); err != nil {
						return
					}
				}
			}(conn)
		}
	}()

	return ln, nil
}

func main() {}`,
  hints: [
    'Use binary.BigEndian.PutUint32(buf, length) to encode the message length into 4 bytes.',
    'Use io.ReadFull(conn, buf) to read exactly N bytes -- regular Read may return fewer bytes.',
    'For the server, loop reading and echoing messages until an error occurs (client disconnect).',
    'Handle empty messages (length 0) as a valid case -- just skip reading the payload.',
  ],
}

export default exercise
