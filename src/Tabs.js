// @flow
import React, {
  Children,
  cloneElement,
  isValidElement,
  // $FlowFixMe
  useState,
  // $FlowFixMe
  useMemo,
} from 'react'
import type { ChildrenArray, Element } from 'react'
import { update } from 'ramda'
import styled from 'styled-components'
import { useDidUpdateEffect } from './hooks'

// Styles
const SC = {
  tabs: styled.ul`
    margin: 0;
    padding-left: 0;
  `,
  tabsHeader: styled.header``,
  tabItem: styled.li`
    display: ${({ active }) => (active ? 'block' : 'none')};
    list-style-type: none;
    w`,
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

TabItem.defaultProps = {
  active: false,
}

function TabItem({ children, title, active }: TabItemProps): Element<'li'> {
  return (
    <SC.tabItem active={active}>
      <div>{active && children}</div>
    </SC.tabItem>
  )
}

type TabsProps = {
  children: ChildrenArray<Element<typeof TabItem>>,
  activeIndex: number,
  onTabChange: () => void,
}

Tabs.defaultProps = {
  activeIndex: 0,
  onTabChange: () => {},
}

// TODO: We need to search why the TabItems are not re-created when the active state is changed. Instead, it fires re-rendering.
// Basically what we are anticipating is to re-create the items not re-render. So we gonna search about this magic optimazion.
// We missed this behaviour of react.
function Tabs({
  children,
  activeIndex,
  onTabChange,
}: TabsProps): Element<'ul'> {
  const [active, setActive] = useActive(activeIndex, onTabChange)
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
          <button
            key={i}
            onClick={() => {
              setActive(i)
            }}
          >
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

export { Tabs as default, TabItem }
