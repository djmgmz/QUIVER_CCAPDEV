import { Box, Text, Spinner, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/view/Layout/Layout';
import PostDetails from '@/model/Posts/PostDetailsModel';
import { firestore } from '@/model/firebase/clientApp';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

interface Post {
  id: string;
  title: string;
  description: string;
  author: string;
  community: string;
  createdAt?: string;
  upvotes: number;
  downvotes: number;
}

interface Comment {
  id: string;
  author: string;
  username: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: any;
}

const PostDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchPost = async (postId: string) => {
    try {
      const subquiversSnapshot = await getDocs(collection(firestore, "subquivers"));

      for (const subquiverDoc of subquiversSnapshot.docs) {
        const postRef = doc(firestore, "subquivers", subquiverDoc.id, "posts", postId);
        const postSnapshot = await getDoc(postRef);

        if (postSnapshot.exists()) {
          const postData = postSnapshot.data();

          setPost({
            id: postSnapshot.id,
            ...postData,
            community: subquiverDoc.id,
          } as Post);

          fetchComments(subquiverDoc.id, postSnapshot.id);
          return;
        }
      }

      toast({
        title: "Post not found.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error("Error fetching post:", error);
      toast({
        title: "Error fetching post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (subquiverId: string, postId: string) => {
    try {
      const commentsRef = collection(firestore, "subquivers", subquiverId, "posts", postId, "comments");
      const querySnapshot = await getDocs(commentsRef);

      const commentsData = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      })) as Comment[];

      setComments(commentsData);

    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error fetching comments.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchPost(id);
    }
  }, [id]);

  if (loading) {
    return (
      <Layout showGrid={false}>
        <Box p={6}>
          <Spinner size="xl" />
        </Box>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout showGrid={false}>
        <Box p={6}>
          <Text>No post found.</Text>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout showGrid={false}>
      <PostDetails post={post} comments={comments} />
    </Layout>
  );
};

export default PostDetail;
