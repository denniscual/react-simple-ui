// @flow
import React, {
  Fragment,
  Children,
  isValidElement,
  // $FlowFixMe
  useState,
  // $FlowFixMe
  useEffect,
  // $FlowFixMe
  useMemo,
} from 'react'
import type { ChildrenArray, Element } from 'react'
import styled from 'styled-components'
import { useUpdateChildren } from './hooks'
import RootSC from './styles'

const SC = {
  carouselPane: styled(RootSC.listItem)`
    visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
  `,
}

function CarouselIndicators({
  children,
  setActive,
  setPlaying,
}: {
  children: ChildrenArray<Element<typeof CarouselPane>>,
  setActive: Function,
  setPlaying: Function,
}) {
  const carouselIndicators = useMemo(
    () => {
      // Create indicator based in the given children array.
      const indicators = Children.map(children, (child, i) => {
        const isValid = isValidElement(child)
        // If valid.
        if (isValid) {
          return (
            <button
              key={i}
              onClick={() => {
                setActive(i)
                // pause the automated switch
                setPlaying(false)
              }}
            >
              button
            </button>
          )
        }
        // Else.
        throw new TypeError('Value is not valid element.')
      })
      return <div>{indicators}</div>
    },
    [children],
  )
  return carouselIndicators
}

function CarouselControls({
  currentActive,
  slidesLength,
  setPlaying,
  setActive,
}: {
  currentActive: number,
  slidesLength: number,
  setPlaying: Function,
  setActive: Function,
}) {
  // If previous button will be invoked, we gonna decrement the value from 1. If the result will become negative, then we gonna set the currentActive number into last element index number.
  function prevClick() {
    const newActive = (currentActive - 1 + slidesLength) % slidesLength
    // change the current active
    setActive(newActive)
    // pause the automated switch
    setPlaying(false)
  }
  // If next button will be invoked, we gonna increment the value from 1. If the result will become greater than the last element index number, then we gonna set the currentActive number into first element index number.
  function nextClick() {
    const newActive = (currentActive + 1) % slidesLength
    setActive(newActive)
    // pause the automated switch
    setPlaying(false)
  }
  return (
    <div>
      <button onClick={prevClick}>Previous</button>
      <button onClick={() => setPlaying(isPlaying => !isPlaying)}>
        Pause/Play
      </button>
      <button onClick={nextClick}>Next</button>
    </div>
  )
}

CarouselPane.defaultProps = {
  active: false,
}

function CarouselPane({
  children,
  active,
}: {
  children: Element<any>,
  active: boolean,
}): Element<typeof RootSC.listItem> {
  return <SC.carouselPane active={active}>{children}</SC.carouselPane>
}

Carousel.defaultProps = {
  activeIndex: 0,
  autoSwitch: true,
  switchTimeout: 2000,
}

function Carousel({
  children, // The carousel panes.
  activeIndex, // User can choose what active pane should be displayed.
  autoSwitch, // Option to user for auto switch mode.
  switchTimeout, // The timeout used in auto switch mode.
}: {
  children: ChildrenArray<Element<typeof CarouselPane>>,
  activeIndex: number,
  autoSwitch: boolean,
  switchTimeout: number,
}) {
  // count/length of children
  const slidesLength = Children.count(children)
  // State to define Carousel controls.
  const [isPlaying, setPlaying] = useState(autoSwitch)
  const [slides, { currentActive, setActive }] = useUpdateChildren({
    activeIndex,
    children,
  })
  useEffect(
    () => {
      let timeout: any = 0
      // We will have a schedule in updating the active state if only the isPlaying flag is true.
      if (isPlaying) {
        // When this Component gets mounted, schedule to update the active state so that it switch to next pane.
        timeout = setTimeout(() => {
          setActive((currentActive + 1) % slidesLength)
        }, switchTimeout)
      }
      // When the active state is updated via clicking the indicators or using some controls, we need to stop the schedule of updating the state.
      return function cleanup() {
        clearTimeout(timeout)
      }
    },
    [currentActive, isPlaying],
  )
  return (
    <Fragment>
      <CarouselControls
        currentActive={currentActive}
        slidesLength={slidesLength}
        setPlaying={setPlaying}
        setActive={setActive}
      />
      <RootSC.list>{slides}</RootSC.list>
      <CarouselIndicators setActive={setActive} setPlaying={setPlaying}>
        {slides}
      </CarouselIndicators>
    </Fragment>
  )
}

export { Carousel as default, CarouselPane }
