import React, { useEffect, useRef, useState } from 'react';

import { Container, Flex, Box, Text, Button, Input, Center } from '@chakra-ui/react';

import Icon from '../components/Icon';
import AddressDisplay from '../components/AddressDisplay';
import UserActionMenu from '../components/UserActionMenu';
import AssetsByTimeChart from '../components/BasicLineChart';

import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

import contract from "../utils/StartContract.js";

import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import Illustration from '../assets/images/Illustration.png';
import theme from '../theme';
import Card from '../components/Card';
import { NULL_ADDRESS } from '../utils/constant';
import { useSelector } from 'react-redux';
import LoadingModal from '../components/LoadingModal';


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
      const address = await contract.findByName(primaryMetaAddress);
      setAddressFromMeta(address);
      setWalletsAttached(1);
    }
  }

  async function getAggregateEther() {
    if (typeof window.ethereum !== 'undefined') {
      const aggregatedEther = await contract.getAggregateEther(primaryMetaAddress);
      setEthEarned(ethers.utils.formatEther(aggregatedEther));
      return aggregatedEther;
    }
  }

  async function approve() {
    if (typeof window.ethereum !== 'undefined') {

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
              <UserActionMenu />
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
