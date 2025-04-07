import React from "react";
import EditPostView from "@/view/Posts/EditPostView";

interface EditPostProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  community: string;
  author: string;
}

const EditPost: React.FC<EditPostProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  onCancel,
  onSave,
  community,
  author,
}) => {

  return (
    <EditPostView
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      onCancel={onCancel}
      onSave={onSave}
      community={community}
      author={author}
    />
  );
};

export default EditPost;
