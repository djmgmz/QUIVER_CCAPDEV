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
import {
  fetchProfile,
  handleSave,
} from "@/controller/Profile/EditProfileController";
import router from "next/router";

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
    if (user) {
      fetchProfile(user.uid, setProfileData, setFetchingProfile);
    }
  }, [user]);

  const onSave = () => {
    if (user) {
      handleSave(user.uid, profileData, setUsernameError, setLoading, router);
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
      handleSave={onSave}
      loading={loading}
    />
  );
};

export default EditProfile;
