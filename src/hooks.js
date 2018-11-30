// @flow
import {
  Children,
  cloneElement,
  // $FlowFixMe
  useState,
  // $FlowFixMe
  useEffect,
  // $FlowFixMe
  useRef,
  // $FlowFixMe
  useMemo,
} from 'react'
import type { ChildrenArray, Element } from 'react'
import { update } from 'ramda'

// Helpers
// It returns the previous version of a value.
function usePrevious(value: any) {
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

// Hooks defining an active state and returning an updater. It also accepts a callback which only execute in componentDidUpdate method.
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

// Update children by given active index.
function useUpdateChildrenByActiveIndex(
  children: ChildrenArray<Element<any>>,
  activeIndex: number,
) {
  return useMemo(
    () => {
      const childrenToArr = Children.toArray(children)
      const lastElementIndex = childrenToArr.length - 1
      // If the activeIndex is greater than or equal to the lastElementIndex of children, then we gonna return the last element of children.
      // If the activeIndex is less than 0 then return the first element of the children. Else, return the element based in
      // activeIndex.
      const child =
        activeIndex >= lastElementIndex
          ? childrenToArr[lastElementIndex]
          : activeIndex < 0
          ? childrenToArr[0]
          : childrenToArr[activeIndex]
      const updatedTabItemBasedInIndex = cloneElement(child, {
        active: true,
      })
      return update(activeIndex, updatedTabItemBasedInIndex, childrenToArr)
    },
    [children, activeIndex],
  )
}

export {
  usePrevious,
  useDidUpdateEffect,
  useActive,
  useUpdateChildrenByActiveIndex,
}
