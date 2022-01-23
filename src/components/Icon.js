import { Center } from '@chakra-ui/react';
import React from 'react';

import { SiEthereum } from 'react-icons/si';

const Icon = ({ IconSource }) => (
  <Center
    borderRadius={8}
    mx={2}
    minHeight={'max'}
    style={{ width: '50px', backgroundColor: '#7FC9E0' }}
  >
    <SiEthereum size={30} />
  </Center>
);

export default Icon;
