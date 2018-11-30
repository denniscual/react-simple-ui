// @flow
// An application which caters the new features of React including hooks, memo, lazy, Suspense, and more...
import React, {
  // $FlowFixMe
  Suspense,
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

function CarouselPane({
  children,
}: {
  children: Element<any>,
}): Element<typeof RootSC.listItem> {
  return <RootSC.listItem>{children}</RootSC.listItem>
}

Carousel.defaultProps = {
  activeIndex: 5,
}

// TODO: Try to create a hook which abstract the generic logic of creating tabs and carousel. Use the custom hooks which we just defined.
function Carousel({
  activeIndex,
  children,
}: {
  children: ChildrenArray<Element<typeof CarouselPane>>,
  activeIndex: number,
}) {
  const [active, setActive] = useActive(activeIndex)
  const updatedChildren = useUpdateChildrenByActiveIndex(children, active)
  return <RootSC.list>{updatedChildren}</RootSC.list>
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
