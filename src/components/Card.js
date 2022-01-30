import React from 'react';
import { Box } from '@chakra-ui/react';
import theme from '../theme';

const Card = ({
  hidden,
  children,
  width = 'full',
  height = 'auto',
  bg = theme.colors.white,
  boxShadow = 'none',
  chakraProps,
}) => (
  <Box
    hidden={hidden}
    width={width}
    height={height}
    bg={bg}
    border='0.5px solid #eee'
    boxShadow={boxShadow}
    rounded={'lg'}
    p={6}
    my={5}
    {...chakraProps}
  >
    {children}
  </Box>
);

export default Card;
