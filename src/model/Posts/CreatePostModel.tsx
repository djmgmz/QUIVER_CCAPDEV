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

  const handleCreatePost = async () => {
    try {
      if (!currentUser) {
        toast({
          title: "Not Authenticated",
          description: "You must be logged in to create a post.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const subquiverQuery = query(
        collection(firestore, "subquivers"),
        where("name", "==", community)
      );
      const querySnapshot = await getDocs(subquiverQuery);

      if (querySnapshot.empty) {
        toast({
          title: "Subquiver not found.",
          description: "The specified community does not exist.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const subquiverId = querySnapshot.docs[0].id;

      const postRef = collection(firestore, "subquivers", subquiverId, "posts");

      await addDoc(postRef, {
        title,
        description,
        author: currentUser.uid,
        username: username || "anonymous",
        createdAt: serverTimestamp(),
        upvotes: 0,
        downvotes: 0,
      });

      toast({
        title: "Post Created!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push(`/subquiver/${encodeURIComponent(community)}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error creating post.",
        description: "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
