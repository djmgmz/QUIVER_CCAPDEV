import React, { useEffect, useState } from "react";
import ProfileDetailsView from "@/view/Profile/ProfileDetailsView";
import { 
  Box, Text, Avatar, VStack, HStack, Button, Tab, TabList, TabPanel, TabPanels, Tabs, Flex, Divider, 
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/router";
import { BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa6";
import { Spinner } from "@chakra-ui/react";
import { auth, firestore } from "@/model/firebase/clientApp";
import {
  collectionGroup,
  getDocs,
  getDoc,
  collection,
  query,
  where,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { BsThreeDots } from "react-icons/bs";
import { deletePostModalState } from "@/model/atoms/deletePostModalAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "@/model/atoms/authModalAtom";



interface ProfileDetailsProps {
  user: {
    uid: string;
    username: string;
    description: string;
    profilePicture: string | null;
  };
  isCurrentUser: boolean;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user, isCurrentUser }) => {
  const router = useRouter();
  const { uid } = router.query;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true); 
  const [deleteModal, setDeleteModal] = useRecoilState(deletePostModalState);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [postVotes, setPostVotes] = useState({ upvotes: 0, downvotes: 0 });
    const [commentVotes, setCommentVotes] = useState<{ [key: string]: { upvoted: boolean, downvoted: boolean } }>(
      comments.reduce((acc, comment) => {
        acc[comment.id] = { upvoted: false, downvoted: false };
        return acc;
      }, {} as { [key: string]: { upvoted: boolean, downvoted: boolean } })
    );
  const currentUser = auth.currentUser;
  const setAuthModal = useSetRecoilState(authModalState);
  const toast = useToast();

  const [upvotedItems, setUpvotedItems] = useState<any[]>([]);
  const [downvotedItems, setDownvotedItems] = useState<any[]>([]);
  const [loadingVotes, setLoadingVotes] = useState(true);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [currentSubquiverId, setCurrentSubquiverId] = useState<string>("");
  const [parentPostId, setParentPostId] = useState<string>("");

  const castVote = async (
    type: "upvote" | "downvote",
    target: "post" | "comment",
    postId: string,
    subquiverId: string,
    commentId?: string
  ) => {
    try {
      const votePath = commentId
        ? `subquivers/${subquiverId}/posts/${postId}/comments/${commentId}/votes/${currentUser?.uid}`
        : `subquivers/${subquiverId}/posts/${postId}/votes/${currentUser?.uid}`;
  
      const voteRef = doc(firestore, votePath);
      const voteDoc = await getDoc(voteRef);
  
      if (voteDoc.exists()) {
        const existingVote = voteDoc.data().type;
        if (existingVote === type) {
          await deleteDoc(voteRef);
          console.log("Vote removed successfully!");
        } else {
          await setDoc(voteRef, { type });
          console.log(`Vote updated to ${type}`);
        }
      } else {
        await setDoc(voteRef, { type });
        console.log(`${type} successfully recorded!`);
      }
  
      // Refresh the respective vote counts
      if (target === "post") {
        await refreshPostVotes(postId, subquiverId);
      } else if (target === "comment" && commentId) {
        await refreshCommentVotes(commentId, postId, subquiverId);
      }
  
      // Refresh the upvoted and downvoted panels
      await refreshUserVotes();
  
    } catch (error) {
      console.error("Error casting vote:", error);
    }
  };        

  const handlePostUpvote = (postId: string, community: string) => {
    castVote("upvote", "post", postId, community).then(() =>
      refreshPostVotes(postId, community)
    );
  };
  
  const handlePostDownvote = (postId: string, community: string) => {
    castVote("downvote", "post", postId, community).then(() =>
      refreshPostVotes(postId, community)
    );
  };    
  
  const handleCommentUpvote = (commentId: string, postId: string, community: string) => {
    castVote("upvote", "comment", postId, community, commentId).then(() =>
      refreshCommentVotes(commentId, postId, community)
    );
  };
  
  const handleCommentDownvote = (commentId: string, postId: string, community: string) => {
    castVote("downvote", "comment", postId, community, commentId).then(() =>
      refreshCommentVotes(commentId, postId, community)
    );
  };    
  
  const refreshPostVotes = async (postId: string, communityId: string) => {
    const { upvotes, downvotes } = await countVotes("post", communityId, postId);
    
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId ? { ...p, upvotes, downvotes } : p
      )
    );
  };
  
  const refreshCommentVotes = async (
    commentId: string,
    postId: string,
    communityId: string
  ) => {
    const { upvotes, downvotes } = await countVotes("comment", communityId, postId, commentId);
  
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, upvotes, downvotes }
          : comment
      )
    );
  };  
  
  const countVotes = async (
    target: "post" | "comment",
    communityId: string,
    postId: string,
    commentId?: string
  ) => {
    const votePath = commentId
      ? `subquivers/${communityId}/posts/${postId}/comments/${commentId}/votes`
      : `subquivers/${communityId}/posts/${postId}/votes`;

    const votesSnapshot = await getDocs(collection(firestore, votePath));

    let upvotes = 0;
    let downvotes = 0;

    votesSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.type === "upvote") upvotes++;
      else if (data.type === "downvote") downvotes++;
    });

    return { upvotes, downvotes };
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
  
      try {
        const postsQuery = query(
          collectionGroup(firestore, "posts"),
          where("author", "==", user.uid)
        );
  
        const querySnapshot = await getDocs(postsQuery);
  
        const postsData = await Promise.all(
          querySnapshot.docs.map(async (docItem) => {
            const postData = docItem.data();
            const subquiverId = docItem.ref.parent.parent?.id || "unknown";
  
            const subquiverSnapshot = await getDoc(doc(firestore, "subquivers", subquiverId));
            const communityName = subquiverSnapshot.exists()
              ? subquiverSnapshot.data().name || "Unknown Subquiver"
              : "Unknown Subquiver";
  
            let postAuthorUsername = "Unknown Author";
            if (postData.author) {
              const authorSnapshot = await getDoc(doc(firestore, "users", postData.author));
              postAuthorUsername = authorSnapshot.exists()
                ? authorSnapshot.data().username || "Unknown Author"
                : "Unknown Author";
            }
  
            const { upvotes, downvotes } = await countVotes("post", subquiverId, docItem.id);
  
            const createdAtDate = postData.createdAt?.toDate();
            const formattedCreatedAt = createdAtDate ? createdAtDate.toLocaleString() : "Unknown Date";
  
            return {
              id: docItem.id,
              title: postData.title,
              description: postData.description,
              upvotes,
              downvotes,
              comments: postData.comments || 0,
              community: communityName,
              subquiverId,
              postAuthorUsername,
              createdAt: formattedCreatedAt,
            };
          })
        );
  
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserPosts();
  }, [user.uid]);      

  useEffect(() => {
    const fetchUserComments = async () => {
      if (!user?.uid) {
        setCommentsLoading(false);
        return;
      }
  
      try {
        const commentsQuery = query(
          collectionGroup(firestore, "comments"),
          where("author", "==", user.uid)
        );
  
        const querySnapshot = await getDocs(commentsQuery);
  
        const commentsData = await Promise.all(
          querySnapshot.docs.map(async (docItem) => {
            const commentData = docItem.data();
            const postRef = docItem.ref.parent.parent;
            const subquiverRef = postRef?.parent.parent;
  
            let postTitle = "Unknown Post";
            let postAuthorUsername = "Unknown Author";
            let subquiverName = "Unknown Subquiver";
            const postId = postRef?.id || "unknown";
            const subquiverId = subquiverRef?.id || "unknown";
  
            if (postRef) {
              const postSnapshot = await getDoc(postRef);
              if (postSnapshot.exists()) {
                const postData = postSnapshot.data();
                postTitle = postData.title || "Unknown Post";
  
                if (postData.author) {
                  const userSnapshot = await getDoc(doc(firestore, "users", postData.author));
                  postAuthorUsername = userSnapshot.exists() 
                    ? userSnapshot.data().username || "Unknown Author" 
                    : "Unknown Author";
                }
              }
            }
  
            if (subquiverRef) {
              const subquiverSnapshot = await getDoc(subquiverRef);
              subquiverName = subquiverSnapshot.exists() 
                ? subquiverSnapshot.data().name || "Unknown Subquiver"
                : "Unknown Subquiver";
            }
  
            const { upvotes, downvotes } = await countVotes("comment", subquiverId, postId, docItem.id);
  
            return {
              id: docItem.id,
              content: commentData.content,
              createdAt: commentData.createdAt,
              upvotes,
              downvotes,
              postTitle,
              postAuthorUsername,
              subquiverName,
              subquiverId,
              postId,
            };
          })
        );
  
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setCommentsLoading(false);
      }
    };
  
    fetchUserComments();
  }, [user.uid]);
  
  useEffect(() => {
    const fetchUserVotes = async () => {
      if (!user?.uid) return;
  
      setLoadingVotes(true);
  
      try {
        const upvotedData = await fetchVotesByType("upvote");
        const downvotedData = await fetchVotesByType("downvote");
  
        setUpvotedItems(upvotedData);
        setDownvotedItems(downvotedData);
      } catch (error) {
        console.error("Error fetching voted items:", error);
      }
  
      setLoadingVotes(false);
    };
  
    fetchUserVotes();
  }, [user.uid]);
  
  // Function to fetch votes based on type
  const fetchVotesByType = async (voteType: "upvote" | "downvote") => {
    const votesQuery = query(
      collectionGroup(firestore, "votes"),
      where("type", "==", voteType)
    );
  
    const voteSnapshots = await getDocs(votesQuery);
  
    const results = await Promise.all(
      voteSnapshots.docs
        .filter((voteDoc) => voteDoc.id === currentUser?.uid) // ✅ Filter by document ID (userId)
        .map(async (voteDoc) => {
          const votePath = voteDoc.ref.path;
          const parts = votePath.split("/");
  
          let data: any = {};
          let type = "";
  
          if (parts.includes("comments")) {
            // It's a comment vote
            type = "comment";
            const subquiverId = parts[1];
            const postId = parts[3];
            const commentId = parts[5];
  
            const commentRef = doc(firestore, `subquivers/${subquiverId}/posts/${postId}/comments/${commentId}`);
            const commentSnapshot = await getDoc(commentRef);
  
            const postRef = doc(firestore, `subquivers/${subquiverId}/posts/${postId}`);
            const postSnapshot = await getDoc(postRef);
  
            let postTitle = "Unknown Post";
            let postAuthorUsername = "Unknown Author";
            let content = "Unknown Content";
            let createdAt = "Unknown Date";
  
            if (postSnapshot.exists()) {
              const postData = postSnapshot.data();
              postTitle = postData?.title || "Unknown Post";
  
              if (postData?.author) {
                const userSnapshot = await getDoc(doc(firestore, "users", postData.author));
                postAuthorUsername = userSnapshot.exists()
                  ? userSnapshot.data()?.username || "Unknown Author"
                  : "Unknown Author";
              }
            }
  
            if (commentSnapshot.exists()) {
              const commentData = commentSnapshot.data();
              content = commentData?.content || "Unknown Content";
              createdAt = commentData?.createdAt?.toDate().toLocaleString() || "Unknown Date";
            }
  
            const { upvotes, downvotes } = await countVotes("comment", subquiverId, postId, commentId);
  
            data = {
              id: commentId,
              content,
              postTitle,
              author: postAuthorUsername,
              type,
              subquiverId,
              postId,
              upvotes,
              downvotes,
              createdAt,
            };
          } else {
            // It's a post vote
            type = "post";
            const subquiverId = parts[1];
            const postId = parts[3];
  
            const postRef = doc(firestore, `subquivers/${subquiverId}/posts/${postId}`);
            const postSnapshot = await getDoc(postRef);
  
            if (postSnapshot.exists()) {
              const postData = postSnapshot.data();
  
              const { upvotes, downvotes } = await countVotes("post", subquiverId, postId);
  
              let postAuthorUsername = "Unknown Author";
              if (postData?.author) {
                const userSnapshot = await getDoc(doc(firestore, "users", postData.author));
                postAuthorUsername = userSnapshot.exists()
                  ? userSnapshot.data()?.username || "Unknown Author"
                  : "Unknown Author";
              }
  
              data = {
                id: postSnapshot.id,
                title: postData?.title || "Unknown Title",
                description: postData?.description || "No description",
                author: postAuthorUsername,
                type,
                subquiverId,
                upvotes,
                downvotes,
                createdAt: postData?.createdAt?.toDate().toLocaleString() || "Unknown Date",
              };
            }
          }
  
          return data;
        })
    );
  
    return results;
  };    
  
  // Refreshes the upvoted and downvoted items
  const refreshUserVotes = async () => {
    try {
      const upvotedData = await fetchVotesByType("upvote");
      const downvotedData = await fetchVotesByType("downvote");

      setUpvotedItems(upvotedData);
      setDownvotedItems(downvotedData);
    } catch (error) {
      console.error("Error refreshing voted items:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.postId) return;
  
    try {
      if (isDeletingComment) {
        // Delete Comment and its Votes
        const votesRef = collection(firestore, `subquivers/${currentSubquiverId}/posts/${parentPostId}/comments/${deleteModal.postId}/votes`);
        const votesSnapshot = await getDocs(votesRef);
        votesSnapshot.forEach((vote) => deleteDoc(vote.ref));
  
        await deleteDoc(doc(firestore, `subquivers/${currentSubquiverId}/posts/${parentPostId}/comments/${deleteModal.postId}`));
  
        setComments((prev) => prev.filter((comment) => comment.id !== deleteModal.postId));
  
        toast({
          title: "Comment deleted successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
  
      } else {
        // Delete Post and its Comments and Votes
        const commentsRef = collection(firestore, `subquivers/${currentSubquiverId}/posts/${deleteModal.postId}/comments`);
        const commentsSnapshot = await getDocs(commentsRef);
  
        for (const comment of commentsSnapshot.docs) {
          const votesRef = collection(firestore, `${comment.ref.path}/votes`);
          const votesSnapshot = await getDocs(votesRef);
          votesSnapshot.forEach((vote) => deleteDoc(vote.ref));
          await deleteDoc(comment.ref);
        }
  
        // Delete post votes
        const votesRef = collection(firestore, `subquivers/${currentSubquiverId}/posts/${deleteModal.postId}/votes`);
        const votesSnapshot = await getDocs(votesRef);
        votesSnapshot.forEach((vote) => deleteDoc(vote.ref));
  
        // Delete the post itself
        await deleteDoc(doc(firestore, `subquivers/${currentSubquiverId}/posts/${deleteModal.postId}`));
  
        setPosts((prev) => prev.filter((post) => post.id !== deleteModal.postId));
  
        toast({
          title: "Post and its comments deleted successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  
    setDeleteModal({ open: false, postId: null });
    setIsDeletingComment(false); // Reset local state
  };  


  return (
    <ProfileDetailsView
      user={user}
      isCurrentUser={isCurrentUser}
      posts={posts}
      comments={comments}
      upvotedItems={upvotedItems}
      downvotedItems={downvotedItems}
      loading={loading}
      commentsLoading={commentsLoading}
      loadingVotes={loadingVotes}
      handlePostUpvote={handlePostUpvote}
      handlePostDownvote={handlePostDownvote}
      handleCommentUpvote={handleCommentUpvote}
      handleCommentDownvote={handleCommentDownvote}
      handleDelete={handleDelete}
      deleteModal={deleteModal}
      setDeleteModal={setDeleteModal}
      setIsDeletingComment={setIsDeletingComment}
      setCurrentSubquiverId={setCurrentSubquiverId}
      setParentPostId={setParentPostId}
      router={router}
    />
  
  );
}


export default ProfileDetails;
