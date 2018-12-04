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
}: {
  children: ChildrenArray<Element<typeof CarouselPane>>,
  setActive: Function,
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

// Controls for carousel. E.g, ability to play or pause the auto-switching.
// TODO: Add previous and next buttons to navigate to different panes.
function CarouselControls({ setPlaying }: { setPlaying: Function }) {
  // TODO: Click handler should be cached. Use `useCallback` hook.
  return (
    <div>
      <button onClick={() => setPlaying(isPlaying => !isPlaying)}>
        Pause/Play
      </button>
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
}

// TODO: We need to add styles and animation for our Carousel including indicators.
// TODO: Add controls like indicators to go to the next pane, go to previous pane and play/pause that auto-switching.
function Carousel({
  activeIndex,
  children,
}: {
  children: ChildrenArray<Element<typeof CarouselPane>>,
  activeIndex: number,
}) {
  // State to define Carousel controls.
  const [isPlaying, setPlaying] = useState(true)
  // TODO: I think it is good to encapsulates/group this 2 next statements into 1 hook because they change together.
  const [active, setActive] = useActive(activeIndex)
  const updatedChildren = useUpdateChildrenByActiveIndex(children, active)
  useEffect(
    () => {
      let timeout: any = 0
      // We will have a schedule in updating the active state if only the isPlaying flag is true.
      if (isPlaying) {
        // When this Component gets mounted, schedule to update the active state so that it switch to next pane.
        timeout = setTimeout(() => {
          // Result of increment of active by 1.
          const incrementActive = active + 1
          // Get the last element index of updatedChildren []
          const lastElementIndex = updatedChildren.length - 1
          // If incrementActive is greater than the lastElementIndex then active should be assigned to 0 to go back in to first panel. Else, keep going.
          const resultActive =
            incrementActive > lastElementIndex ? 0 : incrementActive
          setActive(resultActive)
        }, 2000)
      }
      // When the active state is updated via clicking the indicators or using some controls, we need to stop the schedule of updating the state.
      return function cleanup() {
        clearTimeout(timeout)
      }
    },
    [active, isPlaying],
  )
  return (
    <Fragment>
      <RootSC.list>{updatedChildren}</RootSC.list>
      <CarouselControls setPlaying={setPlaying} />
      <CarouselIndicators setActive={setActive}>
        {updatedChildren}
      </CarouselIndicators>
    </Fragment>
  )
}

export { Carousel as default, CarouselPane }
