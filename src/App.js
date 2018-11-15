// @flow
import React, {
  Children,
  cloneElement,
  isValidElement,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react'
import type { ChildrenArray, Element } from 'react'
import { update } from 'ramda'
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

// Helpers
// It returns the previous version of a value.
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// Styles
// TODO: Try this new structure in defining Styled Components. In this way, we can
// easily distinguish the Styled Components against Regular React Components.
const sc = {
  tabs: styled.ul`
    margin: 0;
  `,
  tabsHeader: styled.header`
  `,
  tabItem: styled.li`
    display: ${({ active }) => active ? 'block' : 'none'};
    list-style-type: none;
  `,
}

function TabItem (
  {
    children,
    title,
    active,
  }:
  {
    children: Element<any> | any,
    title: string,
    active: boolean,
  }
): Element<'li'> {
  return (
    <sc.tabItem active={active}>
      <div>{ children }</div>
    </sc.tabItem>
  )
}

TabItem.defaultProps = {
  active: false,
}

// TODO: Need to accept some event handlers. This handlers gets invoke when there is changes in active Tab and there is selection.
// TODO: Make this component more reusable and add some base styles.
function Tabs(
  {
    children,
    activeIndex,
  }: {
    children: ChildrenArray<Element<typeof TabItem>>,
    activeIndex: number,
  }
): Element<'ul'> {
  const [ active, setActive ] = useState(activeIndex)
  // create the tabsHeader. Note that the computation has been memoized. Means if no
  // changes in children, it returns the cache value. No re-rendering happens.
  const tabsHeader = useMemo(() => {
    // create an array whose elements are the title prop of every child. Memoized the return value.
    const tabItemHeaders = Children
      .map(children, (child) => {
        const isValid = isValidElement(child)
        // If valid.
        if (isValid) {
          return child.props.title
        }
        // Else.
        throw new TypeError('Value is not valid element.')
      })
      .map((title, i) => <button key={i} onClick={() => setActive(i)}>{ title }</button>)
    return <sc.tabsHeader>{ tabItemHeaders }</sc.tabsHeader>
  }, [ children ])
  // Create body/content of the Tabs. Value has been memoized.
  const tabsBody = useMemo(() => {
    const updatedTabItemBasedInIndex = cloneElement(
      Children.toArray(children)[active],
      { active: true }
    )
    return <div>{ update(active, updatedTabItemBasedInIndex, children) }</div>
  }, [ children, active ])
  return (
    <sc.tabs>
      { tabsHeader }
      { tabsBody }
    </sc.tabs>
  )
}

Tabs.defaultProps = {
  activeIndex: 0,
}

function App() {
  return (
    // <Counter />
    <Tabs activeIndex={0}>
      <TabItem title="Tab 1">
        <div>This is the Tab 1</div>
      </TabItem>
      <TabItem title="Tab 2">
        <div>This is the Tab 2</div>
      </TabItem>
      <TabItem title="Tab 3">
        <div>This is the Tab 3</div>
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
