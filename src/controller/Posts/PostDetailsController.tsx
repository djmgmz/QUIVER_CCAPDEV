import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    setDoc,
    addDoc,
  } from "firebase/firestore";
  import { firestore } from "@/model/firebase/clientApp";
  import router, { NextRouter } from "next/router";
  import { UseToastOptions } from "@chakra-ui/react";
  
  export const handleDeletePost = async (
    post: any,
    toast: (options: UseToastOptions) => void,
    router: NextRouter,
    setIsDeleteModalOpen: (val: boolean) => void
  ) => {
    const commentsRef = collection(firestore, "subquivers", post.community, "posts", post.id, "comments");
    const commentsSnapshot = await getDocs(commentsRef);
  
    for (const commentDoc of commentsSnapshot.docs) {
      const commentId = commentDoc.id;
      const votesRef = collection(
        firestore,
        "subquivers",
        post.community,
        "posts",
        post.id,
        "comments",
        commentId,
        "votes"
      );
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
  };
  
  export const handleDeleteComment = async (
    post: any,
    commentId: string,
    toast: (options: UseToastOptions) => void,
    setComments: (updateFn: (prev: any[]) => any[]) => void,
    setCommentToDelete: (val: string | null) => void
  ) => {
    await deleteDoc(doc(firestore, "subquivers", post.community, "posts", post.id, "comments", commentId));
  
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  
    toast({
      title: "Comment deleted successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  
    setCommentToDelete(null);
  };
  
  export const handleCommentSubmit = async (
    post: any,
    currentUser: any,
    commentText: string,
    setComments: (updateFn: (prev: any[]) => any[]) => void,
    setCommentText: (val: string) => void,
    setIsCommenting: (val: boolean) => void,
    toast: (options: UseToastOptions) => void
  ) => {

    if (!currentUser) {
      toast({
        title: "You must be logged in to interact with posts.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    else{   
      if (commentText.trim() === "") return;
    
      const commentsRef = collection(firestore, "subquivers", post.community, "posts", post.id, "comments");
    
      const newComment = {
        content: commentText,
        author: currentUser?.uid || "unknown",
        username: currentUser?.displayName?.length >= 3 ? currentUser.displayName : "Anonymous",
        createdAt: serverTimestamp(),
        edited: false,
        parentId: null,
      };    
    
      const docRef = await addDoc(commentsRef, newComment);
    

      setComments((prev) => [...prev, { id: docRef.id, ...newComment, replies: [] }]);
      setCommentText("");
      setIsCommenting(false);
      
      router.reload();
      
      toast({
        title: "Comment added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
   }
  };
  
  export const handleVote = async (
    post: any,
    currentUser: any,
    type: "upvote" | "downvote",
    target: "post" | "comment",
    commentId: string | null,
    fetchPostVotes: () => Promise<void>,
    refreshCommentVotes: (commentId: string) => Promise<void>,
    setUpvoted: (val: boolean) => void,
    setDownvoted: (val: boolean) => void,
    toast: (options: UseToastOptions) => void
  ) => {

    if (!currentUser) {
      toast({
        title: "You must be logged in to interact with posts.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    else{
        const votePath = commentId
          ? `subquivers/${post.community}/posts/${post.id}/comments/${commentId}/votes/${currentUser?.uid}`
          : `subquivers/${post.community}/posts/${post.id}/votes/${currentUser?.uid}`;
      
        const voteRef = doc(firestore, votePath);
        const voteDoc = await getDoc(voteRef);
      
        if (voteDoc.exists()) {
          const existingVote = voteDoc.data().type;
      
          if (existingVote === type) {
            await deleteDoc(voteRef);
            if (target === "post") {
              type === "upvote" ? setUpvoted(false) : setDownvoted(false);
            }
          } else {
            await setDoc(voteRef, { type });
            if (target === "post") {
              type === "upvote" ? (setUpvoted(true), setDownvoted(false)) : (setDownvoted(true), setUpvoted(false));
            }
          }
        } else {
          await setDoc(voteRef, { type });
          if (target === "post") {
            type === "upvote" ? setUpvoted(true) : setDownvoted(true);
          }
        }
      
        if (target === "post") {
          await fetchPostVotes();
        } else if (commentId) {
          await refreshCommentVotes(commentId);
        }
      };
    }

  export const handleReplySubmit = async (
    post: any,
    currentUser: any,
    replyText: string,
    parentId: string,
    setComments: (updateFn: (prev: any[]) => any[]) => void,
    setReplyText: (val: string) => void,
    setIsReplying: (val: boolean) => void,
    toast: (options: UseToastOptions) => void
  ) => {

    if (!currentUser) {
      toast({
        title: "You must be logged in to interact with posts.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    else{
      if (replyText.trim() === "") return;
    
      const commentsRef = collection(firestore, "subquivers", post.community, "posts", post.id, "comments");
    
      const newReply = {
        content: replyText,
        author: currentUser?.uid || "unknown",
        username: currentUser?.displayName || "Anonymous",
        createdAt: serverTimestamp(),
        edited: false,
        parentId,
      };
    
      const docRef = await addDoc(commentsRef, newReply);
    
      setComments((prev) => [...prev, { id: docRef.id, ...newReply, replies: [] }]);
      setReplyText("");
      setIsReplying(false);
    
      toast({
        title: "Reply added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.reload();
    };
  }