import React, { useState } from "react";
import {
  Box,
  Text,
  Avatar,
  Button,
  HStack,
  VStack,
  Divider,
  Spinner,
  useToast,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import DeletePost from "@/view/Modal/DeletePost";
import router from "next/router";
import { FaRegComment } from "react-icons/fa6";
import { BiSolidUpvote } from "react-icons/bi";
import { BiSolidDownvote } from "react-icons/bi";
import { BiUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { auth } from "@/model/firebase/clientApp";
import { handleDeleteSubquiver, handleEditSubquiver } from "@/controller/Communities/CommunityContentController";
import EditSubquiverModalView from "@/view/Modal/EditSubquiverModalView"; 
import DeleteSubquiverModalView from "@/view/Modal/DeleteSubquiverModalView"; 
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";

interface Post {
  id: string;
  title: string;
  description: string;
  author: string;
  username: string;
  community: string;
  upvotes: number;
  downvotes: number;
  userVote?: "upvote" | "downvote" | null;
  createdAt?: string;
  profilePicture?: string | null;
}

interface PostCardProps {
    post: Post;
    handleVote: (postId: string, type: "upvote" | "downvote") => void;
    setDeleteModal: (modalState: { open: boolean; postId: string | null }) => void;
    user: { uid: string | null } | null;
  }
  

const PostCard: React.FC<PostCardProps> = ({ post, handleVote, setDeleteModal, user }) => {
  const handleEditPost = () => {
    router.push(`/post/edit/${post.id}?community=${post.community}`);
  };

  const handleViewPost = () => {
    router.push(`/post/${post.id}`);
  };

  return (
      <Box
        maxW={{ base: "95%", md: "750px", lg: "900px", xl: "1200px" }}
        width="full"
        p={4}
        border="2px solid"
        borderColor="black"
        borderRadius="lg"
        shadow="md"
      >
        <HStack justify="space-between">
          <HStack>
          <Avatar
              size="sm"
              bg="gray.400"
              src={post.profilePicture || "/images/guestprofilepic.jpeg"}
              sx={{
                border: "1px solid",
                borderColor: "brand.100",
              }}
            />
            <VStack spacing={0} align="start">
              <Text fontWeight="bold" color="brand.100">{post.title}</Text>
              <Link href={`/profile/${post.author}`}>
                <Text fontSize="xs" color="brand.100" _hover={{ color: "brand.600", cursor: "pointer" }}>
                  u/{post.username}
                </Text>
              </Link>
            </VStack>
          </HStack>
  
          {user?.uid === post.author && (
            <Menu>
              <MenuButton as={IconButton} icon={<BsThreeDots />} variant="ghost" size="md" color="brand.100" />
              <MenuList>
                <MenuItem onClick={handleEditPost}>Edit</MenuItem>
                <MenuItem onClick={() => setDeleteModal({ open: true, postId: post.id })}>Delete</MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
  
        <Box mx={7} mt={3} p={6} bg="brand.800" borderRadius="md">
          <Text color="#F4F4F4">{post.description}</Text>
        </Box>
  
        <Box mt={2} ml={5}>
          <HStack spacing={6} ml={4}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVote(post.id, "upvote")}
            leftIcon={post.userVote === "upvote" ? <BiSolidUpvote size={16} /> : <BiUpvote size={16} />}
          >
            <Text fontSize="xs">{post.upvotes}</Text>
          </Button>
  
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVote(post.id, "downvote")}
            leftIcon={post.userVote === "downvote" ? <BiSolidDownvote size={16} /> : <BiDownvote size={16} />}
          >
            <Text fontSize="xs">{post.downvotes}</Text>
          </Button>
          <Button
              variant="outline"
              size="sm"
              onClick={handleViewPost}
              leftIcon={<FaRegComment />}
            >
              Comment
            </Button>
          </HStack>
        </Box>
      </Box>
    );
  };

interface CommunityContentViewProps {
  name: string;
  posts: Post[];
  loading: boolean;
  joined: boolean;
  handleJoin: () => void;
  handleLeave: () => void;
  handleCreatePost: () => void;
  handleVote: (postId: string, type: "upvote" | "downvote") => void;
  deleteModal: {
    open: boolean;
    postId: string | null;
  };
  handleConfirmDelete: () => void;
  setDeleteModal: (modalState: { open: boolean; postId: string | null }) => void;
  fetchPosts: () => Promise<void>;
  checkMembership: () => Promise<void>;
  updateVoteCounts: (postId: string, type: "upvote" | "downvote", delta: number) => void;
  updateUserVote: (postId: string, vote: "upvote" | "downvote" | null) => void;
  user: { uid: string | null } | null;
  authorProfilePic: string | null;
  onDeleteSubquiver: () => void;
  onEditSubquiver: () => void;
  communityId: string;
  description: string;
  bannerImageURL?: string | null;
  iconImageURL?: string | null;
  creatorId: string | null;
}

const CommunityContentView: React.FC<CommunityContentViewProps> = ({
  name,
  posts,
  loading,
  joined,
  handleJoin,
  handleLeave,
  handleCreatePost,
  handleVote,
  deleteModal,
  handleConfirmDelete,
  setDeleteModal,
  fetchPosts,
  checkMembership,
  updateVoteCounts,
  updateUserVote,
  user,
  communityId,
  description,
  bannerImageURL,
  iconImageURL,
  creatorId,
}) => {

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const toast = useToast();

    return (
        <Box width="full">
          <Box
            width="full"
            height="150px"
            position="relative"
            sx={{
              bg: bannerImageURL ? "transparent" : "brand.100",
              backgroundImage: bannerImageURL ? `url(${bannerImageURL})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <Avatar
              size="xl"
              position="absolute"
              bottom="-40px"
              left="20px"
              bg="gray.400"
              src={iconImageURL || "/images/guestprofilepic.jpeg"}
              sx={{
                border: "4px solid",
                borderColor: "brand.100",
              }}
            />
          </Box>

          
          <Box ml={100} px={4} pt={2} pb={4}>
            <HStack justify="space-between" align="center">
            <Box>
              <Text color="brand.100" fontSize="35" fontWeight="bold">
                q/{name}
              </Text>
              <Text fontSize="lg" color="gray.600" maxW="600px" ml={10} mt={2}>
                {description}
              </Text>
            </Box>

            <HStack spacing={3}>
            
            {user?.uid === creatorId && (
              <Menu>
                <MenuButton as={IconButton} icon={<BsThreeDotsVertical />} variant="outline" />
                <MenuList>
                  <MenuItem onClick={() => setEditModalOpen(true)}>Edit Subquiver</MenuItem>
                  <MenuItem onClick={() => setDeleteModalOpen(true)}>Delete Subquiver</MenuItem>
                </MenuList>
              </Menu>
            )}


          <Button leftIcon={<FaPlus />} size="md" variant="outline" onClick={handleCreatePost}>
            Create Post
          </Button>
  
          <Button size="md" variant="solid" onClick={joined ? handleLeave : handleJoin}>
            {joined ? "Joined" : "Join"}
          </Button>
              </HStack>
            </HStack>
          </Box>
    
          <VStack spacing={0} mt={6} align="center" width="full">
            {loading ? (
              <Spinner size="xl" />
            ) : posts.length > 0 ? (
              posts.map((post, index) => (
                <React.Fragment key={post.id}>
                  <PostCard 
                    post={post} 
                    handleVote={handleVote} 
                    setDeleteModal={setDeleteModal} 
                    user={user} 
                    />

                  {index !== posts.length - 1 && <Divider borderColor="black" my={4} />}
                </React.Fragment>
              ))
            ) : (
              <Text fontSize="lg" fontWeight="bold" color="brand.100" mt={10}>
                No posts made yet in this subquiver
              </Text>
            )}
          </VStack>

           <EditSubquiverModalView
            isOpen={isEditModalOpen}
            onClose={() => setEditModalOpen(false)}
            communityId={communityId}
            communityName={name}
            communityDescription={description}
            onEdit={(communityId: string, newName: string, newDescription: string) =>
              handleEditSubquiver(
                communityId,
                newName,
                newDescription,
                (options) => toast({ ...options, status: options.status as "info" | "warning" | "success" | "error" | "loading" }),
                fetchPosts,
                router
              )
            }
          />

          <DeleteSubquiverModalView
            isOpen={isDeleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onDelete={() => {
            handleDeleteSubquiver(
            communityId,
            (options) =>
            toast({
              ...options,
              status: options.status as "info" | "warning" | "success" | "error" | "loading",
            }),
            router
            );
            setDeleteModalOpen(false);
            }}
          />
    
          <DeletePost isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, postId: null })} onDelete={handleConfirmDelete} />
        </Box>
    );
};


export default CommunityContentView;
