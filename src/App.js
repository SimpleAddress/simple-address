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
import Dapp from "./pages/Dapp";
import Home from "./pages/Home";
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/store";

//Wallet logic
import { useState } from "react";
import { ethers } from "ethers";
import SimpleAddressCore from "./abis/SimpleAddressCore.json";
import SimpleAddress from "./pages/SimpleAddress";


// const simpleAddressCoreAddress = "0x697783cc3eeFC8FD4F49b382fc9f5F8348d85D97"; // ROPSTEN
//const simpleAddressCoreAddress = "0xE0033560227148caE17B078B309730e624b99F14"; // RINKEBY

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ReduxProvider store={store}>
        <BrowserRouter>
          <Flex className="App" direction={"row"} height={"100vh"}>
            <Center
              bgColor={theme.colors.primary}
              minHeight={"100vh"}
              display={["none", "none", "none", "flex"]}
            >
              <Sidebar />
            </Center>
            <Box flex="1">
              <Routes>
                <Route exact path="/" element={<Home />} />
                {/* <Route exact path="/details" element={<WalletDetails />} /> */}
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
