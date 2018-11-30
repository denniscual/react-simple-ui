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
  active: number,
) {
  return useMemo(
    () => {
      const childrenToArr = Children.toArray(children)
      const updatedTabItemBasedInIndex = cloneElement(childrenToArr[active], {
        active: true,
      })
      return update(active, updatedTabItemBasedInIndex, childrenToArr)
    },
    [children, active],
  )
}

export {
  usePrevious,
  useDidUpdateEffect,
  useActive,
  useUpdateChildrenByActiveIndex,
}
