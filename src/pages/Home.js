import React, { useEffect, useState } from 'react';
import { Box, Container, Button, Center, Input, Text, Flex, Spacer } from '@chakra-ui/react';
import Card from '../components/Card';
import theme from '../theme';
import UserActionMenu from '../components/UserActionMenu';
import Header from '../components/Header';
import FingerPoint from '../assets/images/FingerPoint.png';
import HandShare from '../assets/images/HandShare.png';
import StarHead from '../assets/images/StarHead.png';
import Woman from '../assets/images/woman.png';
import WalletOne from '../assets/images/wallet_1.png';
import WalletTwo from '../assets/images/wallet_2.png';
import WalletThree from '../assets/images/wallet_3.png';
import WalletFour from '../assets/images/wallet_4.png';
import WalletFive from '../assets/images/wallet_5.png';
import Swirl from '../assets/images/swirl.png';

// For the wallet
import WalletConnect from '../assets/images/walletconnect.jpeg';
import { ethers } from 'ethers';
import SimpleAddressCore from '../abis/SimpleAddressCore.json';
import { NULL_ADDRESS } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { storeMetaAddress, userConnected } from '../redux/SimpleAddressActions';
import { useNavigate } from 'react-router';
import LoadingModal from '../components/LoadingModal';

import contract from "../utils/StartContract.js";


function Home() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userAddress = useSelector((state) => state.user.address);
  const primaryMetaAddress = useSelector((state) => state.user.primaryMetaAddress);

  const [registeredMetaName, setRegisteredMetaName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const userAddressValid = userAddress != NULL_ADDRESS && userAddress !== '';
  const primaryMetaAddressValid = primaryMetaAddress != NULL_ADDRESS && primaryMetaAddress !== '';

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
    if (typeof window.ethereum !== 'undefined' && userAddressValid === true) {
        const metaName = await contract.findByMeta(userAddress);
        dispatch(storeMetaAddress(metaName)); //dispatch an action to store meta address
    }
  }

  // request access to the user's metamask account
  async function requestAccount() {
    return await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
  }

  // call the smart contract, send an update
  async function registerAddress() {
    if (typeof window.ethereum !== 'undefined') {
      setRefresh(false);
      setIsRegistering(true);

      try {
        const transaction = await contract.registerAddress(registeredMetaName);
        await transaction.wait();
        localStorage.setItem(userAddress, transaction);
      } catch (error) {
        //TODO: Show dialog
        setIsRegistering(false);
        setRefresh(true);
        console.log(error);
        return;
      }

      setIsRegistering(false);
      setRefresh(true);
    }
  }

  const renderSimpleAddress = () => {
    if (!primaryMetaAddressValid) {
      return (
        <Flex direction="column" alignItems="center" width="100%" p={10}>
          <Input
            value={registeredMetaName}
            onChange={(e) => setRegisteredMetaName(e.target.value)}
            placeholder="Connect your first simple address"
            width="full"
            my={10}
          />

          <Button width="full" onClick={registerAddress}>
            {' '}
            Register address{' '}
          </Button>
        </Flex>
      );
    }

    return (
      <Flex direction="column" alignItems="center">
        <Text py={5}>You are connected with the meta name: {primaryMetaAddress}</Text>
        <Button onClick={() => navigate('/admin')}> Admin Dashboard </Button>
      </Flex>
    );
  };

  return (
    <Box>
      <Container
        p={0}
        m={0}
        height={'100vh'}
        minWidth="100%"
        flex="1"
        bgColor={theme.colors.primary}
        overflowY="scroll"
      >
        <Flex p={10} style={{ height: '100%' }} flexDirection="column">
          <Flex gap={10} flexDirection="row" alignItems="center">
            <Box flex="2">
              <Header />
            </Box>

            <Box flex="1">
              <UserActionMenu />
            </Box>
          </Flex>
          <Flex
            flex="1.5"
            flexGrow={'1'}
            px={5}
            gap={3}
            flexDirection={['column', 'column', 'column', 'row']}
            alignItems="center"
            justifyContent="space-around"
          >
            <Card chakraProps={{ height: '80%', flex: '2', minHeight: 200 }}>
              <Flex
                height="100%"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-evenly"
              >
                <Text fontWeight="semibold" fontSize={40} width="200px">
                  The last address you'll ever need
                </Text>

                <Box display={['none', 'none', 'none', 'flex']}>
                  <img src={Woman} width={250} height={250} />
                </Box>

                <Box display={['none', 'none', 'none', 'flex']}>
                  <img src={Swirl} width={250} height={250} />
                </Box>

                {/*<Box width='33.3%' height='100%'>
                            <Center position='relative' height='100%' width='100%'>
                                <img src={Swirl} width={200} height={200} />
                                <img src={WalletOne} width={50} height={50} style={{position: 'absolute', top: 200, right: 220}} />
                                <img src={WalletTwo} width={50} height={50} style={{position: 'absolute', bottom: 200, right: 250}} />
                                <img src={WalletThree} width={50} height={50} style={{position: 'absolute', top: 200, left: 220}} />
                                <img src={WalletFour} width={50} height={50} style={{position: 'absolute', bottom: 200, left: 250}} />
                                <img src={WalletFive} width={50} height={50} style={{position: 'absolute', bottom: 235, left: 150}} />
                            </Center>
                    </Box>*/}
              </Flex>
            </Card>

            <Card
              chakraProps={{
                boxShadow: 'xl',
                height: '80%',
                flex: '1',
                minHeight: 200,
              }}
            >
              <Center height="100%" display="flex" flexDirection="column" alignItems="center">
                {userAddressValid ? (
                  renderSimpleAddress()
                ) : (
                  <Button onClick={requestAccount}> Connect a wallet </Button>
                )}
              </Center>
            </Card>
          </Flex>

          <Flex
            flex="1"
            px={5}
            gap={3}
            flexDirection={['column', 'column', 'column', 'row']}
            alignItems="center"
            justifyContent="space-evenly"
          >
            <Card
              chakraProps={{
                height: '80%',
                width: '90%',
                p: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 250,
              }}
            >
              <Text fontSize={20} fontWeight="semibold" textAlign="center">
                Maintain all your wallets in one spot
              </Text>

              <Center height="100%">
                <img src={FingerPoint} width={50} height={50} />
              </Center>
            </Card>

            <Card
              chakraProps={{
                height: '80%',
                width: '90%',
                p: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 250,
              }}
            >
              <Text fontSize={20} fontWeight="semibold" textAlign="center">
                Only share one address to showcase your assets
              </Text>

              <Center height="100%">
                <img src={HandShare} width={120} height={120} />
              </Center>
            </Card>

            <Card
              chakraProps={{
                height: '80%',
                width: '90%',
                p: 8,
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 250,
              }}
            >
              <Text fontSize={20} fontWeight="semibold" textAlign="center">
                Build your reputation and extend it across your addresses
              </Text>

              <Center height="100%" flex="1">
                <img src={StarHead} width={120} height={120} />
              </Center>
            </Card>
          </Flex>
        </Flex>
      </Container>

      <LoadingModal isOpen={isRegistering} title="Registering your meta address..." />
    </Box>
  );
}

export default Home;
