import React from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  Input,
  Textarea,
  Button,
  Flex,
} from "@chakra-ui/react";

interface CreatePostViewProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  onCancel: () => void;
  handleCreatePost: () => void;
  community: string;
  username: string | null;
}

const CreatePostView: React.FC<CreatePostViewProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  onCancel,
  handleCreatePost,
  community,
  username,
}) => {
  return (
    <Box width="full">
      <Box width="full" height="150px" bg="brand.100" position="relative">
        <Avatar
          size="xl"
          position="absolute"
          bottom="-40px"
          left="20px"
          border="4px solid"
          borderColor="white"
          bg="brand.100"
        />
      </Box>

      <HStack mt={2} ml={24} spacing={2} align="flex-start">
        <VStack align="start" spacing={0}>
          <Text ml={45} fontSize="40" color="brand.100" fontWeight="bold">
            q/{community}
          </Text>
          <Text ml={45} fontSize="sm" color="brand.100">
            Posted by u/{username || "anonymous"}
          </Text>
        </VStack>
      </HStack>

      <VStack
        align="stretch"
        spacing={4}
        maxW="1500px"
        ml={3}
        mt={6}
        p={6}
        border="2px solid"
        borderColor="black"
        borderRadius="lg"
      >
        <Text fontSize="2xl" fontWeight="extrabold" color="brand.100">
          Create Post
        </Text>

        <Box>
          <Input
            fontSize={20}
            fontWeight="bold"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            color="brand.100"
            placeholder="Enter post Title here..."
            _placeholder={{ color: "brand.100" }}
            border="1px solid"
            borderColor="transparent"
            _hover={{ borderColor: "brand.100" }}
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            mt={4}
            color="brand.100"
            placeholder="Enter post description here..."
            _placeholder={{ color: "brand.100" }}
            border="1px solid"
            borderColor="transparent"
            _hover={{ borderColor: "brand.100" }}
          />
        </Box>

        <Flex justify="flex-end">
          <HStack spacing={4}>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleCreatePost}>Create</Button>
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );
};

export default CreatePostView;
