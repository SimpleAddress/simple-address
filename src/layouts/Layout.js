import { Box, Grid, GridItem } from '@chakra-ui/react'

const Layout = ({ header, main, sidebar, sidebarHeader }) => {
    return (
        <Grid templateColumns='66.666% 33.333%' templateRows={'10vh 90vh'} height={'100vh'}>
            <GridItem borderBottom={'solid 1px #eee'}>{header}</GridItem>
            <GridItem borderBottom={'solid 1px #eee'} borderLeft={'solid 1px #eee'}>{sidebarHeader}</GridItem>
            <GridItem>{main}</GridItem>
            <GridItem borderLeft={'solid 1px #eee'}>{sidebar}</GridItem>
        </Grid>
    )
}
export default Layout;