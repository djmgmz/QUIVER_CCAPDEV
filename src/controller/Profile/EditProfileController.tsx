import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage, firestore } from "@/model/firebase/clientApp";
import { uploadImageToStorage } from "../UploadImage/uploadImageToStorage";

export const fetchProfile = async (
  userId: string,
  setProfileData: React.Dispatch<React.SetStateAction<{
    username: string;
    description: string;
    profilePicture: string;
    banner: string;
  }>>,
  setFetchingProfile: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setFetchingProfile(true);
    const userDocRef = doc(firestore, "users", userId);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const data = userSnapshot.data();
      setProfileData({
        username: data.username || "",
        description: data.description || "",
        profilePicture: data.profilePicture || "",
        banner: data.banner || "",
      });
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
  } finally {
    setFetchingProfile(false);
  }
};

export const handleSave = async (
  userId: string,
  profileData: {
    username: string;
    description: string;
    profilePicture: string;
    banner: string;
  },
  setUsernameError: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);

    if (!profileData.username.trim()) {
      setUsernameError(true);
      return;
    }

    const userDocRef = doc(firestore, "users", userId);
    const updatePayload: any = {
      username: profileData.username.trim(),
      description: profileData.description.trim(),
    };

    if (
      profileData.profilePicture &&
      profileData.profilePicture.startsWith("data:")
    ) {
      const blob = await fetch(profileData.profilePicture).then((res) =>
        res.blob()
      );
      const file = new File([blob], `${userId}_profile.jpg`, {
        type: blob.type,
      });
      const url = await uploadImageToStorage(file, `users/${userId}/profile.jpg`);
      updatePayload.profilePicture = url;
    }

    if (profileData.banner && profileData.banner.startsWith("data:")) {
      const blob = await fetch(profileData.banner).then((res) => res.blob());
      const file = new File([blob], `${userId}_banner.jpg`, {
        type: blob.type,
      });
      const url = await uploadImageToStorage(file, `users/${userId}/banner.jpg`);
      updatePayload.banner = url;
    }

    await updateDoc(userDocRef, updatePayload);
    setUsernameError(false);
  } catch (error) {
    console.error("Error updating profile:", error);
  } finally {
    setLoading(false);
  }
};