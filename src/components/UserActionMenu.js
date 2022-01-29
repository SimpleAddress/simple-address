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

import { MdOutlineSearch, MdKeyboardArrowDown } from 'react-icons/md';
import theme from '../theme';
export default function UserActionMenu() {
  return (
    <Stack  direction="row" alignItems='center'>
      <InputGroup width={'400px'}>
        <InputLeftElement pointerEvents="none" children={<MdOutlineSearch color="#aaa" />} />
        <Input type="search" bg={theme.colors.white} placeholder="Search a simple address" />
      </InputGroup>

          <Avatar name="E H" size={'xs'} cursor="pointer" />
      </Stack>
  );
}
