import React, { useEffect, useRef, useState } from 'react';

import { Container, Flex, Box, Text, Button, Input, InputGroup, InputLeftElement, Center } from '@chakra-ui/react';

import Icon from '../components/Icon';
import AddressDisplay from '../components/AddressDisplay';
import UserActionMenu from '../components/UserActionMenu';
import AssetsByTimeChart from '../components/BasicLineChart';
import ConnectedIndicator from '../components/ConnectedIndicator';

import { ethers } from 'ethers';

import { useNavigate } from 'react-router-dom';
import { MdOutlineSearch } from 'react-icons/md';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import Illustration from '../assets/images/Illustration.png';
import theme from '../theme';
import Card from '../components/Card';
import { useSelector, useDispatch } from 'react-redux';
import { storeMetaName, storeMetaAddress, userConnected } from '../redux/SimpleAddressActions';

import LoadingModal from '../components/LoadingModal';

// smart contract
import SimpleAddressCore from "../abis/SimpleAddressCore.json";
import ContractAddress from "../abis/contract-address.json";  // keeps last deploied address
import {requestAccount, getContract} from '../utils/common.js';

import { NULL_ADDRESS } from '../utils/constant';

const initialData = [
  {
    name: 'Jan',
    balance: 0,
  },
];

/*

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
            */



function DApp() {
  const contract = getContract(ContractAddress.SimpleAddressCore,SimpleAddressCore);

  const ref = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // keep only local variables
  const userAddress = useSelector((state) => state.user.address);
  const primaryMetaAddress = useSelector((state) => state.user.primaryMetaAddress);
  //const primaryMetaName = useSelector((state) => state.user.primaryMetaName);
  const [primaryMetaName, setPrimaryMetaName] = useState(NULL_ADDRESS)

  const validUserAddress = userAddress != NULL_ADDRESS && userAddress != '';
  const validPrimaryMetaAddress = primaryMetaAddress != NULL_ADDRESS && primaryMetaAddress != '';

  const [searchMetaName, setSearchMetaName] = useState(0);
  const [walletsAttached, setWalletsAttached] = useState(0);
  const [listWalletsAttached, setListWalletsAttached] = useState(0);
  const [ethEarned, setEthEarned] = useState(0);
  
  const [nameToRegister, setNameToRegister] = useState('');
  const [subAccountToRegister, setSubAccountToRegister] = useState('');
  const [isRegisteringSimpleName, setIsRegisteringSimpleName] = useState(false);
  const [isApprovingSubAccount, setIsApprovingSubAccount] = useState(false);
  
  const [isApproving, setIsApproving] = useState(false);
  const [newSubAddress, setNewSubAddress] = useState('');

  const [graphData, setGraphData] = useState(initialData);
  const [refresh, setRefresh] = useState(false);

  // Shreyase Additions start
  // address is the connected address
  const [address, setAddressValue] = useState(NULL_ADDRESS);  // researved to eth_requestAccounts
  // viewAddress tells which address details are showing
  const [viewAddress, setViewAddressValue] = useState();
  const [isConnected, setIsConnectedValue] = useState(false);
  const [isMeta, setIsMeta] = useState(false)

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


  // request access to the user's metamask account
  async function requestAccount() {
    const _address = await window.ethereum.request({
      method: "eth_requestAccounts", });
    setAddressValue(_address[0]);
    // console.log(_address);
    // console.log(_address[0])
    console.log("Inside request accounts, got this address: " + _address[0])
    const isConn = await window.ethereum.isConnected();
    if(_address.length>0){
      findByMeta()
      setIsConnectedValue(true);
    }
    else{
      setIsConnectedValue(false);
    }
  }
  
  window.ethereum.on('accountsChanged', function (accounts) {
    // Time to reload your interface with accounts[0]!
    console.log("DETECTED");
    if(accounts.length>0){
      requestAccount();
    }
    else{
      setAddressValue(NULL_ADDRESS);
      setIsConnectedValue(false);
    }
  })
  //Shreyase Additions End

    //Takes in the address and returns the name
    async function findByMeta() {
      if (typeof window.ethereum !== 'undefined') {
          const metaName = await contract.findByMeta(address);
          setPrimaryMetaName(metaName)
          console.log('findbyMeta found: '+ metaName);
      }
    }


  const onNavigateAddressSettings = (address) => {
    if (address === NULL_ADDRESS) return;
    navigate(`/details/${address}`);
  };

  const renderPersonalDisplay = () => {
    console.log(address)
    console.log(primaryMetaName)


    if (address == NULL_ADDRESS) {
      //if not connected
      return null;
    } else if (address != NULL_ADDRESS && primaryMetaName == NULL_ADDRESS) {
      //if only user address and no meta address it must be sub acount or new user

      return (
        <Flex direction='column' flex='1' overflowY='scroll'>
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
        </Flex>
      );
    } else if (address != NULL_ADDRESS && primaryMetaName != NULL_ADDRESS) {
      //user is connected and a primary meta address exist
      return (
        <Box>
          <>
            <Text>My Simple Name</Text>

            <Box display="flex" flexDirection="column">
              <AddressDisplay
                title={primaryMetaName}
                subtitle={address}
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

  
  useEffect(() => {
    async function setup() {
      await getAggregateEther();
      const eth = ethEarned;
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
      await findByMeta();
    }
    setup();
  }, [primaryMetaAddress]);

  // useEffect(() => {
  //   findByName();
  // }, [primaryMetaAddress]);


  useEffect(() => {
    async function search(){
      if (!searchMetaName) { 
        dispatch(storeMetaAddress(address)); // update primaryMetaName 
        findByMeta(); }
      else {
        dispatch(storeMetaName(searchMetaName)); // update primaryMetaName 
        console.log('new name is: '+ primaryMetaName);
        findByName(); // will update primaryMetaAddress 
        findByMeta();
      }
    }
    search();
    }, [searchMetaName]);
  
  //Takes in the meta name to retrieve the address
  async function findByName() {
    if (typeof window.ethereum !== 'undefined') {
      const _address = await contract.findByName(primaryMetaName);
      dispatch(storeMetaAddress(_address)); //dispatch an action to store meta address
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

  const renderSearch = () => {
    return <div> Hello World </div>
  }

  return (
    <Container
      p={0}
      m={0}
      height={'100vh'}
      minWidth="100%"
      flex="1"
      bgColor={theme.colors.primary}
      overflowY={'scroll'}
    >
      {/* Top Bar Begins*/}
      <Flex
        py={2}
        // px={2}
        flexDirection={['column', 'column', 'column', 'row']}
        justifyContent={'space-between'}
        // bgColor={theme.colors.white}
        // overflowY={['scroll', 'scroll', 'hidden', 'hidden']}
        height={'80px'}
      >
        <Flex
          position="relative"
          display={'flex'}
          flexDirection="column"
          height={"100%"}
          px={2}
          width={['100%', '100%', '100%', '30%']}>
          
          <ConnectedIndicator
            onClick={requestAccount}
            address={address}
            isConnected={isConnected}>    
          </ConnectedIndicator>

        </Flex>
        <Flex
          // flex="1"
          position="relative"
          display={'flex'}
          flexDirection="column"
          height={"100%"}
          px={2}
          width={['100%', '100%', '100%', '70%']}>
            <Box
              width={'100%'}
              bg={theme.colors.secondary}
              boxShadow="none"
              rounded={'lg'}
              p={4}
              ref={ref}
              height={"100%"}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <InputGroup sz={"60px"} width={'1400px'}>
                <InputLeftElement pointerEvents="none" children={<MdOutlineSearch color="#aaa" />} />
                <Input 
                  type="search" 
                  bg={theme.colors.white} 
                  placeholder="Search any name or account" 
                  defaultValue={primaryMetaName}
                  onChange={(e) => setSearchMetaName(e.target.value)}
                />
              </InputGroup>
            </Box>
            {/* End of Search Bar */}
        </Flex>
        {/* End of Top Bar */}
      </Flex>

      {

        searchMetaName == '' ?

      <Flex
        py={2}
        // px={2}
        flexDirection={['column', 'column', 'column', 'row']}
        justifyContent={'space-between'}
        overflowY='scroll'
      >
        {/* Section 1 */}
        {renderPersonalDisplay()}
        {/* End Section 1 */}

        {/* Section 2 */}
        {
          address != NULL_ADDRESS ?

        <Flex
          flexDirection="column"
          minHeight="100vh"
          flex="1"
          px={2}
          maxWidth={['100%', '100%', '100%', '48%']}
        >
          <Box display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'}>
            {/* <Box display={['none', 'none', 'none', 'flex']}>
              <UserActionMenu />
            </Box> */}

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
              Add this account within a Simple Name
            </Text>
            <div>
              <Input
                id="meta-address"
                // value={primaryMetaAddress}
                placeholder={primaryMetaAddress}
                bgColor="lightblue"
                my={2}
              />
              <br></br>
              <Input
                id="new-sub-address"
                onChange={(e) => setSubAccountToRegister(e.target.value)}
                value={subAccountToRegister}
                // placeholder="Enter a sub address to approve"
                bgColor="lightblue"
                my={2}
              />
            </div>
            <Button onClick={approve}>Approve</Button>
          </Card>
        </Flex>
        :
        null

      }
        {/* End Section 2 */}
      </Flex>
      :
      renderSearch()

      }

      <LoadingModal isOpen={isApproving} title="Approving your sub address..." />
    </Container>
  );
}

export default DApp;
