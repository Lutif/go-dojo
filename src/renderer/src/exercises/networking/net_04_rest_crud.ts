import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_04_rest_crud',
  title: 'REST CRUD API',
  category: 'Networking',
  subcategory: 'HTTP',
  difficulty: 'intermediate',
  order: 4,
  description: `Implement a REST API for CRUD operations on an in-memory item store. REST uses HTTP methods to map operations:

- \`POST /items\` -- Create a new item (JSON body: \`{"name":"...", "price":...}\`), returns the created item with an assigned \`id\` and status 201
- \`GET /items\` -- List all items as a JSON array, status 200
- \`GET /items/{id}\` -- Get a single item by ID, 404 if not found
- \`PUT /items/{id}\` -- Update an item (JSON body with name/price), 404 if not found
- \`DELETE /items/{id}\` -- Delete an item, 404 if not found, 200 with body \`deleted\` on success

Item struct: \`{ ID int, Name string, Price float64 }\`

Your task:
1. Implement \`NewItemStore() *ItemStore\` that creates the store
2. Implement \`(s *ItemStore) ServeHTTP(w http.ResponseWriter, r *http.Request)\` to handle all routes`,
  code: `package main

import (
	"encoding/json"
	"net/http"
	"sync"
)

type Item struct {
	ID    int     ` + "`" + `json:"id"` + "`" + `
	Name  string  ` + "`" + `json:"name"` + "`" + `
	Price float64 ` + "`" + `json:"price"` + "`" + `
}

type ItemStore struct {
	mu     sync.Mutex
	items  map[int]Item
	nextID int
}

// NewItemStore creates a new empty item store.
// TODO: Implement this function
func NewItemStore() *ItemStore {
	return nil
}

// ServeHTTP handles all REST routes for the item store.
// Routes:
//   POST   /items      -> create item, return 201
//   GET    /items      -> list all items, return 200
//   GET    /items/{id} -> get item by id, 404 if missing
//   PUT    /items/{id} -> update item by id, 404 if missing
//   DELETE /items/{id} -> delete item by id, 404 if missing
// TODO: Implement this method
func (s *ItemStore) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	_ = json.NewEncoder(w)
}

func main() {}`,
  testCode: `package main

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCreateItem(t *testing.T) {
	srv := httptest.NewServer(NewItemStore())
	defer srv.Close()

	body := bytes.NewBufferString(` + "`" + `{"name":"Widget","price":9.99}` + "`" + `)
	resp, err := http.Post(srv.URL+"/items", "application/json", body)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 201 {
		t.Fatalf("status = %d, want 201", resp.StatusCode)
	}

	var item Item
	json.NewDecoder(resp.Body).Decode(&item)
	if item.Name != "Widget" || item.Price != 9.99 || item.ID == 0 {
		t.Errorf("unexpected item: %+v", item)
	}
}

func TestListItems(t *testing.T) {
	srv := httptest.NewServer(NewItemStore())
	defer srv.Close()

	// Create two items
	for _, name := range []string{"A", "B"} {
		body := bytes.NewBufferString(` + "`" + `{"name":"` + "`" + ` + name + ` + "`" + `","price":1.0}` + "`" + `)
		http.Post(srv.URL+"/items", "application/json", body)
	}

	resp, _ := http.Get(srv.URL + "/items")
	defer resp.Body.Close()

	var items []Item
	json.NewDecoder(resp.Body).Decode(&items)
	if len(items) != 2 {
		t.Errorf("expected 2 items, got %d", len(items))
	}
}

func TestGetItem(t *testing.T) {
	srv := httptest.NewServer(NewItemStore())
	defer srv.Close()

	body := bytes.NewBufferString(` + "`" + `{"name":"Gadget","price":19.99}` + "`" + `)
	resp, _ := http.Post(srv.URL+"/items", "application/json", body)
	var created Item
	json.NewDecoder(resp.Body).Decode(&created)
	resp.Body.Close()

	resp2, _ := http.Get(srv.URL + "/items/" + fmt.Sprint(created.ID))
	defer resp2.Body.Close()

	var got Item
	json.NewDecoder(resp2.Body).Decode(&got)
	if got.Name != "Gadget" {
		t.Errorf("name = %q, want %q", got.Name, "Gadget")
	}
}

func TestGetItemNotFound(t *testing.T) {
	srv := httptest.NewServer(NewItemStore())
	defer srv.Close()

	resp, _ := http.Get(srv.URL + "/items/999")
	defer resp.Body.Close()

	if resp.StatusCode != 404 {
		t.Errorf("status = %d, want 404", resp.StatusCode)
	}
}

func TestUpdateItem(t *testing.T) {
	srv := httptest.NewServer(NewItemStore())
	defer srv.Close()

	body := bytes.NewBufferString(` + "`" + `{"name":"Old","price":5.0}` + "`" + `)
	resp, _ := http.Post(srv.URL+"/items", "application/json", body)
	var created Item
	json.NewDecoder(resp.Body).Decode(&created)
	resp.Body.Close()

	updateBody := bytes.NewBufferString(` + "`" + `{"name":"New","price":10.0}` + "`" + `)
	req, _ := http.NewRequest("PUT", srv.URL+"/items/"+fmt.Sprint(created.ID), updateBody)
	req.Header.Set("Content-Type", "application/json")
	resp2, _ := http.DefaultClient.Do(req)
	defer resp2.Body.Close()

	var updated Item
	json.NewDecoder(resp2.Body).Decode(&updated)
	if updated.Name != "New" || updated.Price != 10.0 {
		t.Errorf("updated item = %+v, want name=New, price=10.0", updated)
	}
}

func TestDeleteItem(t *testing.T) {
	srv := httptest.NewServer(NewItemStore())
	defer srv.Close()

	body := bytes.NewBufferString(` + "`" + `{"name":"ToDelete","price":1.0}` + "`" + `)
	resp, _ := http.Post(srv.URL+"/items", "application/json", body)
	var created Item
	json.NewDecoder(resp.Body).Decode(&created)
	resp.Body.Close()

	req, _ := http.NewRequest("DELETE", srv.URL+"/items/"+fmt.Sprint(created.ID), nil)
	resp2, _ := http.DefaultClient.Do(req)
	b, _ := io.ReadAll(resp2.Body)
	resp2.Body.Close()

	if resp2.StatusCode != 200 {
		t.Errorf("delete status = %d, want 200", resp2.StatusCode)
	}
	if string(b) != "deleted" {
		t.Errorf("delete body = %q, want %q", string(b), "deleted")
	}

	// Verify it's gone
	resp3, _ := http.Get(srv.URL + "/items/" + fmt.Sprint(created.ID))
	resp3.Body.Close()
	if resp3.StatusCode != 404 {
		t.Errorf("get after delete: status = %d, want 404", resp3.StatusCode)
	}
}`,
  solution: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"sync"
)

type Item struct {
	ID    int     ` + "`" + `json:"id"` + "`" + `
	Name  string  ` + "`" + `json:"name"` + "`" + `
	Price float64 ` + "`" + `json:"price"` + "`" + `
}

type ItemStore struct {
	mu     sync.Mutex
	items  map[int]Item
	nextID int
}

func NewItemStore() *ItemStore {
	return &ItemStore{
		items:  make(map[int]Item),
		nextID: 1,
	}
}

func (s *ItemStore) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/items")
	path = strings.TrimPrefix(path, "/")

	w.Header().Set("Content-Type", "application/json")

	if path == "" {
		switch r.Method {
		case "GET":
			s.listItems(w)
		case "POST":
			s.createItem(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
		return
	}

	id, err := strconv.Atoi(path)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	switch r.Method {
	case "GET":
		s.getItem(w, id)
	case "PUT":
		s.updateItem(w, r, id)
	case "DELETE":
		s.deleteItem(w, id)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func (s *ItemStore) createItem(w http.ResponseWriter, r *http.Request) {
	var item Item
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	s.mu.Lock()
	item.ID = s.nextID
	s.nextID++
	s.items[item.ID] = item
	s.mu.Unlock()

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(item)
}

func (s *ItemStore) listItems(w http.ResponseWriter) {
	s.mu.Lock()
	items := make([]Item, 0, len(s.items))
	for _, item := range s.items {
		items = append(items, item)
	}
	s.mu.Unlock()
	json.NewEncoder(w).Encode(items)
}

func (s *ItemStore) getItem(w http.ResponseWriter, id int) {
	s.mu.Lock()
	item, ok := s.items[id]
	s.mu.Unlock()
	if !ok {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprint(w, "not found")
		return
	}
	json.NewEncoder(w).Encode(item)
}

func (s *ItemStore) updateItem(w http.ResponseWriter, r *http.Request, id int) {
	var input Item
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	s.mu.Lock()
	_, ok := s.items[id]
	if !ok {
		s.mu.Unlock()
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprint(w, "not found")
		return
	}
	input.ID = id
	s.items[id] = input
	s.mu.Unlock()
	json.NewEncoder(w).Encode(input)
}

func (s *ItemStore) deleteItem(w http.ResponseWriter, id int) {
	s.mu.Lock()
	_, ok := s.items[id]
	if !ok {
		s.mu.Unlock()
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprint(w, "not found")
		return
	}
	delete(s.items, id)
	s.mu.Unlock()
	w.Header().Del("Content-Type")
	fmt.Fprint(w, "deleted")
}

func main() {}`,
  hints: [
    'Implement the http.Handler interface by adding a ServeHTTP method to ItemStore.',
    'Parse the item ID from the URL path: strings.TrimPrefix(r.URL.Path, "/items/") and strconv.Atoi.',
    'Use json.NewDecoder(r.Body).Decode(&item) to parse JSON request bodies.',
    'Use sync.Mutex to protect the items map from concurrent access.',
  ],
}

export default exercise
