import React, { useState } from "react";
import { useRouter } from "next/router";
import CreatePost from "@/model/Posts/CreatePostModel";
import { firestore, auth } from "@/model/firebase/clientApp";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const CreatePostPage = () => {
  const router = useRouter();
  const { community } = router.query;
  const user = auth.currentUser;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    setLoading(true);

    try {
      const postRef = doc(firestore, "posts", `${user.uid}_${Date.now()}`);
      await setDoc(postRef, {
        title,
        description,
        community,
        author: user.displayName || "Anonymous",
        authorId: user.uid,
        createdAt: serverTimestamp(),
        upvotes: 0,
        downvotes: 0,
        commentsCount: 0,
      });

      console.log("Post created successfully!");
      router.push(`/subquiver/${community}`);
    } catch (error) {
      console.error("Error creating post:", error);
    }

    setLoading(false);
  };

  return (
    <CreatePost
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      onCancel={() => router.back()}
      onCreate={handleCreatePost}
      community={community as string}
      author={user?.displayName || "Anonymous"}
    />
  );
};

export default CreatePostPage;
