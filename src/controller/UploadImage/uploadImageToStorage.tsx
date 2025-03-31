import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/model/firebase/clientApp";

export const uploadImageToStorage = async (
  file: File,
  path: string
): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
