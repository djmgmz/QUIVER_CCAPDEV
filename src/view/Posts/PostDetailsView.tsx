import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  chakra,
  Input,
  InputGroup,
  Link,
  Avatar,
} from "@chakra-ui/react";
import { BiSolidUpvote, BiSolidDownvote, BiDownvote, BiUpvote } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/router";
import DeletePost from "@/view/Modal/DeletePost";
import { FaRegComments } from "react-icons/fa6";
import { transparentize } from "@chakra-ui/theme-tools";


interface Post {
  id: string;
  title: string;
  description: string;
  author: string;
  community: string;
  createdAt?: any;
  upvotes?: number;
  downvotes?: number;
  edited?: boolean;
}

interface Comment {
  id: string;
  author: string;
  username: string;
  profilePicture?: string | null;
  content: string;
  createdAt: any;
  parentId?: string | null;
  userVote?: "upvote" | "downvote" | null;
  upvotes?: number;
  downvotes?: number;
  edited?: boolean;
  replies?: Comment[];
}


interface PostDetailsViewProps {
  post: Post;
  comments: Comment[];
  currentUser: any;
  communityName: string;
  authorUsername: string;
  authorProfilePic: string | null;
  formattedDate: string;
  postVotes: { upvotes: number; downvotes: number };
  commentVotes: { [key: string]: { upvoted: boolean; downvoted: boolean } };
  isDeleteModalOpen: boolean;
  commentToDelete: string | null;
  isCommenting: boolean;
  commentText: string;
  upvoted: boolean;
  downvoted: boolean;
  handlePostUpvote: () => void;
  handlePostDownvote: () => void;
  handleCommentUpvote: (commentId: string) => void;
  handleCommentDownvote: (commentId: string) => void;
  handleDeletePost: () => void;
  handleDeleteComment: (commentId: string) => void;
  handleCommentSubmit: (event: React.FormEvent) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  setCommentToDelete: (commentId: string | null) => void;
  setIsCommenting: (isCommenting: boolean) => void;
  setCommentText: (text: string) => void;
  handleReplySubmit: (
    parentId: string,
    replyText: string,
    setReplyText: (text: string) => void,
    setIsReplying: (val: boolean) => void
  ) => void;
}

const PostDetailsView: React.FC<PostDetailsViewProps> = ({
  post,
  comments,
  currentUser,
  communityName,
  authorUsername,
  authorProfilePic,
  formattedDate,
  postVotes,
  commentVotes,
  isDeleteModalOpen,
  commentToDelete,
  isCommenting,
  commentText,
  upvoted,
  downvoted,
  handlePostUpvote,
  handlePostDownvote,
  handleCommentUpvote,
  handleCommentDownvote,
  handleDeletePost,
  handleDeleteComment,
  handleCommentSubmit,
  setIsDeleteModalOpen,
  setCommentToDelete,
  setIsCommenting,
  setCommentText,
  handleReplySubmit,
}) => {
  const router = useRouter();

  const CommentItem: React.FC<{
    comment: Comment;
    depth?: number;
    currentUser: any;
    handleCommentUpvote: (commentId: string) => void;
    handleCommentDownvote: (commentId: string) => void;
    handleDeleteComment: (commentId: string) => void;
    commentVotes: { [key: string]: { upvoted: boolean, downvoted: boolean } };
    setCommentToDelete: (commentId: string | null) => void;
  }> = ({
    comment,
    depth = 0,
    currentUser,
    handleCommentUpvote,
    handleCommentDownvote,
    handleDeleteComment,
    commentVotes,
    setCommentToDelete
  }) => {
    const isAuthor = currentUser?.uid === comment.author;
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");

    const formattedDate = comment.createdAt?.seconds
      ? new Date(comment.createdAt.seconds * 1000).toLocaleString()
      : "Unknown Date";
  
    return (
      <Box
        ml={depth * 4}
        pl={4}
        pt={2}
        pb={2}
        position="relative"
        key={comment.id}
        _before={
          depth > 0
            ? {
                content: '""',
                position: "absolute",
                top: 0,
                left: -1,
                width: "16px",
                height: "100%",
                borderLeft: "2px solid",
                borderColor: transparentize("brand.100", 0.5),
              }
            : {}
        }
        _after={
          depth > 0
            ? {
                content: '""',
                position: "absolute",
                top: "16px", // vertical position of elbow
                left: "-4px",
                width: "16px", // horizontal part of L
                borderTop: "2px solid",
                borderColor: transparentize("brand.100", 0.5),
              }
            : {}
        }
      >
        <HStack spacing={2} color="brand.100" fontSize="sm">
          <Avatar
            size="xs"
            src={comment.profilePicture || "/images/guestprofilepic.jpeg"}
            bg="gray.400"
            sx={{
              border: "1px solid",
              borderColor: "brand.100",
            }}
          />
          <Link href={`/profile/${comment.author}`}>
            <Text fontWeight="bold" color="brand.100" _hover={{ cursor: "pointer", color: "brand.600" }}>
              u/{comment.username}
            </Text>
          </Link>
          <Text>{formattedDate}</Text>
          <Text>{comment.edited ? " (edited)" : ""}</Text>
        </HStack>

        <Text color="brand.100" mt={2}>
          {comment.content}
        </Text>

        <HStack spacing={4} mt={2}>
          <Button
            variant="outline"
            size="xs"
            onClick={() => handleCommentUpvote(comment.id)}
            leftIcon={
              commentVotes[comment.id]?.upvoted ? (
                <BiSolidUpvote size={14} />
              ) : (
                <BiUpvote size={14} />
              )
            }
          >
            <Text fontSize="xs">{comment.upvotes}</Text>
          </Button>

          <Button
            variant="outline"
            size="xs"
            onClick={() => handleCommentDownvote(comment.id)}
            leftIcon={
              commentVotes[comment.id]?.downvoted ? (
                <BiSolidDownvote size={14} />
              ) : (
                <BiDownvote size={14} />
              )
            }
          >
            <Text fontSize="xs">{comment.downvotes}</Text>
          </Button>

          {!isReplying && (
            <Button
              size="xs"
              variant="outline"
              onClick={() => setIsReplying(true)}
              color="brand.100"
            >
              Reply
            </Button>
          )}

        </HStack>

        {isReplying && (
          <Box mt={2} ml={4}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleReplySubmit(comment.id, replyText, setReplyText, setIsReplying);
              }}
            >
              <InputGroup>
                <Input
                  placeholder="Write a reply..."
                  size="sm"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  color="brand.100"
                  borderRadius="md"
                  borderColor="brand.100"
                />
              </InputGroup>
              <HStack mt={1} spacing={2}>
                <Button size="xs" type="submit" colorScheme="blue">
                  Submit
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    setReplyText("");
                    setIsReplying(false);
                  }}
                >
                  Cancel
                </Button>
              </HStack>
            </form>
          </Box>
        )}

        {isAuthor && (
          <Box position="absolute" top={2} right={2}>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<BsThreeDots size="18px" />}
                variant="ghost"
                color="brand.100"
                size="sm"
              />
              <MenuList>
                <MenuItem
                  onClick={() =>
                    router.push({
                      pathname: `/comment/edit/${comment.id}`,
                      query: {
                        communityId: post.community,
                        postId: post.id,
                      },
                    })
                  }
                >
                  Edit
                </MenuItem>
                <MenuItem onClick={() => setCommentToDelete(comment.id)}>
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        )}

         {/* 🔁 Recursively render replies if any */}
        {comment.replies && comment.replies.length > 0 && (
          <VStack mt={2} spacing={2} align="stretch">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                currentUser={currentUser}
                handleCommentUpvote={handleCommentUpvote}
                handleCommentDownvote={handleCommentDownvote}
                handleDeleteComment={handleDeleteComment}
                commentVotes={commentVotes}
                setCommentToDelete={setCommentToDelete}
              />
            ))}
          </VStack>
        )}
      </Box>
    );
  };  

  return (
    <VStack align="stretch" spacing={0.5} maxW="stretch">
      <Box mt={5} ml={10}>
      <Text fontSize="20" color="brand.100">
        in{" "}
        <Link href={`/subquiver/${communityName}`}>
          <Text as="span" color="brand.100" fontWeight="semibold" _hover={{ cursor: "pointer", color: "brand.600" }}>
            q/{communityName}
          </Text>
        </Link>
      </Text>
      </Box>

      <Box position="relative" maxW="1350px" ml={82}>
        <Text fontSize="40" fontWeight="bold" color="brand.100" ml={4}>
          {post.title}
        </Text>

        {currentUser?.uid === post.author && (
          <Box position="absolute" top={0} right={0}>
            <Menu>
              <MenuButton as={IconButton} icon={<BsThreeDots size="24px" />} color="brand.100" variant="ghost" size="lg" />
              <MenuList>
                <MenuItem onClick={() => router.push(`/post/edit/${post.id}?community=${communityName}`)}>Edit</MenuItem>
                <MenuItem onClick={() => setIsDeleteModalOpen(true)}>Delete</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        )}
      </Box>

      <Box ml={35}>
        <HStack spacing={2} color="brand.600" fontSize="sm" ml={69}>
          <Avatar
            size="sm"
            src={authorProfilePic || "/images/guestprofilepic.jpeg"}
            name={authorUsername}
            bg="gray.400"
            sx={{
              border: "1px solid",
              borderColor: "brand.100",
            }}
          />
          <Link href={`/profile/${post.author}`}>
            <Text fontSize="17" color="brand.100" fontWeight="medium" _hover={{ cursor: "pointer", color: "brand.600" }}>
              u/{authorUsername}
            </Text>
          </Link>
          <Text>{formattedDate}</Text>
          <Text>{post.edited ? " (edited)" : ""}</Text>
        </HStack>
      </Box>

      <Box bg="brand.700" borderRadius="lg" p={6} boxShadow="sm" maxW="1400px" ml={100}>
        <Text color="brand.100" fontSize="md">
          {post.description}
        </Text>
      </Box>

      <Box mt={2} ml={88}>
        <HStack spacing={6} ml={4}>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePostUpvote}
          leftIcon={upvoted ? <BiSolidUpvote size={16} /> : <BiUpvote size={16} />}
        >
          <Text fontSize="xs">{postVotes.upvotes}</Text>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handlePostDownvote}
          leftIcon={downvoted ? <BiSolidDownvote size={16} /> : <BiDownvote size={16} />}
        >
          <Text fontSize="xs">{postVotes.downvotes}</Text>
        </Button>
        </HStack>
      </Box>

      <Box ml={100} maxW="1400px" mt={4}>
        {!isCommenting ? (
          <Box 
            p={3} 
            borderRadius="lg" 
            borderWidth="1px"
            borderColor="black"
            cursor="text" 
            onClick={() => setIsCommenting(true)}
            display="flex"
            alignItems="center"
            gap={2}
          >
            <chakra.div color="brand.100">
              <FaRegComments fontSize="20px" />
            </chakra.div>
            <Text color="brand.100">Add a comment</Text>
          </Box>
        ) : (
          <Box 
            p={3} 
            borderRadius="lg" 
            borderWidth="1px" 
            borderColor="black"
          >
            <form onSubmit={handleCommentSubmit}>
              <InputGroup>
                <Input
                  placeholder="Add a comment..."
                  _placeholder={{ color: "brand.100" }}
                  borderRadius="md"
                  borderColor="transparent"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  color="brand.100"
                  _focus={{ borderColor: "brand.100" }}
                />
              </InputGroup>
              
              <HStack mt={2} justify="flex-end">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsCommenting(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="solid" size="sm">
                  Comment
                </Button>
              </HStack>
            </form>
          </Box>
        )}
      </Box>

      <Box ml={100} maxW="1400px">
        <Text mt={3} color="brand.100" fontSize="xl" fontWeight="bold">
          Comments
        </Text>

        {comments.length === 0 ? (
          <Text color="brand.100" mt={2}>No comments yet under this post.</Text>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              handleCommentUpvote={handleCommentUpvote}
              handleCommentDownvote={handleCommentDownvote}
              handleDeleteComment={handleDeleteComment}
              commentVotes={commentVotes}
              setCommentToDelete={setCommentToDelete}
            />
          ))
        )}
      </Box>

      <DeletePost 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onDelete={handleDeletePost} 
      />

      <DeletePost 
        isOpen={commentToDelete !== null} 
        onClose={() => setCommentToDelete(null)} 
        onDelete={() => commentToDelete && handleDeleteComment(commentToDelete)} 
      />
    </VStack>
  );
};

export default PostDetailsView;
