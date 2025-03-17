import React from "react";
import { Box, Text, Textarea, Button, VStack, HStack, Avatar, Flex, Divider } from "@chakra-ui/react";

interface EditCommentView {
  communityName: string;
  postAuthor: string;
  commentAuthor: string;
  postTitle: string;
  postDescription: string;
  editedContent: string;
  setEditedContent: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

const EditComment: React.FC<EditCommentView> = ({ 
  communityName,
  postAuthor,
  commentAuthor,
  postTitle,
  postDescription,
  editedContent,
  setEditedContent,
  onCancel,
  onSave
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
          <Text ml={45} fontSize="40" color="brand.100" fontWeight="bold">q/{communityName}</Text>
          <Text ml={45} fontSize="sm" color="brand.100">Posted by u/{postAuthor}</Text> 
        </VStack>
      </HStack>

      <Box ml={100} mt={4} p={4}>
        <Text maxW="1400px" fontSize="xl" color="brand.100" fontWeight="bold">{postTitle}</Text>
        <Text maxW="1400px" fontSize="md" color="brand.100">{postDescription}</Text>
      </Box>

      <Divider borderColor="brand.100" my={6} width="85%" mx="auto" />

      <VStack 
        align="stretch" 
        spacing={4} 
        maxW="1400px" 
        mx="auto" 
        width="85%" 
        mt={6} 
        p={6} 
        border="2px solid" 
        borderColor="brand.100" 
        borderRadius="lg"
      >
        <Text fontSize="2xl" fontWeight="extrabold" color="brand.100">Edit Comment</Text>

        <HStack spacing={3} align="center">
          <Avatar size="md" bg="brand.100" />
          <VStack align="start" spacing={0}>
            <Text fontSize="md" color="brand.100" fontWeight="bold">q/{communityName}</Text>
            <Text fontSize="sm" color="brand.100">u/{commentAuthor}</Text>
          </VStack>
        </HStack>

        <Box>
          <Textarea 
            value={editedContent} 
            onChange={(e) => setEditedContent(e.target.value)} 
            rows={6} 
            mt={4} 
            color="brand.100"
            border="1px solid" 
            borderColor="transparent"
            placeholder="Comment here..."
            _placeholder={{ color: "brand.100" }}
            _hover={{ borderColor: "brand.100" }} 
          />
        </Box>

        <Flex justify="flex-end">
          <HStack spacing={4}>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={onSave}>
              Save
            </Button>
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );
};

export default EditComment;
