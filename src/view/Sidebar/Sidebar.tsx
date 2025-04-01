import { VStack, Box, Button, Text, Icon, HStack, Collapse, Spinner } from "@chakra-ui/react";
import { IoHome } from "react-icons/io5";
import { FaBinoculars } from "react-icons/fa6";
import { TiArrowSortedDown } from "react-icons/ti";
import React, { useState } from "react";
import { useRouter } from "next/router";
import DlsuStarIcon from "../Icons/DlsuStarIcon";
import useCommunities from "@/model/hooks/useCommunities";

const Sidebar = () => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const { communities, loading } = useCommunities();

  const handleHomeClick = () => {
    router.push("/");
  };

  const handlePopularClick = () => {
    router.push("/?view=popular");
  };
  
  const handleRecentClick = () => {
    router.push("/?view=recent");
  };

  return (
    <Box
      bgColor="brand.200"
      width="250px"
      minHeight="100%"
      borderRight="2px solid"
      borderColor="#3B6064"
      p={4}
      display="flex"
      flexDirection="column"
    >
      <VStack spacing={2} align="stretch">
        <Button
          onClick={handleHomeClick}
          leftIcon={<Icon as={IoHome} boxSize={6} color="brand.100" />}
          variant="ghost"
          justifyContent="flex-start"
        >
          <Text ml={2.2} color="brand.100">Home</Text>
        </Button>

        <Button
          onClick={handlePopularClick}
          leftIcon={<DlsuStarIcon />}
          variant="ghost"
          justifyContent="flex-start"
        >
          <Text ml={2.2} color="brand.100">Popular</Text>
        </Button>

        <Button
          onClick={handleRecentClick}
          leftIcon={<Icon as={FaBinoculars} boxSize={6} color="brand.100" />}
          variant="ghost"
          justifyContent="flex-start"
        >
          <Text ml={2.2} color="brand.100">Recent</Text>
        </Button>
      </VStack>

      <Box mt={4} borderTop="2px solid" borderColor="brand.100" width="95%" />

      <HStack
        mt={3}
        ml={5}
        spacing={1}
        align="center"
        cursor="pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Text color="brand.100" fontSize="md" fontWeight="semibold">
          Your Subquivers
        </Text>
        <Icon
          as={TiArrowSortedDown}
          color="brand.100"
          boxSize={5}
          transform={showDropdown ? "rotate(180deg)" : "rotate(0deg)"}
          transition="transform 0.2s ease-in-out"
        />
      </HStack>

      <Collapse in={showDropdown}>
        {loading ? (
          <Spinner color="brand.100" />
        ) : (
          <VStack align="stretch" mt={2} pl={2} spacing={0.3}>
            {communities.map((community) => (
              <Button
                key={community.id}
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => router.push(`/subquiver/${community.name}`)}
              >
                <Text color="brand.600">q/{community.name}</Text>
              </Button>
            ))}
          </VStack>
        )}
      </Collapse>
    </Box>
  );
};

export default Sidebar;
