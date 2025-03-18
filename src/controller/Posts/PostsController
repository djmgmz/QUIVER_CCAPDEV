import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import {
  collection,
  collectionGroup,
  getDocs,
  getDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "@/model/firebase/clientApp";

interface Post {
  id: string;
  title: string;
  description: string;
  author: string;
  username: string;
  community: string;
  communityName: string;
  createdAt?: Timestamp | null;
  upvotes: number;
  downvotes: number;
  comments: number;
}

const PostsController = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const postsQuery = collectionGroup(firestore, "posts");
      const querySnapshot = await getDocs(postsQuery);

      if (querySnapshot.empty) {
        toast({
          title: "No posts found across subquivers.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      const postsData = await Promise.all(
        querySnapshot.docs.map(async (docItem) => {
          const postData = docItem.data();

          let username = "anonymous";
          const userDoc = await getDoc(doc(firestore, "users", postData.author));
          if (userDoc.exists()) {
            username = userDoc.data().username || "anonymous";
          }

          const subquiverId = docItem.ref.parent.parent?.id || "unknown";
          const subquiverDoc = await getDoc(doc(firestore, "subquivers", subquiverId));
          const communityName = subquiverDoc.exists()
            ? subquiverDoc.data().name || "unknown"
            : "unknown";

          // Count votes
          const votesSnapshot = await getDocs(
            collection(firestore, `subquivers/${subquiverId}/posts/${docItem.id}/votes`)
          );
          let upvotes = 0;
          let downvotes = 0;
          votesSnapshot.forEach((voteDoc) => {
            const vote = voteDoc.data();
            if (vote.type === "upvote") upvotes++;
            if (vote.type === "downvote") downvotes++;
          });

          // Count comments
          const commentsSnapshot = await getDocs(
            collection(firestore, `subquivers/${subquiverId}/posts/${docItem.id}/comments`)
          );

          return {
            id: docItem.id,
            title: postData.title,
            description: postData.description,
            author: postData.author,
            username,
            community: subquiverId,
            communityName,
            createdAt: postData.createdAt as Timestamp | null,
            upvotes,
            downvotes,
            comments: commentsSnapshot.size,
          };
        })
      );

      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error fetching posts.",
        description: "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return { posts, loading };
};

export default PostsController;
