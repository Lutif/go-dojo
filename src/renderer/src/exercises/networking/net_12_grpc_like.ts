import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_12_grpc_like',
  title: 'RPC Protocol',
  category: 'Networking',
  subcategory: 'HTTP',
  difficulty: 'expert',
  order: 12,
  description: `Build a simple JSON-RPC system over HTTP. Clients call remote procedures by name, sending JSON-encoded requests and receiving JSON-encoded responses. The server dispatches to registered handler functions based on the method name.

Key concepts:
- A \`Handler\` is a function that takes a JSON request body (as \`json.RawMessage\`) and returns a result (as \`interface{}\`) or an error
- The server maps method names to handlers
- Requests include a \`"method"\` field and a \`"params"\` field
- Responses include a \`"result"\` field or an \`"error"\` field

Wire format (request):

    {"method": "Add", "params": {"a": 1, "b": 2}}

Wire format (response):

    {"result": 3}
    -- or --
    {"error": "unknown method: Multiply"}

Your task:
1. Implement \`NewRPCServer() *RPCServer\`
2. Implement \`(*RPCServer) Register(method string, handler Handler)\` -- registers a handler for a method name
3. Implement \`(*RPCServer) ServeHTTP(w, r)\` -- parses the JSON request, dispatches to the handler, writes the JSON response
4. Implement \`RPCCall(serverURL, method string, params interface{}) (json.RawMessage, error)\` -- client function that makes an RPC call`,
  code: `package main

import (
	"encoding/json"
	"net/http"
)

// Handler is a function that handles an RPC call.
// It receives the params as raw JSON and returns a result or error.
type Handler func(params json.RawMessage) (interface{}, error)

// RPCRequest is the JSON structure for an incoming RPC call.
type RPCRequest struct {
	Method string          ` + "`" + `json:"method"` + "`" + `
	Params json.RawMessage ` + "`" + `json:"params"` + "`" + `
}

// RPCResponse is the JSON structure for an RPC response.
type RPCResponse struct {
	Result interface{} ` + "`" + `json:"result,omitempty"` + "`" + `
	Error  string      ` + "`" + `json:"error,omitempty"` + "`" + `
}

// RPCServer dispatches RPC calls to registered handlers.
type RPCServer struct {
	// TODO: Add a map of method names to handlers
}

// NewRPCServer creates a new RPC server.
// TODO: Implement this function
func NewRPCServer() *RPCServer {
	return nil
}

// Register adds a handler for the given method name.
// TODO: Implement this function
func (s *RPCServer) Register(method string, handler Handler) {
}

// ServeHTTP handles incoming RPC requests.
// It should:
// 1. Decode the JSON request body into RPCRequest
// 2. Look up the handler by method name
// 3. Call the handler with params
// 4. Write the JSON response (result or error)
// TODO: Implement this function
func (s *RPCServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
}

// RPCCall makes an RPC call to the server.
// It sends a JSON request with the method and params, and returns the result.
// TODO: Implement this function
func RPCCall(serverURL, method string, params interface{}) (json.RawMessage, error) {
	return nil, nil
}

func main() {}`,
  testCode: `package main

import (
	"encoding/json"
	"fmt"
	"net/http/httptest"
	"testing"
)

func TestRegisterAndCall(t *testing.T) {
	srv := NewRPCServer()
	if srv == nil {
		t.Fatal("NewRPCServer returned nil")
	}

	srv.Register("Echo", func(params json.RawMessage) (interface{}, error) {
		var msg string
		if err := json.Unmarshal(params, &msg); err != nil {
			return nil, err
		}
		return msg, nil
	})

	ts := httptest.NewServer(srv)
	defer ts.Close()

	result, err := RPCCall(ts.URL, "Echo", "hello rpc")
	if err != nil {
		t.Fatalf("RPCCall: %v", err)
	}

	var got string
	if err := json.Unmarshal(result, &got); err != nil {
		t.Fatalf("unmarshal result: %v", err)
	}
	if got != "hello rpc" {
		t.Errorf("got %q, want %q", got, "hello rpc")
	}
}

func TestAddMethod(t *testing.T) {
	srv := NewRPCServer()

	type AddParams struct {
		A int ` + "`" + `json:"a"` + "`" + `
		B int ` + "`" + `json:"b"` + "`" + `
	}

	srv.Register("Add", func(params json.RawMessage) (interface{}, error) {
		var p AddParams
		if err := json.Unmarshal(params, &p); err != nil {
			return nil, err
		}
		return p.A + p.B, nil
	})

	ts := httptest.NewServer(srv)
	defer ts.Close()

	result, err := RPCCall(ts.URL, "Add", AddParams{A: 3, B: 4})
	if err != nil {
		t.Fatalf("RPCCall: %v", err)
	}

	var sum float64
	if err := json.Unmarshal(result, &sum); err != nil {
		t.Fatalf("unmarshal: %v", err)
	}
	if sum != 7 {
		t.Errorf("Add(3,4) = %v, want 7", sum)
	}
}

func TestUnknownMethod(t *testing.T) {
	srv := NewRPCServer()
	ts := httptest.NewServer(srv)
	defer ts.Close()

	_, err := RPCCall(ts.URL, "NoSuchMethod", nil)
	if err == nil {
		t.Error("expected error for unknown method, got nil")
	}
}

func TestHandlerError(t *testing.T) {
	srv := NewRPCServer()
	srv.Register("Fail", func(params json.RawMessage) (interface{}, error) {
		return nil, fmt.Errorf("intentional error")
	})

	ts := httptest.NewServer(srv)
	defer ts.Close()

	_, err := RPCCall(ts.URL, "Fail", nil)
	if err == nil {
		t.Error("expected error from failing handler, got nil")
	}
}

func TestMultipleMethods(t *testing.T) {
	srv := NewRPCServer()

	srv.Register("Upper", func(params json.RawMessage) (interface{}, error) {
		var s string
		json.Unmarshal(params, &s)
		result := ""
		for _, c := range s {
			if c >= 'a' && c <= 'z' {
				result += string(c - 32)
			} else {
				result += string(c)
			}
		}
		return result, nil
	})

	srv.Register("Len", func(params json.RawMessage) (interface{}, error) {
		var s string
		json.Unmarshal(params, &s)
		return len(s), nil
	})

	ts := httptest.NewServer(srv)
	defer ts.Close()

	// Test Upper
	result, err := RPCCall(ts.URL, "Upper", "hello")
	if err != nil {
		t.Fatalf("Upper: %v", err)
	}
	var upper string
	json.Unmarshal(result, &upper)
	if upper != "HELLO" {
		t.Errorf("Upper = %q, want HELLO", upper)
	}

	// Test Len
	result, err = RPCCall(ts.URL, "Len", "hello")
	if err != nil {
		t.Fatalf("Len: %v", err)
	}
	var length float64
	json.Unmarshal(result, &length)
	if length != 5 {
		t.Errorf("Len = %v, want 5", length)
	}
}`,
  solution: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// Handler is a function that handles an RPC call.
type Handler func(params json.RawMessage) (interface{}, error)

// RPCRequest is the JSON structure for an incoming RPC call.
type RPCRequest struct {
	Method string          ` + "`" + `json:"method"` + "`" + `
	Params json.RawMessage ` + "`" + `json:"params"` + "`" + `
}

// RPCResponse is the JSON structure for an RPC response.
type RPCResponse struct {
	Result interface{} ` + "`" + `json:"result,omitempty"` + "`" + `
	Error  string      ` + "`" + `json:"error,omitempty"` + "`" + `
}

// RPCServer dispatches RPC calls to registered handlers.
type RPCServer struct {
	handlers map[string]Handler
}

// NewRPCServer creates a new RPC server.
func NewRPCServer() *RPCServer {
	return &RPCServer{
		handlers: make(map[string]Handler),
	}
}

// Register adds a handler for the given method name.
func (s *RPCServer) Register(method string, handler Handler) {
	s.handlers[method] = handler
}

// ServeHTTP handles incoming RPC requests.
func (s *RPCServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var req RPCRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeRPCError(w, "invalid request: "+err.Error())
		return
	}

	handler, ok := s.handlers[req.Method]
	if !ok {
		writeRPCError(w, "unknown method: "+req.Method)
		return
	}

	result, err := handler(req.Params)
	if err != nil {
		writeRPCError(w, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(RPCResponse{Result: result})
}

func writeRPCError(w http.ResponseWriter, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(RPCResponse{Error: msg})
}

// RPCCall makes an RPC call to the server.
func RPCCall(serverURL, method string, params interface{}) (json.RawMessage, error) {
	paramsJSON, err := json.Marshal(params)
	if err != nil {
		return nil, fmt.Errorf("marshal params: %w", err)
	}

	req := RPCRequest{
		Method: method,
		Params: paramsJSON,
	}
	body, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("marshal request: %w", err)
	}

	resp, err := http.Post(serverURL, "application/json", bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("post: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("read response: %w", err)
	}

	var rpcResp RPCResponse
	if err := json.Unmarshal(respBody, &rpcResp); err != nil {
		return nil, fmt.Errorf("unmarshal response: %w", err)
	}

	if rpcResp.Error != "" {
		return nil, fmt.Errorf("rpc error: %s", rpcResp.Error)
	}

	resultJSON, err := json.Marshal(rpcResp.Result)
	if err != nil {
		return nil, fmt.Errorf("marshal result: %w", err)
	}
	return resultJSON, nil
}

func main() {}`,
  hints: [
    'Use a map[string]Handler to store registered handlers, keyed by method name.',
    'In ServeHTTP, use json.NewDecoder(r.Body).Decode(&req) to parse the incoming RPC request.',
    'For RPCCall, marshal the params to json.RawMessage first, then build the RPCRequest and POST it.',
    'Check the RPCResponse.Error field -- if non-empty, return it as a Go error.',
  ],
}

export default exercise
