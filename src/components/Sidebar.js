import React from 'react';

import { Center, Flex, Box, Stack } from '@chakra-ui/react';
import theme from '../theme';
import { Link } from 'react-router-dom';
import { RiHome4Fill, RiSettings5Line } from 'react-icons/ri';
import { MdOutlineExitToApp } from 'react-icons/md';
import { Router, useLocation, useNavigate } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

const Sidebar = ({ navigate }) => {
  const location = useLocation();
  console.log(location);
  return (
    <Center width="100%" height="100vh" display={location.pathname === '/' ? 'none' : 'block'}>
      <Box
        height="95vh"
        m={2}
        width="120px"
        borderRadius={'20px'}
        bg={theme.colors.secondary}
        boxShadow="none"
        p={7}
      >
        <Flex
          minHeight={'100%'}
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="column">
            <Box my={5} as={Link} to="/admin">
              <RiHome4Fill cursor="pointer" color={theme.colors.primary} size={26} />
            </Box>

            <Box my={5} as={Link} to="/details">
              <RiSettings5Line color={theme.colors.primary} size={26} />
            </Box>
          </Stack>

          <MdOutlineExitToApp color={theme.colors.primary} size={26} />
        </Flex>
      </Box>
    </Center>
  );
};

export default Sidebar;
