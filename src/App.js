// @flow
// An application which caters the new features of React including hooks, memo, lazy, Suspense, and more...
import React, {
  Fragment,
  // $FlowFixMe
  Suspense,
  // $FlowFixMe
  useState,
  // $FlowFixMe
  useContext,
  // $FlowFixMe
  useEffect,
} from 'react'
import { createPortal } from 'react-dom'
import styled, { createGlobalStyle } from 'styled-components'
import Counter from './Counter'
import Tabs, { TabItem } from './Tabs'
import Carousel, { CarouselPane } from './Carousel'
import RootSC from './styles'
import { AppThemeContext, themeTypes, getStyle } from './theme'

// TODO: Create modal.
// const modalRoot = document.getElementById('modal-root')

// const SC = {
//   modalWrapper: styled.aside`
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     z-index: 10; // This must be at a higher index to the rest of your page content
//     transform: translateZ(0);
//     background-color: #2726269e;
//   `,
//   modalContent: styled.div`
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     padding: 2.5em 1.5em 1.5em 1.5em;
//     background-color: #ffffff;
//     box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.1);
//     overflow-y: auto;
//     -webkit-overflow-scrolling: touch;

//     @media screen and (min-width: 500px) {
//       left: 50%;
//       top: 50%;
//       height: auto;
//       transform: translate(-50%, -50%);
//       max-width: 30em;
//       max-height: calc(100% - 1em);
//     }
//   `,
// }

// function ModalTrigger({ show }: { show: Function }) {
//   return (
//     <div>
//       <button onClick={show} type="button">
//         Show modal
//       </button>
//     </div>
//   )
// }

// function ModalContent({
//   isVisible,
//   close,
// }: {
//   isVisible: boolean,
//   close: Function,
// }) {
//   return isVisible
//     ? createPortal(
//         <SC.modalWrapper id="modal-wrapper" onClick={close}>
//           <SC.modalContent>
//             <button type="button" onClick={close}>
//               Close
//             </button>
//             <p>
//               Pulvinar tempor mollis ultricies nascetur etiam? Accusamus
//               repellendus, convallis mollis vivamus eu! Hymenaeos delectus,
//               necessitatibus voluptatibus ornare ad vero, venenatis laborum a
//               tempore minima eligendi nunc rerum! Porta, ultrices vehicula, nec
//               litora pellentesque culpa neque, aliquam? Elementum nisi lectus
//               lorem. Do class. Accusamus elit consequat vitae porta congue,
//               veniam ligula laoreet praesent? Quod habitasse ante maiores
//               nascetur viverra repudiandae earum, venenatis, viverra
//               praesentium. Vehicula sollicitudin? Morbi! Eius primis! Mi, minim
//               feugiat lobortis conubia cupiditate? Praesent impedit vitae luctus
//               montes pretium elit ut orci dolor habitasse morbi soluta inceptos
//               quo minim doloremque nisi commodo adipisicing ac modi facilisi
//               lorem quam voluptatem.
//             </p>
//           </SC.modalContent>
//         </SC.modalWrapper>,
//         // $FlowFixMe
//         modalRoot,
//       )
//     : null
// }

// // TODO: We need to add logic in closing the Modal via clicking the WrapperModal. But dont close the Modal if the user clicks into ModalContent.
// // TODO: We need to add events for Modal like onOpen and onClose events.
// // TODO: Expose props for end-user.
// // TODO: Check the guidelines - https://assortment.io/posts/accessible-modal-component-react-portals-part-1
// function Modal() {
//   const [isVisible, setVisible] = useState(false)
//   function handleModalTriggerClick(event) {
//     if (event.target.id === 'modal-wrapper') {
//       setVisible(isVisible => !isVisible)
//     }
//   }
//   return (
//     <Fragment>
//       <ModalContent isVisible={isVisible} close={handleModalTriggerClick} />
//       <ModalTrigger show={handleModalTriggerClick} />
//     </Fragment>
//   )
// }
const SC = {
  wrapper: styled.div`
    width: 100%;
    height: 100vh;
    background-color: ${getStyle(['elements', 'appWrapper'])};
  `,
  header: styled.header`
    color: ${getStyle(['elements', 'text'])};
  `,
  main: styled.main`
    margin: 2em 0;
    color: ${getStyle(['elements', 'text'])};
  `,
  toggleThemeButton: styled.button`
    color: ${getStyle(['elements', 'text'])};
  `,
  footer: styled.footer`
    color: ${getStyle(['elements', 'text'])};
  `,
}

// TODO: We gonna build an app which has themes. First feature is to have a light and dark theme. Use button toggle between the themes. Default to Dark theme.
function App() {
  // Toggle theme
  const [themeLabel, setThemeLabel] = useState('Dark')
  const [isDark, setDark] = useState(true)
  // Use to dispatch an action to change the app theme.
  const themeDispatch = useContext(AppThemeContext)
  useEffect(
    () => {
      // Switch to dark theme
      if (isDark) {
        setThemeLabel('Dark')
        return themeDispatch({ type: themeTypes.DARK })
      }
      // Else, switch to light theme.
      setThemeLabel('Light')
      return themeDispatch({ type: themeTypes.LIGHT })
    },
    [isDark],
  )
  function handleClick() {
    setDark(dark => !dark)
  }
  return (
    <SC.wrapper>
      <SC.header>
        <h3 style={{ marginTop: 0 }}>App with themes</h3>
      </SC.header>
      <SC.main>
        <p>Used theme: {themeLabel}</p>
        <SC.toggleThemeButton onClick={handleClick}>
          Toggle theme
        </SC.toggleThemeButton>
      </SC.main>
      <SC.footer>
        <p>Established 2018-2019</p>
      </SC.footer>
    </SC.wrapper>
    // <Suspense fallback={<div>Loading...</div>}>
    //   {/* <RootSC.section>
    //   </RootSC.section> */}
    //   <RootSC.section isHide>
    //     <Modal />
    //   </RootSC.section>
    //   <RootSC.section isHide>
    //     <h3>Carousel</h3>
    //     <Carousel switchTimeout={2000}>
    //       <CarouselPane>
    //         <div>Pane 1</div>
    //       </CarouselPane>
    //       <CarouselPane>
    //         <div>Pane 2</div>
    //       </CarouselPane>
    //       <CarouselPane>
    //         <div>Pane 3</div>
    //       </CarouselPane>
    //     </Carousel>
    //   </RootSC.section>
    //   <RootSC.section isHide>
    //     <h3>Counter</h3>
    //     <Counter />
    //   </RootSC.section>
    //   <RootSC.section isHide>
    //     <h3>Tabs</h3>
    //     <Tabs activeIndex={0}>
    //       <TabItem title="Tab 1">Tab Item 1</TabItem>
    //       <TabItem title="Tab 2">Tab Item 2</TabItem>
    //     </Tabs>
    //   </RootSC.section>
    // </Suspense>
  )
}

export default App
