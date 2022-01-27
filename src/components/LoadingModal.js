import React from 'react';
import {
  Modal,
  ModalOverlay,
  Spinner,
  ModalContent,
  Text,
  ModalBody,
  Center,
} from '@chakra-ui/react';

function LoadingModal({ isOpen, onClose, title }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={20}>
            <Center display="flex" flexDirection="column" alignItems="center">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />

              <Text py={10}> {title} </Text>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default LoadingModal;
