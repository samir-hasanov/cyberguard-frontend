import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  },
  fonts: {
    heading: 'Segoe UI, system-ui, sans-serif',
    body: 'Segoe UI, system-ui, sans-serif'
  },
  styles: {
    global: {
      body: {
        bg: '#0b1220',
        color: '#e5e7eb'
      }
    }
  },
  colors: {
    soc: {
      50: '#e0fbff',
      500: '#22d3ee',
      700: '#0e7490'
    }
  }
})

export default theme
