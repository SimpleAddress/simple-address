import React from 'react'
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { Center, Container } from '@chakra-ui/react'
import WalletAdmin from './WalletAdmin'
import WalletDetails from './WalletDetails';

const Home = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<WalletAdmin />}  />
                <Route exact path='/details' element={<WalletDetails />} />
                <Route exact path='/admin' element={<WalletAdmin />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Home;