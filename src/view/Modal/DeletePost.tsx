import { 
    Text, 
    Button, 
    Flex, 
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    ModalOverlay 
} from '@chakra-ui/react';
import React from 'react';

type DeletePostProps = {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
};

const DeletePost: React.FC<DeletePostProps> = ({ isOpen, onClose, onDelete }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent borderRadius="lg">
                <ModalHeader fontSize="lg" fontWeight="bold">
                    Delete Post?
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text fontSize="sm" color="gray.600">
                        Once you delete this post, it can’t be restored.
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Flex w="100%" justify="space-between">
                        <Button onClick={onClose} variant="outline">
                            Go Back
                        </Button>
                        <Button onClick={onDelete} variant="solid">
                            Yes, Delete
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeletePost;
