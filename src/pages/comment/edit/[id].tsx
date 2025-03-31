import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "@/model/firebase/clientApp";
import EditComment from "@/model/Comments/EditCommentModel";

const EditCommentPage = () => {
  const router = useRouter();

  const id = router.query.id as string | undefined;
  const communityId = router.query.communityId as string | undefined;
  const postId = router.query.postId as string | undefined;

  const [comment, setComment] = useState<any>(null);
  const [post, setPost] = useState<any>(null);
  const [communityName, setCommunityName] = useState<string>("");
  const [authorUsername, setAuthorUsername] = useState<string>("");
  const [postAuthorUsername, setPostAuthorUsername] = useState<string>("");
  const [editedContent, setEditedContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCommentAndPost = async () => {
      if (!id || !communityId || !postId) {
        setError("Missing required query parameters.");
        setLoading(false);
        return;
      }

      try {
        // Fetch Comment Data
        const commentRef = doc(
          firestore,
          `subquivers/${communityId}/posts/${postId}/comments/${id}`
        );
        const commentSnapshot = await getDoc(commentRef);

        if (!commentSnapshot.exists()) {
          setError("Comment not found.");
          return;
        }

        const commentData = commentSnapshot.data();
        setComment(commentData);
        setEditedContent(commentData.content);

        // Fetch Post Data
        const postRef = doc(firestore, `subquivers/${communityId}/posts/${postId}`);
        const postSnapshot = await getDoc(postRef);

        if (!postSnapshot.exists()) {
          setError("Post not found.");
          return;
        }

        const postData = postSnapshot.data();
        setPost(postData);

        // Fetch Community (Subquiver) Name
        const communityRef = doc(firestore, `subquivers/${communityId}`);
        const communitySnapshot = await getDoc(communityRef);
        setCommunityName(communitySnapshot.exists() ? communitySnapshot.data().name : "Unknown Subquiver");

        // Fetch Comment Author Username
        const commentAuthorRef = doc(firestore, `users/${commentData.author}`);
        const commentAuthorSnapshot = await getDoc(commentAuthorRef);
        setAuthorUsername(commentAuthorSnapshot.exists() ? commentAuthorSnapshot.data().username : "Unknown User");

        // Fetch Post Author Username
        const postAuthorRef = doc(firestore, `users/${postData.author}`);
        const postAuthorSnapshot = await getDoc(postAuthorRef);
        setPostAuthorUsername(postAuthorSnapshot.exists() ? postAuthorSnapshot.data().username : "Unknown User");

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommentAndPost();
  }, [id, communityId, postId]);

  const handleSave = async () => {
    if (!id || !communityId || !postId || !comment) return;

    try {
      const commentRef = doc(
        firestore,
        `subquivers/${communityId}/posts/${postId}/comments/${id}`
      );

      await setDoc(commentRef, {
        ...comment,
        content: editedContent,
        edited: true,
      }, { merge: true });

      console.log(`💾 Comment saved: ${id}`);
      router.push(`/post/${postId}?community=${communityId}`);
    } catch (err) {
      console.error("Error saving comment:", err);
    }
  };

  const handleCancel = () => {
    router.push(`/post/${postId}?community=${communityId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <EditComment
      communityName={communityName}
      commentAuthor={authorUsername}
      postAuthor={postAuthorUsername}
      postTitle={post?.title}
      postDescription={post?.description}
      editedContent={editedContent}
      setEditedContent={setEditedContent}
      onCancel={handleCancel}
      onSave={handleSave}
    />
  );
};

export default EditCommentPage;
