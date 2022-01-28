import React, { useEffect, useRef, useState } from 'react';

import { Container, Flex, Box, Text, Button, Input, Center, Stack } from '@chakra-ui/react';

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
  );
}

export default WalletAdmin;
