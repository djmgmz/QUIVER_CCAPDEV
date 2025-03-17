import React, { ReactNode } from "react";
import { Flex, Box, useBreakpointValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Navbar from "@/view/Navbar/Navbar";
import Sidebar from "@/view/Sidebar/Sidebar";
import PostsGrid from "@/model/Posts/PostsModel";

interface LayoutProps {
  children: ReactNode;
  showGrid?: boolean; // This prop is now optional
}

const Layout: React.FC<LayoutProps> = ({ children, showGrid }) => {
  const router = useRouter(); // ✅ Get current route
  const showSidebar = useBreakpointValue({ base: false, md: true, lg: true, xl: true });

  // ✅ Automatically show PostsGrid only on the homepage ("/")
  const shouldShowGrid = showGrid ?? router.pathname === "/";

  return (
    <>
      <Navbar />
      <Flex minH="100vh">
        {showSidebar && (
          <Box width="250px" bg="gray.50" flexShrink={0}>
            <Sidebar />
          </Box>
        )}

        {/* Main content */}
        <Box flex="1" p={4}>
          {/* ✅ Automatically show PostsGrid only on "/" */}
          {shouldShowGrid && <PostsGrid />}
          {children}
        </Box>
      </Flex>
    </>
  );
};

export default Layout;
