import React, { useEffect, useRef, useState } from 'react';

import { Container, Flex, Box, Text, Button, Input, Center, Stack } from '@chakra-ui/react';

import Icon from '../components/Icon';
import AddressDisplay from '../components/AddressDisplay';
import AssetsByTimeChart from '../components/BasicLineChart';

import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

import contract from "../utils/StartContract.js";

import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import Illustration from '../assets/images/Illustration.png';
import theme from '../theme';
import Card from '../components/Card';
import { NULL_ADDRESS } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import LoadingModal from '../components/LoadingModal';

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
  
  const [searchMetaName, setSearchMetaName] = useState(0);
  const [addressFromMeta, setAddressFromMeta] = useState(NULL_ADDRESS);
  const [walletsAttached, setWalletsAttached] = useState(0);
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


  useEffect(() => {
    async function search(){
      if (!searchMetaName) { findByMeta(); }
      else {
        dispatch(storeMetaName(searchMetaName)); // update primaryMetaName 
        console.log('search name is: '+ primaryMetaName);
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
  //   findByName();
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

      const connectionsChecked = listConnections?.length ? listConnections : []

      setListWalletsAttached(connectionsChecked);
      console.log('connections for address: ' + primaryMetaAddress);
      console.log(listConnections);
      setWalletsAttached(connectionsChecked.length+"");
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
        const transaction = await contract.approve(primaryMetaAddress, newSubAddress);
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
