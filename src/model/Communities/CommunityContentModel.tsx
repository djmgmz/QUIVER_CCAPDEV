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
import {
  handleJoin as join,
  handleLeave as leave,
  handleCreatePost as create,
  handleConfirmDelete as confirmDelete,
  handleVote as vote,
} from "../../controller/Communities/CommunityContentController";

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
  profilePicture?: string | null;
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
          let profilePicture: string | null = null;
  
          // Fetch Username and Profile Picture
          if (postData.author) {
            const userDoc = await getDoc(doc(firestore, "users", postData.author));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              username = userData?.username || "anonymous";
              profilePicture = userData?.profilePicture || null;
            }
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
            profilePicture,
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

  useEffect(() => {
    if (subquiverId) {
      fetchPosts();
      checkMembership();
    }
  }, [subquiverId, user]);


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

  const handleJoin = (
    user: any,
    subquiverId: string,
    setJoined: (val: boolean) => void,
    toast: ReturnType<typeof useToast>,
    setAuthModal: ReturnType<typeof useSetRecoilState>
  ) => {
    join(user, subquiverId);
    setJoined(true);
    toast({ title: "Joined Community!", status: "success", duration: 3000, isClosable: true });
  };
  
  const handleLeave = (
    user: any,
    subquiverId: string,
    setJoined: (val: boolean) => void,
    toast: ReturnType<typeof useToast>
  ) => {
    leave(user, subquiverId);
    setJoined(false);
    toast({ title: "Left Community!", status: "info", duration: 3000, isClosable: true });
  };
  
  const handleCreatePost = (
    user: any,
    name: string,
    router: ReturnType<typeof useRouter>,
    setAuthModal: ReturnType<typeof useSetRecoilState>
  ) => {
    create(user, name, router);
  };
  
  const handleConfirmDelete = (
    subquiverId: string,
    postId: string,
    toast: ReturnType<typeof useToast>,
    fetchPosts: () => void,
    setDeleteModal: ReturnType<typeof useRecoilState>[1]
  ) => {
    confirmDelete(subquiverId, postId);
    toast({ title: "Post and its comments deleted successfully!", status: "success", duration: 3000, isClosable: true });
    fetchPosts();
    setDeleteModal({ open: false, postId: null });
  };
  
  const handleVote = async (
    user: any,
    subquiverId: string,
    postId: string,
    type: "upvote" | "downvote",
    setAuthModal: ReturnType<typeof useSetRecoilState>,
    updateVoteCounts: (id: string, type: "upvote" | "downvote", delta: number) => void,
    updateUserVote: (id: string, vote: "upvote" | "downvote" | null) => void
  ) => {
    const result = await vote(user, subquiverId, postId, type);
    if (result === "added") {
      updateVoteCounts(postId, type, 1);
      updateUserVote(postId, type);
    } else if (result === "removed") {
      updateVoteCounts(postId, type, -1);
      updateUserVote(postId, null);
    } else if (result === "switched") {
      updateVoteCounts(postId, type, 1);
      updateVoteCounts(postId, type === "upvote" ? "downvote" : "upvote", -1);
      updateUserVote(postId, type);
    }
  };

  const onConfirmDelete = () => {
    if (!deleteModal.postId) return;
    confirmDelete(subquiverId, deleteModal.postId);
    toast({
      title: "Post and its comments deleted successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    fetchPosts();
    setDeleteModal({ open: false, postId: null });
  };
  
  const onJoin = () => {
    join(user, subquiverId);
    setJoined(true);
    toast({
      title: "Joined Community!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  const onLeave = () => {
    leave(user, subquiverId);
    setJoined(false);
    toast({
      title: "Left Community!",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const onCreatePost = () => {
    create(user, name, router);
  };
  
  const onVote = async (postId: string, type: "upvote" | "downvote") => {
    const result = await vote(user, subquiverId, postId, type);
  
    if (result === "added") {
      updateVoteCounts(postId, type, 1);
      updateUserVote(postId, type);
    } else if (result === "removed") {
      updateVoteCounts(postId, type, -1);
      updateUserVote(postId, null);
    } else if (result === "switched") {
      updateVoteCounts(postId, type, 1);
      updateVoteCounts(postId, type === "upvote" ? "downvote" : "upvote", -1);
      updateUserVote(postId, type);
    }
  };
  
  

  return (
    <CommunityContentView
      name={name}
      posts={posts}
      loading={loading}
      joined={joined}
      handleJoin={onJoin}
      handleLeave={onLeave}
      handleCreatePost={onCreatePost}
      handleVote={onVote}
      deleteModal={deleteModal}
      handleConfirmDelete={onConfirmDelete}
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
  
}
export default CommunityContent;