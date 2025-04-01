import React, { useState, useEffect } from "react";
import {
  Box,
  useToast,
} from "@chakra-ui/react";
import {
  collection,
  collectionGroup,
  getDocs,
  getDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "@/model/firebase/clientApp";
import PostsGridView from "@/view/Posts/PostsView";
import { useRouter } from "next/router";

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

const PostsGrid: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<"today" | "week" | "month">("month");

  const router = useRouter();
  const toast = useToast();

  const isPopularView = router.query.view === "popular";

  const getDaysSince = (timestamp: Timestamp | null) => {
    if (!timestamp) return Infinity;
    const now = new Date();
    const createdAt = timestamp.toDate();
    const diffMs = now.getTime() - createdAt.getTime();
    return diffMs / (1000 * 60 * 60 * 24); // days
  };

  const isWithinPeriod = (timestamp: Timestamp | null, period: "today" | "week" | "month") => {
    if (!timestamp) return false;
    const now = new Date();
    const createdAt = timestamp.toDate();
    const diffMs = now.getTime() - createdAt.getTime();

    switch (period) {
      case "today":
        return diffMs < 1000 * 60 * 60 * 24;
      case "week":
        return diffMs < 1000 * 60 * 60 * 24 * 7;
      case "month":
        return diffMs < 1000 * 60 * 60 * 24 * 30;
      default:
        return true;
    }
  };

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const postsQuery = collectionGroup(firestore, "posts");
      const querySnapshot = await getDocs(postsQuery);

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

      let finalPosts = postsData;

      if (isPopularView) {
        finalPosts = postsData
          .filter((post) => isWithinPeriod(post.createdAt || null, timePeriod))
          .map((post) => ({
            ...post,
            popularityScore: (post.upvotes + post.downvotes) / getDaysSince(post.createdAt || null),
          }))
          .sort((a, b) => b.popularityScore - a.popularityScore);
      } else if (router.query.view === "recent") {
        finalPosts = postsData.sort((a, b) => {
          const timeA = a.createdAt?.toMillis() || 0;
          const timeB = b.createdAt?.toMillis() || 0;
          return timeB - timeA;
        });
      }


      setPosts(finalPosts);
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
  }, [router.query.view, timePeriod]);

  return (
    <PostsGridView
      posts={posts}
      loading={loading}
      isPopularView={isPopularView}
      timePeriod={timePeriod}
      setTimePeriod={setTimePeriod}
    />
  );
};

export default PostsGrid;
