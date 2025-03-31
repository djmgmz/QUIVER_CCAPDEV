import React from "react";
import {
  Box,
  Text,
  Avatar,
  VStack,
  Flex,
  Input,
  Textarea,
  Spinner,
  Button,
  Icon,
  Image,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

interface EditProfileProps {
  loadingAuth: boolean;
  fetchingProfile: boolean;
  profileData: {
    username: string;
    description: string;
    profilePicture: string;
    banner: string;
  };
  setProfileData: (data: {
    username: string;
    description: string;
    profilePicture: string;
    banner: string;
  }) => void;
  usernameError: boolean;
  setUsernameError: (value: boolean) => void;
  handleSave: () => void;
  loading: boolean;
}

const EditProfileView: React.FC<EditProfileProps> = ({
  loadingAuth,
  fetchingProfile,
  profileData,
  setProfileData,
  usernameError,
  setUsernameError,
  handleSave,
  loading,
}) => {
  return (
    <>
      {(loadingAuth || fetchingProfile) ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <Spinner size="xl" />
        </Box>
      ) : (
        <Box maxW="700px" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="lg">
          <VStack spacing={6} align="stretch">
            <Text color="brand.100" fontSize="2xl" fontWeight="extrabold">
              Profile
            </Text>
            <Text color="brand.100" fontSize="lg" fontWeight="bold">
              General
            </Text>

            <Flex align="center" gap={6}>
              <Box
                position="relative"
                cursor="pointer"
                width="120px"
                height="120px"
                borderRadius="full"
                bg="brand.100"
                display="flex"
                justifyContent="center"
                alignItems="center"
                overflow="hidden"
                onClick={() => document.getElementById("profilePicInput")?.click()}
              >
                {profileData.profilePicture && (
                  <Avatar
                    size="2xl"
                    src={profileData.profilePicture}
                    position="absolute"
                    width="full"
                    height="full"
                  />
                )}
                <Flex
                  position="absolute"
                  direction="column"
                  justify="center"
                  align="center"
                  width="full"
                  height="full"
                  borderRadius="full"
                >
                  <Icon as={FaPlus} boxSize={6} color="brand.200" />
                  <Text fontSize="sm" color="brand.200" align="center">
                    Add a profile picture
                  </Text>
                </Flex>
              </Box>

              <Input
                type="file"
                accept="image/*"
                id="profilePicInput"
                display="none"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setProfileData({
                        ...profileData,
                        profilePicture: reader.result as string,
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />

              <Box flex="1">
                <Text color="brand.100" fontWeight="bold" fontSize="md">
                  Username
                </Text>
                <Input
                  color="brand.100"
                  placeholder="Add Username here"
                  _placeholder={{ color: "brand.100" }}
                  value={profileData.username}
                  border="2px solid"
                  borderColor={usernameError ? "red.500" : "brand.100"}
                  borderRadius="md"
                  _hover={{ borderColor: usernameError ? "red.500" : "brand.100" }}
                  _focus={{ borderColor: usernameError ? "red.500" : "brand.100", boxShadow: "none" }}
                  onChange={(e) => {
                    setProfileData({
                      ...profileData,
                      username: e.target.value,
                    });
                    setUsernameError(false);
                  }}
                />
              </Box>
            </Flex>

            <Box>
              <Text color="brand.100" fontSize={20} fontWeight="bold">
                About Description
              </Text>
              <Textarea
                placeholder="Add details about you"
                _placeholder={{ color: "brand.100" }}
                value={profileData.description}
                border="2px solid"
                borderColor="brand.100"
                borderRadius="md"
                _hover={{ borderColor: "brand.100" }}
                _focus={{ borderColor: "brand.100", boxShadow: "none" }}
                onChange={(e) => setProfileData({
                  ...profileData,
                  description: e.target.value,
                })}
              />
            </Box>

            <Box>
              <Text color="brand.100" fontWeight="bold" fontSize="md">
                Banner
              </Text>
              <Box
                position="relative"
                cursor="pointer"
                width="100%"
                height="150px"
                borderRadius="md"
                border="2px solid"
                borderColor="brand.100"
                display="flex"
                justifyContent="center"
                alignItems="center"
                overflow="hidden"
                onClick={() => document.getElementById("bannerInput")?.click()}
              >
                {profileData.banner && (
                  <Image
                    src={profileData.banner}
                    position="absolute"
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                )}

                <Flex
                  position="absolute"
                  direction="column"
                  justify="center"
                  align="center"
                  width="full"
                  height="full"
                  bg="rgba(0, 0, 0, 0.3)"
                  borderRadius="md"
                  _hover={{ bg: "rgba(0, 0, 0, 0.4)" }}
                >
                  <Icon as={FaPlus} boxSize={6} color="white" />
                  <Text fontSize="sm" color="white" align="center">
                    Add a banner image
                  </Text>
                </Flex>
              </Box>

              <Input
                type="file"
                accept="image/*"
                id="bannerInput"
                display="none"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setProfileData({
                        ...profileData,
                        banner: reader.result as string,
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </Box>

            {usernameError && (
              <Text color="red.500" fontSize="sm" fontWeight="bold">
                Username cannot be empty
              </Text>
            )}

            <Button colorScheme="teal" onClick={handleSave} isLoading={loading}>
              Save Changes
            </Button>
          </VStack>
        </Box>
      )}
    </>
  );
};

export default EditProfileView;
