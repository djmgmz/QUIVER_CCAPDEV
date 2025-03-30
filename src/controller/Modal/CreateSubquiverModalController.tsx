import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, firestore } from "../../model/firebase/clientApp";

export const handleNext = (
  step: number,
  setStep: (val: number) => void,
  communityName: string,
  description: string,
  setNameError: (msg: string) => void,
  setDescError: (msg: string) => void
) => {
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
  setStep(step + 1);
};

export const handleBack = (setStep: (val: number | ((prev: number) => number)) => void) => {
  setStep((prev: number) => prev - 1);
};

export const handleCreateSubquiver = async (
  communityName: string,
  description: string,
  onClose: () => void,
  toast: ReturnType<typeof import("@chakra-ui/react").useToast>
) => {
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
