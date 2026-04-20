import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_23_state_machine',
  title: 'State Machine',
  category: 'Patterns',
  subcategory: 'Design Patterns',
  difficulty: 'advanced',
  order: 23,
  description: `Build a state machine with states, events, transitions, and lifecycle hooks.

State machines model workflows where an entity moves between well-defined states in response to events. Invalid transitions are rejected.

Your tasks:

1. Define a \`Transition\` struct with:
   - \`From\` (string) - source state
   - \`Event\` (string) - triggering event
   - \`To\` (string) - destination state

2. Define a \`StateMachine\` struct with:
   - \`current\` (string) - current state
   - \`transitions\` ([]Transition) - allowed transitions
   - \`onEnter\` (map[string]func(from string)) - hooks called when entering a state
   - \`onExit\` (map[string]func(to string)) - hooks called when exiting a state

3. Implement \`NewStateMachine(initial string, transitions []Transition) *StateMachine\`.

4. Implement \`(sm *StateMachine) OnEnter(state string, fn func(from string))\`:
   - Registers a callback that fires when entering the given state
   - The callback receives the previous state name

5. Implement \`(sm *StateMachine) OnExit(state string, fn func(to string))\`:
   - Registers a callback that fires when leaving the given state
   - The callback receives the next state name

6. Implement \`(sm *StateMachine) SendEvent(event string) error\`:
   - Finds a transition matching (current state, event)
   - If no valid transition, return an error: "invalid transition: STATE + EVENT"
   - Calls OnExit hook for current state (if registered)
   - Changes state
   - Calls OnEnter hook for new state (if registered)
   - Returns nil

7. Implement \`(sm *StateMachine) Current() string\`.

8. Implement \`(sm *StateMachine) CanSend(event string) bool\`:
   - Returns true if there is a valid transition for the current state and event.`,
  code: `package main

import "fmt"

// TODO: Define Transition struct with From, Event, To string fields

// TODO: Define StateMachine struct with current, transitions,
// onEnter map[string]func(string), onExit map[string]func(string)

// TODO: Implement NewStateMachine(initial string, transitions []Transition) *StateMachine

// TODO: Implement (sm *StateMachine) OnEnter(state string, fn func(from string))

// TODO: Implement (sm *StateMachine) OnExit(state string, fn func(to string))

// TODO: Implement (sm *StateMachine) SendEvent(event string) error
// Find valid transition, call exit hook, change state, call enter hook

// TODO: Implement (sm *StateMachine) Current() string

// TODO: Implement (sm *StateMachine) CanSend(event string) bool

var _ = fmt.Sprintf

func main() {}`,
  testCode: `package main

import (
	"testing"
)

func newOrderMachine() *StateMachine {
	return NewStateMachine("pending", []Transition{
		{From: "pending", Event: "approve", To: "approved"},
		{From: "pending", Event: "reject", To: "rejected"},
		{From: "approved", Event: "ship", To: "shipped"},
		{From: "shipped", Event: "deliver", To: "delivered"},
	})
}

func TestInitialState(t *testing.T) {
	sm := newOrderMachine()
	if sm.Current() != "pending" {
		t.Errorf("expected pending, got %s", sm.Current())
	}
}

func TestValidTransition(t *testing.T) {
	sm := newOrderMachine()

	err := sm.SendEvent("approve")
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
	if sm.Current() != "approved" {
		t.Errorf("expected approved, got %s", sm.Current())
	}
}

func TestInvalidTransition(t *testing.T) {
	sm := newOrderMachine()

	err := sm.SendEvent("ship")
	if err == nil {
		t.Error("expected error for invalid transition")
	}
	if sm.Current() != "pending" {
		t.Errorf("state should not change on invalid transition, got %s", sm.Current())
	}
}

func TestMultipleTransitions(t *testing.T) {
	sm := newOrderMachine()

	sm.SendEvent("approve")
	sm.SendEvent("ship")
	sm.SendEvent("deliver")

	if sm.Current() != "delivered" {
		t.Errorf("expected delivered, got %s", sm.Current())
	}
}

func TestCanSend(t *testing.T) {
	sm := newOrderMachine()

	if !sm.CanSend("approve") {
		t.Error("should be able to send approve from pending")
	}
	if !sm.CanSend("reject") {
		t.Error("should be able to send reject from pending")
	}
	if sm.CanSend("ship") {
		t.Error("should not be able to send ship from pending")
	}
}

func TestOnEnterHook(t *testing.T) {
	sm := newOrderMachine()
	var enteredFrom string

	sm.OnEnter("approved", func(from string) {
		enteredFrom = from
	})

	sm.SendEvent("approve")

	if enteredFrom != "pending" {
		t.Errorf("expected OnEnter called with from=pending, got %q", enteredFrom)
	}
}

func TestOnExitHook(t *testing.T) {
	sm := newOrderMachine()
	var exitedTo string

	sm.OnExit("pending", func(to string) {
		exitedTo = to
	})

	sm.SendEvent("approve")

	if exitedTo != "approved" {
		t.Errorf("expected OnExit called with to=approved, got %q", exitedTo)
	}
}

func TestHookOrder(t *testing.T) {
	sm := newOrderMachine()
	var order []string

	sm.OnExit("pending", func(to string) {
		order = append(order, "exit-pending")
	})
	sm.OnEnter("approved", func(from string) {
		order = append(order, "enter-approved")
	})

	sm.SendEvent("approve")

	if len(order) != 2 {
		t.Fatalf("expected 2 hooks, got %d", len(order))
	}
	if order[0] != "exit-pending" {
		t.Errorf("expected exit first, got %s", order[0])
	}
	if order[1] != "enter-approved" {
		t.Errorf("expected enter second, got %s", order[1])
	}
}

func TestNoHooksOnInvalidTransition(t *testing.T) {
	sm := newOrderMachine()
	called := false

	sm.OnExit("pending", func(to string) { called = true })
	sm.OnEnter("shipped", func(from string) { called = true })

	sm.SendEvent("ship") // invalid from pending

	if called {
		t.Error("hooks should not fire on invalid transition")
	}
}`,
  solution: `package main

import "fmt"

type Transition struct {
	From  string
	Event string
	To    string
}

type StateMachine struct {
	current     string
	transitions []Transition
	onEnter     map[string]func(string)
	onExit      map[string]func(string)
}

func NewStateMachine(initial string, transitions []Transition) *StateMachine {
	return &StateMachine{
		current:     initial,
		transitions: transitions,
		onEnter:     make(map[string]func(string)),
		onExit:      make(map[string]func(string)),
	}
}

func (sm *StateMachine) OnEnter(state string, fn func(from string)) {
	sm.onEnter[state] = fn
}

func (sm *StateMachine) OnExit(state string, fn func(to string)) {
	sm.onExit[state] = fn
}

func (sm *StateMachine) SendEvent(event string) error {
	for _, t := range sm.transitions {
		if t.From == sm.current && t.Event == event {
			if fn, ok := sm.onExit[sm.current]; ok {
				fn(t.To)
			}
			prev := sm.current
			sm.current = t.To
			if fn, ok := sm.onEnter[sm.current]; ok {
				fn(prev)
			}
			return nil
		}
	}
	return fmt.Errorf("invalid transition: %s + %s", sm.current, event)
}

func (sm *StateMachine) Current() string {
	return sm.current
}

func (sm *StateMachine) CanSend(event string) bool {
	for _, t := range sm.transitions {
		if t.From == sm.current && t.Event == event {
			return true
		}
	}
	return false
}

func main() {}`,
  hints: [
    'Store transitions as a slice and scan it linearly in SendEvent to find a matching (From, Event) pair.',
    'In SendEvent, find the transition first, then call OnExit for the current state, update current, then call OnEnter for the new state.',
    'If no matching transition is found, return an error without calling any hooks or changing state.',
    'CanSend just searches the transitions slice for a match without actually transitioning.',
  ],
}

export default exercise
