import { signOut } from 'firebase/auth';
import { auth } from '@/model/firebase/clientApp';
import { NextRouter } from 'next/router';
import { UseToastOptions } from '@chakra-ui/react';

export const handleViewProfile = (
  router: NextRouter,
  userId: string | undefined,
  setIsOpen: (open: boolean) => void
) => {
  if (userId) {
    router.push(`/profile/${userId}`);
    setIsOpen(false);
  }
};

export const handleEditProfile = (
  router: NextRouter,
  setIsOpen: (open: boolean) => void
) => {
  router.push(`/profile/edit`);
  setIsOpen(false);
};

export const handleSignOut = async (
  toast: (options: UseToastOptions) => void,
  setIsOpen: (open: boolean) => void
) => {
  await signOut(auth);
  toast({
    title: 'Signed out successfully!',
    status: 'info',
    duration: 3000,
    isClosable: true,
  });
  setIsOpen(false);
};
