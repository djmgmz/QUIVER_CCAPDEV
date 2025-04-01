import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";

interface EditSubquiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityId: string;
  communityName: string;
  communityDescription: string;
  onEdit: (communityId: string, newName: string, newDescription: string) => void;
}

const EditSubquiverModal: React.FC<EditSubquiverModalProps> = ({
  isOpen,
  onClose,
  communityId,
  communityName,
  communityDescription,
  onEdit,
}) => {
  const [newName, setNewName] = useState(communityName);
  const [newDescription, setNewDescription] = useState(communityDescription);

  // Reset input fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewName(communityName);
      setNewDescription(communityDescription);
    }
  }, [isOpen, communityName, communityDescription]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Subquiver</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Subquiver Name</FormLabel>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Enter new name" />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Subquiver Description</FormLabel>
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter new description"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" ml={3} onClick={() => onEdit(communityId, newName, newDescription)}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditSubquiverModal;
