// @flow
import React, { useState } from 'react';

// If we gonna create a named function, we gonna use function declaration syntax.
// Then if we gonna create an anonymous function, go to flat arrow syntax.

// TODO: Add linting. Either eslint or standardjs.
function Counter() {
  const [ counter, setCounter ] = useState(0);

  function handleDecrement() {
    setCounter(prev => prev - 1);
  }

  function handleIncrement() {
    setCounter(prev => prev + 1);
  };

  return (
    <div>
      <button onClick={handleDecrement}>Decrement</button>
      <div>{counter}</div>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}

// TODO: Continue the learning...
function App() {
  return (
    <Counter />
  );
}

export default App;
