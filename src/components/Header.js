import React from 'react';

import { Box, Text, Spacer, Stack } from '@chakra-ui/react';
import { Link } from 'react-router-dom'
import theme from '../theme';
import { RiHome4Fill, RiSettings5Line } from 'react-icons/ri';

export default function Header() {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      p={3}
      borderRadius={30}
      bg={theme.colors.black}
      color="white"
      boxShadow='dark-lg'
      px={10}
    >
      <Text fontWeight="bold" fontSize={20}>
        Simple Address
      </Text>

      <Spacer />

      <Stack direction="row" gap={4}>
        <Box as={Link} to="/">
          <RiHome4Fill ecursor="pointer" color={theme.colors.primary} size={26} />
        </Box>

        <Box as={Link} to="/admin">
          <RiSettings5Line cursor='pointer' color={theme.colors.primary} size={26} />
        </Box>
      </Stack>
    </Box>
  );
}
