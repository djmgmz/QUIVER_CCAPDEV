import { authModalState } from '@/model/atoms/authModalAtom';
import { auth } from '@/model/firebase/clientApp';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

interface Comment {
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

export const useCommentDetails = (comment: Comment) => {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const setAuthModalState = useSetRecoilState(authModalState);

  const handleVote = (type: 'up' | 'down') => {
    if (!auth.currentUser) {
      setAuthModalState({ open: true, view: 'signup' });
      return;
    }
    setUserVote((prevVote) => (prevVote === type ? null : type));
  };

  return { userVote, handleVote };
};
