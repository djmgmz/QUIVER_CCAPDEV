import { signOut, User } from 'firebase/auth';
import { auth } from '@/model/firebase/clientApp';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useTheme } from '@/view/chakra/themecontext';
import UserMenuView from '@/view/Navbar/RightContent/UserMenuView';

type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleViewProfile = () => {
    router.push(`/profile/${user?.uid}`);
    setIsOpen(false);
  };

  const handleEditProfile = () => {
    router.push(`/profile/edit`);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    toast({
      title: 'Signed out successfully!',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    setIsOpen(false);
  };

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