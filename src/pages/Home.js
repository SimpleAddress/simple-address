import React, {useState} from 'react';
import { Box, Container, Button, Center, Text, Flex, Spacer } from '@chakra-ui/react';
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

import WalletConnect from '../assets/images/walletconnect.jpeg';


function Home() {

  const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
	}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}


	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);


  return (
    <Box>
      <Container
        p={0}
        m={0}
        height={'100vh'}
        minWidth="100%"
        flex="1"
        bgColor={theme.colors.primary}
        overflowY={['scroll', 'scroll', 'hidden', 'hidden']}
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

                <img src={Woman} width={250} height={250} />

                <img src={Swirl} width={250} height={250} />

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
              <Center height="100%">
                <Button onClick={connectWalletHandler} variant="solid" color={theme.colors.primary} bgColor={theme.colors.black}>
                  Connect with Wallet
                </Button>
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
    </Box>
  );
}

export default Home;
