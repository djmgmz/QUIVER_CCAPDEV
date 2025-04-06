interface Post {
    id: string;
    title: string;
    description: string;
    community: string;
  }  

  export const handleSearchInputChange = (
    input: string,
    setSearchTerm: (val: string) => void,
    setCommunityFilter: (val: string | null) => void,
    posts: Post[],
    setFilteredPosts: (posts: Post[]) => void,
    currentFilter: string | null
  ) => {
    let term = input;
    let newFilter: string | null = currentFilter;
  
    const validCommunities = Array.from(new Set(posts.map((post) => post.community)));
  
    const communityMatch = term.match(/q\/([^\n]+)/i);

    if (!currentFilter) {
      const parts = input.split(" ");
      const communityPart = parts.find(
        (part) => part.startsWith("q/") && validCommunities.includes(part.replace("q/", ""))
      );
  
      if (communityPart) {
        newFilter = communityPart.replace("q/", "");
        term = parts.filter((p) => p !== communityPart).join(" ");
      }
    }

    if (communityMatch) {
      const potentialCommunity = communityMatch[1].trim(); 
  
      const isValid = validCommunities.some(
        (comm) => comm.toLowerCase() === potentialCommunity.toLowerCase()
      );
  
      if (isValid) {
        newFilter = potentialCommunity;
        term = term.replace(communityMatch[0], "").trim(); 
      }
    }
  
    setSearchTerm(term);
    setCommunityFilter(newFilter);
  
    const lowerTerm = term.toLowerCase();

    const filtered = posts.filter((post) => {
      const matchesCommunity = !newFilter || post.community === newFilter;
      const searchText = lowerTerm.replace(/\s+/g, "");
      const communityText = post.community.replace(/[-_]/g, "").toLowerCase();
      
      const matchesText =

        post.title.toLowerCase().includes(lowerTerm) ||
        post.description.toLowerCase().includes(lowerTerm) ||
        communityText.includes(searchText);
      
      return matchesCommunity && matchesText;
    });
  
    setFilteredPosts(filtered);
  };
  
  export const handleRemoveTag = (
    communityFilter: string | null,
    searchTerm: string,
    setSearchTerm: (val: string) => void,
    setCommunityFilter: (val: string | null) => void,
    posts: Post[],
    setFilteredPosts: (posts: Post[]) => void
  ) => {
    setCommunityFilter(null);
  
    handleSearchInputChange(
      searchTerm,
      setSearchTerm,
      setCommunityFilter,
      posts,
      setFilteredPosts,
      null
    );
  };  
  
