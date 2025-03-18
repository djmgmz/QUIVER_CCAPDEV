import { authModalState } from '@/model/atoms/authModalAtom';
import { auth, firestore } from '@/model/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/model/firebase/errors';
import { Text, Input, Button, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { doc, setDoc, getDocs, query, collection, orderBy } from 'firebase/firestore';
import { useSignUp } from '../../../model/Modal/Auth/SignUpModel';

const SignUpView: React.FC = () => {
    const { signUpForm, onChange, onSubmit, loading, error, userError, setAuthModalState } = useSignUp();
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

export default SignUpView;
