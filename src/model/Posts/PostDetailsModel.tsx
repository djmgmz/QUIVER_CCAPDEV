import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  chakra,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { BiSolidUpvote, BiSolidDownvote, BiDownvote, BiUpvote } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/router";
import DeletePost from "@/view/Modal/DeletePost";
import { firestore } from "@/model/firebase/clientApp";
import { doc, getDoc, collection, addDoc, serverTimestamp, getDocs, orderBy, query, setDoc, deleteDoc } from "firebase/firestore";
import { FaRegComments } from "react-icons/fa6";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/model/firebase/clientApp";
import { getAuth } from "firebase/auth";
import PostDetailsView from "@/view/Posts/PostDetailsView";

interface Post {
  id: string;
  title: string;
  description: string;
  author: string;
  community: string;
  createdAt?: any;
  upvotes?: number;
  downvotes?: number;
}

interface Comment {
  id: string;
  author: string;
  username: string;
  content: string;
  createdAt: any;
  userVote?: "upvote" | "downvote" | null;
  upvotes?: number;
  downvotes?: number;
}


interface PostDetailsProps {
  post: Post;
  comments: Comment[];
}

const PostDetails: React.FC<PostDetailsProps> = ({ post, comments: initialComments }) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [currentUser] = useAuthState(auth);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [postVotes, setPostVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [commentVotes, setCommentVotes] = useState<{ [key: string]: { upvoted: boolean, downvoted: boolean } }>(
    comments.reduce((acc, comment) => {
      acc[comment.id] = { upvoted: false, downvoted: false };
      return acc;
    }, {} as { [key: string]: { upvoted: boolean, downvoted: boolean } })
  );
  const [isCommenting, setIsCommenting] = useState(false);
  const [authorUsername, setAuthorUsername] = useState("anonymous");
  const [communityName, setCommunityName] = useState("unknown");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handlePostUpvote = () => {
    castVote("upvote", "post");
  };
  
  const handlePostDownvote = () => {
    castVote("downvote", "post");
  };
  
  const handleCommentUpvote = (commentId: string) => {
    castVote("upvote", "comment", commentId).then(() => refreshCommentVotes(commentId));
  };
  
  const handleCommentDownvote = (commentId: string) => {
    castVote("downvote", "comment", commentId).then(() => refreshCommentVotes(commentId));
  };  

  const handleDeletePost = async () => {
    try {
      const commentsRef = collection(firestore, "subquivers", post.community, "posts", post.id, "comments");
      const commentsSnapshot = await getDocs(commentsRef);
  
      for (const commentDoc of commentsSnapshot.docs) {
        const commentId = commentDoc.id;
  
        const votesRef = collection(firestore, "subquivers", post.community, "posts", post.id, "comments", commentId, "votes");
        const votesSnapshot = await getDocs(votesRef);
  
        for (const voteDoc of votesSnapshot.docs) {
          await deleteDoc(doc(votesRef, voteDoc.id));
        }
  
        await deleteDoc(doc(commentsRef, commentId));
      }
  
      const postVotesRef = collection(firestore, "subquivers", post.community, "posts", post.id, "votes");
      const postVotesSnapshot = await getDocs(postVotesRef);
      for (const voteDoc of postVotesSnapshot.docs) {
        await deleteDoc(doc(postVotesRef, voteDoc.id));
      }
  
      await deleteDoc(doc(firestore, "subquivers", post.community, "posts", post.id));
  
      toast({
        title: "Post and its comments deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      setIsDeleteModalOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error deleting post and comments:", error);
      toast({
        title: "Failed to delete the post and its comments.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteDoc(doc(firestore, "subquivers", post.community, "posts", post.id, "comments", commentId));
  
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
  
      toast({
        title: "Comment deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      setCommentToDelete(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Failed to delete the comment.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCommentSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  if (commentText.trim() === '') return;

  try {
    const commentsRef = collection(
      firestore,
      "subquivers",
      post.community,
      "posts",
      post.id,
      "comments"
    );

    const newComment: Omit<Comment, "id"> = {
      content: commentText,
      author: currentUser?.uid || "unknown",
      username: currentUser?.displayName || "Anonymous",
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(commentsRef, newComment);

    const addedComment: Comment = {
      id: docRef.id,
      ...newComment,
    };

    setComments((prev) => [
      ...prev,
      { id: docRef.id, ...newComment }
    ]);    

    setCommentText('');
    setIsCommenting(false);

    toast({
      title: "Comment added successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

  } catch (error) {
    console.error("Error adding comment:", error);
    toast({
      title: "Error adding comment.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

useEffect(() => {
  const fetchPostDetails = async () => {
    try {
      const userDoc = await getDoc(doc(firestore, "users", post.author));
      if (userDoc.exists()) {
        setAuthorUsername(userDoc.data().username || "anonymous");
      }

      const communityDoc = await getDoc(doc(firestore, "subquivers", post.community));
      if (communityDoc.exists()) {
        setCommunityName(communityDoc.data().name || "unknown");
      }

      await fetchComments();

    } catch (error) {
      console.error("Error fetching post details:", error);
      toast({
        title: "Error fetching post details.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  fetchPostDetails();
}, [post.author, post.community]);

const fetchComments = async () => {
  try {
    const commentsRef = collection(
      firestore,
      "subquivers",
      post.community,
      "posts",
      post.id,
      "comments"
    );

    const q = query(commentsRef, orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);

    const fetchedComments: Comment[] = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();

        const userDoc = await getDoc(doc(firestore, "users", data.author));
        const username = userDoc.exists() ? userDoc.data().username || "Anonymous" : "Anonymous";

        const voteDoc = await getDoc(
          doc(firestore, `subquivers/${post.community}/posts/${post.id}/comments/${docSnapshot.id}/votes/${currentUser?.uid}`)
        );

        const userVote = voteDoc.exists() ? voteDoc.data().type : null;

        const { upvotes, downvotes } = await countVotes("comment", docSnapshot.id);

        return {
          id: docSnapshot.id,
          author: data.author,
          username,
          content: data.content,
          createdAt: data.createdAt,
          userVote,
          upvotes,
          downvotes,
        };
      })
    );

    setComments(fetchedComments);

  } catch (error) {
    console.error("Error fetching comments:", error);
    toast({
      title: "Error fetching comments.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

const fetchPostVotes = async () => {
  const { upvotes, downvotes } = await countVotes("post");
  setPostVotes({ upvotes, downvotes });

  const voteDoc = await getDoc(
    doc(firestore, `subquivers/${post.community}/posts/${post.id}/votes/${currentUser?.uid}`)
  );

  if (voteDoc.exists()) {
    const userVote = voteDoc.data().type;
    setUpvoted(userVote === "upvote");
    setDownvoted(userVote === "downvote");
  } else {
    setUpvoted(false);
    setDownvoted(false);
  }
};

useEffect(() => {
  fetchPostVotes();
}, [post.id]);

const refreshCommentVotes = async (commentId: string) => {
  const { upvotes, downvotes } = await countVotes("comment", commentId);

  const voteDoc = await getDoc(
    doc(firestore, `subquivers/${post.community}/posts/${post.id}/comments/${commentId}/votes/${currentUser?.uid}`)
  );

  const userVote = voteDoc.exists() ? voteDoc.data().type : null;

  setComments((prevComments) =>
    prevComments.map((comment) =>
      comment.id === commentId
        ? { ...comment, upvotes, downvotes, userVote }
        : comment
    )
  );

  setCommentVotes((prevVotes) => ({
    ...prevVotes,
    [commentId]: {
      upvoted: userVote === "upvote",
      downvoted: userVote === "downvote",
    },
  }));
};

        

  const formattedDate = post.createdAt?.seconds
    ? new Date(post.createdAt.seconds * 1000).toLocaleString()
    : "No date provided";

    const castVote = async (
      type: "upvote" | "downvote",
      target: "post" | "comment",
      commentId?: string
    ) => {
      try {
        const votePath = commentId
          ? `subquivers/${post.community}/posts/${post.id}/comments/${commentId}/votes/${currentUser?.uid}`
          : `subquivers/${post.community}/posts/${post.id}/votes/${currentUser?.uid}`;
    
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
    
        if (target === "post") {
          await fetchPostVotes();
        } else if (commentId) {
          await refreshCommentVotes(commentId);
        }
    
      } catch (error) {
        console.error("Error casting vote:", error);
      }
    };       
    
    const refreshPostVotes = async () => {
      const { upvotes, downvotes } = await countVotes("post");
      setPostVotes({ upvotes, downvotes });
    };

  const countVotes = async (target: "post" | "comment", commentId?: string) => {
    const votePath = commentId
      ? `subquivers/${post.community}/posts/${post.id}/comments/${commentId}/votes`
      : `subquivers/${post.community}/posts/${post.id}/votes`;
  
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

  return (
    <PostDetailsView
      post={post}
      comments={comments}
      currentUser={currentUser}
      communityName={communityName}
      authorUsername={authorUsername}
      formattedDate={formattedDate}
      postVotes={postVotes}
      commentVotes={commentVotes}
      isDeleteModalOpen={isDeleteModalOpen}
      commentToDelete={commentToDelete}
      isCommenting={isCommenting}
      commentText={commentText}
      upvoted={upvoted}
      downvoted={downvoted}
      handlePostUpvote={handlePostUpvote}
      handlePostDownvote={handlePostDownvote}
      handleCommentUpvote={handleCommentUpvote}
      handleCommentDownvote={handleCommentDownvote}
      handleDeletePost={handleDeletePost}
      handleDeleteComment={handleDeleteComment}
      handleCommentSubmit={handleCommentSubmit}
      setIsDeleteModalOpen={setIsDeleteModalOpen}
      setCommentToDelete={setCommentToDelete}
      setIsCommenting={setIsCommenting}
      setCommentText={setCommentText}
    />
  );
}  
export default PostDetails;
