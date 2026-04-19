import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_03_channels_basic',
  title: 'Channels Basic',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'beginner',
  order: 3,
  description: `Understand unbuffered channels for passing data between goroutines. Channels are Go's way of allowing safe communication between concurrent goroutines without explicit locks.`,
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
    'Unbuffered channels block until both sender and receiver are ready',
    'Use `<-` to send data into a channel: `ch <- value`',
    'Use `<-` to receive data from a channel: `value := <-ch`',
  ],
}

export default exercise
