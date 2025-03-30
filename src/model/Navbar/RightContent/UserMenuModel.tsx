import { signOut, User } from 'firebase/auth';
import { auth } from '@/model/firebase/clientApp';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useTheme } from '@/view/chakra/themecontext';
import UserMenuView from '@/view/Navbar/RightContent/UserMenuView';
import {
  handleViewProfile as viewProfile,
  handleEditProfile as editProfile,
  handleSignOut as signOutHandler,
} from "@/controller/Navbar/RightContent/UserMenuController";

type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleViewProfile = () => viewProfile(router, user?.uid, setIsOpen);
  const handleEditProfile = () => editProfile(router, setIsOpen);
  const handleSignOut = () => signOutHandler(toast, setIsOpen);

  return (
    <UserMenuView
      user={user}
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