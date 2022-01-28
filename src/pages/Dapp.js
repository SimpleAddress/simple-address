import React, { useEffect, useRef, useState } from 'react';

import { Container, Flex, Box, Text, Button, Input, InputGroup, InputLeftElement, Center } from '@chakra-ui/react';

import Icon from '../components/Icon';
import AddressDisplay from '../components/AddressDisplay';
import UserActionMenu from '../components/UserActionMenu';
import AssetsByTimeChart from '../components/BasicLineChart';
import ConnectedIndicator from '../components/ConnectedIndicator';

// For the wallet
import WalletConnect from '../assets/images/walletconnect.jpeg';
import { ethers } from 'ethers';
import SimpleAddressCore from '../abis/SimpleAddressCore.json';
import { useNavigate } from 'react-router-dom';

import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import Illustration from '../assets/images/Illustration.png';
import theme from '../theme';
import Card from '../components/Card';
import { NULL_ADDRESS } from '../utils/constant';
import { useSelector } from 'react-redux';
import LoadingModal from '../components/LoadingModal';
import { MdOutlineSearch, MdNotificationsActive, MdKeyboardArrowDown } from 'react-icons/md';

const simpleAddressCoreAddress = '0x2062d7b5900058D159Bf493ba6D038B5c682b3BA';

const initialData = [
  {
    name: 'Jan',
    balance: 0,
  },
];

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

function WalletAdmin() {
  const ref = useRef();
  const navigate = useNavigate();

  const userAddress = useSelector((state) => state.user.address);
  const primaryMetaAddress = useSelector((state) => state.user.primaryMetaAddress);

  const [addressFromMeta, setAddressFromMeta] = useState(NULL_ADDRESS);
  const [walletsAttached, setWalletsAttached] = useState(0);
  const [ethEarned, setEthEarned] = useState(0);
  const [newSubAddress, setNewSubAddress] = useState('');
  const [graphData, setGraphData] = useState(initialData);
  const [isApproving, setIsApproving] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Shreyase Additions start
  const [address, setAddressValue] = useState();  // researved to eth_requestAccounts
  const [viewAddress, setViewAddressValue] = useState();
  const [isConnected, setIsConnectedValue] = useState(false);
  // request access to the user's metamask account
  async function requestAccount() {
    const _address = await window.ethereum.request({
      method: "eth_requestAccounts", });
    setAddressValue(_address[0]);
    console.log("dchjvsbdjfcvsdjkhc vgj")
    console.log(_address);
    console.log(_address[0])
    console.log("Inside request accounts, got this address")
    const isConn = await window.ethereum.isConnected();
    if(_address.length>0){
      setIsConnectedValue(true);
    }
    else{
      setIsConnectedValue(false);
    }
    // if(_address===NULL_ADDRESS || _address===null){
    //   setIsConnectedValue(false);
    // }
    // else{
    //   setIsConnectedValue(true);
    // }
    // console.log("address is: "+ address);
    // return address;
  }
  window.ethereum.on('accountsChanged', function (accounts) {
    // Time to reload your interface with accounts[0]!
    console.log("DETECTEDDDDDDDDDDDDDDDDD");
    requestAccount();
  })
  requestAccount();
  //Shreyase Additions End


  const onNavigateAddressSettings = (address) => {
    if (address === NULL_ADDRESS) return;
    navigate(`/details/${address}`);
  };

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
            balance: 0,
          },
          {
            name: 'Mar',
            balance: 0,
          },
          {
            name: 'Apr',
            balance: 0,
          },
          {
            name: 'May',
            balance: 0,
          },
          {
            name: 'Jun',
            balance: 0,
          },
          {
            name: 'Jul',
            balance: 0,
          },
        ]);
      });
      await findByName();
    }

    setup();
  }, []);

  useEffect(() => {
    findByName();
  }, [primaryMetaAddress]);

  //Takes in the meta name (inputted) to retrieve the address
  async function findByName() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(simpleAddressCoreAddress, SimpleAddressCore.abi, signer);
      const address = await contract.findByName(primaryMetaAddress);
      setAddressFromMeta(address);
      setWalletsAttached(1);
    }
  }

  async function getAggregateEther() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(simpleAddressCoreAddress, SimpleAddressCore.abi, signer);
      const aggregatedEther = await contract.getAggregateEther(primaryMetaAddress);
      setEthEarned(Number(aggregatedEther));
      return aggregatedEther;
    }
  }

  async function approve() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(simpleAddressCoreAddress, SimpleAddressCore.abi, signer);

      setRefresh(false);
      setIsApproving(true);

      try {
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
          isConnected={isConnected}></ConnectedIndicator>

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
                <Input type="search" bg={theme.colors.white} placeholder="Search any name or account" />
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
              {addressFromMeta === NULL_ADDRESS ? (
                <Text>This account has no sun addresses registered</Text>
              ) : (
                <AddressDisplay
                  title={addressFromMeta}
                  subtitle={'Share this Address'}
                  subtitleClickable
                  buttonTitle={'Settings'}
                  onClick={() => onNavigateAddressSettings(addressFromMeta)}
                  onClickSubtitle={() => onNavigateAddressSettings(addressFromMeta)}
                />
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
                    {ethEarned /*convertWeiToEth(ethEarned)*/}
                  </Text>
                  <Text>Eth Earned</Text>
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
                value={addressFromMeta}
                placeholder={addressFromMeta}
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
