import { Box, Button, HStack, Text } from '@chakra-ui/react';
import React from 'react';
import { BiDownvote, BiSolidDownvote, BiSolidUpvote, BiUpvote } from "react-icons/bi";
import { useCommentDetails } from '@/model/Comments/CommentDetailsModel';

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

interface CommentDetailsProps {
  comment: Comment;
}

const CommentDetailsView: React.FC<CommentDetailsProps> = ({ comment }) => {
  const { userVote, handleVote } = useCommentDetails(comment);

  return (
    <Box bg="white" p={4} borderRadius="md" boxShadow="sm">
      <HStack spacing={2} color="gray.500" fontSize="sm" mb={2}>
        <Text color="gray.700" fontWeight="medium">u/{comment.author}</Text>
        <Text>·</Text>
        <Text>{comment.time}</Text>
        <Text>·</Text>
        <Text>{comment.date}</Text>
      </HStack>
      <Text color="gray.800">{comment.content}</Text>

      <HStack spacing={4} mt={2}>
        <Button 
          variant="ghost" 
          size="sm" 
          leftIcon={userVote === 'up' ? <BiSolidUpvote size={14} /> : <BiUpvote size={14} />}
          onClick={() => handleVote('up')}
          color={userVote === 'up' ? 'brand.100' : 'gray.500'}
        >
          <Text fontSize="xs">{comment.upvotes}</Text>
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          leftIcon={userVote === 'down' ? <BiSolidDownvote size={14} /> : <BiDownvote size={14} />} 
          onClick={() => handleVote('down')}
          color={userVote === 'down' ? 'red.500' : 'gray.500'}
        >
          <Text fontSize="xs">{comment.downvotes}</Text>
        </Button>
      </HStack>
    </Box>
  );
};

export default CommentDetailsView;
