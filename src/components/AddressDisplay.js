import React from 'react'
import { Box,Text, Center, Flex, Button } from '@chakra-ui/react'
import Icon from './Icon'

import theme from '../theme'

export default function AddressDisplay({ 
    IconSource, 
    title, 
    subtitle, 
    buttonTitle, 
    onClick=()=>{}, 
    subtitleClickable = false, 
    onClickSubtitle=()=>{} 
}) {
    return (
        <Box
        my={2}
        height={'auto'}
        w={'full'}
        bg='#fff'
        boxShadow='none'
        rounded={'lg'}
        p={5}>
            <Center minWidth={'full'} >
            <Flex 
            minWidth='full' 
            p={0} 
            flexDirection='row' 
            justifyContent='space-between' 
            alignItems={'center'} 
            gap={0}>
                <Flex 
                flexDirection={'row'} 
                justifyContent={'center'}>
                    <Icon />
                    <Box p={0} m={0}>
                        <Text fontWeight={'bold'}>{title}</Text>
                        {
                            subtitleClickable ?
                            <Button 
                            variant='link' 
                            fontSize={12} 
                            fontWeight={'normal'} 
                            color='#000'> 
                                {subtitle} 
                            </Button>
                            :
                            <Text 
                            fontSize={12}
                            fontWeight={'normal'} 
                            color='#000'>
                                {subtitle}
                            </Text>
                        }
                    </Box>
                </Flex>

                <Button 
                variant='solid' 
                onClick={onClick} 
                style={{backgroundColor: theme.colors.secondary, color: theme.colors.primary}}>
                    {buttonTitle}
                </Button>
            </Flex>
            </Center>
        </Box>
    )
}


