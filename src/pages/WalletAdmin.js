import React, { useEffect, useRef, useState } from "react";

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
import AssetsByTimeChart from "../components/BasicLineChart";

import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import theme from '../theme'

const WALLETS = [0,1,2,3,4];

const initialData = [
  {
    name: "Jan",
    balance: 0.5,
  },
  {
    name: "Feb",
    balance: 1.2,
  },
  {
    name: "March",
    balance: 2.3,
  },
  {
    name: "April",
    balance: 1.3,
  },
  {
    name: "May",
    balance: 4.0,
  },
  {
    name: "June",
    balance: 3.0,
  },
  {
    name: "July",
    balance: 2.0,
  },
];

function WalletAdmin() {
    const [items, setItems] = useState([0,1,1,1,1,11,1,1,1,1,1,1,1,1,1,1,1,1,1,1])
    const ref = useRef()

    const onNavigateSettings = () => {}

  return (
    <Container
      p={0}
      m={0}
      height={'100vh'}
      minWidth='100%'
      flex='1'
      bgColor={theme.colors.primary}
      overflowY={['scroll', 'scroll', 'hidden', 'hidden']}
    >
      <Flex
        p={10}
        flexDirection={['column', 'column', 'column', 'row']}
        justifyContent={"space-between"}
        overflowY={['scroll', 'scroll', 'hidden', 'hidden']}
      >
        {/* Section 1 */}
        <Flex 
        display={'flex'}
        overflowY={'scroll'} 
        flexDirection="column" 
        minHeight="100vh" 
        width={['100%', '100%', '100%', '48%']}>
          <Box width={'100%'}>
          <Box
            minW={"100%"}
            bg={useColorModeValue("white", "gray.900")}
            boxShadow="none"
            rounded={"lg"}
            p={6}
            ref={ref}
          >
            <Text fontWeight={"extrabold"} fontSize={36}>
              Hello Omar!
            </Text>
            <p>It's good to see you again.</p>
          </Box>

          <AddressDisplay 
          title={`omarwallet.simple`} 
          subtitle={'Share this Address'} 
          subtitleClickable 
          buttonTitle={'Settings'} 
          onClick={onNavigateSettings} 
          onClickSubtitle={() =>{}} />
          </Box>


          <Box mt={10} flexGrow={'1'} display={'flex'} flexDirection={'column'}>
            <div>
              <Text 
              fontWeight={'extrabold'} 
              fontSize={20} 
              py={3}> 
                Wallets 
              </Text>
              <Text fontWeight={'bold'}> All wallets </Text>
            </div>

            <Box 
            width={'full'} 
            minWidth={'full'} 
            overflowX={'visible'} 
           // flexGrow='1'
            height={'600px'}
            overflowY={'scroll'}
            sx={{  overflowY: 'scroll !important'}}>
            {items.map((address, idx, arr) => {
              return (
                <AddressDisplay 
                title={`Address ${idx+1}`} 
                subtitle={'Share this Address'} 
                subtitleClickable 
                buttonTitle={'Settings'} 
                onClick={onNavigateSettings} 
                onClickSubtitle={() =>{}} />
              )
            })}

            
            </Box>
          </Box>
        </Flex>
        {/*End Section 1 */}


        {/* Section 2 */}
        <Flex 
        flexDirection="column" 
        minHeight="100vh" 
        flex='1' 
        maxWidth={['100%', '100%', '100%', '48%']}>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'}>
          <Box display={['none', 'none', 'flex', 'flex']}>
            <UserActionMenu />
          </Box>

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
          </Box>

            <AssetsByTimeChart 
            data={initialData} 
            title='Your Assets' 
            subtitle='Assets over time' 
            ActionComponent={() => <Text>Dropdown</Text>} 
            handleAction={() => {}}  
            chartWidth='100%' 
            chartHeight={400} 
            responsiveContainerWidth='100%' 
            responsiveContainerHeight={400} 
            xAxisDataKey='name' 
            yAxisDataKey='balance' />

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
