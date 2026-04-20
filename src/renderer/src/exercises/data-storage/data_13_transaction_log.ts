import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_13_transaction_log',
  title: 'Transaction Log',
  category: 'Data & Storage',
  subcategory: 'Transactions',
  difficulty: 'expert',
  order: 13,
  description: `Create a transaction log that supports Begin, Commit, and Rollback for ACID-like semantics on an in-memory key-value store.

A transaction collects operations (Set/Delete) without applying them. On Commit, all operations are applied atomically. On Rollback, they are discarded:

\`\`\`
store := NewTxStore()
store.Set("x", "1")        // direct write

tx := store.Begin()         // start transaction
tx.Set("y", "2")            // buffered
tx.Set("z", "3")            // buffered
tx.Commit()                 // applies both writes

tx2 := store.Begin()
tx2.Set("x", "99")
tx2.Rollback()              // discards change, x is still "1"
\`\`\`

Implement:
- \`NewTxStore()\` - creates an empty transactional store
- \`TxStore.Set(key, value string)\` - directly sets a value (outside transaction)
- \`TxStore.Get(key string) (string, bool)\` - retrieves a value
- \`TxStore.Delete(key string)\` - directly deletes a key
- \`TxStore.Begin() *Transaction\` - starts a new transaction
- \`Transaction.Set(key, value string)\` - buffers a set operation
- \`Transaction.Delete(key string)\` - buffers a delete operation
- \`Transaction.Get(key string) (string, bool)\` - reads from buffer first, then store
- \`Transaction.Commit() error\` - applies all buffered operations (returns error if already finalized)
- \`Transaction.Rollback() error\` - discards all buffered operations (returns error if already finalized)`,
  code: `package main

import "errors"

type opType int

const (
	opSet opType = iota
	opDelete
)

type operation struct {
	typ   opType
	key   string
	value string
}

// TxStore is an in-memory key-value store with transaction support.
type TxStore struct {
	// TODO: Add data map
}

// Transaction represents an active transaction with buffered operations.
type Transaction struct {
	// TODO: Add reference to store, operations buffer, and finalized flag
}

// NewTxStore creates a new transactional store.
func NewTxStore() *TxStore {
	// TODO
	return nil
}

// Set directly sets a key-value pair (outside any transaction).
func (s *TxStore) Set(key, value string) {
	// TODO
}

// Get retrieves a value from the store.
func (s *TxStore) Get(key string) (string, bool) {
	// TODO
	return "", false
}

// Delete directly removes a key from the store.
func (s *TxStore) Delete(key string) {
	// TODO
}

// Begin starts a new transaction.
func (s *TxStore) Begin() *Transaction {
	// TODO
	return nil
}

// Set buffers a set operation in the transaction.
func (tx *Transaction) Set(key, value string) {
	// TODO
}

// Delete buffers a delete operation in the transaction.
func (tx *Transaction) Delete(key string) {
	// TODO
}

// Get reads from the transaction buffer first (most recent op for key),
// then falls back to the store. Returns ("", false) if deleted in buffer.
func (tx *Transaction) Get(key string) (string, bool) {
	// TODO: Check buffer in reverse order, then check store
	return "", false
}

// Commit applies all buffered operations to the store.
// Returns an error if the transaction was already committed or rolled back.
func (tx *Transaction) Commit() error {
	// TODO
	return nil
}

// Rollback discards all buffered operations.
// Returns an error if the transaction was already committed or rolled back.
func (tx *Transaction) Rollback() error {
	// TODO
	return nil
}

var _ = errors.New

func main() {}`,
  testCode: `package main

import "testing"

func TestTxStoreDirectOps(t *testing.T) {
	store := NewTxStore()
	store.Set("a", "1")
	store.Set("b", "2")

	val, ok := store.Get("a")
	if !ok || val != "1" {
		t.Errorf("Get(a) = (%q, %v), want (1, true)", val, ok)
	}

	store.Delete("b")
	_, ok = store.Get("b")
	if ok {
		t.Error("Get(b) should return false after Delete")
	}
}

func TestTxCommit(t *testing.T) {
	store := NewTxStore()
	store.Set("x", "old")

	tx := store.Begin()
	tx.Set("x", "new")
	tx.Set("y", "added")

	// Before commit, store should have old value
	val, _ := store.Get("x")
	if val != "old" {
		t.Errorf("before commit Get(x) = %q, want old", val)
	}

	err := tx.Commit()
	if err != nil {
		t.Fatalf("Commit() error: %v", err)
	}

	val, _ = store.Get("x")
	if val != "new" {
		t.Errorf("after commit Get(x) = %q, want new", val)
	}
	val, ok := store.Get("y")
	if !ok || val != "added" {
		t.Errorf("after commit Get(y) = (%q, %v), want (added, true)", val, ok)
	}
}

func TestTxRollback(t *testing.T) {
	store := NewTxStore()
	store.Set("x", "original")

	tx := store.Begin()
	tx.Set("x", "changed")
	tx.Set("y", "new")

	err := tx.Rollback()
	if err != nil {
		t.Fatalf("Rollback() error: %v", err)
	}

	val, _ := store.Get("x")
	if val != "original" {
		t.Errorf("after rollback Get(x) = %q, want original", val)
	}
	_, ok := store.Get("y")
	if ok {
		t.Error("after rollback Get(y) should return false")
	}
}

func TestTxDeleteInTx(t *testing.T) {
	store := NewTxStore()
	store.Set("a", "1")

	tx := store.Begin()
	tx.Delete("a")
	tx.Commit()

	_, ok := store.Get("a")
	if ok {
		t.Error("after commit with delete, Get(a) should return false")
	}
}

func TestTxGetFromBuffer(t *testing.T) {
	store := NewTxStore()
	store.Set("k", "store-val")

	tx := store.Begin()
	tx.Set("k", "tx-val")

	val, ok := tx.Get("k")
	if !ok || val != "tx-val" {
		t.Errorf("tx.Get(k) = (%q, %v), want (tx-val, true)", val, ok)
	}
}

func TestTxGetDeletedInBuffer(t *testing.T) {
	store := NewTxStore()
	store.Set("k", "val")

	tx := store.Begin()
	tx.Delete("k")

	_, ok := tx.Get("k")
	if ok {
		t.Error("tx.Get(k) should return false after delete in buffer")
	}
}

func TestTxGetFallsBackToStore(t *testing.T) {
	store := NewTxStore()
	store.Set("existing", "value")

	tx := store.Begin()
	val, ok := tx.Get("existing")
	if !ok || val != "value" {
		t.Errorf("tx.Get(existing) = (%q, %v), want (value, true)", val, ok)
	}
}

func TestTxDoubleCommit(t *testing.T) {
	store := NewTxStore()
	tx := store.Begin()
	tx.Set("k", "v")
	tx.Commit()

	err := tx.Commit()
	if err == nil {
		t.Error("second Commit() should return error")
	}
}

func TestTxDoubleRollback(t *testing.T) {
	store := NewTxStore()
	tx := store.Begin()
	tx.Set("k", "v")
	tx.Rollback()

	err := tx.Rollback()
	if err == nil {
		t.Error("second Rollback() should return error")
	}
}

func TestTxCommitAfterRollback(t *testing.T) {
	store := NewTxStore()
	tx := store.Begin()
	tx.Set("k", "v")
	tx.Rollback()

	err := tx.Commit()
	if err == nil {
		t.Error("Commit after Rollback should return error")
	}
}`,
  solution: `package main

import "errors"

type opType int

const (
	opSet opType = iota
	opDelete
)

type operation struct {
	typ   opType
	key   string
	value string
}

type TxStore struct {
	data map[string]string
}

type Transaction struct {
	store     *TxStore
	ops       []operation
	finalized bool
}

func NewTxStore() *TxStore {
	return &TxStore{data: make(map[string]string)}
}

func (s *TxStore) Set(key, value string) {
	s.data[key] = value
}

func (s *TxStore) Get(key string) (string, bool) {
	v, ok := s.data[key]
	return v, ok
}

func (s *TxStore) Delete(key string) {
	delete(s.data, key)
}

func (s *TxStore) Begin() *Transaction {
	return &Transaction{store: s}
}

func (tx *Transaction) Set(key, value string) {
	tx.ops = append(tx.ops, operation{typ: opSet, key: key, value: value})
}

func (tx *Transaction) Delete(key string) {
	tx.ops = append(tx.ops, operation{typ: opDelete, key: key})
}

func (tx *Transaction) Get(key string) (string, bool) {
	// Check buffer in reverse order for most recent op on this key
	for i := len(tx.ops) - 1; i >= 0; i-- {
		op := tx.ops[i]
		if op.key == key {
			if op.typ == opDelete {
				return "", false
			}
			return op.value, true
		}
	}
	return tx.store.Get(key)
}

func (tx *Transaction) Commit() error {
	if tx.finalized {
		return errors.New("transaction already finalized")
	}
	tx.finalized = true
	for _, op := range tx.ops {
		switch op.typ {
		case opSet:
			tx.store.data[op.key] = op.value
		case opDelete:
			delete(tx.store.data, op.key)
		}
	}
	return nil
}

func (tx *Transaction) Rollback() error {
	if tx.finalized {
		return errors.New("transaction already finalized")
	}
	tx.finalized = true
	tx.ops = nil
	return nil
}

func main() {}`,
  hints: [
    'Buffer operations as a slice of {opType, key, value}. On Commit, apply them all. On Rollback, discard them.',
    'For Transaction.Get, scan the ops buffer in reverse to find the most recent operation for that key.',
    'Use a finalized bool flag. Return an error from Commit/Rollback if already finalized.',
  ],
}

export default exercise
