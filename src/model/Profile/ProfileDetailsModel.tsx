import React, { useEffect, useState } from "react";
import ProfileDetailsView from "@/view/Profile/ProfileDetailsView";
import { 
  useToast
} from "@chakra-ui/react";
import { useRouter } from "next/router";
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
import { deletePostModalState } from "@/model/atoms/deletePostModalAtom";
import { useRecoilState } from "recoil";
import {
  handlePostUpvote,
  handlePostDownvote,
  handleCommentUpvote,
  handleCommentDownvote,
  handleDelete as handleDeleteFn
} from "@/controller/Profile/ProfileDetailsController";

export type CastVoteParams = {
  type: "upvote" | "downvote";
  target: "post" | "comment";
  postId: string;
  communityId: string;
  commentId: string | null;
  currentUser: any; 
  fetchPostVotes: () => Promise<void>;
  refreshCommentVotes: (commentId: string) => Promise<void>;
};

export const castVote = async ({
  type,
  target,
  postId,
  communityId,
  commentId,
  currentUser,
  fetchPostVotes,
  refreshCommentVotes,
}: CastVoteParams) => {
  try {
    const votePath = commentId
      ? `subquivers/${communityId}/posts/${postId}/comments/${commentId}/votes/${currentUser?.uid}`
      : `subquivers/${communityId}/posts/${postId}/votes/${currentUser?.uid}`;

    const voteRef = doc(firestore, votePath);
    const voteDoc = await getDoc(voteRef);

    if (voteDoc.exists()) {
      const existingVote = voteDoc.data().type;

      if (existingVote === type) {
        await deleteDoc(voteRef);
      } else {
        await setDoc(voteRef, { type });
      }
    } else {
      await setDoc(voteRef, { type });
    }

    if (target === "post") {
      await fetchPostVotes();
    } else if (commentId) {
      await refreshCommentVotes(commentId);
    }

  } catch (error) {
    console.error("Error casting vote:", error);
  }
};

interface ProfileDetailsProps {
  user: {
    uid: string;
    username: string;
    description: string;
    profilePicture: string | null;
    banner: string | null;
  };
  isCurrentUser: boolean;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user, isCurrentUser }) => {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true); 
  const [deleteModal, setDeleteModal] = useRecoilState(deletePostModalState);
  const currentUser = auth.currentUser;
  const toast = useToast();
  const [upvotedItems, setUpvotedItems] = useState<any[]>([]);
  const [downvotedItems, setDownvotedItems] = useState<any[]>([]);
  const [loadingVotes, setLoadingVotes] = useState(true);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [currentSubquiverId, setCurrentSubquiverId] = useState<string>("");
  const [parentPostId, setParentPostId] = useState<string>("");

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

            const commentsSnapshot = await getDocs(
              collection(firestore, `subquivers/${subquiverId}/posts/${docItem.id}/comments`)
            );
            
  
            return {
              id: docItem.id,
              title: postData.title,
              description: postData.description,
              upvotes,
              downvotes,
              comments: commentsSnapshot.size,
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
        const upvotedData = await fetchVotesByType("upvote", user.uid);
        const downvotedData = await fetchVotesByType("downvote", user.uid);
  
        setUpvotedItems(upvotedData);
        setDownvotedItems(downvotedData);
      } catch (error) {
        console.error("Error fetching voted items:", error);
      }
  
      setLoadingVotes(false);
    };
  
    fetchUserVotes();
  }, [user.uid]);  
  
  const fetchVotesByType = async (voteType: "upvote" | "downvote", userId: string) => {
    const votesQuery = query(
      collectionGroup(firestore, "votes"),
      where("type", "==", voteType)
    );
  
    const voteSnapshots = await getDocs(votesQuery);
  
    const results = await Promise.all(
      voteSnapshots.docs
        .filter((voteDoc) => voteDoc.id === userId)
        .map(async (voteDoc) => {
          const votePath = voteDoc.ref.path;
          const parts = votePath.split("/");
  
          let data: any = {};
          let type = "";
  
          if (parts.includes("comments")) {
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
  
  const refreshUserVotes = async () => {
    try {
      const upvotedData = await fetchVotesByType("upvote", user.uid);
      const downvotedData = await fetchVotesByType("downvote", user.uid);
  
      setUpvotedItems(upvotedData);
      setDownvotedItems(downvotedData);
    } catch (error) {
      console.error("Error refreshing voted items:", error);
    }
  };

  const onPostUpvote = (postId: string, community: string) => {
    if (!currentUser) return;
    handlePostUpvote(postId, community, currentUser, refreshPostVotes);
    refreshUserVotes();
  };
  
  const onPostDownvote = (postId: string, community: string) => {
    if (!currentUser) return;
    handlePostDownvote(postId, community, currentUser, refreshPostVotes);
    refreshUserVotes();
  };
  
  const onCommentUpvote = (commentId: string, postId: string, community: string) => {
    if (!currentUser) return;
    handleCommentUpvote(commentId, postId, community, currentUser, refreshCommentVotes);
    refreshUserVotes();
  };
  
  const onCommentDownvote = (commentId: string, postId: string, community: string) => {
    if (!currentUser) return;
    handleCommentDownvote(commentId, postId, community, currentUser, refreshCommentVotes);
    refreshUserVotes();
  };

  const [deleteTarget, setDeleteTarget] = useState<{
    postId: string;
    isComment: boolean;
    community: string;
    parentId?: string;
  } | null>(null);
  
  const handleDelete = () => {
    if (!deleteModal.postId) return;
  
    handleDeleteFn(
      deleteModal,
      isDeletingComment,
      currentSubquiverId,
      parentPostId,
      setComments,
      setPosts,
      setDeleteModal,
      setIsDeletingComment,
      toast
    );
  };
  
  return (
    <ProfileDetailsView
      user={{
        ...user,
        banner: user.banner ?? null,
      }}
      isCurrentUser={isCurrentUser}
      posts={posts}
      comments={comments}
      upvotedItems={upvotedItems}
      downvotedItems={downvotedItems}
      loading={loading}
      commentsLoading={commentsLoading}
      loadingVotes={loadingVotes}
      handlePostUpvote={onPostUpvote}
      handlePostDownvote={onPostDownvote}
      handleCommentUpvote={onCommentUpvote}
      handleCommentDownvote={onCommentDownvote}
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
