import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Avatar,
  Button,
  IconButton,
  HStack,
  VStack,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { FaPlus, FaRegComment } from "react-icons/fa";
import { useSetRecoilState, useRecoilState } from "recoil";
import { authModalState } from "@/model/atoms/authModalAtom";
import { deletePostModalState } from "@/model/atoms/deletePostModalAtom";
import { firestore, auth } from "@/model/firebase/clientApp";
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { BiDownvote, BiSolidDownvote, BiSolidUpvote, BiUpvote } from "react-icons/bi";
import CommunityContentView from "@/view/Communities/CommunityContentView";

interface Post {
  id: string;
  title: string;
  description: string;
  author: string;
  username: string;
  community: string;
  upvotes: number;
  downvotes: number;
  userVote?: "upvote" | "downvote" | null;
  createdAt?: string;
}

interface CommunityContentProps {
  name: string;
  subquiverId: string;
}

const CommunityContent: React.FC<CommunityContentProps> = ({ name, subquiverId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const setAuthModal = useSetRecoilState(authModalState);
  const [deleteModal, setDeleteModal] = useRecoilState(deletePostModalState);
  const user = auth.currentUser;
  const router = useRouter();
  const toast = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postsQuery = query(
        collection(firestore, "subquivers", subquiverId, "posts"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(postsQuery);
  
      const postData = await Promise.all(
        querySnapshot.docs.map(async (docItem) => {
          const postData = docItem.data();
          let username = "anonymous";
  
          // Fetch Username
          if (postData.author) {
            const userDoc = await getDoc(doc(firestore, "users", postData.author));
            username = userDoc.exists() ? userDoc.data()?.username || "anonymous" : "anonymous";
          }
  
          // Count Upvotes and Downvotes
          const votesSnapshot = await getDocs(
            collection(firestore, `subquivers/${subquiverId}/posts/${docItem.id}/votes`)
          );
          
          let upvotes = 0;
          let downvotes = 0;
          let userVote: "upvote" | "downvote" | null = null;
  
          votesSnapshot.forEach((voteDoc) => {
            const voteData = voteDoc.data();
            if (voteData.type === "upvote") upvotes++;
            if (voteData.type === "downvote") downvotes++;
            if (voteDoc.id === user?.uid) userVote = voteData.type;
          });
  
          return {
            id: docItem.id,
            title: postData.title,
            description: postData.description,
            author: postData.author,
            username,
            community: name,
            upvotes,
            downvotes,
            userVote,
          };
        })
      );
  
      setPosts(postData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setLoading(false);
  };    

  const checkMembership = async () => {
    if (!user) return;
    const userDoc = await getDoc(doc(firestore, "users", user.uid));
    if (userDoc.exists()) {
      const joinedCommunities = userDoc.data().joinedCommunities || [];
      setJoined(joinedCommunities.includes(subquiverId));
    }
  };

  const handleJoin = async () => {
    if (!user) {
      setAuthModal({ open: true, view: "login" });
      return;
    }
    await updateDoc(doc(firestore, "users", user.uid), {
      joinedCommunities: arrayUnion(subquiverId),
    });
    setJoined(true);
    toast({
      title: "Joined Community!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleLeave = async () => {
    if (!user) return;
    await updateDoc(doc(firestore, "users", user.uid), {
      joinedCommunities: arrayRemove(subquiverId),
    });
    setJoined(false);
    toast({
      title: "Left Community!",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    if (subquiverId) {
      fetchPosts();
      checkMembership();
    }
  }, [subquiverId, user]);

  const handleCreatePost = () => {
    if (!user) {
      setAuthModal({ open: true, view: "login" });
      return;
    }
    router.push(`/subquiver/${encodeURIComponent(name)}/createpost`);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.postId) return;
    try {
      const postId = deleteModal.postId;
  
      const commentsRef = collection(firestore, "subquivers", subquiverId, "posts", postId, "comments");
      const commentsSnapshot = await getDocs(commentsRef);
  
      for (const commentDoc of commentsSnapshot.docs) {
        const commentId = commentDoc.id;
  
        const votesRef = collection(firestore, "subquivers", subquiverId, "posts", postId, "comments", commentId, "votes");
        const votesSnapshot = await getDocs(votesRef);
        for (const voteDoc of votesSnapshot.docs) {
          await deleteDoc(doc(votesRef, voteDoc.id));
        }
  
        await deleteDoc(doc(commentsRef, commentId));
      }
  
      const postVotesRef = collection(firestore, "subquivers", subquiverId, "posts", postId, "votes");
      const postVotesSnapshot = await getDocs(postVotesRef);
      for (const voteDoc of postVotesSnapshot.docs) {
        await deleteDoc(doc(postVotesRef, voteDoc.id));
      }
  
      await deleteDoc(doc(firestore, "subquivers", subquiverId, "posts", postId));
  
      toast({
        title: "Post and its comments deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post and comments:", error);
      toast({
        title: "Failed to delete the post and its comments.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleteModal({ open: false, postId: null });
    }
  };
  

  const handleVote = async (postId: string, type: "upvote" | "downvote") => {
    if (!user) {
      setAuthModal({ open: true, view: "login" });
      return;
    }
  
    const voteRef = doc(firestore, `subquivers/${subquiverId}/posts/${postId}/votes/${user.uid}`);
    const voteDoc = await getDoc(voteRef);
  
    try {
      if (voteDoc.exists()) {
        const currentVote = voteDoc.data().type;
        if (currentVote === type) {
          await deleteDoc(voteRef);
          updateVoteCounts(postId, type, -1);
          updateUserVote(postId, null);
        } else {
          await setDoc(voteRef, { type });
          updateVoteCounts(postId, type, 1);
          updateVoteCounts(postId, currentVote, -1);
          updateUserVote(postId, type);
        }
      } else {
        await setDoc(voteRef, { type });
        updateVoteCounts(postId, type, 1);
        updateUserVote(postId, type);
      }
    } catch (error) {
      console.error("Error handling vote:", error);
    }
  };
  
  const updateVoteCounts = (postId: string, type: "upvote" | "downvote", delta: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId
          ? { ...p, [type === "upvote" ? "upvotes" : "downvotes"]: p[type === "upvote" ? "upvotes" : "downvotes"] + delta }
          : p
      )
    );
  };
  
  const updateUserVote = (postId: string, vote: "upvote" | "downvote" | null) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === postId ? { ...p, userVote: vote } : p))
    );
  };

  return (
    <CommunityContentView
      name={name}
      posts={posts}
      loading={loading}
      joined={joined}
      handleJoin={handleJoin}
      handleLeave={handleLeave}
      handleCreatePost={handleCreatePost}
      handleVote={handleVote}
      deleteModal={deleteModal}
      handleConfirmDelete={handleConfirmDelete}
      setDeleteModal={setDeleteModal}
      fetchPosts={fetchPosts}
      checkMembership={checkMembership}
      updateVoteCounts={updateVoteCounts}
      updateUserVote={updateUserVote}
      user={user}
    />
  );
  

  interface PostCardProps {
    post: Post;
    handleVote: (postId: string, type: "upvote" | "downvote") => void;
    setDeleteModal: (modalState: { open: boolean; postId: string | null }) => void;
    user: { uid: string | null } | null;
  }
  
/* removed unreachable code
const PostCard: React.FC<PostCardProps> = ({ post, handleVote }) => {
  const setAuthModal = useSetRecoilState(authModalState);
  const setDeleteModal = useSetRecoilState(deletePostModalState);
  const user = auth.currentUser;
  const router = useRouter();

  const handleEditPost = () => {
    router.push(`/post/edit/${post.id}?community=${post.community}`);
  };
  
  const handleViewPost = () => {
    router.push(`/post/${post.id}`);
  };

  return (
    <PostCard
      post={post}
      handleVote={handleVote}
      setDeleteModal={setDeleteModal}
      user={user}
    />
  );
  
  } 
*/

}
export default CommunityContent;