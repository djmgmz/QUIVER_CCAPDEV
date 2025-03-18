import { authModalState } from '@/model/atoms/authModalAtom';
import { auth, firestore } from '@/model/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/model/firebase/errors';
import { Text, Input, Button, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { doc, setDoc, getDocs, query, collection, orderBy } from 'firebase/firestore';

export const useSignUp = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [error, setError] = useState('');
  const [
    createUserWithEmailAndPassword,
    userCredential,
    loading,
    userError,
  ] = useCreateUserWithEmailAndPassword(auth);

  const getNextAvailableId = async (): Promise<number> => {
    try {
      const usersCollection = collection(firestore, 'users');
      const q = query(usersCollection, orderBy('id', 'asc'));
      const querySnapshot = await getDocs(q);

      let existingIds = querySnapshot.docs.map(doc => doc.data().id).sort((a, b) => a - b);
      let nextId = 1;
      for (let id of existingIds) {
        if (id !== nextId) break;
        nextId++;
      }
      
      return nextId;
    } catch (err) {
      console.error("Error fetching user IDs:", err);
      return -1;
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (error) setError('');

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const newUserId = await getNextAvailableId();
      if (newUserId === -1) {
        setError('Failed to generate user ID. Please try again.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        signUpForm.email,
        signUpForm.password
      );

      if (!userCredential || !userCredential.user) {
        setError('User creation failed. Please try again.');
        console.error("Firebase authentication failed:", userError?.message);
        return;
      }

      console.log("User created successfully:", userCredential.user.uid);

      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        id: newUserId,
        username: signUpForm.username,
        email: signUpForm.email,
        profilePicture: null,
      });

      console.log("User data saved to Firestore.");
    } catch (err) {
      console.error("Error during sign-up:", err);
      setError('Error creating account. Please try again.');
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return {signUpForm, onChange, onSubmit, loading, error, userError, setAuthModalState
  };
};
