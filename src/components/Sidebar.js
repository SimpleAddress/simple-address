import React from "react";

import { Center, Flex, Box, Stack } from "@chakra-ui/react";
import theme from "../theme";
import { Link } from "react-router-dom";
import { RiHome4Fill, RiSettings5Line } from "react-icons/ri";
import { MdOutlineExitToApp } from "react-icons/md";
import { Router, useLocation, useNavigate } from "react-router";
import { BrowserRouter } from "react-router-dom";

const Sidebar = ({ navigate }) => {
  const location = useLocation();
  return (
    <Center
      width="100%"
      height="100vh"
      display={location.pathname === "/" ? "none" : "block"}
    >
      <Box
        height="100vh"
        width="100%"
        py={10}
        width="80px"
        borderRadius={0}
        bg={theme.colors.black}
      >
        <Flex
          minHeight={"100%"}
          width="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="column" width="100%">
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              width="100%"
              my={5}
              as={Link}
              to="/"
            >
              <RiHome4Fill
                cursor="pointer"
                color={theme.colors.primary}
                size={26}
              />
            </Box>
          </Stack>

          <MdOutlineExitToApp color={theme.colors.primary} size={26} />
        </Flex>
      </Box>
    </Center>
  );
};

export default Sidebar;
