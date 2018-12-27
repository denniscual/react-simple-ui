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
import { useActive, useUpdateChildrenByActiveIndex } from './hooks'
import RootSC from './styles'

const SC = {
  carouselPane: styled(RootSC.listItem)`
    visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
  `,
}

// TODO: Create a Carousel Component.
// It holds a Panes, handle the content/information, like in Tabs. But one of the difference between this 2 components
// is that in Carousel, the Panes are automatically switch but in Tabs no. It also has a controls so that user can
// control what CarouselPane he/she wants to view.
// Basic features:
// - It should have panes which hold a specific content.
// - Automatically switching mode of panes. The switch should be in sequence. Provide a user an option
//   if he/she wants to have a auto switch mode or disable it.
// - Provide controls where the user can choose what pane he/she wants to view.

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
  // TODO: Add definition for this navigator updaters.
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
  // State to define Carousel controls.
  const [isPlaying, setPlaying] = useState(autoSwitch)
  // TODO: I think it is good to encapsulates/group this 2 next statements into 1 hook because they change together.
  const [currentActive, setActive] = useActive(activeIndex)
  const slides = useUpdateChildrenByActiveIndex(children, currentActive)
  // count/length of children
  const slidesLength = Children.count(children)
  useEffect(
    () => {
      let timeout: any = 0
      // We will have a schedule in updating the active state if only the isPlaying flag is true.
      if (isPlaying) {
        // When this Component gets mounted, schedule to update the active state so that it switch to next pane.
        timeout = setTimeout(() => {
          // Result of increment of active by 1.
          const incrementActive = currentActive + 1
          // Get the last element index of slides []
          const lastElementIndex = slides.length - 1
          // If incrementActive is greater than the lastElementIndex then active should be assigned to 0 to go back in to first panel. Else, keep going.
          const resultActive =
            incrementActive > lastElementIndex ? 0 : incrementActive
          setActive(resultActive)
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
