// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import AppTheme, { GlobalStyle } from './theme'
import * as serviceWorker from './serviceWorker'

// --------- For Providers -----------//
// ----------------------------------//
function Root() {
  return (
    <AppTheme>
      <React.Fragment>
        <GlobalStyle />
        <App />
      </React.Fragment>
    </AppTheme>
  )
}

ReactDOM.render(<Root />, window.document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
