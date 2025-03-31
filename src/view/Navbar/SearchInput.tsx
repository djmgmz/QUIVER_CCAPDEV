import {
    Box,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    List,
    ListItem,
    Tag,
    TagLabel,
    TagCloseButton,
    Text,
  } from "@chakra-ui/react";
  import { SearchIcon } from "@chakra-ui/icons";
  import { useRouter } from "next/router";
  import React from "react";
  import { useSearchInputModel } from "@/model/Navbar/SearchInputModel";
  import {
    handleSearchInputChange,
    handleRemoveTag,
  } from "@/controller/Navbar/SearchInputController";
  
  const SearchInput: React.FC = () => {
    const router = useRouter();
    const {
      searchTerm,
      setSearchTerm,
      communityFilter,
      setCommunityFilter,
      posts,
      filteredPosts,
      setFilteredPosts,
      showDropdown,
      setShowDropdown,
      containerRef,
      subquivers,
    } = useSearchInputModel();
  
    return (
      <Flex
        ref={containerRef}
        direction="column"
        position="relative"
        flexGrow={1}
        maxW="40%"
        ml={4}
      >
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="brand.100" />
          </InputLeftElement>
  
          <Flex
            align="center"
            flex="1"
            bg="brand.400"
            pl="40px"
            pr="10px"
            py="2px"
            borderRadius="md"
            flexWrap="wrap"
            minH="34px"
            position="relative"
          >
            {communityFilter && (
              <Tag
                size="sm"
                mr={2}
                mb={1}
                borderRadius="full"
                bg="brand.100"
                color="brand.200"
              >
                <TagLabel>q/{communityFilter}</TagLabel>
                <TagCloseButton
                  onClick={() =>
                    handleRemoveTag(
                      communityFilter,
                      searchTerm,
                      setSearchTerm,
                      setCommunityFilter,
                      posts,
                      setFilteredPosts
                    )
                  }
                />
              </Tag>
            )}
  
            <Box flex="1" minW="120px">
              <Input
                variant="unstyled"
                placeholder="Search Posts"
                value={searchTerm}
                onChange={(e) =>
                  handleSearchInputChange(
                    e.target.value,
                    setSearchTerm,
                    setCommunityFilter,
                    posts,
                    setFilteredPosts,
                    communityFilter
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !searchTerm && communityFilter) {
                    handleRemoveTag(
                      communityFilter,
                      "",
                      setSearchTerm,
                      setCommunityFilter,
                      posts,
                      setFilteredPosts
                    );
                  }
                }}
                _placeholder={{ color: "brand.100" }}
                color="brand.100"
              />
            </Box>
          </Flex>
        </InputGroup>
  
        {showDropdown && (filteredPosts.length > 0 || searchTerm.trim() !== "") && (
          <Box
          position="absolute"
          top="44px"
          width="100%"
          bg="brand.200"
          border="1px solid"
          borderColor="gray.200"
          zIndex={10}
          borderRadius="md"
          maxHeight="300px"
          overflowY="auto"
        >
          <List spacing={1}>
            {subquivers
              .filter((sq) =>
                sq.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((sq) => (
                <ListItem
                  key={`subquiver-${sq}`}
                  px={3}
                  py={2}
                  role="group"
                  _hover={{ bg: "brand.100", cursor: "pointer" }}
                  onClick={() => router.push(`/subquiver/${encodeURIComponent(sq)}`)}
                >
                  <Text
                    fontWeight="bold"
                    color="brand.100"
                    _groupHover={{ color: "brand.200" }}
                  >
                    q/{sq}
                  </Text>
                  <Text fontSize="sm" color="brand.100" _groupHover={{ color: "brand.200" }}>
                    Community
                  </Text>
                </ListItem>
              ))}
        
            {filteredPosts.map((post) => (
              <ListItem
                key={post.id}
                px={3}
                py={2}
                role="group"
                _hover={{ bg: "brand.100", cursor: "pointer" }}
                onClick={() => router.push(`/post/${post.id}`)}
              >
                <Text
                  color="brand.100"
                  fontWeight="bold"
                  _groupHover={{ color: "brand.200" }}
                >
                  {post.title}
                </Text>
                <Text
                  fontSize="sm"
                  color="brand.100"
                  _groupHover={{ color: "brand.200" }}
                >
                  q/{post.community}
                </Text>
              </ListItem>
            ))}
          </List>
        </Box>        
        )}
      </Flex>
    );
  };
  
  export default SearchInput;
  