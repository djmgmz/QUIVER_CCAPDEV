import { Button, Flex } from '@chakra-ui/react';
import { signOut, User } from "firebase/auth"
import React from 'react';
import AuthButtons from './AuthButtons';
import AuthModal from '@/view/Auth/AuthModal';
import { auth } from '@/model/firebase/clientApp';
import Icons from './Icons';
import UserMenu from '@/model/Navbar/RightContent/UserMenuModel';

type RightContentProps = {
    user?: User | null;
};

const RightContent:React.FC<RightContentProps> = ({ user }) => {
    
    return (
        <>
        <AuthModal />
        <Flex justify='center' align = 'center'>
            {user ?  <Icons/> : <AuthButtons />}
            <UserMenu user={user}/>
        </Flex>
     </>
    );

};
export default RightContent;