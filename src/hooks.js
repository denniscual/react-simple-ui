// @flow
import {
  // $FlowFixMe
  useEffect,
  // $FlowFixMe
  useRef,
} from 'react'

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

export { usePrevious, useDidUpdateEffect }
