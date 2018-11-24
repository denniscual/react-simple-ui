// @flow
import React, {
  Children,
  cloneElement,
  isValidElement,
  // $FlowFixMe
  Suspense,
  // $FlowFixMe
  lazy,
  // $FlowFixMe
  useState,
  // $FlowFixMe
  useMemo,
  // $FlowFixMe
  useEffect,
  // $FlowFixMe
  useRef,
} from 'react'
import type { ChildrenArray, Element } from 'react'
import { update } from 'ramda'
import styled from 'styled-components'

// Styles
const SC = {
  tabs: styled.ul`
    margin: 0;
  `,
  tabsHeader: styled.header``,
  tabItem: styled.li`
    display: ${({ active }) => (active ? 'block' : 'none')};
    list-style-type: none;
  w`,
}

// An application which caters the new features of React including hooks, memo, lazy, Suspense, and more...

// TODO: Add styles to our case study for React hooks.

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
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

// The callback will only invoke in effect during re-rendering. It defers
// the invocation in initial render (didMount)
function useDidUpdateEffect(fn: Function, inputs: Array<any>) {
  const didMountRef = useRef(false)
  useEffect(() => {
    if (didMountRef.current) fn()
    else didMountRef.current = true
  }, inputs)
}

function useActive(activeIndex: number, callback?: Function) {
  const [active, setActive] = useState(activeIndex)
  // Callback will only run in re-rendering.
  useDidUpdateEffect(
    () => {
      // Handle if callback is defined. Invoke it in mount and every update.
      if (callback) {
        callback()
      }
    },
    [active],
  )
  return [active, setActive]
}

type TabItemProps = {
  children: Element<any> | any,
  title: string,
  active: boolean,
}

function TabItem({ children, title, active }: TabItemProps): Element<'li'> {
  return (
    <SC.tabItem active={active}>
      <div>{active && children}</div>
    </SC.tabItem>
  )
}

TabItem.defaultProps = {
  active: false,
}

// TODO: Make this component more reusable and add some base styles.
function Tabs({
  children,
  activeIndex,
  onTabChange,
}: {
  children: ChildrenArray<Element<typeof TabItem>>,
  activeIndex: number,
  onTabChange: () => void,
}): Element<'ul'> {
  const [active, setActive] = useActive(activeIndex, onTabChange)

  // TODO: We need to search why the TabItems are not re-created when the active state is changed. Instead, it fires re-rendering.
  // Basically what we are anticipating is to re-create the items not re-render. So we gonna search about this magic optimazion.
  // We missed this behaviour of react.
  const updatedChildren = useMemo(
    () => {
      const childrenToArr = Children.toArray(children)
      const updatedTabItemBasedInIndex = cloneElement(childrenToArr[active], {
        active: true,
      })
      return update(active, updatedTabItemBasedInIndex, childrenToArr)
    },
    [children, active],
  )

  // create the tabsHeader. Note that the computation has been memoized. Means if no
  // changes in children, it returns the cache value. No re-rendering happens.
  const tabsHeader = useMemo(
    () => {
      // create an array whose elements are the title prop of every child. Memoized the return value.
      const tabItemHeaders = Children.map(
        updatedChildren,
        (child): { title: string, active: boolean } => {
          const isValid = isValidElement(child)
          // If valid.
          if (isValid) {
            const props: TabItemProps = child.props
            return { title: props.title, active: props.active }
          }
          // Else.
          throw new TypeError('Value is not valid element.')
        },
      ).map((props, i) =>
        props.active ? (
          <span key={i}>{props.title}</span>
        ) : (
          <button key={i} onClick={() => setActive(i)}>
            {props.title}
          </button>
        ),
      )
      return <SC.tabsHeader>{tabItemHeaders}</SC.tabsHeader>
    },
    [updatedChildren],
  )

  // Create body/content of the Tabs. Value has been memoized.
  const tabsBody = useMemo(() => <div>{updatedChildren}</div>, [
    updatedChildren,
  ])

  return (
    <SC.tabs>
      {tabsHeader}
      {tabsBody}
    </SC.tabs>
  )
}

Tabs.defaultProps = {
  activeIndex: 0,
  onTabChange: () => {},
}

// TODO: We need to investigate why code-splitting is not working here.
const Item1 = lazy(() => import('./Item1'))
const Item2 = lazy(() => import('./Item2'))

function LikeTabs({ children }) {
  const [isShow, setShow] = useState(false)
  function handleClick() {
    setShow(!isShow)
  }
  return (
    <div>
      <button onClick={handleClick}>Show</button>
      <div>{isShow && children}</div>
    </div>
  )
}

function App() {
  function onTabChange() {
    console.log('on tab change')
  }
  return (
    // <Counter />
    <Suspense fallback={<div>Loading...</div>}>
      <LikeTabs>
        <Item1 />
      </LikeTabs>
      <LikeTabs>
        <Item2 />
      </LikeTabs>
      {/* <Tabs activeIndex={0} onTabChange={onTabChange}>
          <TabItem title="Tab 1">
          <Item1 />
          </TabItem>
          <TabItem title="Tab 2">
          <Item2 />
          </TabItem>
          </Tabs> */}
    </Suspense>
  )
}

export default App

// Counter App using React hooks
/* function Counter() {
 *   // If we are using useState, basically our Component became 'stateful'.
 *   const [counter, setCounter] = useState(0)
 *
 *   function handleDecrement() {
 *     setCounter(prev => prev - 1)
 *   }
 *
 *   function handleIncrement() {
 *     setCounter(prev => prev + 1)
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handleDecrement}>Decrement</button>
 *       <div>{counter}</div>
 *       <button onClick={handleIncrement}>Increment</button>
 *     </div>
 *   )
 * } */
