// controller/Posts/CreatePostController.ts
import { addDoc, collection, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/model/firebase/clientApp";
import { NextRouter } from "next/router";
import { UseToastOptions } from "@chakra-ui/react";

export const handleCreatePost = async (
  currentUser: any,
  title: string,
  description: string,
  username: string,
  community: string,
  router: NextRouter,
  toast: (options: UseToastOptions) => void
) => {
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
};
