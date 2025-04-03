import { addDoc, arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, firestore, storage } from "@/model/firebase/clientApp";
import router from "next/router";

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

    // **Step 1: Check if a subquiver with the same name already exists**
    const subquiversRef = collection(firestore, "subquivers");
    const q = query(subquiversRef, where("name", "==", communityName));
    const existingSubquivers = await getDocs(q);

    if (!existingSubquivers.empty) {
      toast({
        title: "Subquiver already exists!",
        description: "A community with this name already exists. Choose a different name.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // **Step 2: Check if the user is already a member of the subquiver**
    const subquiverId = doc(subquiversRef).id;

    let bannerImageURL = "";
    let iconImageURL = "";

   // **Step 3: Upload the banner and icon images to Firebase Storage**
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

    // **Step 4: Create the subquiver document in Firestore**
    await setDoc(doc(firestore, "subquivers", subquiverId), {
      name: communityName,
      description,
      createdAt: timestamp,
      creatorId,
      bannerImageURL,
      iconImageURL,
      memberCount: 1,
    });

    // **Step 5: Auto-join the creator**
    if (!auth.currentUser?.uid) {
      throw new Error("User is not authenticated.");
    }
    await updateDoc(doc(firestore, "users", auth.currentUser.uid), {
      joinedCommunities: arrayUnion(subquiverId),
    });

    toast({
      title: "Subquiver created & joined!",
      description: "You have automatically joined this community.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    router.reload();

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

