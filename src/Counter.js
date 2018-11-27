import React, {
  // $FlowFixMe
  useState,
} from 'react'

// Counter App using React hooks
function Counter() {
  // If we are using useState, basically our Component became 'stateful'.
  const [counter, setCounter] = useState(0)

  function handleDecrement() {
    setCounter(prev => prev - 1)
  }

  function handleIncrement() {
    setCounter(prev => prev + 1)
  }

  return (
    <div>
      <button onClick={handleDecrement}>Decrement</button>
      <div>{counter}</div>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  )
}

export default Counter
