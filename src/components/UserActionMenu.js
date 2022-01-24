import React from 'react';

import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Flex,
  Avatar,
  Stack,
} from '@chakra-ui/react';

import { MdOutlineSearch, MdNotificationsActive, MdKeyboardArrowDown } from 'react-icons/md';
import theme from '../theme';
export default function UserActionMenu() {
  return (
    <Box
      width="100%"
      display={'flex'}
      flexDirection={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <InputGroup width={'400px'}>
        <InputLeftElement pointerEvents="none" children={<MdOutlineSearch color="#aaa" />} />
        <Input type="search" bg={theme.colors.white} placeholder="Search a simple address" />
      </InputGroup>

      <Stack mx={2} direction="row" gap={2}>
        <MdNotificationsActive size={25} />

        <Box mx={2} display="flex" flexDirection="row" alignItems="center">
          <Avatar name="E H" size={'xs'} cursor="pointer" />
          <MdKeyboardArrowDown cursor="pointer" />
        </Box>
      </Stack>
    </Box>
  );
}
