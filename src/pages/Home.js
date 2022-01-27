import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Button,
  Center,
  Text,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import Card from "../components/Card";
import theme from "../theme";
import UserActionMenu from "../components/UserActionMenu";
import Header from "../components/Header";
import FingerPoint from "../assets/images/FingerPoint.png";
import HandShare from "../assets/images/HandShare.png";
import StarHead from "../assets/images/StarHead.png";
import Woman from "../assets/images/woman.png";
import WalletOne from "../assets/images/wallet_1.png";
import WalletTwo from "../assets/images/wallet_2.png";
import WalletThree from "../assets/images/wallet_3.png";
import WalletFour from "../assets/images/wallet_4.png";
import WalletFive from "../assets/images/wallet_5.png";
import Swirl from "../assets/images/swirl.png";

// For the wallet
import { ethers } from "ethers";
import SimpleAddressCore from "../abis/SimpleAddressCore.json";
import ContractAddress from "../abis/contract-address.json";  // keeps last deploied address

function Home() {

  // storing address in local state
  const [address, setAddressValue] = useState();  // researved to eth_requestAccounts
  const [subAddress, setsubAddressValue] = useState();
  const [metaName, setMetaNameValue] = useState();
  const [searchAddress, setSearchAddressValue] = useState();  // used for user input
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    ContractAddress.SimpleAddressCore,
    SimpleAddressCore.abi,
    signer
  );

  // request access to the user's metamask account
  async function requestAccount() {
    const [_address] = await window.ethereum.request({
      method: "eth_requestAccounts", });
    setAddressValue(address);
    // console.log("address is: "+ address);
    // return address;
  }
  
  // call the smart contract, send an update
  async function registerAddress() {
    if (!metaName) return;
    if (typeof window.ethereum !== "undefined") {
      console.log("meta name is: "+ metaName);
      requestAccount();
      const transaction = await contract.registerAddress(metaName);
      await transaction.wait();
      console.log(transaction);
      localStorage.setItem(metaName, transaction);
    }
  }

  //Takes in the address and returns the name
  async function findByMeta() {
    if (typeof window.ethereum !== "undefined") {
      requestAccount();
      const _metaName = await contract.findByMeta(searchAddress);
      console.log("The meta name is " + _metaName);
    }
  }

  //Takes in the meta name (inputted) to retrieve the address
  async function findByName() {
    if (typeof window.ethereum !== "undefined") {
      const _metaAddress = await contract.findByName(metaName);
      console.log("The address for this metaname is " + _metaAddress);
    }
  }

  async function revoke() {
    if (typeof window.ethereum !== "undefined") {
      requestAccount();
      const tx = await contract.revoke(searchAddress, subAddress);
      console.log(
        "You have revoked the sub address " +
          subAddress +
          " to the meta address " +
          address
      );
    }
  }

  async function getAggregateEther() {
    if (typeof window.ethereum !== "undefined") {
      requestAccount();
      const aggregatedEther = await contract.getAggregateEther(metaName);
      console.log(
        "The aggregated ether for this account is " + aggregatedEther
      );
    }
  }

  async function approve() {
    if (typeof window.ethereum !== "undefined") {
      requestAccount();
      const tx = await contract.approve(searchAddress, subAddress);
      console.log(
        "You have approved the sub address " +
          subAddress +
          " to the meta address " +
          address
      );
    }
  }

  return (
    <Box>
      <Container
        p={0}
        m={0}
        height={"100vh"}
        minWidth="100%"
        flex="1"
        bgColor={theme.colors.primary}
        overflowY={["scroll", "scroll", "hidden", "hidden"]}
      >
        <Flex p={10} style={{ height: "100%" }} flexDirection="column">
          <Flex gap={10} flexDirection="row" alignItems="center">
            <Box flex="2">
              <Header />
            </Box>

            <Box flex="1">
              <UserActionMenu />
            </Box>
          </Flex>
          <Flex
            flex="1.5"
            flexGrow={"1"}
            px={5}
            gap={3}
            flexDirection={["column", "column", "column", "row"]}
            alignItems="center"
            justifyContent="space-around"
          >
            <Card chakraProps={{ height: "80%", flex: "2", minHeight: 200 }}>
              <Flex
                height="100%"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-evenly"
              >
                <Text fontWeight="semibold" fontSize={40} width="200px">
                  The last address you'll ever need
                </Text>

                <Box display={["none", "none", "none", "flex"]}>
                  <img src={Woman} width={250} height={250} />
                </Box>

                <Box display={["none", "none", "none", "flex"]}>
                  <img src={Swirl} width={250} height={250} />
                </Box>

                {/*<Box width='33.3%' height='100%'>
                            <Center position='relative' height='100%' width='100%'>
                                <img src={Swirl} width={200} height={200} />
                                <img src={WalletOne} width={50} height={50} style={{position: 'absolute', top: 200, right: 220}} />
                                <img src={WalletTwo} width={50} height={50} style={{position: 'absolute', bottom: 200, right: 250}} />
                                <img src={WalletThree} width={50} height={50} style={{position: 'absolute', top: 200, left: 220}} />
                                <img src={WalletFour} width={50} height={50} style={{position: 'absolute', bottom: 200, left: 250}} />
                                <img src={WalletFive} width={50} height={50} style={{position: 'absolute', bottom: 235, left: 150}} />
                            </Center>
                    </Box>*/}
              </Flex>
            </Card>

            <Card
              chakraProps={{
                boxShadow: "xl",
                height: "80%",
                flex: "1",
                minHeight: 200,
              }}
            >
              <Center
                height="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Button
                  onClick={registerAddress}
                  variant="solid"
                  color={theme.colors.primary}
                  bgColor={theme.colors.black}
                >
                  Connect your simple address
                </Button>
                <br></br>
                <div>
                  <input
                    onChange={(e) => setMetaNameValue(e.target.value)}
                    placeholder="Meta Name"
                    style={{
                      backgroundColor: "lightblue",
                      height: "30px",
                      marginLeft: "10px",
                    }}
                  />
                </div>
                <br></br>
                <Button
                  onClick={findByName}
                  variant="solid"
                  color={theme.colors.primary}
                  bgColor={theme.colors.black}
                >
                  Console log the meta address by inputting meta name
                </Button>
                <br></br>
                <input
                  onChange={(e) => {
                    setMetaNameValue(e.target.value) 
                    setSearchAddressValue(e.target.value)} 
                  }
                  placeholder="Meta Name or Meta Address to Search"
                  style={{
                    backgroundColor: "lightblue",
                    height: "30px",
                    marginLeft: "10px",
                  }}
                />
                <br></br>
                <Button
                  onClick={findByMeta}
                  variant="solid"
                  color={theme.colors.primary}
                  bgColor={theme.colors.black}
                >
                  Console log the meta name by inputting meta address 
                </Button>
                <br></br>
                <Button
                  onClick={approve}
                  variant="solid"
                  color={theme.colors.primary}
                  bgColor={theme.colors.black}
                >
                  Add a new address to your meta-address
                </Button>
                <br></br>
                <div>
                  <input
                    onChange={(e) => setSearchAddressValue(e.target.value)}
                    placeholder="Meta Address"
                    style={{
                      backgroundColor: "lightblue",
                      height: "30px",
                      marginLeft: "10px",
                    }}
                  />
                  <br></br>
                  <input
                    onChange={(e) => setsubAddressValue(e.target.value)}
                    placeholder="Sub Address"
                    style={{
                      backgroundColor: "lightblue",
                      height: "30px",
                      marginLeft: "10px",
                    }}
                  />
                  <br></br>
                  <br></br>
                  <Button
                    onClick={revoke}
                    variant="solid"
                    color={theme.colors.primary}
                    bgColor={theme.colors.black}
                  >
                    Disconnect your address from the meta name
                  </Button>
                  <br></br>
                  <div>
                    <br></br>
                    <input
                      onChange={(e) => setSearchAddressValue(e.target.value)}
                      placeholder="Meta Address"
                      style={{
                        backgroundColor: "lightblue",
                        height: "30px",
                        marginLeft: "10px",
                      }}
                    />
                    <br></br>
                    <input
                      onChange={(e) => setsubAddressValue(e.target.value)}
                      placeholder="Sub Address"
                      style={{
                        backgroundColor: "lightblue",
                        height: "30px",
                        marginLeft: "10px",
                      }}
                    />
                    <br></br>
                    <Button
                      onClick={getAggregateEther}
                      variant="solid"
                      color={theme.colors.primary}
                      bgColor={theme.colors.black}
                    >
                      Enter meta name below and Console log the aggregated ether
                      for this account
                    </Button>
                    <input
                      onChange={(e) => setMetaNameValue(e.target.value)}
                      placeholder="Meta Name"
                      style={{
                        backgroundColor: "lightblue",
                        height: "30px",
                        marginLeft: "10px",
                      }}
                    />
                  </div>
                </div>
                <br></br>
              </Center>
            </Card>
          </Flex>

          <Flex
            flex="1"
            px={5}
            gap={3}
            flexDirection={["column", "column", "column", "row"]}
            alignItems="center"
            justifyContent="space-evenly"
          >
            <Card
              chakraProps={{
                height: "80%",
                width: "90%",
                p: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: 250,
              }}
            >
              <Text fontSize={20} fontWeight="semibold" textAlign="center">
                Maintain all your wallets in one spot
              </Text>

              <Center height="100%">
                <img src={FingerPoint} width={50} height={50} />
              </Center>
            </Card>

            <Card
              chakraProps={{
                height: "80%",
                width: "90%",
                p: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: 250,
              }}
            >
              <Text fontSize={20} fontWeight="semibold" textAlign="center">
                Only share one address to showcase your assets
              </Text>

              <Center height="100%">
                <img src={HandShare} width={120} height={120} />
              </Center>
            </Card>

            <Card
              chakraProps={{
                height: "80%",
                width: "90%",
                p: 8,
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                alignItems: "center",
                minHeight: 250,
              }}
            >
              <Text fontSize={20} fontWeight="semibold" textAlign="center">
                Build your reputation and extend it across your addresses
              </Text>

              <Center height="100%" flex="1">
                <img src={StarHead} width={120} height={120} />
              </Center>
            </Card>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

export default Home;
