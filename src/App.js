import { ChakraProvider, Flex, Box, Container, Heading } from '@chakra-ui/react'
import Layout from "./layouts/Layout";
import Sidebar from './components/Sidebar';
import { BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import theme from './theme';
import './App.css'
import WalletAdmin from './pages/WalletAdmin';
import WalletDetails from './pages/WalletDetails';
import Home from './pages/Home';

import { useLocation } from "react-router-dom"

function App() {
  return (
      <ChakraProvider theme={theme}>
            <BrowserRouter>
          <Flex className='App' direction={'row'} height={'100vh'}>
      <Box
        bgColor={theme.colors.primary}
        minHeight={'100vh'}
        display={['none', 'none', 'none', 'flex']}
      >
                    <Sidebar />
      </Box>
      <Box flex="1">
      <Routes>
              <Route exact path='/' element={<Home />} />
              <Route exact path='/details' element={<WalletDetails />} />
              <Route exact path='/admin' element={<WalletAdmin />} />
            </Routes>
      </Box>
    </Flex>

        </BrowserRouter>
      </ChakraProvider>
  );
}

export default App;
