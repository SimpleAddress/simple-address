import { extendTheme } from "@chakra-ui/react"

export default extendTheme({
  textStyles: {
    h1: {
      fontSize: '32px',
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
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
      grey: '#808080',
      white: '#FFFFFF',
      black:'#000000',
      connectedGreen: '#008000',
      editableGreen: '#60D060',
    },
  })