import { extendTheme } from "@chakra-ui/react"

export default extendTheme({
  textStyles: {
    h1: {
      fontSize: '36px',
      fontWeight: 'extrabold',
      letterSpacing: 'auto',
    },
    h2: {
      fontSize: '18px',
      fontWeight: 'bold',
      letterSpacing: 'auto',
    },
    h3: {
      fontSize: '16px',
      fontWeight: 'bold',
      letterSpacing: 'auto',
    },
    body1: {
      fontSize: '16px',
      fontWeight: 'normal',
      letterSpacing: 'auto',
    },
  },
    colors: {
      transparent: 'transparent',
      primary: '#7FC9E0',
      secondary: '#000',
      white: '#fff'
    },
  })