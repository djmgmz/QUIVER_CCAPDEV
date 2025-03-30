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
import {
  handleNext as handleNextFn,
  handleBack as handleBackFn,
  handleCreateSubquiver as handleCreateSubquiverFn,
} from "../../controller/Modal/CreateSubquiverModalController";


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

  const handleNext = () =>
    handleNextFn(
      step,
      setStep,
      communityName,
      description,
      setNameError,
      setDescError
    );

  const handleBack = () => handleBackFn(setStep);

  const handleCreateSubquiver = async () =>
    await handleCreateSubquiverFn(communityName, description, onClose, toast);

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
