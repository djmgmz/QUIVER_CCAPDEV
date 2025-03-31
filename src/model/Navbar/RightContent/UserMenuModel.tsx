import { signOut, User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useTheme } from '@/view/chakra/themecontext';
import UserMenuView from '@/view/Navbar/RightContent/UserMenuView';
import {
  handleViewProfile as viewProfile,
  handleEditProfile as editProfile,
  handleSignOut as signOutHandler,
} from "@/controller/Navbar/RightContent/UserMenuController";
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/model/firebase/clientApp';

type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user?.uid) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfilePicture(data.profilePicture || null);
        }
      }
    };

    fetchProfilePicture();
  }, [user?.uid]);

  const handleViewProfile = () => viewProfile(router, user?.uid, setIsOpen);
  const handleEditProfile = () => editProfile(router, setIsOpen);
  const handleSignOut = () => signOutHandler(toast, setIsOpen, setProfilePicture);

  return (
    <UserMenuView
      user={user}
      profilePicture={profilePicture}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleViewProfile={handleViewProfile}
      handleEditProfile={handleEditProfile}
      handleSignOut={handleSignOut}
      toggleTheme={toggleTheme}
    />
  );
};

export default UserMenu;