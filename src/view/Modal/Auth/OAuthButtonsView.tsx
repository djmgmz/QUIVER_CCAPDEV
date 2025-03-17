import { Text, Flex, Button, Image } from '@chakra-ui/react';
import React from 'react';
import { useOAuthButtons } from '../../../model/Modal/Auth/OAuthButtonsModel';

const OAuthButtons: React.FC = () => {
    const { signInWithGoogle, loading, error } = useOAuthButtons();

    return (
        <Flex direction="column" width="100%" mb={4}>
            <Button 
                variant="oauth" 
                mb={2} 
                isLoading={loading} 
                onClick={() => signInWithGoogle()}
            >
                <Image src="/images/googlelogo.png" height="20px" mr={4} />
                Continue with Google
            </Button>
            {error && <Text>{error.message}</Text>}
        </Flex>
    );
};

export default OAuthButtons;
