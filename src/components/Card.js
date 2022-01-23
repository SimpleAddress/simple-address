import React from 'react'
import { Box } from '@chakra-ui/react'
import theme from '../theme'

const Card = ({ 
    children, 
    width='full', 
    height='auto', 
    bg=theme.colors.white, 
    boxShadow='none', 
    chakraProps
}) => (
    <Box
    width={width}
    height={height}
    bg={bg}
    boxShadow={boxShadow}
    rounded={"lg"}
    p={6}
    my={5}
    {...chakraProps}
    >
        {children}
    </Box>
)

export default Card;