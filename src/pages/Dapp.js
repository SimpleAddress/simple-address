import React, { useEffect, useRef, useState } from "react";

import {
  Container,
  Flex,
  Box,
  Text,
  Select,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Center,
} from "@chakra-ui/react";

import Icon from "../components/Icon";
import AddressDisplay from "../components/AddressDisplay";
import AssetsByTimeChart from "../components/BasicLineChart";
import ConnectedIndicator from "../components/ConnectedIndicator";

import { ethers } from "ethers";

import { useNavigate } from "react-router-dom";
import { MdOutlineSearch } from "react-icons/md";
import Illustration from "../assets/images/Illustration.png";
import theme from "../theme";
import Card from "../components/Card";
import { useDispatch } from "react-redux";
import { storeMetaAddress } from "../redux/SimpleAddressActions";

import LoadingModal from "../components/LoadingModal";

// smart contract
import SimpleAddressCore from "../abis/SimpleAddressCore.json";
import ContractAddress from "../abis/contract-address.json"; // keeps last deploied address
import { getContract } from "../utils/common.js";

import { NULL_ADDRESS } from "../utils/constant";

const initialData = [
  {
    name: "Jan",
    balance: 0,
  },
];

function DApp() {
  const contract = getContract(
    ContractAddress.SimpleAddressCore,
    SimpleAddressCore
  );

  const ref = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [primaryMetaName, setPrimaryMetaName] = useState(NULL_ADDRESS);

  const [searchMetaName, setSearchMetaName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [walletsAttached, setWalletsAttached] = useState(0);
  const [listWalletsAttached, setListWalletsAttached] = useState(0);
  const [ethEarned, setEthEarned] = useState(0);

  const [nameToRegister, setNameToRegister] = useState("");
  const [subAccountToRegister, setSubAccountToRegister] = useState("");
  const [isRegisteringSimpleName, setIsRegisteringSimpleName] = useState(false);
  const [isApprovingSubAccount, setIsApprovingSubAccount] = useState(false);

  const [graphData, setGraphData] = useState(initialData);
  const [refresh, setRefresh] = useState(false);

  const [address, setAddressValue] = useState(NULL_ADDRESS); // reserved to eth_requestAccounts

  const [isConnected, setIsConnectedValue] = useState(false);

  // call the smart contract, send an update
  async function registerAddress() {
    if (typeof window.ethereum !== "undefined") {
      setRefresh(false);
      setIsRegisteringSimpleName(true);

      try {
        const transaction = await contract.registerAddress(nameToRegister);
        await transaction.wait();
      } catch (error) {
        //TODO: Show dialog
        setIsRegisteringSimpleName(false);
        setRefresh(true);
        console.log(error);
        return;
      }

      setIsRegisteringSimpleName(false);
      setRefresh(true);
      setNameToRegister("");
    }
  }

  // request access to the user's metamask account
  async function requestAccount() {
    const _address = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAddressValue(_address[0]);
    const isConn = await window.ethereum.isConnected();
    if (_address.length > 0) {
      findByMeta();
      setIsConnectedValue(true);
    } else {
      setIsConnectedValue(false);
    }
  }

  window.ethereum.on("accountsChanged", function (accounts) {
    // Time to reload your interface with accounts[0]!
    if (accounts.length > 0) {
      requestAccount();
    } else {
      setAddressValue(NULL_ADDRESS);
      setIsConnectedValue(false);
    }
  });
  //Shreyase Additions End

  //Takes in the address and returns the name
  async function findByMeta() {
    if (typeof window.ethereum !== "undefined") {
      const metaName = await contract.findByMeta(address);
      setPrimaryMetaName(metaName);
    }
  }

  const onNavigateAddressSettings = (address) => {
    if (address === NULL_ADDRESS) return;
    navigate(`/details/${address}`);
  };

  const renderPersonalDisplay = () => {
    if (address == NULL_ADDRESS) {
      //if not connected
      return (
        <Box flex="1" height="100%">
          <Center height="100%">
            <Box bgColor="#f7f7fa" p={10} rounded="lg">
              <Text fontWeight="medium" py={5}>
                Welcome to Simple Address. Connect a wallet or search for an
                address.
              </Text>
              <Button
                onClick={requestAccount}
                p={8}
                width="full"
                boxShadow="md"
                bgColor="#039BE5"
                color='#fff'
              >
                Connect a wallet
              </Button>
            </Box>
          </Center>
        </Box>
      );
    } else if (address != NULL_ADDRESS && primaryMetaName == NULL_ADDRESS) {
      //if only user address and no meta address it must be sub acount or new user

      return (
        <Flex direction="column" flex="1" overflowY="scroll">
          <Card>
            <Text pb={5} fontWeight="extrabold" fontSize={18}>
              Simple name Registration
            </Text>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Icon />

              <Flex width="100%" direction="row" alignItems="flex-end">
                <Flex width="100%" direction="column" alignItems="flex-start">
                  <Text pb={2} fontWeight="bold" fontSize={15}>
                    Don't have a Simple Name yet? Create your first Simple Name
                    now !
                  </Text>
                  <Input
                    width="90%"
                    value={nameToRegister}
                    onChange={(e) => setNameToRegister(e.target.value)}
                  />
                </Flex>

                <Button variant="solid" onClick={registerAddress}>
                  Register
                </Button>
              </Flex>
            </Box>
          </Card>

          <Card>
            <Text pb={5} fontWeight="extrabold" fontSize={18}>
              Connected Simple Names
            </Text>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Icon />

              <Flex
                width="100%"
                direction="row"
                alignItems="flex-end"
                justifyContent="space-evenly"
              >
                <Flex width="100%" direction="column" alignItems="flex-start">
                  <Text pb={2} fontWeight="bold" fontSize={15}>
                    Add this account within a Simple Name
                  </Text>
                  <Input
                    width="90%"
                    value={subAccountToRegister}
                    onChange={(e) => setSubAccountToRegister(e.target.value)}
                  />
                </Flex>

                <Button variant="solid" onClick={approve}>
                  Add Account
                </Button>
              </Flex>
            </Box>
          </Card>
        </Flex>
      );
    } else if (address != NULL_ADDRESS && primaryMetaName != NULL_ADDRESS) {
      //user is connected and a primary meta address exist
      return (
        <Box>
          <Box mb={4} p={2}>
            <Text fontWeight="bold" py={3}>
              My Simple Name
            </Text>

            <Box display="flex" flexDirection="column">
              <AddressDisplay title={primaryMetaName} subtitle={address} />
            </Box>
          </Box>

          <>
            <Text fontWeight="bold" py={2}>
              Connected Simple Names
            </Text>
            <Box display="flex" flexDirection="column">
              {listWalletsAttached.length === 0 ? (
                <Text fontSize={13}>
                  This account has no sub addresses registered
                </Text>
              ) : (
                listWalletsAttached.map((element) => {
                  return (
                    <AddressDisplay
                      title={"0x" + element.substring(26)}
                      subtitle={"Share this Address"}
                      subtitleClickable
                      buttonTitle={"Settings"}
                      onClick={() =>
                        onNavigateAddressSettings(
                          "0x" + element[0].substring(26)
                        )
                      }
                      onClickSubtitle={() =>
                        onNavigateAddressSettings(
                          "0x" + element[0].substring(26)
                        )
                      }
                    />
                  );
                })
              )}
            </Box>
          </>
        </Box>
      );
    }
  };

  useEffect(() => {
      setGraphData([
        {
          name: "Jan",
          balance: ethEarned,
        },
        {
          name: "Feb",
          balance: 0,
        },
        {
          name: "Mar",
          balance: 0,
        },
        {
          name: "Apr",
          balance: 0,
        },
        {
          name: "May",
          balance: 0,
        },
        {
          name: "Jun",
          balance: 0,
        },
        {
          name: "Jul",
          balance: 0,
        },
      ]);

      console.log('@@@@')
      console.log(ethEarned)
  }, [ethEarned]);

  useEffect(() => {
    findByMeta();
  }, [address]);

  useEffect(() => {
    // findByName()
    getAggregateEther()
    viewConnections();
  }, [primaryMetaName]);

  useEffect(() => {
    async function search() {
      if (searchMetaName != "") {
        setSearchResults(
          await contract.viewConnections(String(searchMetaName), false)
        );
      } else {
        setSearchResults([]);
      }
    }

    search();
  }, [searchMetaName]);

  //Takes in the meta name to retrieve the address
  async function findByName() {
    if (typeof window.ethereum !== "undefined") {
      const _address = await contract.findByName(primaryMetaName);
      dispatch(storeMetaAddress(_address)); //dispatch an action to store meta address
    }
  }

  async function viewConnections() {
    if (typeof window.ethereum !== "undefined") {
      const listConnections = await contract.viewConnections(
        primaryMetaName,
        false
      ); // 2nd argument fullApproved
      console.log("@@@@@");
      console.log(listConnections);
      const connectionsChecked = listConnections?.length ? listConnections : []
      setListWalletsAttached(connectionsChecked);
      setWalletsAttached(connectionsChecked.length + "");
    }
  }

  async function getAggregateEther() {
    if (typeof window.ethereum !== "undefined") {
      let aggregatedEther = await contract.getAggregateEther(primaryMetaName);
      aggregatedEther = ethers.utils.formatEther(aggregatedEther);
      setEthEarned(aggregatedEther);
      return aggregatedEther;
    }
  }

  async function approve() {
    if (typeof window.ethereum !== "undefined") {
      setRefresh(false);
      setIsApprovingSubAccount(true);

      try {
        const transaction = await contract.approve(
          address,
          subAccountToRegister
        );
        const receipt = await transaction.wait();
        console.log(receipt);
      } catch (error) {
        setIsApprovingSubAccount(false);
        setRefresh(true);

        return;
      }

      setIsApprovingSubAccount(false);
      setRefresh(true);
      setSubAccountToRegister("");
    }
  }

  function renderSearch() {
    return (
      <Box
        width={"full"}
        minWidth={"full"}
        overflowX={"visible"}
        flex="1"
        height="100vh"
        overflowY={"scroll"}
        sx={{ overflowY: "scroll !important" }}
      >
        {searchResults.length === 0 ? (
          <Box height="100%">
            <Center height="100%">
              <Box bgColor="#f7f7fa" p={20} rounded="md">
                <Text>
                  Sorry we couldn't find any connections for this address
                </Text>
              </Box>
            </Center>
          </Box>
        ) : (
          searchResults.map((element) => {
            return (
              <AddressDisplay
                title={"0x" + element.substring(26)}
                subtitle={"Share this Address"}
                subtitleClickable
                buttonTitle={"Settings"}
                onClick={() =>
                  onNavigateAddressSettings("0x" + element[0].substring(26))
                }
                onClickSubtitle={() =>
                  onNavigateAddressSettings("0x" + element[0].substring(26))
                }
              />
            );
          })
        )}
      </Box>
    );
  }

  return (
    <Container
      p={0}
      m={0}
      height={"100vh"}
      minWidth="100%"
      flex="1"
      bgColor="#fff"
      overflowY={"scroll"}
    >
      {/* Top Bar Begins*/}
      <Flex
        flexDirection={["column", "column", "column", "row"]}
        gap={2}
        bgColor={theme.colors.white}
        height={"65px"}
      >
        <Flex
          position="relative"
          display={"flex"}
          flexDirection="column"
          height={"100%"}
          width={["100%", "100%", "100%", "30%"]}
        >
          <ConnectedIndicator
            address={address}
            isConnected={isConnected}
          ></ConnectedIndicator>
        </Flex>
        <Flex
          // flex="1"
          border="0.5px solid #eee"
          display={"flex"}
          flexDirection="column"
          height={"100%"}
          width={["100%", "100%", "100%", "70%"]}
        >
          <Box
            width={"100%"}
            bgColor="#f7f7fa"
            boxShadow="none"
            px={5}
            ref={ref}
            height={"100%"}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <InputGroup rounded="lg" border="0.5px solid #eee" width={"1400px"}>
              <InputLeftElement
                pointerEvents="none"
                children={<MdOutlineSearch color="#aaa" />}
              />
              <Input
                border="0px solid transparent"
                type="search"
                bg={theme.colors.white}
                placeholder="Search any name or account"
                fontSize={15}
                value={searchMetaName}
                onChange={(e) => setSearchMetaName(e.target.value)}
              />
            </InputGroup>
          </Box>
          {/* End of Search Bar */}
        </Flex>
        {/* End of Top Bar */}
      </Flex>

      {searchMetaName == "" ? (
        <Flex
          py={2}
          // px={2}
          flexDirection={["column", "column", "column", "row"]}
          justifyContent={"space-between"}
          overflowY="scroll"
        >
          {/* Section 1 */}
          <Box flex="1" px={8} minHeight="100vh" overflow="hidden">
            {renderPersonalDisplay()}
          </Box>
          {/* End Section 1 */}

          {/* Section 2 */}
          {address != NULL_ADDRESS ? (
            <Flex
              flexDirection="column"
              minHeight="100vh"
              flex="1"
              py={5}
              px={8}
            >
              <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-evenly"}
              >
                <Flex
                  flexDirection={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Box
                    width="full"
                    bg={theme.colors.white}
                    boxShadow="none"
                    rounded={"lg"}
                    p={6}
                    border="1px solid #eee"
                    mr={2}
                    height={150}
                  >
                    <Flex
                      flex="1"
                      height="100%"
                      justifyContent="center"
                      flexDirection={"column"}
                      alignItems="center"
                    >
                      <Text py={2} fontWeight={"bold"} fontSize={20}>
                        {walletsAttached}
                      </Text>
                      <Text>Wallets Attached</Text>
                    </Flex>
                  </Box>

                  <Box
                    width={"full"}
                    bg={theme.colors.white}
                    boxShadow="none"
                    rounded={"lg"}
                    p={6}
                    border="1px solid #eee"
                    ml={2}
                    height={150}
                  >
                    <Flex
                      flex="1"
                      height="100%"
                      justifyContent="center"
                      flexDirection={"column"}
                      alignItems="center"
                    >
                      <Text py={2} fontWeight={"bold"} fontSize={20}>
                        {ethEarned}
                      </Text>
                      <Text>Last ETH Balance</Text>
                    </Flex>
                  </Box>
                </Flex>
              </Box>

              <Card border="0.5px solid #eee">
                <Text fontSize={15} fontWeight="bold">
                  Add this account within a Simple Name
                </Text>
                <div>
                  <Input
                    id="meta-address"
                    placeholder={
                      primaryMetaName == NULL_ADDRESS
                        ? 'Enter a meta name like "omardraz.eth"'
                        : primaryMetaName
                    }
                    bgColor="#f7f7fa"
                    my={2}
                    fontSize={13}
                  />
                  <br></br>
                  <Input
                    id="new-sub-address"
                    onChange={(e) => setSubAccountToRegister(e.target.value)}
                    value={subAccountToRegister}
                    placeholder="Enter a sub address to approve"
                    bgColor="#f7f7fa"
                    fontSize={13}
                    my={2}
                  />
                </div>
                <Button bgColor='#2196F3' color='#fff' onClick={approve}>Approve</Button>
              </Card>

              <AssetsByTimeChart
                data={graphData}
                title="Your Assets"
                subtitle="Assets over time"
                ActionComponent={() => {
                  return (
                    <Select placeholder="Ether" size="sm" width="100px">
                      <option value="ether">Bitcoin</option>
                    </Select>
                  );
                }}
                handleAction={() => {}}
                chartWidth="100%"
                chartHeight={320}
                responsiveContainerWidth="100%"
                responsiveContainerHeight={320}
                xAxisDataKey="name"
                yAxisDataKey="balance"
              />
            </Flex>
          ) : null}
          {/* End Section 2 */}
        </Flex>
      ) : (
        renderSearch()
      )}

      <LoadingModal
        isOpen={isApprovingSubAccount}
        title="Approving your sub address..."
      />
      <LoadingModal
        isOpen={isRegisteringSimpleName}
        title="Registering your simple name..."
      />
    </Container>
  );
}

export default DApp;
