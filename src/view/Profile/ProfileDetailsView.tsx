import React from "react";
import { useColorModeValue, Box, Flex, VStack, Text, Avatar, Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Button, Spinner, Divider, Menu, MenuButton, IconButton, MenuList, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { NextRouter } from 'next/router';
import { useTheme } from "@/view/chakra/themecontext";

interface ProfileDetailsViewProps {
  user: {
    uid: string;
    username: string;
    description: string;
    profilePicture: string | null;
    banner: string | null;
  };
  isCurrentUser: boolean;
  posts: Array<{
    id: string;
    title: string;
    description: string;
    upvotes: number;
    downvotes: number;
    comments: number;
    community: string;
    subquiverId: string;
    postAuthorUsername: string;
    createdAt: string;
  }>;
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    upvotes: number;
    downvotes: number;
    postTitle: string;
    postAuthorUsername: string;
    subquiverName: string;
    subquiverId: string;
    postId: string;
  }>;
  upvotedItems: any[];
  downvotedItems: any[];
  loading: boolean;
  commentsLoading: boolean;
  loadingVotes: boolean;
  handlePostUpvote: (postId: string, community: string) => void;
  handlePostDownvote: (postId: string, community: string) => void;
  handleCommentUpvote: (commentId: string, postId: string, community: string) => void;
  handleCommentDownvote: (commentId: string, postId: string, community: string) => void;
  handleDelete: () => void;
  deleteModal: { open: boolean; postId: string | null };
  setDeleteModal: (modal: { open: boolean; postId: string | null }) => void;
  setIsDeletingComment: (value: boolean) => void;
  setCurrentSubquiverId: (id: string) => void;
  setParentPostId: (id: string) => void;
  router: NextRouter;
}

  const ProfileDetailsView: React.FC<ProfileDetailsViewProps> = ({
    user,
    isCurrentUser,
    posts,
    comments,
    upvotedItems,
    downvotedItems,
    loading,
    commentsLoading,
    loadingVotes,
    handlePostUpvote,
    handlePostDownvote,
    handleCommentUpvote,
    handleCommentDownvote,
    handleDelete,
    deleteModal,
    setDeleteModal,
    setIsDeletingComment,
    setCurrentSubquiverId,
    setParentPostId,
    router,
  }) => {
    const { theme } = useTheme();
    return (
      <>
      <Box width="full" position="relative">
      <Box
          width="full"
          height="150px"
          position="relative"
          sx={{
            bg: user.banner ? "transparent" : "brand.100",
            backgroundImage: user.banner ? `url(${user.banner})` : undefined,
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
          src={user.profilePicture || "/images/guestprofilepic.jpeg"}
          sx={{
            border: "4px solid",
            borderColor: "brand.100",
          }}
        />
        </Box>
  
        <Flex align="center" justify="space-between" mt={1} ml={90} px={10}>
          <Text color="brand.100" fontSize="40" fontWeight="bold">
            u/{user.username || "Unknown User"}
          </Text>
          {isCurrentUser && (
            <Button variant="outline" onClick={() => router.push("/profile/edit")}>
              Edit Profile
            </Button>
          )}
        </Flex>
  
        <VStack align="start" spacing={2} mt={2} ml={90} px={10}>
          <Text fontSize="md" maxW="600px" color="brand.100">
            {user.description || "No bio available."}
          </Text>
        </VStack>
  
        <Tabs variant="solid-rounded"  align="start" ml={160} mt={8} px={10}>
          <TabList mb={4}>
            <HStack spacing={250} align="center" color="yellow">
              <Tab color={theme[100]} _selected={{ color: theme[200] , bg:theme[300]}}>Posts</Tab>
              <Tab color={theme[100]} _selected={{ color: theme[200] , bg:theme[300]}}>Comments</Tab>
              <Tab color={theme[100]} _selected={{ color: theme[200] , bg:theme[300]}}>Upvoted</Tab>
              <Tab color={theme[100]} _selected={{ color: theme[200] , bg:theme[300]}}>Downvoted</Tab>
            </HStack>
          </TabList>
  
          <Divider width="85%" borderColor="brand.100" my={4} />
  
          <TabPanels mt={6}>
          <TabPanel>
              {loading ? (
                <Spinner size="xl" />
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <Box
                    key={post.id}
                    p={4}
                    border="2px solid"
                    borderColor="black"
                    borderRadius="lg"
                    shadow="md"
                    mt={4}
                    maxWidth={1130}
                  >
                    <HStack justify="space-between" align="start">
                      <VStack align="start">
                        <Text fontWeight="bold" color="brand.100">
                              {post.title}
                        </Text>
                        <HStack >
                        <Avatar
                            size="sm"
                            bg="gray.400"
                            src={user.profilePicture || "/images/guestprofilepic.jpeg"}
                            sx={{
                              border: "1px solid",
                              borderColor: "brand.100",
                            }}
                          />
  
                          <VStack spacing={0} align="start">
                            <Text fontSize="xs" color="brand.100">
                              u/{post.postAuthorUsername} in q/{post.community}
                            </Text>
                            <Text fontSize="xs" color="brand.100">
                              Posted on: {post.createdAt}
                            </Text>
                          </VStack>
                        </HStack>
                      </VStack>
                      
  
                      {isCurrentUser && (
                        <Menu>
                        <MenuButton as={IconButton} icon={<BsThreeDots />} variant="ghost" size="md" color="brand.100" />
                        <MenuList>
                          <MenuItem onClick={() => router.push(`/post/edit/${post.id}?community=${post.community}`)}>
                            Edit
                          </MenuItem>
                          <MenuItem onClick={() => {
                            setIsDeletingComment(false);
                            setCurrentSubquiverId(post.subquiverId);
                            setDeleteModal({ open: true, postId: post.id });
                          }}>
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                      )}
                    </HStack>
  
                    <Box mt={2} p={4} bg="brand.800" borderRadius="md">
                      <Text color="#F4F4F4">{post.description}</Text>
                    </Box>
  
                    <HStack spacing={6} mt={2}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePostUpvote(post.id, post.subquiverId)}
                        leftIcon={<BiSolidUpvote />}
                      >
                        {post.upvotes}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePostDownvote(post.id, post.subquiverId)}
                        leftIcon={<BiSolidDownvote />}
                      >
                        {post.downvotes}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<FaRegComment />}
                        onClick={() => router.push(`/post/${post.id}`)}
                      >
                        {post.comments}
                      </Button>
                    </HStack>
                  </Box>
                ))
              ) : (
                <Text color="brand.100">No posts yet.</Text>
              )}
            </TabPanel>
            <TabPanel>
              {commentsLoading ? (
                <Spinner size="xl" />
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <Box
                    key={comment.id}
                    p={4}
                    border="2px solid"
                    borderColor="black"
                    borderRadius="lg"
                    shadow="md"
                    mt={4}
                    maxWidth={1130}
                  >
                    <HStack justify="space-between" align="start">
                    <Text fontSize={19} fontWeight={900} color="brand.100">
                      In q/{comment.subquiverName}
                    </Text>
                    {isCurrentUser && (
                    <Menu>
                      <MenuButton as={IconButton} icon={<BsThreeDots />} variant="ghost" size="md" color="brand.100" />
                      <MenuList>
                        <MenuItem onClick={() => {
                          router.push(`/comment/edit/${comment.id}?postId=${comment.postId}&communityId=${comment.subquiverId}`);
                        }}>
                          Edit
                        </MenuItem>
                        <MenuItem onClick={() => {
                          setIsDeletingComment(true);
                          setCurrentSubquiverId(comment.subquiverId);
                          setParentPostId(comment.postId);
                          setDeleteModal({ open: true, postId: comment.id });
                        }}>
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                    )}
                    </HStack>
                    <Text ml={2} fontSize="xs" fontWeight={600} color="brand.100">
                      {comment.postTitle}
                    </Text>
                    <Text ml={2} fontSize="xs" color="brand.100">
                      by u/{comment.postAuthorUsername}
                    </Text>
  
                    <Box mt={2} p={4} bg="brand.800" borderRadius="md">
                      <Text color="#F4F4F4">{comment.content}</Text>
                    </Box>
  
                    <HStack spacing={6} mt={2}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleCommentUpvote(comment.id, comment.postId, comment.subquiverId)
                        }
                        leftIcon={<BiSolidUpvote />}
                      >
                        {comment.upvotes}
                      </Button>
  
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleCommentDownvote(comment.id, comment.postId, comment.subquiverId)
                        }
                        leftIcon={<BiSolidDownvote />}
                      >
                        {comment.downvotes}
                      </Button>
                    </HStack>
                  </Box>
                ))
              ) : (
                <Text color="brand.100">No comments yet.</Text>
              )}
            </TabPanel>
            <TabPanel>
              {loadingVotes ? (
                <Spinner size="xl" />
              ) : upvotedItems.length > 0 ? (
                upvotedItems.map((item) =>
                  item.type === "post" ? (
                    <Box key={item.id} p={4} border="2px solid" borderColor="black" borderRadius="lg" shadow="md" mt={4} maxWidth={1130}>
                      <Text fontWeight="bold" color="brand.100">
                        {item.title}
                      </Text>
                      <Text fontSize="xs" color="brand.100">
                        by u/{item.author}
                      </Text>
                      <Text color="brand.100">{item.description}</Text>
                      <Text fontSize="xs" color="brand.100">
                        Upvotes: {item.upvotes}, Downvotes: {item.downvotes}
                      </Text>
                      <Text fontSize="xs" color="brand.100">
                        Created: {item.createdAt}
                      </Text>
                    </Box>
                  ) : (
                    <Box key={item.id} p={4} border="2px solid" borderColor="black" borderRadius="lg" shadow="md" mt={4} maxWidth={1130}>
                      <Text fontWeight="bold" color="brand.100">
                        Commented on Post: {item.postTitle}
                      </Text>
                      <Text fontSize="xs" color="brand.100">
                        by u/{item.author}
                      </Text>
                      <Text color="brand.100">{item.content}</Text>
                      <Text fontSize="xs" color="brand.100">
                        Upvotes: {item.upvotes}, Downvotes: {item.downvotes}
                      </Text>
                      <Text fontSize="xs" color="brand.100">
                        Created: {item.createdAt}
                      </Text>
                    </Box>
                  )
                )
              ) : (
                <Text color="brand.100">No upvoted items yet.</Text>
              )}
            </TabPanel>
  
            <TabPanel>
              {loadingVotes ? (
                <Spinner size="xl" />
              ) : downvotedItems.length > 0 ? (
                downvotedItems.map((item) =>
                  item.type === "post" ? (
                    <Box key={item.id} p={4} border="2px solid" borderColor="black" borderRadius="lg" shadow="md" mt={4} maxWidth={1130}>
                      <Text fontWeight="bold" color="brand.100">
                        {item.title}
                      </Text>
                      <Text fontSize="xs" color="brand.100">
                        by u/{item.author}
                      </Text>
                      <Text color="brand.100">{item.description}</Text>
                      <Text fontSize="xs" color="brand.100">
                        Upvotes: {item.upvotes}, Downvotes: {item.downvotes}
                      </Text>
                      <Text fontSize="xs" color="brand.100">
                        Created: {item.createdAt}
                      </Text>
                    </Box>
                  ) : (
                    <Box key={item.id} p={4} border="2px solid" borderColor="black" borderRadius="lg" shadow="md" mt={4} maxWidth={1130}>
                      <Text fontWeight="bold" color="brand.100">
                        Commented on Post: {item.postTitle}
                      </Text>
                      <Text fontSize="xs" color="brand.100">
                        by u/{item.author}
                      </Text>
                      <Text color="brand.100">{item.content}</Text>
                      <Text fontSize="xs" color="brand.100">
                        Upvotes: {item.upvotes}, Downvotes: {item.downvotes}
                      </Text>
                      <Text fontSize="xs" color="brand.100">
                        Created: {item.createdAt}
                      </Text>
                    </Box>
                  )
                )
              ) : (
                <Text color="brand.100">No downvoted items yet.</Text>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      
      <DeletePost
        isOpen={deleteModal.open}
        onClose={() => {
          setDeleteModal({ open: false, postId: null });
          setIsDeletingComment(false);
        }}
        onDelete={handleDelete}
      />
    </>
    );
  };
  
  const DeletePost = ({
    isOpen,
    onClose,
    onDelete,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
  }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this item?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onDelete(); 
                onClose();  
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

export default ProfileDetailsView;
