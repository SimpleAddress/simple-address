import React from 'react'

import { Box, Input, InputGroup, InputLeftElement, Spacer, Flex, Avatar } from '@chakra-ui/react'

import { MdOutlineSearch, MdNotificationsActive, MdKeyboardArrowDown } from "react-icons/md";
import theme from '../theme';
export default function UserActionMenu() {
    return (
        <Box minWidth={'max'} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
            
            <Box maxWidth='lg'>
            <InputGroup width={'max'}>
                <InputLeftElement
                pointerEvents='none'
                children={<MdOutlineSearch color='gray.300' />}
                />
                <Input type='tel' bg={theme.colors.white} placeholder='Search a simple address ' />
                </InputGroup>
            </Box>

                <Flex>
                    <Box mx={2}>
                        <MdNotificationsActive size={20} />
                    </Box>
                <Box mx={2} display='flex'>
                    <Avatar name='E H' size={'xs'} />
                    <MdKeyboardArrowDown />
                </Box>
                </Flex>

        </Box>
    )
}