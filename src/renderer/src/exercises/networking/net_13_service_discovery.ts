import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_13_service_discovery',
  title: 'Service Registry',
  category: 'Networking',
  subcategory: 'Patterns',
  difficulty: 'expert',
  order: 13,
  description: `Implement an in-memory service registry for service discovery. In microservice architectures, services register themselves and discover other services by name rather than using hardcoded addresses.

Key concepts:
- Services have a name, address, and health status
- \`Register\` adds a service instance to the registry
- \`Deregister\` removes a service instance
- \`Discover\` finds all healthy instances of a service by name
- \`SetHealth\` updates the health status of a service instance
- Thread safety is required

Example usage:

    reg := NewRegistry()
    reg.Register("auth", "10.0.0.1:8080")
    reg.Register("auth", "10.0.0.2:8080")
    reg.SetHealth("auth", "10.0.0.1:8080", false)

    addrs := reg.Discover("auth")
    // returns ["10.0.0.2:8080"] (only healthy instances)

Your task:
1. Implement \`NewRegistry() *Registry\`
2. Implement \`(*Registry) Register(name, addr string)\` -- registers an instance (starts healthy), no duplicates
3. Implement \`(*Registry) Deregister(name, addr string)\` -- removes a specific instance
4. Implement \`(*Registry) Discover(name string) []string\` -- returns addresses of all healthy instances
5. Implement \`(*Registry) SetHealth(name, addr string, healthy bool)\` -- updates health status
6. Implement \`(*Registry) Services() []string\` -- returns all registered service names (sorted)`,
  code: `package main

import (
	"sync"
)

// ServiceInstance represents a single instance of a service.
type ServiceInstance struct {
	Addr    string
	Healthy bool
}

// Registry is an in-memory service registry.
type Registry struct {
	mu sync.Mutex
	// TODO: Add a map of service name to instances
}

// NewRegistry creates a new service registry.
// TODO: Implement this function
func NewRegistry() *Registry {
	return nil
}

// Register adds a service instance. It starts as healthy.
// Duplicate (name, addr) pairs are ignored.
// TODO: Implement this function
func (r *Registry) Register(name, addr string) {
}

// Deregister removes a service instance.
// TODO: Implement this function
func (r *Registry) Deregister(name, addr string) {
}

// Discover returns the addresses of all healthy instances of the named service.
// Returns nil if the service is not found or has no healthy instances.
// TODO: Implement this function
func (r *Registry) Discover(name string) []string {
	return nil
}

// SetHealth updates the health status of a service instance.
// TODO: Implement this function
func (r *Registry) SetHealth(name, addr string, healthy bool) {
}

// Services returns a sorted list of all registered service names.
// TODO: Implement this function
func (r *Registry) Services() []string {
	return nil
}

func main() {}`,
  testCode: `package main

import (
	"sort"
	"testing"
)

func TestNewRegistry(t *testing.T) {
	reg := NewRegistry()
	if reg == nil {
		t.Fatal("NewRegistry returned nil")
	}
	if len(reg.Services()) != 0 {
		t.Errorf("new registry has %d services, want 0", len(reg.Services()))
	}
}

func TestRegisterAndDiscover(t *testing.T) {
	reg := NewRegistry()
	reg.Register("api", "10.0.0.1:8080")
	reg.Register("api", "10.0.0.2:8080")

	addrs := reg.Discover("api")
	if len(addrs) != 2 {
		t.Fatalf("Discover returned %d addrs, want 2", len(addrs))
	}

	sort.Strings(addrs)
	if addrs[0] != "10.0.0.1:8080" || addrs[1] != "10.0.0.2:8080" {
		t.Errorf("addrs = %v, want [10.0.0.1:8080, 10.0.0.2:8080]", addrs)
	}
}

func TestRegisterDuplicate(t *testing.T) {
	reg := NewRegistry()
	reg.Register("api", "10.0.0.1:8080")
	reg.Register("api", "10.0.0.1:8080")

	addrs := reg.Discover("api")
	if len(addrs) != 1 {
		t.Errorf("duplicate register: got %d addrs, want 1", len(addrs))
	}
}

func TestDeregister(t *testing.T) {
	reg := NewRegistry()
	reg.Register("api", "10.0.0.1:8080")
	reg.Register("api", "10.0.0.2:8080")

	reg.Deregister("api", "10.0.0.1:8080")

	addrs := reg.Discover("api")
	if len(addrs) != 1 {
		t.Fatalf("after deregister: got %d addrs, want 1", len(addrs))
	}
	if addrs[0] != "10.0.0.2:8080" {
		t.Errorf("remaining addr = %q, want 10.0.0.2:8080", addrs[0])
	}
}

func TestSetHealth(t *testing.T) {
	reg := NewRegistry()
	reg.Register("db", "10.0.0.1:5432")
	reg.Register("db", "10.0.0.2:5432")

	reg.SetHealth("db", "10.0.0.1:5432", false)

	addrs := reg.Discover("db")
	if len(addrs) != 1 {
		t.Fatalf("after unhealthy: got %d addrs, want 1", len(addrs))
	}
	if addrs[0] != "10.0.0.2:5432" {
		t.Errorf("healthy addr = %q, want 10.0.0.2:5432", addrs[0])
	}

	// Restore health
	reg.SetHealth("db", "10.0.0.1:5432", true)
	addrs = reg.Discover("db")
	if len(addrs) != 2 {
		t.Errorf("after restore: got %d addrs, want 2", len(addrs))
	}
}

func TestDiscoverUnknown(t *testing.T) {
	reg := NewRegistry()
	addrs := reg.Discover("nonexistent")
	if addrs != nil && len(addrs) != 0 {
		t.Errorf("Discover unknown: got %v, want nil or empty", addrs)
	}
}

func TestServices(t *testing.T) {
	reg := NewRegistry()
	reg.Register("cache", "10.0.0.1:6379")
	reg.Register("api", "10.0.0.1:8080")
	reg.Register("db", "10.0.0.1:5432")

	services := reg.Services()
	if len(services) != 3 {
		t.Fatalf("Services() = %d, want 3", len(services))
	}

	expected := []string{"api", "cache", "db"}
	for i, want := range expected {
		if services[i] != want {
			t.Errorf("services[%d] = %q, want %q", i, services[i], want)
		}
	}
}

func TestConcurrentAccess(t *testing.T) {
	reg := NewRegistry()
	done := make(chan bool, 20)

	for i := 0; i < 10; i++ {
		go func(n int) {
			reg.Register("svc", "10.0.0.1:8080")
			reg.Discover("svc")
			done <- true
		}(i)
	}
	for i := 0; i < 10; i++ {
		go func(n int) {
			reg.SetHealth("svc", "10.0.0.1:8080", true)
			reg.Services()
			done <- true
		}(i)
	}

	for i := 0; i < 20; i++ {
		<-done
	}
}`,
  solution: `package main

import (
	"sort"
	"sync"
)

// ServiceInstance represents a single instance of a service.
type ServiceInstance struct {
	Addr    string
	Healthy bool
}

// Registry is an in-memory service registry.
type Registry struct {
	mu       sync.Mutex
	services map[string][]ServiceInstance
}

// NewRegistry creates a new service registry.
func NewRegistry() *Registry {
	return &Registry{
		services: make(map[string][]ServiceInstance),
	}
}

// Register adds a service instance. It starts as healthy.
func (r *Registry) Register(name, addr string) {
	r.mu.Lock()
	defer r.mu.Unlock()

	instances := r.services[name]
	for _, inst := range instances {
		if inst.Addr == addr {
			return // duplicate
		}
	}
	r.services[name] = append(instances, ServiceInstance{Addr: addr, Healthy: true})
}

// Deregister removes a service instance.
func (r *Registry) Deregister(name, addr string) {
	r.mu.Lock()
	defer r.mu.Unlock()

	instances := r.services[name]
	for i, inst := range instances {
		if inst.Addr == addr {
			r.services[name] = append(instances[:i], instances[i+1:]...)
			if len(r.services[name]) == 0 {
				delete(r.services, name)
			}
			return
		}
	}
}

// Discover returns the addresses of all healthy instances.
func (r *Registry) Discover(name string) []string {
	r.mu.Lock()
	defer r.mu.Unlock()

	instances, ok := r.services[name]
	if !ok {
		return nil
	}

	var addrs []string
	for _, inst := range instances {
		if inst.Healthy {
			addrs = append(addrs, inst.Addr)
		}
	}
	return addrs
}

// SetHealth updates the health status of a service instance.
func (r *Registry) SetHealth(name, addr string, healthy bool) {
	r.mu.Lock()
	defer r.mu.Unlock()

	instances := r.services[name]
	for i, inst := range instances {
		if inst.Addr == addr {
			instances[i].Healthy = healthy
			return
		}
	}
}

// Services returns a sorted list of all registered service names.
func (r *Registry) Services() []string {
	r.mu.Lock()
	defer r.mu.Unlock()

	names := make([]string, 0, len(r.services))
	for name := range r.services {
		names = append(names, name)
	}
	sort.Strings(names)
	return names
}

func main() {}`,
  hints: [
    'Use map[string][]ServiceInstance to map service names to their instances.',
    'In Register, loop through existing instances to check for duplicates before appending.',
    'In Discover, only return addresses where Healthy is true.',
    'Use sort.Strings() to return service names in sorted order from Services().',
  ],
}

export default exercise
