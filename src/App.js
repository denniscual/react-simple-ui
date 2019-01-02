// @flow
// An application which caters the new features of React including hooks, memo, lazy, Suspense, and more...
import React, {
  Fragment,
  // $FlowFixMe
  Suspense,
  // $FlowFixMe
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import Counter from './Counter'
import Tabs, { TabItem } from './Tabs'
import Carousel, { CarouselPane } from './Carousel'
import RootSC from './styles'

// TODO: Create modal.
const modalRoot = document.getElementById('modal-root')

const SC = {
  modalWrapper: styled.aside`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10; // This must be at a higher index to the rest of your page content
    transform: translateZ(0);
    background-color: #2726269e;
  `,
  modalContent: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 2.5em 1.5em 1.5em 1.5em;
    background-color: #ffffff;
    box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    @media screen and (min-width: 500px) {
      left: 50%;
      top: 50%;
      height: auto;
      transform: translate(-50%, -50%);
      max-width: 30em;
      max-height: calc(100% - 1em);
    }
  `,
}

function ModalTrigger({ show }: { show: Function }) {
  return (
    <div>
      <button onClick={show} type="button">
        Show modal
      </button>
    </div>
  )
}

// TODO: We need to add logic in closing the Modal via clicking the WrapperModal. But dont close the Modal if the user clicks into ModalContent.
function ModalContent({
  isVisible,
  close,
}: {
  isVisible: boolean,
  close: Function,
}) {
  return isVisible
    ? createPortal(
        <SC.modalWrapper id="modal-wrapper" onClick={close}>
          <SC.modalContent>
            <button type="button" onClick={close}>
              Close
            </button>
            <p>
              Pulvinar tempor mollis ultricies nascetur etiam? Accusamus
              repellendus, convallis mollis vivamus eu! Hymenaeos delectus,
              necessitatibus voluptatibus ornare ad vero, venenatis laborum a
              tempore minima eligendi nunc rerum! Porta, ultrices vehicula, nec
              litora pellentesque culpa neque, aliquam? Elementum nisi lectus
              lorem. Do class. Accusamus elit consequat vitae porta congue,
              veniam ligula laoreet praesent? Quod habitasse ante maiores
              nascetur viverra repudiandae earum, venenatis, viverra
              praesentium. Vehicula sollicitudin? Morbi! Eius primis! Mi, minim
              feugiat lobortis conubia cupiditate? Praesent impedit vitae luctus
              montes pretium elit ut orci dolor habitasse morbi soluta inceptos
              quo minim doloremque nisi commodo adipisicing ac modi facilisi
              lorem quam voluptatem.
            </p>
          </SC.modalContent>
        </SC.modalWrapper>,
        // $FlowFixMe
        modalRoot,
      )
    : null
}

// TODO: We need to add events for Modal like onOpen and onClose events.
function Modal() {
  const [isVisible, setVisible] = useState(false)
  function handleModalTriggerClick(event) {
    if (event.target.id === 'modal-wrapper') {
      setVisible(isVisible => !isVisible)
    }
  }
  return (
    <Fragment>
      <ModalContent isVisible={isVisible} close={handleModalTriggerClick} />
      <ModalTrigger show={handleModalTriggerClick} />
    </Fragment>
  )
}

// TODO: Create a state management library which is built on top of xstate and React hooks.
// TODO: Instead of using xstate to provide the statechart, what we gonna do is to create our own statechart based in hooks and xstate.

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RootSC.section>
        <Modal />
      </RootSC.section>
      <RootSC.section isHide>
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
      <RootSC.section isHide>
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
