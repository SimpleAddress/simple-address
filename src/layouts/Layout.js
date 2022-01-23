import React from 'react'
import { Box, Grid, Flex, GridItem } from '@chakra-ui/react'
import theme from '../theme'
const Layout = ({ header, main, sidebar, sidebarHeader }) => {
    return (
        <Flex direction={'row'} height={'100vh'}>
            <Box bgColor={theme.colors.primary} minHeight={'100vh'} display={['none', 'none', 'flex', 'flex']}>
            {sidebar}
            </Box>
            <Box flex='1'>
            {main}
            </Box>
        </Flex>
    )
}
export default Layout;