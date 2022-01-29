import React from "react";
import { Box, Text, Center, Flex, Button } from "@chakra-ui/react";
import Icon from "./Icon";

import theme from "../theme";

export default function AddressDisplay({
  address,
  onClick = () => {},
  isConnected,
}) {
  var indicator_color = theme.colors.grey;
  var indicator_text = "Not Connected";
  var indicator_text_color = theme.colors.white;
  var display_text = "Connect your wallet to continue";
  var hidden = false;

  if (isConnected == true) {
    indicator_color = theme.colors.connectedGreen;
    indicator_text = "Connected";
    display_text = address;
    indicator_text_color = theme.colors.white;
    hidden = true;
  }
  return (
    <Flex
      justifyContent={"center"}
      width={"100%"}
      height={"100%"}
      bg={theme.colors.secondary}
      p={2}
      flexDirection={"column"}
      alignItems="center"
      border="0.5px solid #eee"
      bgColor="#f7f7fa"
    >
      <Button
        width="100%"
        flex="1"
        height={"25px"}
        bg={indicator_color}
        color={indicator_text_color}
        _hover={{
          background: { indicator_color },
          color: { indicator_text_color },
        }}
      >
        {indicator_text}
      </Button>
    </Flex>
  );
}
