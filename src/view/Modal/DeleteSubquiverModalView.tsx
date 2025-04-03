import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Text,
} from "@chakra-ui/react";

interface DeleteSubquiverModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteSubquiverModal: React.FC<DeleteSubquiverModalProps> = ({ isOpen, onClose, onDelete}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Delete Subquiver</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>Are you sure you want to delete this subquiver? This action cannot be undone.</Text>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="default" ml={3} onClick={onDelete}>
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteSubquiverModal;
