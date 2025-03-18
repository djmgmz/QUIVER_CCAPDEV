import { Text, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React from 'react';
import AuthInputs from '@/model/Modal/Auth/AuthInputsModel';
import OAuthButtons from '@/view/Modal/Auth/OAuthButtonsView';
import { useAuthModal } from '../../../model/Modal/Auth/AuthModalModel';

const AuthModalView:React.FC = () => {
    const { modalState, handleClose } = useAuthModal();
    return (
        <>

        <Modal isOpen={modalState.open} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader textAlign="center">
                {modalState.view === "login" && "Login"}
                {modalState.view === "signup" && "Sign Up"}
                {modalState.view === "resetPassword" && "Reset Password"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody 
            display='flex' 
            flexDirection='column' 
            alignItems='center' 
            justifyContent='center'
            pb={6}
            >
                <Flex 
                direction ='column' 
                align='center' 
                justify='center' 
                width='70%'
                >
                    <OAuthButtons />
                    <Text color="gray.500" fontWeight={700}>
                        OR
                    </Text>
                    <AuthInputs />
                    {/* <ResetPassword /> */}
                </Flex>
            </ModalBody>
            </ModalContent>
        </Modal>
        </>
    )
};
export default AuthModalView;