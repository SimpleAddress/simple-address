import {
  ChakraProvider,
  Flex,
  Center,
  Box,
  Container,
  Heading,
} from "@chakra-ui/react";
import Layout from "./layouts/Layout";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import theme from "./theme";
import "./App.css";
import WalletAdmin from "./pages/WalletAdmin";
import WalletDetails from "./pages/WalletDetails";
import Home from "./pages/Home";
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/store";


function App() {

  return (
    <ChakraProvider theme={theme}>
      <ReduxProvider store={store}>
        <BrowserRouter>
          <Flex className="App" direction={"row"} height={"100vh"}>
            <Center
              element={Center}
              bgColor={theme.colors.primary}
              minHeight={"100vh"}
              display={["none", "none", "none", "flex"]}
            >
              <Sidebar />
            </Center>
            <Box flex="1">
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/details" element={<WalletDetails />} />
                <Route exact path="/admin" element={<WalletAdmin />} />
              </Routes>
            </Box>
          </Flex>
        </BrowserRouter>
      </ReduxProvider>
    </ChakraProvider>
  );
}

export default App;
