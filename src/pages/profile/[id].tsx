import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProfileDetails from "@/model/Profile/ProfileDetailsModel";
import { firestore, auth } from "@/model/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface UserProfile {
  uid: string;
  username: string;
  email: string;
  description: string;
  profilePicture: string | null;
}

const ProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    if (!id) return;
  
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userRef = doc(firestore, "users", id as string);
        const userSnap = await getDoc(userRef);
  
        if (userSnap.exists()) {
          setUserData({
            ...(userSnap.data() as Omit<UserProfile, "uid">),
            uid: userSnap.id,
          });
        } else {
          console.error("User not found");
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
      setLoading(false);
    };
  
    fetchUser();
  }, [id]);  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsCurrentUser(user.uid === id);
      } else {
        setIsCurrentUser(false);
      }
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userData) {
    return <p>User not found</p>;
  }

  return <ProfileDetails user={userData} isCurrentUser={isCurrentUser} />;
};

export default ProfilePage;
