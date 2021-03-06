import React, { useEffect, useState } from 'react';
import { Box, Container, Button, Center, Input, Text, Flex, Spacer } from '@chakra-ui/react';
import Card from '../components/Card';
import theme from '../theme';
import Header from '../components/Header';
import FingerPoint from '../assets/images/FingerPoint.png';
import HandShare from '../assets/images/HandShare.png';
import StarHead from '../assets/images/StarHead.png';
import Woman from '../assets/images/woman.png';
import Swirl from '../assets/images/swirl.png';

import { useNavigate } from 'react-router';

function Home() {
  const navigate = useNavigate();

  return (
      <Box
        p={0}
        m={0}
        height='100vh'
        flex="1"
        width='100vw'
        bgColor={theme.colors.primary}
        overflowY="scroll"
      >
        <Flex width='100%' p={10} style={{ height: '100%' }} flexDirection="column">
        <Flex gap={10} flexDirection="row" alignItems="center">
            <Box flex="2">
              <Header />
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
              <Button onClick={() => navigate('/dapp')}> Go to application </Button>
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
      </Box>
  );
}

export default Home;
