import React, { useState } from "react";

import {
  Heading,
  Avatar,
  Container,
  Flex,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Link,
  Badge,
  useColorModeValue,
  Spacer,
} from "@chakra-ui/react";

import Icon from "../components/Icon";
import AddressDisplay from "../components/AddressDisplay";
import UserActionMenu from "../components/UserActionMenu";
import AssetsByTimeChart from "../components/AssetsByTimeChart";

import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import theme from '../theme'

import InfiniteScroll from "react-infinite-scroll-component";

import "./WalletAdmin/WalletAdmin.css";

const WALLETS = [0,1,2,3,4];

function WalletAdmin() {

    const [items, setItems] = useState([0,1,2,3,4,5,6,7,8,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1])

    const fetchMoreData = () => {
        // a fake async api call like which sends
        // 20 more records in 1.5 secs
        setTimeout(() => {
          setItems([0,1,2,3,4,5,6,7,8,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1])
        }, 1500);
      };
  return (
    <Container
      p={0}
      m={0}
      minHeight="100vw"
      maxW="container.xl"
      bgColor={theme.colors.primary}
    >
      <Flex
        overflowY={"scroll"}
        p={10}
        flexDirection="row"
        justifyContent={"space-between"}
      >
        {/* Section 1 */}
        <Flex overflowY={'scroll'} flexDirection="column" minHeight="100vh" minWidth="48%">
          <Box
            maxW={"100%"}
            w={"full"}
            bg={useColorModeValue("white", "gray.900")}
            boxShadow="none"
            rounded={"lg"}
            p={6}
          >
            <Text fontWeight={"extrabold"} fontSize={36}>
              Hello Omar!
            </Text>
            <p>It's good to see you again.</p>
          </Box>

          <AddressDisplay />

          <div>
            <div>
              <h2> Wallets </h2>
              <h3> All wallets </h3>
            </div>

            {items.map((wallet) => {
              return <AddressDisplay />;
            })}

          </div>
        </Flex>
        {/*End Section 1 */}

        {/* Section 2 */}
        <Flex flexDirection="column" minHeight="100vh" minWidth="48%">
          <UserActionMenu />
          <Flex
            my={5}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box
              width="full"
              bg={useColorModeValue("white", "gray.900")}
              boxShadow="none"
              rounded={"lg"}
              p={6}
              mr={2}
            >
              <Flex
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-evenly"}
              >
                <Text fontWeight={"extrabold"} fontSize={40}>
                  0
                </Text>
                <Flex flexDirection={"column"}>
                  <Text width={"70px"}>Wallets Attached</Text>
                </Flex>
              </Flex>
            </Box>

            <Box
              width={"full"}
              bg={useColorModeValue("white", "gray.900")}
              boxShadow="none"
              rounded={"lg"}
              p={6}
              ml={2}
            >
              <Flex
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-evenly"}
              >
                <Text fontWeight={"extrabold"} fontSize={40}>
                  0
                </Text>
                <Flex flexDirection={"column"}>
                  <Text width={"70px"}>Eth Earned</Text>
                </Flex>
              </Flex>
            </Box>
          </Flex>

          <Box my={5}>
            <Box px={19} py={2}>
              <Text fontWeight="extrabold" px={19}>
                {" "}
                Your assets{" "}
              </Text>
              <Flex
                px={19}
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Text fontSize={12} fontWeight="extrabold">
                  Assets over time
                </Text>

                <p>Dropdown</p>
              </Flex>
            </Box>
            <AssetsByTimeChart />
          </Box>

          <Box
            maxW={"100%"}
            w={"full"}
            bg="#fff"
            boxShadow="none"
            rounded={"lg"}
            p={6}
          >
            <Flex
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Box maxWidth={"230px"}>
                <Box pb={5}>
                  <Text fontWeight={"bold"} fontSize={24}>
                    Attach a wallet
                  </Text>
                  <Text fontWeight={"normal"} fontSize={15}>
                    Click below to open metamask to connect additional wallets
                  </Text>
                </Box>
                <Button variant="solid">Connect a wallet</Button>
              </Box>

              <MdOutlineAccountBalanceWallet size={100} />
            </Flex>
          </Box>
        </Flex>
        {/* End Section 2 */}
      </Flex>
    </Container>
  );
}

export default WalletAdmin;
