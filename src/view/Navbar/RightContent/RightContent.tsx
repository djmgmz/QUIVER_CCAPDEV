import { Flex } from '@chakra-ui/react';
import { User } from "firebase/auth"
import React from 'react';
import AuthButtons from './AuthButtons';
import AuthModalView from '@/view/Modal/Auth/AuthModalView';
import Icons from './Icons';
import UserMenu from '@/model/Navbar/RightContent/UserMenuModel';


type RightContentProps = {
    user?: User | null;
};

const RightContent:React.FC<RightContentProps> = ({ user }) => {
    
    return (
        <>
        <AuthModalView/>
        <Flex justify='center' align = 'center'>
            {user ?  <Icons/> : <AuthButtons />}
            <UserMenu user={user}/>
        </Flex>
     </>
    );

};
export default RightContent;