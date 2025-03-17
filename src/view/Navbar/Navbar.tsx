import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import SearchInput from './SearchInput';
import RightContent from './RightContent/RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/model/firebase/clientApp';
import QuiverText from '@/view/Icons/QuiverText';
import QuiverIcon from '@/view/Icons/QuiverIcon';

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  return (
    <Flex bg="brand.200" height='65px' padding='6px 12px' align="center" justify="space-between" borderBottom="2px solid #3B6064">
      <Flex align="center">
        <QuiverIcon />
        <QuiverText />
      </Flex>
      {/* <Directory /> */}
      <SearchInput />
      <RightContent user={user}/>
    </Flex>
  );
};

export default Navbar;