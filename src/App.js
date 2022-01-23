import { ChakraProvider, Container, Heading } from '@chakra-ui/react'
import Layout from "./layouts/Layout";
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import theme from './theme';
import './App.css'

function App() {
  return (
      <ChakraProvider theme={theme}>
        <Container className="App" m={0} p={0} minWidth={'100vw'} minHeight={'100vh'}>
      <Layout
            header={<Heading pl={'8'} pt={'6'} size={'lg'}>Simple Address</Heading>}
            main={<Home />}
            sidebar={<Sidebar></Sidebar>}
            sidebarHeader={<Heading pl={'8'} pt={'8'} size={'sm'}>No wallet connected</Heading>}
        />
                </Container>
      </ChakraProvider>
  );
}

export default App;
