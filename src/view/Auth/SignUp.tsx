import { authModalState } from '@/model/atoms/authModalAtom';
import { auth, firestore } from '@/model/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/model/firebase/errors';
import { Text, Input, Button, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { doc, setDoc, getDocs, query, collection, orderBy } from 'firebase/firestore';

const SignUp: React.FC = () => {
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

  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name="username"
        placeholder="Username"
        type="text"
        mb={2}
        fontSize="10pt"
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        bg="gray.50"
        onChange={onChange}
      />
      <Input
        required
        name="email"
        placeholder="Email"
        type="email"
        mb={2}
        fontSize="10pt"
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        bg="gray.50"
        onChange={onChange}
      />
      <Input
        required
        name="password"
        placeholder="Password"
        type="password"
        mb={2}
        fontSize="10pt"
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        bg="gray.50"
        onChange={onChange}
      />
      <Input
        required
        name="confirmPassword"
        placeholder="Confirm Password"
        type="password"
        mb={2}
        fontSize="10pt"
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        bg="gray.50"
        onChange={onChange}
      />
      {(error || userError) && (
        <Text textAlign="center" color="red" fontSize="10pt">
          {error || FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
      <Button
        width="100%"
        height="36px"
        mt={2}
        mb={2}
        type="submit"
        isLoading={loading}
      >
        Sign Up
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>Already an archer?</Text>
        <Text
          color="#3B6064"
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: 'login',
            }))
          }
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
};

export default SignUp;
