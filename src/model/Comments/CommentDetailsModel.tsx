import { authModalState } from '@/model/atoms/authModalAtom';
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


  return { userVote, setUserVote, setAuthModalState };
};