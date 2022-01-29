import {
  ChakraProvider,
  Flex,
  Center,
  Box
} from "@chakra-ui/react";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import theme from "./theme";
import "./App.css";
import Dapp from "./pages/Dapp";
import Home from "./pages/Home";
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/store";
import WalletDetails from './pages/WalletDetails'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ReduxProvider store={store}>
        <BrowserRouter>
          <Flex className="App" direction={"row"} height={"100vh"}>
            <Center
              bgColor={theme.colors.white}
              minHeight={"100vh"}
              display={["none", "none", "none", "flex"]}
            >
              <Sidebar />
            </Center>
            <Box flex="1">
              <Routes>
                <Route exact path="/" element={<Home />} />
                 <Route exact path="/details" element={<WalletDetails />} />
                <Route exact path="/dapp" element={<Dapp />} />
              </Routes>
            </Box>
          </Flex>
        </BrowserRouter>
      </ReduxProvider>
    </ChakraProvider>
  );
}

export default App;
