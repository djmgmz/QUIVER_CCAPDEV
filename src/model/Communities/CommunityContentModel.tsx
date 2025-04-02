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
  handleEditSubquiver,
  handleDeleteSubquiver
} from "../../controller/Communities/CommunityContentController";
import { useAuthState } from "react-firebase-hooks/auth";

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
  const [bannerImageURL, setBannerImageURL] = useState<string | null>(null);
  const [iconImageURL, setIconImageURL] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("Community Description");
  const [user, loadingUser] = useAuthState(auth);
  const [creatorId, setCreatorId] = useState<string | null>(null);
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
  
          if (postData.author) {
            const userDoc = await getDoc(doc(firestore, "users", postData.author));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              username = userData?.username || "anonymous";
              profilePicture = userData?.profilePicture || null;
            }
          }

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
    const fetchSubquiverMetadata = async () => {
      try {
        const subquiverDoc = await getDoc(doc(firestore, "subquivers", subquiverId));
        if (subquiverDoc.exists()) {
          const data = subquiverDoc.data();
          console.log("Current User UID:", user?.uid);
          console.log("Creator ID from Firestore:", data.creatorId);
          setBannerImageURL(data.bannerImageURL || null);
          setIconImageURL(data.iconImageURL || null);
          setDescription(data.description || "No description available");
          setCreatorId(data.creatorId || null);
        }
      } catch (error) {
        console.error("Error fetching subquiver metadata:", error);
      }
    };    
  
    if (subquiverId) {
      fetchSubquiverMetadata();
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
  
  const onJoin = async () => {
    await join(user, subquiverId);
    setJoined(true);
    toast({
      title: "Joined Community!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    router.reload();
  };
  
  const onLeave = async () => {
    await leave(user, subquiverId);
    setJoined(false);
    toast({
      title: "Left Community!",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    router.reload();
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

  const onEditSubquiver = () => {
    handleEditSubquiver(
      subquiverId,
      "Updated Name", 
      "Updated Description",
      (options) => toast({ ...options, status: options.status as "info" | "warning" | "success" | "error" | "loading" }), 
      fetchPosts,
      router
    );
  }; 

  const onDeleteSubquiver = () => {
    handleDeleteSubquiver(
      subquiverId,
      (options) => toast({ ...options, status: options.status as "info" | "warning" | "success" | "error" | "loading" }),
      router
    );
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
      user={user ? { uid: user.uid } : null}
      onEditSubquiver={onEditSubquiver}
      onDeleteSubquiver={onDeleteSubquiver}
      description={description}
      bannerImageURL={bannerImageURL}
      iconImageURL={iconImageURL}
      authorProfilePic={user?.photoURL || null}
      communityId={subquiverId}
      creatorId={creatorId}
    />
  );
  
}
export default CommunityContent;