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
    type: "post" | "comment";
  };
  
  const DeletePost: React.FC<DeletePostProps> = ({ isOpen, onClose, onDelete, type }) => {
    const title = type === "post" ? "Delete Post?" : "Delete Comment?";
    const body = type === "post"
      ? "Once you delete this post, it can’t be restored."
      : "Once you delete this comment, it can’t be restored.";
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="lg">
          <ModalHeader fontSize="lg" fontWeight="bold">{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm" color="gray.600">{body}</Text>
          </ModalBody>
          <ModalFooter>
            <Flex w="100%" justify="space-between">
              <Button onClick={onClose} variant="outline">
                Go Back
              </Button>
              <Button onClick={onDelete} variant="solid" colorScheme="red">
                Yes, Delete
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default DeletePost;
