import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, Heading } from '@chakra-ui/react'
import Layout from "./layouts/Layout";
import Home from './pages/Home';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider>
      <Layout
            header={<Heading pl={'8'} pt={'6'} size={'lg'}>Simple Address</Heading>}
            main={<Home />}
            sidebar={<Sidebar></Sidebar>}
            sidebarHeader={<Heading pl={'8'} pt={'8'} size={'sm'}>No wallet connected</Heading>}
        />
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
