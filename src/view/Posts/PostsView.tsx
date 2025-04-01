import React, { useState } from "react";
import { Box, SimpleGrid, Text, HStack, Spinner, Menu, MenuButton, MenuItem, MenuList, } from "@chakra-ui/react";
import Link from "next/link";
import { BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";
import { FaComment } from "react-icons/fa6";
import { Timestamp } from "firebase/firestore";
import { TiArrowSortedDown } from "react-icons/ti";

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
  isPopularView: boolean;
  timePeriod: "today" | "week" | "month";
  setTimePeriod: React.Dispatch<React.SetStateAction<"today" | "week" | "month">>;
}

const PostsGridView: React.FC<PostsGridViewProps> = ({
  posts,
  loading,
  isPopularView,
  timePeriod,
  setTimePeriod,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Box p={6}>
      {isPopularView && (
        <Box mb={4}>
        <Text mb={1} color="brand.100" fontWeight="semibold">
          Showing popular posts from:
        </Text>
      
        <Menu isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <MenuButton
              as={Box}
              cursor="pointer"
              display="flex"
              alignItems="center"
              bg="brand.200"
              color="brand.100"
              px={4}
              py={2}
              borderRadius="md"
              onClick={() => setIsOpen(!isOpen)}
              maxW="200px"
              border="1px solid"
              borderColor="brand.100"
            >
            <HStack justify="space-between" w="full">
              <Text fontWeight="medium" fontSize="sm">
                {timePeriod === "today"
                  ? "Today"
                  : timePeriod === "week"
                  ? "This Week"
                  : "This Month"}
              </Text>
              <TiArrowSortedDown
                style={{
                  transition: "transform 0.2s",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </HStack>
          </MenuButton>
      
          <MenuList bg="brand.200" borderColor="brand.100">
            <MenuItem
              onClick={() => {
                setTimePeriod("today");
                setIsOpen(false);
              }}
              _hover={{ bg: "brand.100", color: "brand.200" }}
            >
              Today
            </MenuItem>
            <MenuItem
              onClick={() => {
                setTimePeriod("week");
                setIsOpen(false);
              }}
              _hover={{ bg: "brand.100", color: "brand.200" }}
            >
              This Week
            </MenuItem>
            <MenuItem
              onClick={() => {
                setTimePeriod("month");
                setIsOpen(false);
              }}
              _hover={{ bg: "brand.100", color: "brand.200" }}
            >
              This Month
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
      )}

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
