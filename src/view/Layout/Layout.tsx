import React, { ReactNode, useState, useEffect} from "react";
import { Flex, Box, useBreakpointValue, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Navbar from "@/view/Navbar/Navbar";
import Sidebar from "@/view/Sidebar/Sidebar";
import PostsGrid from "@/model/Posts/PostsModel";

interface LayoutProps {
  children: ReactNode;
  showGrid?: boolean; 
}

const Layout: React.FC<LayoutProps> = ({ children, showGrid }) => {
  const router = useRouter(); 
  const showSidebar = useBreakpointValue({ base: false, md: true, lg: true, xl: true });

  
  const shouldShowGrid = showGrid ?? router.pathname === "/";
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Navbar />
      <Flex minH="100vh">
        {showSidebar && (
          <Box width="250px" bg="gray.50" flexShrink={0}>
            <Sidebar />
          </Box>
        )}

        <Box flex="1" p={4}>
          
          {shouldShowGrid && <PostsGrid />}
          {children}
        </Box>
      </Flex>
      
      {showScrollToTop && (
        <Button
          position="fixed"
          bottom="50px"
          right="50px"
          onClick={scrollToTop}
        >
          ▲
        </Button>
      )}
    </>
  );
};

export default Layout;
