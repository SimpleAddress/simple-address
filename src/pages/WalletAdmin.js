import React, { useEffect, useRef, useState } from 'react';
import { Container, Flex, Box, Text, Button, Input, Center } from '@chakra-ui/react';
import {InputGroup, InputLeftElement, Avatar, Stack, } from '@chakra-ui/react';
import { MdOutlineSearch, MdNotificationsActive, MdKeyboardArrowDown } from 'react-icons/md';
// import UserActionMenu from '../components/UserActionMenu';
import Icon from '../components/Icon';
import AddressDisplay from '../components/AddressDisplay';
import AssetsByTimeChart from '../components/BasicLineChart';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import Illustration from '../assets/images/Illustration.png';
import theme from '../theme';
import Card from '../components/Card';
import { NULL_ADDRESS } from '../utils/constant';
import LoadingModal from '../components/LoadingModal';
import { useDispatch, useSelector } from 'react-redux';
import { storeMetaName, storeMetaAddress, userConnected } from '../redux/SimpleAddressActions';
import SimpleAddressCore from "../abis/SimpleAddressCore.json";
import ContractAddress from "../abis/contract-address.json";  // keeps last deploied address
import {requestAccount, getContract} from '../utils/common.js';

const initialData = [
  {
    name: 'Jan',
    balance: 0,
  },
];


function WalletAdmin() {
  const contract = getContract(ContractAddress.SimpleAddressCore,SimpleAddressCore);
  
  const ref = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userAddress = useSelector((state) => state.user.address);
  const primaryMetaAddress = useSelector((state) => state.user.primaryMetaAddress);
  const primaryMetaName = useSelector((state) => state.user.primaryMetaName);

  const userAddressValid = userAddress != NULL_ADDRESS && userAddress !== '';
  const primaryMetaAddressValid = primaryMetaAddress != NULL_ADDRESS && primaryMetaAddress !== '';
  
  const [addressFromMeta, setAddressFromMeta] = useState(NULL_ADDRESS);
  const [walletsAttached, setWalletsAttached] = useState(0);
  const [searchMetaName, setSearchMetaName] = useState(0);
  
  const [listWalletsAttached, setListWalletsAttached] = useState(0);
  const [ethEarned, setEthEarned] = useState(0);
  const [newSubAddress, setNewSubAddress] = useState('');
  const [graphData, setGraphData] = useState(initialData);
  const [isApproving, setIsApproving] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const onNavigateAddressSettings = (address) => {
    if (address === NULL_ADDRESS) return;
    navigate(`/details/${address}`);
  };

  //back to home/connect user on every refresh
  // useEffect(() => {
  //   navigate('../');
  // }, [refresh]);

  useEffect(() => {
    async function search(){
      if (!searchMetaName) { findByMeta(); }
      else {
        dispatch(storeMetaName(searchMetaName)); // update primaryMetaName 
        console.log('new name is: '+ primaryMetaName);
        findByName(); // will update primaryMetaAddress 
        findByMeta();
      }
    }
    search();
    }, [searchMetaName]);


  useEffect(() => {
    async function setup() {
      await getAggregateEther().then((eth) => {
        setGraphData([
          {
            name: 'Jan',
            balance: eth,
          },
          {
            name: 'Feb',
            balance: eth,
          },
          {
            name: 'Mar',
            balance: eth,
          },
          {
            name: 'Apr',
            balance: eth,
          },
          {
            name: 'May',
            balance: eth,
          },
          {
            name: 'Jun',
            balance: eth,
          },
          {
            name: 'Jul',
            balance: eth,
          },
        ]);
      });
      await findByMeta();
    }
    setup();
  }, [primaryMetaAddress]);

  // useEffect(() => {
  //   findByMeta();
  // }, [primaryMetaAddress]);

  //Takes in the address and returns the name
  async function findByMeta() {
    if (typeof window.ethereum !== 'undefined' && primaryMetaAddressValid) { 
      const metaName = await contract.findByMeta(primaryMetaAddress);
      dispatch(storeMetaName(metaName)); //dispatch an action to store meta address
      viewConnections();
    }
  }

  //Takes in the meta name (inputted) to retrieve the address
  async function findByName() {
    if (typeof window.ethereum !== 'undefined') {
      const address = await contract.findByName(primaryMetaName);
      dispatch(storeMetaAddress(address)); //dispatch an action to store meta address
      console.log('new address is: ' + primaryMetaAddress)
    }
  }

  async function viewConnections() {
    if (typeof window.ethereum !== 'undefined' && primaryMetaAddressValid) {
      const listConnections = await contract.viewConnections(primaryMetaAddress, false); // 2nd argument fullApproved
      setListWalletsAttached(listConnections);
      console.log('connections for address: ' + primaryMetaAddress);
      console.log(listConnections);
      setWalletsAttached(listConnections.length+"");
    }
  }

  async function getAggregateEther() {
    if (typeof window.ethereum !== 'undefined') {
      let aggregatedEther = await contract.getAggregateEther(primaryMetaName);
      aggregatedEther = ethers.utils.formatEther(aggregatedEther);
      setEthEarned(aggregatedEther);
      return aggregatedEther
    }
  }

  async function approve() {
    if (typeof window.ethereum !== 'undefined') {

      setRefresh(false);
      setIsApproving(true);

      try {
        //TODO change to primaryMetaAddress insted of userAddress
        const transaction = await contract.approve(userAddress, newSubAddress);
        await transaction.wait();
      } catch (error) {
        setIsApproving(false);
        setRefresh(true);
        //TODO: Show dialog

        return;
      }

      setIsApproving(false);
      setRefresh(true);
      setNewSubAddress('');
    }
  }


  return (
    <Container
      p={0}
      m={0}
      height={'100vh'}
      minWidth="100%"
      flex="1"
      bgColor={theme.colors.primary}
      overflowY={['scroll', 'scroll', 'hidden', 'hidden']}
    >
      <Flex
        py={5}
        px={2}
        flexDirection={['column', 'column', 'column', 'row']}
        justifyContent={'space-between'}
        overflowY={['scroll', 'scroll', 'hidden', 'hidden']}
      >
        {/* Section 1 */}
        <Flex
          position="relative"
          display={'flex'}
          overflowY={'scroll'}
          flexDirection="column"
          minHeight="100vh"
          px={2}
          width={['100%', '100%', '100%', '48%']}
        >
          <Box width={'100%'}>
            <Box
              minW={'100%'}
              bg={theme.colors.white}
              boxShadow="none"
              rounded={'lg'}
              p={6}
              ref={ref}
              height="auto"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              style={{ overflowY: 'hidden' }}
            >
              <Box>
                <Text textStyle="h1">Welcome to Simple Address!</Text>
                <p>It's good to see you.</p>
              </Box>

              <div />

              {/*<img src={Illustration} style={{ width: 120, height: 200,  position: 'absolute',  right: 200}} />*/}
            </Box>
            <AddressDisplay
              title={primaryMetaAddress}
              subtitle="Share this address"
              subtitleClickable
            />
          </Box>

          <Box mt={10} flexGrow={'1'} display={'flex'} flexDirection={'column'}>
            <div>
              <Text fontWeight={'extrabold'} fontSize={20} py={3}>
                Connected addresses
              </Text>
              <Text fontWeight={'bold'}> All addresses </Text>
            </div>

            <Box
              width={'full'}
              minWidth={'full'}
              overflowX={'visible'}
              // flexGrow='1'
              height={'600px'}
              overflowY={'scroll'}
              sx={{ overflowY: 'scroll !important' }}
            >
              {(!listWalletsAttached) ? (
                <Text>This account has no sub addresses registered</Text>
              ) : (
                listWalletsAttached.map(element => {
                  return <AddressDisplay
                    title={'0x'+element.substring(26)}
                    subtitle={'Share this Address'}
                    subtitleClickable
                    buttonTitle={'Settings'}
                    onClick={() => onNavigateAddressSettings('0x'+element[0].substring(26))}
                    onClickSubtitle={() => onNavigateAddressSettings('0x'+element[0].substring(26))}
                  />
                })
              )}
            </Box>
          </Box>
        </Flex>
        {/*End Section 1 */}

        {/* Section 2 */}
        <Flex
          flexDirection="column"
          minHeight="100vh"
          flex="1"
          px={2}
          maxWidth={['100%', '100%', '100%', '48%']}
        >
          <Box display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'}>
            <Box display={['none', 'none', 'none', 'flex']}>
              <Box
                width="100%"
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <InputGroup width={'400px'}>
                  <InputLeftElement pointerEvents="none" children={<MdOutlineSearch color="#aaa" />} />
                  <Input 
                    type="search" 
                    bg={theme.colors.white} 
                    placeholder="Search a simple address" 
                    defaultValue={primaryMetaName}
                    onChange={(e) => setSearchMetaName(e.target.value)}
                    />
                </InputGroup>

                <Stack mx={2} direction="row" gap={2}>
                  <MdNotificationsActive size={25} />

                  <Box mx={2} display="flex" flexDirection="row" alignItems="center">
                    <Avatar name="E H" size={'xs'} cursor="pointer" />
                    <MdKeyboardArrowDown cursor="pointer" />
                  </Box>
                </Stack>
              </Box>
            </Box>

            <Flex
              mt={2}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Box
                width="full"
                bg={theme.colors.white}
                boxShadow="none"
                rounded={'lg'}
                p={6}
                mr={2}
                height={150}
              >
                <Flex
                  flex="1"
                  height="100%"
                  justifyContent="center"
                  flexDirection={'column'}
                  alignItems="center"
                >
                  <Text py={2} fontWeight={'bold'} fontSize={30}>
                    {walletsAttached}
                  </Text>
                  <Text>Wallets Attached</Text>
                </Flex>
              </Box>

              <Box
                width={'full'}
                bg={theme.colors.white}
                boxShadow="none"
                rounded={'lg'}
                p={6}
                ml={2}
                height={150}
              >
                <Flex
                  flex="1"
                  height="100%"
                  justifyContent="center"
                  flexDirection={'column'}
                  alignItems="center"
                >
                  <Text py={2} fontWeight={'bold'} fontSize={20}>
                    {ethEarned}
                  </Text>
                  <Text>Last ETH Balance</Text>
                </Flex>
              </Box>
            </Flex>
          </Box>

          <AssetsByTimeChart
            data={graphData}
            title="Your Assets"
            subtitle="Assets over time"
            ActionComponent={() => <Text>Dropdown</Text>}
            handleAction={() => {}}
            chartWidth="100%"
            chartHeight={320}
            responsiveContainerWidth="100%"
            responsiveContainerHeight={320}
            xAxisDataKey="name"
            yAxisDataKey="balance"
          />

          <Card>
            <Text fontSize={15} fontWeight="bold">
              Approve a new address
            </Text>
            <div>
              <Input
                id="meta-address"
                // value={primaryMetaAddress}  //TODO: allow different meta 
                placeholder={primaryMetaAddress}
                bgColor="lightblue"
                my={2}
              />
              <br></br>
              <Input
                id="new-sub-address"
                onChange={(e) => setNewSubAddress(e.target.value)}
                value={newSubAddress}
                placeholder="Enter a sub address to approve"
                bgColor="lightblue"
                my={2}
              />
            </div>
            <Button onClick={approve}>Approve</Button>
          </Card>
        </Flex>
        {/* End Section 2 */}
      </Flex>

      <LoadingModal isOpen={isApproving} title="Approving your sub address..." />
    </Container>
  );
}

export default WalletAdmin;
