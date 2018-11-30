// @flow
// An application which caters the new features of React including hooks, memo, lazy, Suspense, and more...
import React, {
  Fragment,
  Children,
  isValidElement,
  // $FlowFixMe
  Suspense,
  // $FlowFixMe
  useMemo,
} from 'react'
import type { ChildrenArray, Element } from 'react'
import styled from 'styled-components'
import Counter from './Counter'
import Tabs, { TabItem } from './Tabs'
import { useActive, useUpdateChildrenByActiveIndex } from './hooks'
import RootSC from './styles'

const SC = {
  section: styled.section`
    margin: 3em;
    display: ${({ isHide }) => (isHide ? 'none' : 'block')};
  `,
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

function Carousel({
  activeIndex,
  children,
}: {
  children: ChildrenArray<Element<typeof CarouselPane>>,
  activeIndex: number,
}) {
  const [active, setActive] = useActive(activeIndex)
  const updatedChildren = useUpdateChildrenByActiveIndex(children, active)
  // TODO: We need to add styles and animation for our Carousel including indicators.
  return (
    <Fragment>
      <RootSC.list>{updatedChildren}</RootSC.list>
      <CarouselIndicators setActive={setActive}>
        {updatedChildren}
      </CarouselIndicators>
    </Fragment>
  )
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SC.section>
        <h3>Carousel</h3>
        <Carousel>
          <CarouselPane>
            <div>Pane 1</div>
          </CarouselPane>
          <CarouselPane>
            <div>Pane 2</div>
          </CarouselPane>
          <CarouselPane>
            <div>Pane 3</div>
          </CarouselPane>
        </Carousel>
      </SC.section>
      <SC.section isHide>
        <h3>Counter</h3>
        <Counter />
      </SC.section>
      <SC.section isHide>
        <h3>Tabs</h3>
        <Tabs activeIndex={0}>
          <TabItem title="Tab 1">Tab Item 1</TabItem>
          <TabItem title="Tab 2">Tab Item 2</TabItem>
        </Tabs>
      </SC.section>
    </Suspense>
  )
}

export default App
