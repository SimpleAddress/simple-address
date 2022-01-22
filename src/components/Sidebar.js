import React from "react";

import { Center, Flex, Box, useColorModeValue, Spacer } from "@chakra-ui/react";
import theme from "../theme";

import { RiHome4Fill, RiSettings5Line,  } from "react-icons/ri";
import { MdOutlineExitToApp } from "react-icons/md";

const Sidebar = () => {
  return (
    <Center bgColor={theme.colors.primary} minHeight={"100vh"} width={'250px'} p={8}>
      <Box
        minHeight={"90vh"}
        my={2}
        height={"80px"}
        maxW={"60%"}
        borderRadius={'20px'}
        w={"full"}
        bg={useColorModeValue(theme.colors.secondary, "gray.900")}
        boxShadow="xl"
       
        p={7}
      >
        <Flex minHeight={'100%'} flexDirection='column' alignItems='center' justifyContent='space-between'>
            <div>
                <Box my={5}>
                    <RiHome4Fill color={theme.colors.primary} size={26}   />
                </Box>

                <Box my={5}>
                    <RiSettings5Line color={theme.colors.primary} size={26} />
                </Box>
            </div>

            <MdOutlineExitToApp color={theme.colors.primary} size={26} />
        </Flex>
      </Box>
    </Center>
  );
};

export default Sidebar;
