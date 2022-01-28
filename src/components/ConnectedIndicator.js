import React from 'react';
import { Box, Text, Center, Flex, Button } from '@chakra-ui/react';
import Icon from './Icon';

import theme from '../theme';

export default function AddressDisplay({
    address,
    onClick = () => {},
    isConnected
  }) {
    
    var indicator_color=theme.colors.grey;
    var indicator_text="Not Connected";
    var indicator_text_color=theme.colors.white;
    var display_text="Connect your wallet to continue";
    var hidden=false;
    console.log(isConnected);
    if(isConnected==true){
        console.log(isConnected);
        indicator_color=theme.colors.connectedGreen;
        indicator_text="Connected";
        display_text=address;
        indicator_text_color=theme.colors.white;
        hidden=true;
    }
    return (
        <Flex
        justifyContent={'space-between'}
        width={'100%'}
        height={"100%"}
        bg={theme.colors.secondary}
        rounded={'lg'}
        p={2}
        flexDirection={"column"}
        >
            <Flex
                width={"100%"}
                height={"30px"}
                justifyContent={'space-between'}
            >
                <Button 
                    width={"45%"}
                    height={"30px"}
                    bg={indicator_color}
                    color={indicator_text_color}
                    _hover={{
                        background: {indicator_color},
                        color:{indicator_text_color},
                      }}
                    >{indicator_text}
                </Button>
                <Button 
                    hidden={hidden}
                    width={"45%"}
                    height={"30px"}
                    onClick={onClick}
                    bg={theme.colors.black}
                    color={theme.colors.white}
                    >Connect
                </Button>
            </Flex>
            <Flex
                width={"100%"}
                height={"40%"}
                p={2}
                justifyContent={'space-between'}
                alignItems="center"
                
            >
                <p align="justify">{display_text}</p>
            </Flex> 
            
            
        </Flex>

    )}





