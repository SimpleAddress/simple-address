import React from 'react'
import { Box, Flex, Button } from '@chakra-ui/react'
import Icon from './Icon'

export default function AddressDisplay({ IconSource }) {
    return (
        <Box
        my={2}
        height={'80px'}
        w={'full'}
        bg='#fff'
        boxShadow='none'
        rounded={'lg'}
        p={2}>
            <Flex flexDirection='row'  justifyContent='space-between'>
                <Flex flexDirection={'row'} justifyContent={'center'}>
                    <Icon />
                    <div>
                        <p> Simple Address</p>
                        <Button variant='link'> Share this adddress </Button>
                    </div>
                </Flex>

                <Button variant='solid'>
                        Settings
                    </Button>
            </Flex>
        </Box>
    )
}


