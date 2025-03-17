import React from "react";
import { Box, SimpleGrid, Text, HStack, Spinner } from "@chakra-ui/react";
import Link from "next/link";
import { BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";
import { FaComment } from "react-icons/fa6";
import { Timestamp } from "firebase/firestore";

interface Post {
  id: string;
  title: string;
  description: string;
  username: string;
  communityName: string;
  createdAt?: Timestamp | null;
  upvotes: number;
  downvotes: number;
  comments: number;
}

interface PostsGridViewProps {
  posts: Post[];
  loading: boolean;
}

const PostsGridView: React.FC<PostsGridViewProps> = ({ posts, loading }) => {
  return (
    <Box p={6}>
      {loading ? (
        <Spinner size="xl" />
      ) : posts.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </SimpleGrid>
      ) : (
        <Text fontSize="lg" color="brand.100">
          No posts found.
        </Text>
      )}
    </Box>
  );
};

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    const formattedDate =
      post.createdAt && post.createdAt instanceof Timestamp
        ? post.createdAt.toDate().toLocaleString()
        : "No date";
        
  return (
    <Link href={`/post/${post.id}`} passHref>
      <Box
        p={6}
        bg="brand.500"
        shadow="0 8px 15px rgba(0, 0, 0, 0.1)"
        minHeight="100px"
        display="flex"
        flexDirection="column"
        cursor="pointer"
      >
        <Text fontWeight="900" fontSize="md" color="brand.100" isTruncated>
          {post.title}
        </Text>

        <Text fontWeight="600" fontSize="xs" color="brand.100" mb={2}>
          u/{post.username}
        </Text>

        <Text color="brand.100" fontSize="sm" mb={4} noOfLines={3}>
          {post.description}
        </Text>

        <HStack justify="center" spacing={6} color="brand.100" fontSize="sm">
          <HStack spacing={1}>
            <BiSolidUpvote color="brand.100" />
            <Text color="brand.100">{post.upvotes}</Text>
          </HStack>
          <HStack spacing={1}>
            <BiSolidDownvote color="brand.100" />
            <Text color="brand.100">{post.downvotes}</Text>
          </HStack>
          <HStack spacing={1}>
            <FaComment />
            <Text color="brand.100">{post.comments}</Text>
          </HStack>
        </HStack>

        <HStack justify="space-between" mt={3} fontSize="xs" color="brand.100">
          <Text>q/{post.communityName}</Text>
          <Text>{formattedDate}</Text>
        </HStack>
      </Box>
    </Link>
  );
};

export default PostsGridView;
