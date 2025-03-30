import { firestore } from "@/model/firebase/clientApp";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { castVote } from "@/model/Profile/ProfileDetailsModel"; // default import
import { User } from "firebase/auth"; // For typing currentUser

export const handlePostUpvote = (
  postId: string,
  community: string,
  currentUser: User,
  fetchVotes: (postId: string, community: string) => Promise<void>
) => {
  return castVote({
    type: "upvote",
    target: "post",
    postId,
    communityId: community,
    commentId: null,
    currentUser,
    fetchPostVotes: () => fetchVotes(postId, community),
    refreshCommentVotes: () => Promise.resolve(), // No comment to refresh
  });
};

export const handlePostDownvote = (
  postId: string,
  community: string,
  currentUser: User,
  fetchVotes: (postId: string, community: string) => Promise<void>
) => {
  return castVote({
    type: "downvote",
    target: "post",
    postId,
    communityId: community,
    commentId: null,
    currentUser,
    fetchPostVotes: () => fetchVotes(postId, community),
    refreshCommentVotes: () => Promise.resolve(), // No comment to refresh
  });
};

export const handleCommentUpvote = (
  commentId: string,
  postId: string,
  community: string,
  currentUser: User,
  refreshCommentVotes: (commentId: string, postId: string, community: string) => Promise<void>
) => {
  return castVote({
    type: "upvote",
    target: "comment",
    postId,
    communityId: community,
    commentId,
    currentUser,
    fetchPostVotes: () => Promise.resolve(), // No post refresh needed
    refreshCommentVotes: () => refreshCommentVotes(commentId, postId, community),
  });
};

export const handleCommentDownvote = (
  commentId: string,
  postId: string,
  community: string,
  currentUser: User,
  refreshCommentVotes: (commentId: string, postId: string, community: string) => Promise<void>
) => {
  return castVote({
    type: "downvote",
    target: "comment",
    postId,
    communityId: community,
    commentId,
    currentUser,
    fetchPostVotes: () => Promise.resolve(), // No post refresh needed
    refreshCommentVotes: () => refreshCommentVotes(commentId, postId, community),
  });
};

export const handleDelete = async (
    deleteModal: { open: boolean; postId: string | null },
    isDeletingComment: boolean,
    currentSubquiverId: string,
    parentPostId: string | null,
    setComments: React.Dispatch<React.SetStateAction<any[]>>,
    setPosts: React.Dispatch<React.SetStateAction<any[]>>,
    setDeleteModal: React.Dispatch<
      React.SetStateAction<{ open: boolean; postId: string | null }>
    >,
    setIsDeletingComment: React.Dispatch<React.SetStateAction<boolean>>,
    toast: ReturnType<typeof import("@chakra-ui/react").useToast>
  ) => {
    if (!deleteModal.postId) return;
  
    try {
      if (isDeletingComment) {
        // Delete Comment and its Votes
        const votesRef = collection(
          firestore,
          `subquivers/${currentSubquiverId}/posts/${parentPostId}/comments/${deleteModal.postId}/votes`
        );
        const votesSnapshot = await getDocs(votesRef);
        votesSnapshot.forEach((vote) => deleteDoc(vote.ref));
  
        await deleteDoc(
          doc(
            firestore,
            `subquivers/${currentSubquiverId}/posts/${parentPostId}/comments/${deleteModal.postId}`
          )
        );
  
        setComments((prev) => prev.filter((comment) => comment.id !== deleteModal.postId));
  
        toast({
          title: "Comment deleted successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
  
      } else {
        // Delete Post and its Comments and Votes
        const commentsRef = collection(
          firestore,
          `subquivers/${currentSubquiverId}/posts/${deleteModal.postId}/comments`
        );
        const commentsSnapshot = await getDocs(commentsRef);
  
        for (const comment of commentsSnapshot.docs) {
          const votesRef = collection(firestore, `${comment.ref.path}/votes`);
          const votesSnapshot = await getDocs(votesRef);
          votesSnapshot.forEach((vote) => deleteDoc(vote.ref));
          await deleteDoc(comment.ref);
        }
  
        // Delete post votes
        const votesRef = collection(
          firestore,
          `subquivers/${currentSubquiverId}/posts/${deleteModal.postId}/votes`
        );
        const votesSnapshot = await getDocs(votesRef);
        votesSnapshot.forEach((vote) => deleteDoc(vote.ref));
  
        // Delete the post itself
        await deleteDoc(
          doc(firestore, `subquivers/${currentSubquiverId}/posts/${deleteModal.postId}`)
        );
  
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