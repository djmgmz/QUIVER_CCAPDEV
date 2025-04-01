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
import {
  handleDeletePost,
  handleDeleteComment,
  handleCommentSubmit,
  handleVote,
  handleReplySubmit,
} from "@/controller/Posts/PostDetailsController";

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
  parentId?: string | null;
  userVote?: "upvote" | "downvote" | null;
  upvotes?: number;
  downvotes?: number;
  edited?: boolean;
  replies?: Comment[];
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
  const [nestedComments, setNestedComments] = useState<Comment[]>([]);
  const toast = useToast();
  const router = useRouter();

  const handlePostUpvote = () => {
    handleVote(post, currentUser, "upvote", "post", null, fetchPostVotes, refreshCommentVotes, setUpvoted, setDownvoted);
  };
  
  const handlePostDownvote = () => {
    handleVote(post, currentUser, "downvote", "post", null, fetchPostVotes, refreshCommentVotes, setUpvoted, setDownvoted);
  };
  
  const handleCommentUpvote = (commentId: string) => {
    handleVote(post, currentUser, "upvote", "comment", commentId, fetchPostVotes, refreshCommentVotes, setUpvoted, setDownvoted);
  };
  
  const handleCommentDownvote = (commentId: string) => {
    handleVote(post, currentUser, "downvote", "comment", commentId, fetchPostVotes, refreshCommentVotes, setUpvoted, setDownvoted);
  };
  
  const onDeletePost = () => {
    handleDeletePost(post, toast, router, setIsDeleteModalOpen);
  };
  
  const onDeleteComment = (commentId: string) => {
    handleDeleteComment(post, commentId, toast, setComments, setCommentToDelete);
  };
  
  const onSubmitComment = (event: React.FormEvent) => {
    event.preventDefault();
    handleCommentSubmit(post, currentUser, commentText, setComments, setCommentText, setIsCommenting, toast);
  };

  const onReplySubmit = (
    parentId: string,
    replyText: string,
    setReplyText: (text: string) => void,
    setIsReplying: (val: boolean) => void
  ) => {
    handleReplySubmit(post, currentUser, replyText, parentId, setComments, setReplyText, setIsReplying, toast);
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

  const buildCommentTree = (comments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    comments.forEach((comment) => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    comments.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies?.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  };

  useEffect(() => {
    setNestedComments(buildCommentTree(comments));
  }, [comments]);
  

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
          edited: data.edited ?? false,
          parentId: data.parentId ?? null,
          replies: [],
        };
      })
    );

    setComments(fetchedComments);
    setNestedComments(buildCommentTree(fetchedComments));

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
      comments={nestedComments}
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
      handleDeletePost={onDeletePost}
      handleDeleteComment={onDeleteComment}
      handleCommentSubmit={onSubmitComment}
      setIsDeleteModalOpen={setIsDeleteModalOpen}
      setCommentToDelete={setCommentToDelete}
      setIsCommenting={setIsCommenting}
      setCommentText={setCommentText}
      handleReplySubmit={onReplySubmit}
    />
  );
}  
export default PostDetails;
