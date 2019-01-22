import React, {
  createContext,
  // $FlowFixMe
  useReducer,
} from 'react'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { type, path, compose } from 'ramda'
import type { Element } from 'react'

// --------- For Styles --------------//
// ----------------------------------//
const themeTypes = {
  LIGHT: 'THEME_LIGHT',
  DARK: 'THEME_DARK',
}

// Construct theme
type Theme = {
  elements: {
    appWrapper: string,
    text: string,
  },
  colors: Object,
  mixins: Object,
}
const colors = {
  black: '#191818',
  white: '#ffffff',
}
const mixins = {
  /** Define here the mixins... */
}

// All the themes
const themes = {
  [themeTypes.DARK]: {
    appWrapper: colors.black,
    text: colors.white,
  },
  [themeTypes.LIGHT]: {
    appWrapper: '#fbfbfb',
    text: colors.black,
  },
}

function getTheme(themeType: string, addedColors?: Object): Theme {
  return {
    elements: themes[themeType],
    colors: {
      ...colors, // Add the default colors.
      ...addedColors, // Merge the added colors.
    },
    mixins,
  }
}

// App theme Reducer - use for switching the theme.
type Action = {
  type: string,
}
const initAppTheme = {
  elements: themes[themeTypes.DARK],
  colors,
  mixins,
}
function appThemeReducer(state: Theme, action: Action): Theme {
  const { type } = action
  switch (type) {
    case themeTypes.LIGHT: {
      const addedColors = {
        accent: '#d23669',
      }
      return getTheme(themeTypes.LIGHT, addedColors)
    }
    default: {
      const addedColors = {
        accent: '#ffa7c4',
      }
      return getTheme(themeTypes.DARK, addedColors)
    }
  }
}

const AppThemeContext = createContext()
function AppTheme({ children }: { children: Element<any> }) {
  const [theme, dispatch] = useReducer(appThemeReducer, initAppTheme)
  return (
    <AppThemeContext.Provider value={dispatch}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppThemeContext.Provider>
  )
}

// Add global styles.
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
  body, h1,h2,h3,h4,h5,h6,p,span,div {
    font-family: sans-serif;
  }
`

// Style helpers.
// Creating css attribute with specified attr and value.
const createAttr = attr => value => `${attr}: ${value}`

/**
 * getStyle :: (Array | String, String?) => Object => String
 *
 * A function for getting the value from the theme prop based on the keys. Keys could
 * either be String or Array. Attribute is optional. If given, we gonna create
 * css attribute with value.
 */
function getStyle(keys: Array<string> | string, attr?: string) {
  return function getProps({ theme }: { theme: Theme }) {
    // If there is specificed attr.
    if (attr) {
      const addAttr = createAttr(attr)
      // Handle if the keys is string
      if (type(keys) === 'String') {
        return addAttr(theme[keys])
      }
      // Handle if the keys is array.
      return compose(
        addAttr,
        path(keys),
      )(theme)
    }
    // Handle if no attr.
    if (type(keys) === 'String') {
      return theme[keys]
    }
    // Handle if the keys is array.
    return path(keys, theme)
  }
}

export {
  AppTheme as default,
  AppThemeContext,
  GlobalStyle,
  themeTypes,
  getStyle,
}
