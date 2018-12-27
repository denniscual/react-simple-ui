// @flow
// An application which caters the new features of React including hooks, memo, lazy, Suspense, and more...
import React, {
  // $FlowFixMe
  Suspense,
} from 'react'
import { compose, curry, toUpper, prop } from 'ramda'
import Counter from './Counter'
import Tabs, { TabItem } from './Tabs'
import Carousel, { CarouselPane } from './Carousel'
import RootSC from './styles'

// TODO: Create a state management library which is built on top of xstate and React hooks.
// TODO: Instead of using xstate to provide the statechart, what we gonna do is to create our own statechart based in hooks and xstate.

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RootSC.section>
        <h3>Carousel</h3>
        <Carousel switchTimeout={2000}>
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
      </RootSC.section>
      <RootSC.section isHide>
        <h3>Counter</h3>
        <Counter />
      </RootSC.section>
      <RootSC.section>
        <h3>Tabs</h3>
        <Tabs activeIndex={0}>
          <TabItem title="Tab 1">Tab Item 1</TabItem>
          <TabItem title="Tab 2">Tab Item 2</TabItem>
        </Tabs>
      </RootSC.section>
    </Suspense>
  )
}

export default App
