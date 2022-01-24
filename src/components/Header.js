import React from 'react'

import {
    Box,
    Flex,
    Avatar,
    HStack,
    Link,
    IconButton,
    Text,
    Button,
    Spacer,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
  } from '@chakra-ui/react';
  import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import theme from '../theme';
import { RiHome4Fill, RiSettings5Line } from 'react-icons/ri';

  const Links = ['Dashboard', 'Projects', 'Team'];
  
  const NavLink = ({ children }) => (
    <Link
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}>
      {children}
    </Link>
  );

export default function Header() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box display='flex' flexDirection='row' alignItems='center' p={3} borderRadius={30} bg={theme.colors.black} color='white' px={10}>
            <Text fontWeight='bold' fontSize={20}>
                Simple Address
            </Text>

            <Spacer />

            <Stack direction='row' gap={4}>
            <RiHome4Fill cursor="pointer" color={theme.colors.primary} size={26} />
  <RiSettings5Line color={theme.colors.primary} size={26} />
            </Stack>
      </Box>
    )
}