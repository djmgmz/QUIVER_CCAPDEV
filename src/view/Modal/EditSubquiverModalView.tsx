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
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  IconButton,
  HStack,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";
import { FaImage } from "react-icons/fa6";
import { useEditSubquiverController } from "../../controller/Modal/EditSubquiverModalController";

interface EditSubquiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityId: string;
  communityName: string;
  communityDescription: string;
  bannerImageURL?: string;
  iconImageURL?: string;
  onEdit: (
    communityId: string,
    newName: string,
    newDescription: string,
    bannerUrl: string,
    iconUrl: string
  ) => void;
}

const EditSubquiverModal: React.FC<EditSubquiverModalProps> = ({
  isOpen,
  onClose,
  communityId,
  communityName,
  communityDescription,
  bannerImageURL = "",
  iconImageURL = "",
  onEdit,
}) => {
  const {
    newName,
    setNewName,
    newDescription,
    setNewDescription,
    bannerPreview,
    iconPreview,
    handleFileChange,
    handleSaveChanges,
  } = useEditSubquiverController(communityId, communityName, communityDescription, bannerImageURL, iconImageURL, onEdit, onClose);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent bg="white" borderRadius="lg" p={4} maxW="500px">
      <ModalCloseButton />
      <ModalHeader fontSize="lg" fontWeight="bold">Edit your Subquiver</ModalHeader>
      <ModalBody>
        <VStack align="stretch" spacing={4}>
          <FormControl>
            <FormLabel>Subquiver Name</FormLabel>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter new description"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Banner</FormLabel>
            <HStack>
              <label htmlFor="banner-upload">
                <IconButton
                  as="span"
                  icon={<FaImage />}
                  aria-label="Upload Banner"
                  cursor="pointer"
                />
              </label>
              <input
                type="file"
                id="banner-upload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, "banner")}
              />
              {bannerPreview && (
                <Image src={bannerPreview} boxSize="40px" borderRadius="md" />
              )}
            </HStack>
          </FormControl>

          <FormControl>
            <FormLabel>Icon</FormLabel>
            <HStack>
              <label htmlFor="icon-upload">
                <IconButton
                  as="span"
                  icon={<FaImage />}
                  aria-label="Upload Icon"
                  cursor="pointer"
                />
              </label>
              <input
                type="file"
                id="icon-upload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, "icon")}
              />
              {iconPreview && (
                <Image src={iconPreview} boxSize="40px" borderRadius="full" />
              )}
            </HStack>
          </FormControl>

          <Box border="1px solid" borderColor="gray.300" borderRadius="md" p={3}>
            <Text fontSize="sm" fontWeight="bold">
              q/{newName || "your-subquiver-name"}
            </Text>
            <Text fontSize="sm" mt={2} noOfLines={2}>
              {newDescription || "Your subquiver description will appear here..."}
            </Text>
          </Box>
        </VStack>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button colorScheme="blue" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  );
};

export default EditSubquiverModal;
