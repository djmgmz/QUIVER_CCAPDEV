import { storage, firestore } from "@/model/firebase/clientApp";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

export const uploadFile = async (file: File, path: string): Promise<string> => {
  const fileRef = ref(storage, path);
  const fileSnap = await uploadBytes(fileRef, file);
  return getDownloadURL(fileSnap.ref);
};

export const updateSubquiver = async (
  communityId: string,
  newName: string,
  newDescription: string,
  bannerUrl: string,
  iconUrl: string
) => {
  await updateDoc(doc(firestore, "subquivers", communityId), {
    name: newName,
    description: newDescription,
    bannerImageURL: bannerUrl,
    iconImageURL: iconUrl,
  });
};
