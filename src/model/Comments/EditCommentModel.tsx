import React from "react";
import EditCommentView from "@/view/Comments/EditCommentView";


interface EditCommentProps {
  communityName: string;
  postAuthor: string;
  commentAuthor: string;
  postTitle: string;
  postDescription: string;
  editedContent: string;
  setEditedContent: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

const EditComment: React.FC<EditCommentProps> = ({ 
  communityName,
  postAuthor,
  commentAuthor,
  postTitle,
  postDescription,
  editedContent,
  setEditedContent,
  onCancel,
  onSave
}) => {
  return (
    <EditCommentView 
    communityName={communityName}
    postAuthor={postAuthor}
    commentAuthor={commentAuthor}
    postTitle={postTitle}
    postDescription={postDescription}
    editedContent={editedContent}
    setEditedContent={setEditedContent}
    onCancel={onCancel}
    onSave={onSave}
  />

    
  );
};

export default EditComment;