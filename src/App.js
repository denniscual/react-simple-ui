// @flow
// An application which caters the new features of React including hooks, memo, lazy, Suspense, and more...
import React, {
  // $FlowFixMe
  Suspense,
} from 'react'
import styled from 'styled-components'
import Counter from './Counter'
import Tabs, { TabItem } from './Tabs'

const SC = {
  section: styled.section`
    margin: 3em;
    display: ${({ isHide }) => (isHide ? 'none' : 'block')};
  `,
}

function App() {
  function onTabChange() {
    console.log('on tab change')
  }
  return (
    // <Counter />
    <Suspense fallback={<div>Loading...</div>}>
      <SC.section isHide>
        <h3>Counter</h3>
        <Counter />
      </SC.section>
      <SC.section>
        <h3>Tabs</h3>
        <Tabs activeIndex={0} onTabChange={onTabChange}>
          <TabItem title="Tab 1">Tab Item 1</TabItem>
          <TabItem title="Tab 2">Tab Item 2</TabItem>
        </Tabs>
      </SC.section>
    </Suspense>
  )
}

export default App
