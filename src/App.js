import { ChakraProvider, Container, Heading } from '@chakra-ui/react'
import Layout from "./layouts/Layout";
import Sidebar from './components/Sidebar';
import { BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import theme from './theme';
import './App.css'
import WalletAdmin from './pages/WalletAdmin';
import WalletDetails from './pages/WalletDetails';

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Container 
        className="App" 
        m={0} 
        p={0} 
        minWidth='100vw'
        minHeight='100vh'>
          <Layout
          main={
            <Routes>
              <Route exact path='/' element={<WalletAdmin />} />
              <Route exact path='/details' element={<WalletDetails />} />
              <Route exact path='/admin' element={<WalletAdmin />} />
            </Routes>
          }
          sidebar={<Sidebar />}
        />
        </Container>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
