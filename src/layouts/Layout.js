import { Box, Grid, Flex, GridItem } from '@chakra-ui/react'

const Layout = ({ header, main, sidebar, sidebarHeader }) => {
    return (
        <Flex direction={'row'} height={'100vh'}>
        {sidebar}
        <Box flex='1'>
        {main}
        </Box>
        </Flex>
    )
}
export default Layout;