import React, { useEffect, useState } from 'react';
import { Box, Center, Text, Flex, Container, Button, Stack, Input } from '@chakra-ui/react';
import WalletAdmin from './WalletAdmin';
import theme from '../theme';
import { connect, useDispatch, useSelector } from 'react-redux';
import Card from '../components/Card';
import { NULL_ADDRESS } from '../utils/constant';
import Icon from '../components/Icon';
import AddressDisplay from '../components/AddressDisplay';
import LoadingModal from '../components/LoadingModal';
import contract from '../utils/StartContract';
import { storeMetaAddress, userConnected } from '../redux/SimpleAddressActions';

function SimpleAddress() {
  const [connectedSimpleNames, setConnectedSimpleNames] = useState([0, 1, 2, 3, 4, 5, 6]);
  const primaryMetaAddress = useSelector((state) => state.user.primaryMetaAddress);
  const userAddress = useSelector((state) => state.user.address);
  const dispatch = useDispatch();

  const validUserAddress = userAddress != NULL_ADDRESS && userAddress != '';
  const validPrimaryMetaAddress = primaryMetaAddress != NULL_ADDRESS && primaryMetaAddress != '';

  const [nameToRegister, setNameToRegister] = useState('');
  const [subAccountToRegister, setSubAccountToRegister] = useState('');

  const [isRegisteringSimpleName, setIsRegisteringSimpleName] = useState(false);
  const [isApprovingSubAccount, setIsApprovingSubAccount] = useState(false);
  const [refresh, setRefresh] = useState(false);

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
    if (typeof window.ethereum !== 'undefined' && validUserAddress === true) {
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
        const transaction = await contract.approve(userAddress, subAccountToRegister);
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
                    Don’t have a simple Name yet? Create Your first Simple Name now !
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
              Connected Simple names
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
                    Add this account within a simple name
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
              {connectedSimpleNames.map((simpleName) => {
                return (
                  <AddressDisplay
                    key={simpleName}
                    title={primaryMetaAddress}
                    subtitle={userAddress}
                    buttonTitle="View Account"
                  />
                );
              })}
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

        <Box>Search bar</Box>
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

        <WalletAdmin />
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
