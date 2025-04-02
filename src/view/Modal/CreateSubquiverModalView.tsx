import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Image,
  Avatar,
  useToast,
  Input,
  Textarea,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, firestore } from "@/model/firebase/clientApp";
import { FaImage } from "react-icons/fa6";

interface CreateSubquiverModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  communityName: string;
  setCommunityName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  nameError: string;
  setNameError: React.Dispatch<React.SetStateAction<string>>;
  descError: string;
  setDescError: React.Dispatch<React.SetStateAction<string>>;
  handleNext: () => void;
  handleBack: () => void;
  handleCreateSubquiver: () => void;
  bannerFile: File | null;
  setBannerFile: React.Dispatch<React.SetStateAction<File | null>>;
  iconFile: File | null;
  setIconFile: React.Dispatch<React.SetStateAction<File | null>>;
}

  

const CreateSubquiverModalView: React.FC<CreateSubquiverModalViewProps> = ({
      isOpen,
      onClose,
      step,
      setStep,
      communityName,
      setCommunityName,
      description,
      setDescription,
      nameError,
      setNameError,
      descError,
      setDescError,
      handleNext,
      handleBack,
      handleCreateSubquiver,
      bannerFile,
      setBannerFile,
      iconFile,
      setIconFile,
  }) => {
  
    useEffect(() => {
      if (!isOpen) {
        setStep(1);
        setCommunityName("");
        setDescription("");
        setNameError("");
        setDescError("");
      }
    }, [isOpen]);

return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="white" borderRadius="lg" p={4} maxW="500px">
        <ModalCloseButton />

        {step === 1 && (
          <>
            <ModalHeader fontSize="lg" fontWeight="bold">
              Tell us about your subquiver
            </ModalHeader>
            <ModalBody>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    Subquiver name <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Input
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    placeholder="Enter subquiver name"
                    maxLength={21}
                    bg="gray.100"
                  />
                  <Text fontSize="xs" color="gray.500">{communityName.length}/21</Text>
                  {nameError && <Text fontSize="xs" color="red.500">{nameError}</Text>}
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    Description <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a description for your subquiver"
                    maxLength={300}
                    bg="gray.100"
                  />
                  <Text fontSize="xs" color="gray.500">{description.length}/300</Text>
                  {descError && <Text fontSize="xs" color="red.500">{descError}</Text>}
                </Box>

                <Box border="1px solid" borderColor="gray.300" borderRadius="md" p={3}>
                  <Text fontSize="sm" fontWeight="bold">
                    q/{communityName || "your-subquiver-name"}
                  </Text>
                  <Text fontSize="sm" mt={2} noOfLines={2}>
                    {description || "Your subquiver description will appear here..."}
                  </Text>
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Flex w="100%" justify="space-between">
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleNext} colorScheme="blue">
                  Next
                </Button>
              </Flex>
            </ModalFooter>
          </>
        )}

        {step === 2 && (
          <>
            <ModalHeader fontSize="lg" fontWeight="bold">
              Style your subquiver
            </ModalHeader>
            <ModalBody>
              <VStack align="stretch" spacing={4}>
              <HStack>
                <Text>Banner</Text>
                <input
                  type="file"
                  accept="image/*"
                  id="banner-upload"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) setBannerFile(e.target.files[0]);
                  }}
                />
                <IconButton
                  aria-label="Upload Banner"
                  icon={<FaImage />}
                  onClick={() => document.getElementById("banner-upload")?.click()}
                />
                {bannerFile && (
                  <Text fontSize="xs" color="gray.600">
                    {bannerFile.name}
                  </Text>
                )}
              </HStack>

              <HStack>
                <Text>Icon</Text>
                <input
                  type="file"
                  accept="image/*"
                  id="icon-upload"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) setIconFile(e.target.files[0]);
                  }}
                />
                <IconButton
                  aria-label="Upload Icon"
                  icon={<FaImage />}
                  onClick={() => document.getElementById("icon-upload")?.click()}
                />
                {iconFile && (
                  <Text fontSize="xs" color="gray.600">
                    {iconFile.name}
                  </Text>
                )}
              </HStack>
                <Box border="1px solid" borderColor="gray.300" borderRadius="md" p={3}>
                  <Text fontSize="sm" fontWeight="bold">
                    q/{communityName || "your-subquiver-name"}
                  </Text>
                  <Text fontSize="sm" mt={2} noOfLines={2}>
                    {description || "Your subquiver description will appear here..."}
                  </Text>
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <HStack spacing={4}>
                <Button onClick={handleBack} variant="outline">
                  Back
                </Button>
                <Button onClick={handleCreateSubquiver}>
                  Create
                </Button>
              </HStack>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
  }
export default CreateSubquiverModalView;
