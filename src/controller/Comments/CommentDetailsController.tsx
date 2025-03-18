import { auth } from '@/model/firebase/clientApp';
import { useCommentDetails  } from '@/model/Comments/CommentDetailsModel';

export interface Comment {
  id: string;
  postId: string;
  communityName: string;
  author: string;
  content: string;
  time: string;
  date: string;
  upvotes: number;
  downvotes: number;
}

export const useCommentController  = (comment: Comment) => {
    const { userVote, setUserVote, setAuthModalState } = useCommentDetails (comment);

  const handleVote = (type: 'up' | 'down') => {
    if (!auth.currentUser) {
      setAuthModalState({ open: true, view: 'signup' });
      return;
    }
    setUserVote((prevVote) => (prevVote === type ? null : type));
  };

  return { userVote, handleVote };
};
