import React, { useEffect, useState } from 'react';
import { Box, Center, Text, Flex, Container, Button, Stack, Input } from '@chakra-ui/react';
import { InputGroup, InputLeftElement, Avatar } from '@chakra-ui/react';
import { MdOutlineSearch, MdNotificationsActive, MdKeyboardArrowDown } from 'react-icons/md';

import theme from '../theme';
import { connect, useDispatch, useSelector } from 'react-redux';
import Card from '../components/Card';
import { NULL_ADDRESS } from '../utils/constant';
import Icon from '../components/Icon';
import AddressDisplay from '../components/AddressDisplay';
import AssetsByTimeChart from '../components/BasicLineChart';
import { useNavigate } from 'react-router-dom';
import LoadingModal from '../components/LoadingModal';
// smart contract
import SimpleAddressCore from "../abis/SimpleAddressCore.json";
import ContractAddress from "../abis/contract-address.json";  // keeps last deploied address
import {requestAccount, getContract} from '../utils/common.js';

import { storeMetaName, storeMetaAddress, userConnected } from '../redux/SimpleAddressActions';

const initialData = [
  {
    name: 'Jan',
    balance: 0,
  },
];

function SimpleAddress() {
  const contract = getContract(ContractAddress.SimpleAddressCore,SimpleAddressCore);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [connectedSimpleNames, setConnectedSimpleNames] = useState([0, 1, 2, 3, 4, 5, 6]);
  const primaryMetaAddress = useSelector((state) => state.user.primaryMetaAddress);
  const userAddress = useSelector((state) => state.user.address);
  const primaryMetaName = useSelector((state) => state.user.primaryMetaName);

  const validUserAddress = userAddress != NULL_ADDRESS && userAddress != '';
  const validPrimaryMetaAddress = primaryMetaAddress != NULL_ADDRESS && primaryMetaAddress != '';

  const [nameToRegister, setNameToRegister] = useState('');
  const [subAccountToRegister, setSubAccountToRegister] = useState('');

  const [isRegisteringSimpleName, setIsRegisteringSimpleName] = useState(false);
  const [isApprovingSubAccount, setIsApprovingSubAccount] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [searchMetaName, setSearchMetaName] = useState(0);
  const [walletsAttached, setWalletsAttached] = useState(0);
  const [listWalletsAttached, setListWalletsAttached] = useState(0);
  const [ethEarned, setEthEarned] = useState(0);
  const [graphData, setGraphData] = useState(initialData);

  const onNavigateAddressSettings = (address) => {
    if (address === NULL_ADDRESS) return;
    navigate(`/details/${address}`);
  };

  //check if user is connected on every render
  useEffect(() => {
    getCurrentUser();
  }, []);

  //fetch meta address anytime user address changes
  useEffect(() => {
    findByMeta();
  }, [userAddress]);

  //fetch the current user on every refresh
  useEffect(() => {
    getCurrentUser();
  }, [refresh]);

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

  async function getCurrentUser() {
    const address = await requestAccount();

    if (address[0]) {
      dispatch(userConnected(address[0])); //dispatch an action to store user's metamask address
    } else {
      dispatch(storeMetaAddress(NULL_ADDRESS)); //dispatch an action to clear user's metamask address
    }
  }

  //Takes in the address and returns the name
  async function findByMeta() {
    if (typeof window.ethereum !== 'undefined' && validUserAddress === true) {
        const metaName = await contract.findByMeta(userAddress);
        dispatch(storeMetaName(metaName)); //dispatch an action to store meta address
        console.log('findbyMeta found: '+ metaName);
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
    if (typeof window.ethereum !== 'undefined' && validPrimaryMetaAddress) {
      const listConnections = await contract.viewConnections(primaryMetaAddress, false); // 2nd argument fullApproved
      setListWalletsAttached(listConnections);
      console.log('connections for address: ' + primaryMetaAddress);
      console.log(listConnections);
      setWalletsAttached(listConnections.length+"");
    }
  }

  // call the smart contract, send an update
  async function registerAddress() {
    if (typeof window.ethereum !== 'undefined') {
      setRefresh(false);
      setIsRegisteringSimpleName(true);

      try {
        const transaction = await contract.registerAddress(nameToRegister);
        await transaction.wait();
        localStorage.setItem(userAddress, transaction);
      } catch (error) {
        //TODO: Show dialog
        setIsRegisteringSimpleName(false);
        setRefresh(true);
        console.log(error);
        return;
      }

      setIsRegisteringSimpleName(false);
      setRefresh(true);
      setNameToRegister('');
    }
  }

  async function approve() {
    if (typeof window.ethereum !== 'undefined') {
      setRefresh(false);
      setIsApprovingSubAccount(true);

      try {
        const transaction = await contract.approve(primaryMetaAddress, subAccountToRegister);
        await transaction.wait();
      } catch (error) {
        setIsApprovingSubAccount(false);
        setRefresh(true);
        //TODO: Show dialog

        return;
      }

      setIsApprovingSubAccount(false);
      setRefresh(true);
      setSubAccountToRegister('');
    }
  }

  const renderWelcomeContent = () => {
    if (validUserAddress === false && validPrimaryMetaAddress === false) {
      return (
        <Box>
          <Text fontSize={12} py={2}>
            Connect your wallet to begin
          </Text>

          <Button variant="solid" bgColor={theme.colors.black} onClick={requestAccount}>
            Connect
          </Button>
        </Box>
      );
    } else {
      return (
        <Box>
          <Text>{userAddress}</Text>
        </Box>
      );
    }
  };

  const renderPersonalDisplay = () => {
    if (validUserAddress === false && validPrimaryMetaAddress === false) {
      //if not connected
      return null;
    } else if (userAddress && (primaryMetaAddress == NULL_ADDRESS || primaryMetaAddress == '')) {
      //if only user address and no meta address it must be sub acount or new user

      return (
        <>
          <Card>
            <Text pb={5} fontWeight="extrabold" fontSize={18}>
              Simple name Registration
            </Text>

            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Icon />

              <Flex width="100%" direction="row" alignItems="flex-end">
                <Flex width="100%" direction="column" alignItems="flex-start">
                  <Text pb={2} fontWeight="bold" fontSize={15}>
                    Don't have a Simple Name yet? Create your first Simple Name now !
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

            <Box display="flex" alignItems="center" justifyContent="space-between">
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
        </>
      );
    } else if (userAddress && primaryMetaAddress) {
      //user is connected and a primary meta address exist
      return (
        <Box>
          <>
            <Text>My Simple Name</Text>

            <Box display="flex" flexDirection="column">
              <AddressDisplay
                title={primaryMetaAddress}
                subtitle={userAddress}
                buttonTitle="View Account"
              />
            </Box>
          </>

          <>
            <Text>Connected Simple Names</Text>
            <Box display="flex" flexDirection="column">
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
          </>
        </Box>
      );
    }
  };

  return (
    <Box minWidth="100%" height={'100vh'}>
      <Stack bgColor="transparent" direction="row" width="100%">
        <Box>Connect Box</Box>

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
          </Box>
        </Box>

      </Stack>

      <Box
        p={0}
        m={0}
        height={'100vh'}
        display="flex"
        minWidth="100%"
        flexDirection="row"
        flex="1"
        bgColor={theme.colors.primary}
        overflowY="scroll"
      >
        <Box px={5} flex="1" width='100%' height="100vh">
          {/* welcome card */}
          <Card>
            <Text textStyle="h1">Welcome to Simple Address</Text>
            {renderWelcomeContent()}
          </Card>

          {renderPersonalDisplay()}
        </Box>

        <Box
          m={0}
          px={5}
          height={'100vh'}
          flex='1'
          flexDirection='column'
          bgColor={theme.colors.primary}
          overflowY='scroll'
          justifyContent='space-evenly'
        >
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
          
            <Card chakraProps={{ my: 3 }}>
          <Text py={2} textAlign="center" textStyle="h2" textDecorationLine="underline">
            Address Information
          </Text>

          <Flex flexDirection={'column'}>
            <Box
              width="100%"
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text textStyle="h2">Info</Text>

              <Text py={2}>0</Text>
            </Box>

            <Box
              width="100%"
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text textStyle="h2">Link Date</Text>

              <Text py={2}>0</Text>
            </Box>

            <Box
              width="100%"
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text textStyle="h2">Total NFTs Held</Text>

              <Text py={2}>0</Text>
            </Box>
          </Flex>
        </Card>

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

        </Box>
      </Box>

      <LoadingModal isOpen={isRegisteringSimpleName} title="Registering your simple name..." />
      <LoadingModal isOpen={isApprovingSubAccount} title="Approving your sub account..." />
    </Box>
  );
}

export default SimpleAddress;
/*<Stack direction='row' width='100%'>
  <Box>
    Connect Box
  </Box>

  <Box>
    Search bar
  </Box>
  </Stack>
  */
