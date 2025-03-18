import { useRouter } from "next/router";
import { useState } from "react";
import useCommunities from "@/model/hooks/useCommunities";

const useSidebarController = () => {
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);
    const { communities, loading } = useCommunities();

    const handleHomeClick = () => {
        router.push("/");
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    const navigateToCommunity = (communityName: string) => {
        router.push(`/subquiver/${communityName}`);
    };

    return {
        showDropdown,
        setShowDropdown,  
        toggleDropdown,    
        handleHomeClick,
        navigateToCommunity,
        communities,
        loading,
    };
};

export default useSidebarController;
