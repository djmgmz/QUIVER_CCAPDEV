import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/model/firebase/clientApp";

interface Post {
  id: string;
  title: string;
  description: string;
  community: string;
}

export const useSearchInputModel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [communityFilter, setCommunityFilter] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [subquivers, setSubquivers] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const subquiversSnapshot = await getDocs(collection(firestore, "subquivers"));
      let allPosts: Post[] = [];
      const subquiverNameSet = new Set<string>();

      for (const docSnap of subquiversSnapshot.docs) {
        const communityId = docSnap.id;
        const communityName = docSnap.data().name;

        subquiverNameSet.add(communityName);

        const postsSnapshot = await getDocs(
          collection(firestore, "subquivers", communityId, "posts")
        );

        postsSnapshot.forEach((postDoc) => {
          allPosts.push({
            id: postDoc.id,
            ...postDoc.data(),
            community: communityName,
          } as Post);
        });
      }

      setSubquivers(Array.from(subquiverNameSet));
      setPosts(allPosts);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "" && !communityFilter) {
      setShowDropdown(false);
    } else if (filteredPosts.length > 0) {
      setShowDropdown(true);
    }
  }, [searchTerm, filteredPosts, communityFilter]);

  return {
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
  };
};
