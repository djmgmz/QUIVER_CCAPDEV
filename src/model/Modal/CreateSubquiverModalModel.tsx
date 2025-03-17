import React, { useState, useEffect } from "react";
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
  ModalOverlay,
  Input,
  Textarea,
  Box,
  VStack,
  HStack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaImage } from "react-icons/fa";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, firestore } from "@/model/firebase/clientApp";
import CreateSubquiverModalView from "@/view/Modal/CreateSubquiverModalView";


interface CreateSubquiverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSubquiverModal: React.FC<CreateSubquiverModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [descError, setDescError] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setCommunityName("");
      setDescription("");
      setNameError("");
      setDescError("");
    }
  }, [isOpen]);

  const handleNext = () => {
    setNameError("");
    setDescError("");

    if (step === 1) {
      if (communityName.trim().length < 3) {
        setNameError("Community name must be at least 3 characters.");
        return;
      }
      if (description.trim().length < 5) {
        setDescError("Description must be at least 5 characters.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleCreateSubquiver = async () => {
    try {
      await addDoc(collection(firestore, "subquivers"), {
        name: communityName,
        description,
        createdAt: serverTimestamp(),
        creatorId: auth.currentUser?.uid,
        bannerImageURL: "",
        iconImageURL: "",
        memberCount: 1,
      });

      toast({
        title: "Subquiver created!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Error creating subquiver.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <CreateSubquiverModalView
      isOpen={isOpen}
      onClose={onClose}
      step={step}
      setStep={setStep}
      communityName={communityName}
      setCommunityName={setCommunityName}
      description={description}
      setDescription={setDescription}
      nameError={nameError}
      setNameError={setNameError}
      descError={descError}
      setDescError={setDescError}
      handleNext={handleNext}
      handleBack={handleBack}
      handleCreateSubquiver={handleCreateSubquiver}
    />
  );
};


export default CreateSubquiverModal;
