import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, firestore, storage } from "@/model/firebase/clientApp";

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
  bannerFile: File | null,
  iconFile: File | null,
  onClose: () => void,
  toast: ReturnType<typeof import("@chakra-ui/react").useToast>
) => {
  try {
    const creatorId = auth.currentUser?.uid;
    const timestamp = serverTimestamp();

    let bannerImageURL = "";
    let iconImageURL = "";

    const subquiverId = doc(collection(firestore, "subquivers")).id;

    if (bannerFile) {
      const bannerRef = ref(storage, `subquivers/${subquiverId}/banner`);
      const bannerSnap = await uploadBytes(bannerRef, bannerFile);
      bannerImageURL = await getDownloadURL(bannerSnap.ref);
    }

    if (iconFile) {
      const iconRef = ref(storage, `subquivers/${subquiverId}/icon`);
      const iconSnap = await uploadBytes(iconRef, iconFile);
      iconImageURL = await getDownloadURL(iconSnap.ref);
    }

    await setDoc(doc(firestore, "subquivers", subquiverId), {
      name: communityName,
      description,
      createdAt: timestamp,
      creatorId,
      bannerImageURL,
      iconImageURL,
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
