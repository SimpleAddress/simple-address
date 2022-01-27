import React, { useState } from 'react';
import { Container, Flex, Text, Box, Button } from '@chakra-ui/react';
import Card from '../components/Card';
import theme from '../theme';
import AddressDisplay from '../components/AddressDisplay';
import moment from 'moment';
import { ethers } from 'ethers';

import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import UserActionMenu from '../components/UserActionMenu';
import { useParams } from 'react-router';

import SimpleAddressCore from '../abis/SimpleAddressCore.json';
import { useSelector } from 'react-redux';
import { NULL_ADDRESS } from '../utils/constant';

const simpleAddressCoreAddress = '0x697783cc3eeFC8FD4F49b382fc9f5F8348d85D97';
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const AccountDetails = ({ linkDate, numCOnnectedAccounts, ethEarned }) => {
  return (
    <Card chakraProps={{ my: 3 }}>
      <Text py={2} textAlign="center" textStyle="h2" textDecorationLine="underline">
        Account Details
      </Text>

      <Flex flexDirection={'column'}>
        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text textStyle="h2">Link Date</Text>

          <Text py={2}>{moment(new Date()).format('LL')}</Text>
        </Box>

        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text textStyle="h2">No. of connected accounts</Text>

          <Text py={2}>0</Text>
        </Box>

        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text textStyle="h2">ETH Earned</Text>

          <Text py={2}>0</Text>
        </Box>
      </Flex>
    </Card>
  );
};

const History = ({ numLookups, numConnectedApplications }) => {
  return (
    <Card chakraProps={{ my: 3 }}>
      <Text py={2} textAlign="center" textStyle="h2" textDecorationLine="underline">
        History
      </Text>

      <Flex flexDirection={'column'}>
        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text textStyle="h2">No. of 3rd party lookups</Text>

          <Text py={2}>0</Text>
        </Box>

        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text textStyle="h2">No. of connected applications</Text>

          <Text py={2}>0</Text>
        </Box>
      </Flex>
    </Card>
  );
};

const WalletInformation = ({ ethAmount, nftAmount, tokenOneAmount, tokenTwoAmount }) => {
  return (
    <Card chakraProps={{ my: 3 }}>
      <Text py={2} textAlign="center" textStyle="h2" textDecorationLine="underline">
        Wallet Information
      </Text>

      <Flex flexDirection={'column'}>
        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text textStyle="h2">ETH</Text>

          <Text py={2}>0</Text>
        </Box>

        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text textStyle="h2">No. of NFTs</Text>

          <Text py={2}>0</Text>
        </Box>

        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text textStyle="h2">Token #1</Text>

          <Text py={2}>0</Text>
        </Box>

        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text textStyle="h2">Token #2</Text>

          <Text py={2}>0</Text>
        </Box>
      </Flex>
    </Card>
  );
};

export default function WalletDetails() {
  const userAddress = useSelector((state) => state.user.address);
  const primaryMetaAddress = useSelector((state) => state.user.primaryMetaAddress);
  const params = useParams();
  const { address } = params;

  async function revoke() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(simpleAddressCoreAddress, SimpleAddressCore.abi, signer);
      const revoke = await contract.revoke(address, userAddress);
      console.log(
        'You have revoked the sub address ' + address + ' to the meta address ' + primaryMetaAddress
      );
    }
  }

  async function getBalance() {
    const userBalance = await provider.getBalance(address);
    return userBalance;
  }

  return (
    <Container
      p={0}
      m={0}
      height="100vh"
      minWidth="100%"
      flex="1"
      bgColor={theme.colors.primary}
      overflowY={['scroll', 'scroll', 'hidden', 'hidden']}
    >
      <Flex
        py={2}
        flexDirection="row"
        alignItems="center"
        flexDirection={['column', 'column', 'column', 'row']}
      >
        <Flex
          px={10}
          height="100vh"
          width={['100%', '100%', '100%', '48%']}
          flexDirection="column"
          alignItems="center"
          flex="1"
        >
          <AddressDisplay
            title={address}
            subtitle="Share this address"
            subtitleClickable={false}
            onClick={() => {}}
            onClickSubtitle={() => {}}
            buttonTitle="Settings"
          />

          <Flex width="full" flex="1" flexDirection="column" alignItems="center">
            <AccountDetails />
            <WalletInformation ethAmount={getBalance()} />
            <History />
          </Flex>
        </Flex>

        <Flex
          px={10}
          height="100vh"
          width={['100%', '100%', '100%', '100%']}
          flexDirection="column"
          alignItems="center"
          justifyContent={'flex-start'}
          flexGrow="1"
          flex="1"
        >
          <Box position="relative" width="100%" top={3} display={['none', 'none', 'none', 'flex']}>
            <UserActionMenu />
          </Box>

          <Card width="100%" chakraProps={{ mt: 10 }}>
            <Flex flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Box>
                <Box pb={5}>
                  <Text fontWeight={'bold'} fontSize={24}>
                    Detach the address
                  </Text>
                  <Text maxWidth="230px" fontWeight="normal" fontSize={15}>
                    Click below to open metamask to detach this wallet
                  </Text>
                </Box>
                <Button
                  variant="solid"
                  color={theme.colors.primary}
                  bgColor={theme.colors.black}
                  onClick={revoke}
                >
                  Detach address
                </Button>
              </Box>

              <MdOutlineAccountBalanceWallet size={100} />
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Container>
  );
}
