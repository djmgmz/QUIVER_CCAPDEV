import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Text, useToast } from "@chakra-ui/react";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/model/firebase/clientApp";
import EditPost from "@/model/Posts/EditPostModel";
import Layout from "@/view/Layout/Layout";

const EditPostPage: React.FC = () => {
  const router = useRouter();
  const { id, community } = router.query;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id || !community) return;

      try {
        // Step 1: Find the subquiver ID by the community name
        const subquiverQuery = query(
          collection(firestore, "subquivers"),
          where("name", "==", community)
        );
        const subquiverSnapshot = await getDocs(subquiverQuery);

        if (subquiverSnapshot.empty) {
          console.error("Subquiver not found");
          return;
        }

        const subquiverId = subquiverSnapshot.docs[0].id;

        // Step 2: Fetch the post by ID
        const postRef = doc(firestore, "subquivers", subquiverId, "posts", id as string);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const postData = postSnap.data();
          setTitle(postData.title);
          setDescription(postData.description);
          setAuthor(postData.author);
        } else {
          console.error("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id, community]);

  const handleSave = async () => {
    if (!id || !community) return;

    try {
      const subquiverQuery = query(
        collection(firestore, "subquivers"),
        where("name", "==", community)
      );
      const subquiverSnapshot = await getDocs(subquiverQuery);

      if (subquiverSnapshot.empty) {
        console.error("Subquiver not found");
        return;
      }

      const subquiverId = subquiverSnapshot.docs[0].id;

      const postRef = doc(firestore, "subquivers", subquiverId, "posts", id as string);
      await updateDoc(postRef, {
        title,
        description,
      });

      toast({
        title: "Post updated!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push(`/subquiver/${community}`);
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error updating post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!title && !description) {
    return <Text>Loading...</Text>;
  }

  return (
    <Layout>
      <EditPost
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        community={community as string}
        author={author}
        onCancel={() => router.back()}
        onSave={handleSave}
      />
    </Layout>
  );
};

export default EditPostPage;
