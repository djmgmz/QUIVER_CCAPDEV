import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Text,
  Textarea,
  VStack,
  Flex,
  Spinner,
  Icon,
  Avatar,
  Button,
} from "@chakra-ui/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaPlus } from "react-icons/fa";
import { auth, firestore } from "@/model/firebase/clientApp";
import { Image } from "@chakra-ui/react";
import EditProfileView from "@/view/Profile/EditProfileView";

type ProfileData = {
  username: string;
  description: string;
  profilePicture: string;
  banner: string;
};

const EditProfile: React.FC = () => {
  const [user, loadingAuth] = useAuthState(auth);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    description: "",
    profilePicture: "",
    banner: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [usernameError, setUsernameError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setFetchingProfile(true);
        const userDocRef = doc(firestore, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const data = userSnapshot.data() as Partial<ProfileData>;
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

    if (user) fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    if (!profileData.username.trim()) {
      setUsernameError(true);
      return;
    }

    try {
      setLoading(true);
      const userDocRef = doc(firestore, "users", user.uid);
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

  return (
    <EditProfileView
      loadingAuth={loadingAuth}
      fetchingProfile={fetchingProfile}
      profileData={profileData}
      setProfileData={setProfileData}
      usernameError={usernameError}
      setUsernameError={setUsernameError}
      handleSave={handleSave}
      loading={loading}
    />
  );
};

export default EditProfile;
