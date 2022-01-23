import React from 'react'

import { Box, Input, InputGroup, InputLeftElement, Spacer, Flex, Avatar } from '@chakra-ui/react'

import { MdOutlineSearch, MdNotificationsActive, MdKeyboardArrowDown } from "react-icons/md";
import theme from '../theme';
export default function UserActionMenu() {
    return (
        <Box 
        width='100%' 
        display={'flex'} 
        flexDirection={'row'} 
        alignItems={'center'} 
        justifyContent={'space-between'}>
            <InputGroup width={'400px'}>
                <InputLeftElement
                pointerEvents='none'
                children={<MdOutlineSearch color='gray.300' />}
                />
                <Input 
                type='search' 
                bg={theme.colors.white} 
                placeholder='Search a simple address ' />
                </InputGroup>

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