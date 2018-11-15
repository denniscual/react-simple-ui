// @flow
import React, { useState } from 'react'
import type { ChildrenArray, Element } from 'react'
import styled from 'styled-components'

// An application which caters the new features of React including hooks, memo, lazy, Suspense, and more...

// TODO: Add styles to our case study for React hooks.
// TODO: Add linting. Either eslint or standardjs.
// NOTE: If we gonna create a named function, we gonna use function declaration syntax.
//       Then if we gonna create an anonymous function, go to flat arrow syntax.

// TODO: Create another app which uses new features of React.
// Create a Tabs Component.
// Requirements in creating Tabs.
//   - we need to have Tabs component (wrapper).
//   - need to have Tab items. The number of items should be given by the user.
//   - each Tab item should show a content.
//   - need to show the active Tab item.
//   - require some event handlers.

// Styles
const SC_Tabs = styled.ul`
  margin: 0;
  display: flex;
`

const SC_TabItem = styled.li`
  list-style-type: none;
`

function TabItem({ children, title }: { children: Element<any> | any, title: string }) {
  return (
    <SC_TabItem>
      <header>{ title }</header>
      <div>{ children }</div>
    </SC_TabItem>
  )
}

function Tabs({ children }: { children: ChildrenArray<Element<typeof TabItem>>}): Element<'ul'> {
  // We need loop to the children prop and extract the title prop of eact TabItem and use the titles
  // for creating header of the Tabs.
  return (
    <SC_Tabs>
      {/* TODO: The header should be displayed in here. E.g, The TabItem's title. */}
      <header>Header define in here</header>
      {/* TODO: The content should be displayed in here. */}
      <div>Content should be displayed in here</div>
    </SC_Tabs>
  )
}

function App() {
  return (
    // <Counter />
    <Tabs>
      <TabItem title="Tab 1">
        This is the Tab 1
      </TabItem>
      <TabItem title="Tab 2">
        This is the Tab 2
      </TabItem>
    </Tabs>
  );
}

export default App;

// Counter App using React hooks
function Counter() {
  // If we are using useState, basically our Component became 'stateful'.
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
