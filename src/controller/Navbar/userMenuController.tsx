import { useRouter } from 'next/router';
import { signOut, User } from 'firebase/auth';
import { auth } from '@/model/firebase/clientApp';
import { useToast } from '@chakra-ui/react';

export const useUserMenuController = (user?: User | null) => {
  const router = useRouter();
  const toast = useToast();

  const handleViewProfile = () => {
    if (user) router.push(`/profile/${user.uid}`);
  };

  const handleEditProfile = () => {
    router.push(`/profile/edit`);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Signed out successfully!',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error signing out',
        description: (error as Error).message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return {
    handleViewProfile,
    handleEditProfile,
    handleSignOut,
  };
};
