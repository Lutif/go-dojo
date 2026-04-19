import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_04_buffered_channels',
  title: 'Buffered Channels',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'beginner',
  order: 4,
  description: `Learn buffered channels that can hold a fixed number of values without blocking. Buffered channels allow asynchronous communication between goroutines by queuing values.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestChannel(t *testing.T) {
	ch := make(chan int)
	go func() {
		ch <- 42
	}()
	
	if v := <-ch; v != 42 {
		t.Errorf("got %d, want 42", v)
	}
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Create buffered channels with `make(chan T, size)` where size is the buffer capacity',
    'Sends only block when the buffer is full, receives block when it\'s empty',
    'Use `cap(ch)` to get buffer size and `len(ch)` to get current elements',
  ],
}

export default exercise
