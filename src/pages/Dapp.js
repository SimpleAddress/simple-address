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

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

function DApp() {
  const contract = getContract(ContractAddress.SimpleAddressCore,SimpleAddressCore);

  const ref = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // keep only local variables
  const userAddress = useSelector((state) => state.user.address);
  const primaryMetaAddress = useSelector((state) => state.user.primaryMetaAddress);
  const primaryMetaName = useSelector((state) => state.user.primaryMetaName);

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
  const [address, setAddressValue] = useState();  // researved to eth_requestAccounts
  // viewAddress tells which address details are showing
  const [viewAddress, setViewAddressValue] = useState();
  const [isConnected, setIsConnectedValue] = useState(false);

  // request access to the user's metamask account
  async function requestAccount() {
    const _address = await window.ethereum.request({
      method: "eth_requestAccounts", });
    setAddressValue(_address[0]);
    console.log("on eth_requestAccounts")
    // console.log(_address);
    // console.log(_address[0])
    console.log("Inside request accounts, got this address: " + _address[0])
    const isConn = await window.ethereum.isConnected();
    if(_address.length>0){
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


  const onNavigateAddressSettings = (address) => {
    if (address === NULL_ADDRESS) return;
    navigate(`/details/${address}`);
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

  //Takes in the address and returns the name
  async function findByMeta() {
    if (typeof window.ethereum !== 'undefined') {
      const metaName = await contract.findByMeta(address);
      dispatch(storeMetaName(metaName)); //dispatch an action to store meta address
      console.log('findbyMeta found: '+ metaName);
      viewConnections();
    }
  }
  
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

  return (
    <Container
      p={0}
      m={0}
      height={'100vh'}
      minWidth="100%"
      flex="1"
      bgColor={theme.colors.white}
      overflowY={['scroll', 'scroll', 'hidden', 'hidden']}
    >
      {/* Top Bar Begins*/}
      <Flex
        py={5}
        px={2}
        flexDirection={['column', 'column', 'column', 'row']}
        justifyContent={'space-between'}
        bgColor={theme.colors.white}
        // overflowY={['scroll', 'scroll', 'hidden', 'hidden']}
        height={'120px'}
      >
        <Flex
          position="relative"
          display={'flex'}
          flexDirection="column"
          height={"100%"}
          px={2}
          width={['100%', '100%', '100%', '29%']}>
          
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
          width={['100%', '100%', '100%', '69%']}>
            <Box
              width={'100%'}
              bg={theme.colors.secondary}
              boxShadow="none"
              rounded={'lg'}
              p={2}
              ref={ref}
              height={"100%"}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <InputGroup sz={"xl"} width={'1400px'}>
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
              bg={theme.colors.secondary}
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
                <p>It's good to see you again.</p>
              </Box>

              {/* View Wallet Address, Editable/Cannot Modify Indicators, Connect Button, Text to provide intuition */}


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
        {/* End Section 1 */}

        {/* Section 2 */}
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
        {/* End Section 2 */}
      </Flex>

      <LoadingModal isOpen={isApproving} title="Approving your sub address..." />
    </Container>
  );
}

export default DApp;
