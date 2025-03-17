import React from "react";
import {
  Box,
  Text,
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
  Avatar,
  Flex,
} from "@chakra-ui/react";
import useUsername from "@/model/hooks/useUsername";

interface EditPostViewProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  community: string;
  author: string;
}

const EditPostView: React.FC<EditPostViewProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  onCancel,
  onSave,
  community,
  author,
}) => {
    
const username = useUsername(author); 
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
          <Text ml={45} fontSize="40" fontWeight="bold" color="brand.100">
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
          Edit Post
        </Text>

        <Box>
          <Input
            fontSize={20}
            color="brand.100"
            fontWeight="bold"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title"
            _placeholder={{ color: "brand.100" }}
            border="1px solid"
            borderColor="transparent"
            _hover={{ borderColor: "brand.100" }}
          />
          <Textarea
            value={description}
            color="brand.100"
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            mt={4}
            border="1px solid"
            borderColor="transparent"
            placeholder="Post Description"
            _placeholder={{ color: "brand.100" }}
            _hover={{ borderColor: "brand.100" }}
          />
        </Box>

        <Flex justify="flex-end">
          <HStack spacing={4}>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              Save
            </Button>
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );
};

export default EditPostView;
