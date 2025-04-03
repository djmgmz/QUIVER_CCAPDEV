import React, { useEffect, useState } from "react";
import {
  useToast,
} from "@chakra-ui/react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore, auth } from "@/model/firebase/clientApp";
import { useRouter } from "next/router";
import useUsername from "@/model/hooks/useUsername";
import CreatePostView from "@/view/Posts/CreatePostView";
import { handleCreatePost as createPost } from "@/controller/Posts/CreatePostController";

interface CreatePostProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  onCancel: () => void;
  onCreate: () => void;
  community: string;
}

const CreatePost: React.FC<CreatePostProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  onCancel,
  onCreate,
  community,
}) => {
  const toast = useToast();
  const router = useRouter();
  const currentUser = auth.currentUser;
  const username = useUsername(currentUser?.uid ?? null);

  const [bannerURL, setBannerURL] = useState<string | null>(null);
  const [iconURL, setIconURL] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubquiverImages = async () => {
      const subquiverQuery = query(
        collection(firestore, "subquivers"),
        where("name", "==", community)
      );
      const querySnapshot = await getDocs(subquiverQuery);
  
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setBannerURL(data.bannerImageURL || null);
        setIconURL(data.iconImageURL || null);
      }
    };

    fetchSubquiverImages();
  }, [community]);

  const handleCreatePost = () =>
    createPost(currentUser, title, description, username || "anonymous", community, router, toast);

  return (
    <CreatePostView
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      onCancel={onCancel}
      handleCreatePost={handleCreatePost}
      community={community}
      username={username}
      bannerImageURL={bannerURL}
      iconImageURL={iconURL}
    />
  );
};

export default CreatePost;
