import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/model/firebase/clientApp";

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
    await updateDoc(userDocRef, {
      username: profileData.username.trim(),
      description: profileData.description.trim(),
    });

    setUsernameError(false);
  } catch (error) {
    console.error("Error updating profile:", error);
  } finally {
    setLoading(false);
  }
};