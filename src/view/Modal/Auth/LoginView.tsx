import { Text, Button, Flex, Input } from '@chakra-ui/react';
import React from 'react';
import { FIREBASE_ERRORS } from '@/model/firebase/errors';
import { useLoginModel } from '../../../model/Modal/Auth/LoginModel';

type LoginProps = {
    
};

const LoginView:React.FC<LoginProps> = () => {
    const { loginForm, onSubmit, onChange, loading, error, setAuthModalState } = useLoginModel();
    return (
        <form onSubmit={onSubmit}>
            <Input 
            required
            name="email" 
            placeholder="email" 
            type="email" 
            mb={2} 
            fontSize='10pt'
            _placeholder={{color: "gray.500"}}
            _hover={{
                bg: 'white',
                border: '1px solid',
                borderColor: "blue.500",
            }}
            _focus={{
                outline: 'none',
                bg: 'white',
                border: '1px solid',
                borderColor: "blue.500",
            }}
            bg="gray.50"
            onChange={onChange}
            />
            <Input 
            required
            name="password" 
            placeholder="password" 
            type="password" 
            mb={2} 
            fontSize='10pt'
            _placeholder={{color: "gray.500"}}
            _hover={{
                bg: 'white',
                border: '1px solid',
                borderColor: "blue.500",
            }}
            _focus={{
                outline: 'none',
                bg: 'white',
                border: '1px solid',
                borderColor: "blue.500",
            }}
            bg="gray.50"
            onChange={onChange}
            />
            <Text textAlign="center" color="red" fontSize="10pt"> 
                {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
            </Text>
            <Button 
            width="100%"
            height="36px"
            mt={2}
            mb={2}
            type="submit"
            isLoading={loading}
            >
                Log In
            </Button>
            <Flex fontSize = '9pt' justifyContent = 'center'>
                <Text mr={1}> 
                    New here?
                </Text>
                <Text 
                    color="#3B6064" 
                    fontWeight={700} 
                    cursor="pointer"
                    onClick={() => setAuthModalState ((prev) => ({
                            ...prev,
                            view: "signup",
                        }))
                    } 
                    > 
                    SIGN UP 
                </Text>
            </Flex>
        </form>
        
    );

};
export default LoginView;