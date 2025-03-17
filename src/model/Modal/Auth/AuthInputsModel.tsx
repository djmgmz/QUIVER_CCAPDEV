import { authModalState } from '@/model/atoms/authModalAtom';
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import AuthInputsView from '../../../view/Modal/Auth/AuthInputsView';

type AuthInputsProps = {};

const AuthInputs:React.FC<AuthInputsProps> = () => {
    const modalState = useRecoilValue(authModalState);

    return (
    <AuthInputsView view={modalState.view} />
    );
}
export default AuthInputs;