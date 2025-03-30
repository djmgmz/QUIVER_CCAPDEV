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
  useToast,
} from "@chakra-ui/react";
import { addDoc, collection, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { firestore, auth } from "@/model/firebase/clientApp";
import { useRouter } from "next/router";
import useUsername from "@/model/hooks/useUsername"; // Import the hook
import CreatePostView from "@/view/Posts/CreatePostView";
import { handleCreatePost as createPost } from "@/controller/Posts/CreatePostController";

interface CreatePostProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  onCancel: () => void;
  onCreate: () => void;
  community: string;
}

const CreatePost: React.FC<CreatePostProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  onCancel,
  onCreate,
  community,
}) => {
  const toast = useToast();
  const router = useRouter();
  const currentUser = auth.currentUser;
  const username = useUsername(currentUser?.uid ?? null);

  const handleCreatePost = () =>
    createPost(currentUser, title, description, username || "anonymous", community, router, toast);

  return (
    <CreatePostView
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      onCancel={onCancel}
      handleCreatePost={handleCreatePost}
      community={community}
      username={username}
    />
  );
  
};

export default CreatePost;
