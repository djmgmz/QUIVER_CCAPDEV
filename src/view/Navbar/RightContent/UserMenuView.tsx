import {
    Avatar,
    Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Icon,
    Flex,
  } from '@chakra-ui/react';
  import { TiArrowSortedDown } from 'react-icons/ti';
  import { User } from 'firebase/auth';
  
  type UserMenuViewProps = {
    user?: User | null;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    handleViewProfile: () => void;
    handleEditProfile: () => void;
    handleSignOut: () => void;
    toggleTheme: () => void;
  };
  
  const UserMenuView: React.FC<UserMenuViewProps> = ({
    user,
    isOpen,
    setIsOpen,
    handleViewProfile,
    handleEditProfile,
    handleSignOut,
    toggleTheme,
  }) => {
    return (
      <Menu isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <MenuButton
          as={Box}
          cursor="pointer"
          display="flex"
          alignItems="center"
          padding="2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Flex align="center">
            <Avatar
              size="sm"
              src={user ? user.photoURL || '/images/guestprofilepic.jpeg' : '/images/guestprofilepic.jpeg'}
            />
            <Icon
              as={TiArrowSortedDown}
              boxSize={5}
              ml={2}
              transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
              transition="transform 0.2s ease-in-out"
            />
          </Flex>
        </MenuButton>
  
        <MenuList bg="brand.200" borderColor="brand.100">
          {user ? (
            <>
              <MenuItem _hover={{ bg: 'brand.100', color: 'brand.200' }} onClick={handleViewProfile}>
                View Profile
              </MenuItem>
              <MenuItem _hover={{ bg: 'brand.100', color: 'brand.200' }} onClick={handleEditProfile}>
                Edit Profile
              </MenuItem>
              <MenuItem _hover={{ bg: 'brand.100', color: 'brand.200' }} onClick={toggleTheme}>
                Dark Mode
              </MenuItem>
              <MenuItem _hover={{ bg: 'brand.100', color: 'brand.200' }} onClick={handleSignOut}>
                Sign Out
              </MenuItem>
            </>
          ) : (
            <MenuItem _hover={{ bg: 'brand.100', color: 'brand.200' }} onClick={toggleTheme}>
              Dark Mode
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    );
  };
  
  export default UserMenuView;