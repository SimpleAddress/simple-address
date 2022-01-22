import { Center, Container } from '@chakra-ui/react'
import WalletAdmin from './WalletAdmin'
const Home = () => {
    return (
        <Container       
        p={0}
        m={0}
        minHeight="100vw"
        maxW="container.xl">
            <WalletAdmin />
        </Container>
    )
}

export default Home;