export interface Post {
  id: string;
  title: string;
  description: string;
  views: string;
  upvotes: string;
  downvotes: string;
  author: string;
  authorId: number;
  time: string;
  date: string;
  community: string;
}

export const samplePosts: Post[] = [
  {
    id: '1',
    title: "This is the second post's title in the home This is the second post's title in the home ",
    description: "Hi this is tin mangyat, thank you Hi this is tin mangyat, thank you Hi this is tin mangyat, thank youHi this is tin mangyat, thank youHi this is tin mangyat, thank youHi this is tin mangyat, thank youHi this is tin mangyat, thank youHi this is tin mangyat, thank youHi this is tin mangyat, thank youHi this is tin mangyat, thank youHi this is tin mangyat, thank youHi this is tin mangyat, thank youHi this is tin mangyat, thank youHi this is tin mangyat, thank youHi this is tin mangyat, thank youHi this is tin mangyat, thank youHi this is tin mangyat, thank you",
    views: "12,204",
    upvotes: "1,200",
    downvotes: "84",
    author: "brandnewcommunity",
    authorId: 101,
    time: "11:11 AM",
    date: "Feb 24, 2025",
    community: "Tech Community"
  },
  {
    id: '2',
    title: "Post Title 2",
    description: "This is another post description to showcase how multiple posts are displayed...",
    views: "5,000",
    upvotes: "680",
    downvotes: "20",
    author: "anotheruser",
    authorId: 102,
    time: "12:34 PM",
    date: "Feb 24, 2025",
    community: "Tech Community"
  },
  {
    id: '3',
    title: "Rov's New AI Assistant: Can It Solve His Snack Crisis?",
    description: "Rov's AI assistant finally helped him order snacks online...",
    views: "1,234",
    upvotes: "345",
    downvotes: "12",
    author: "RovMaster69",
    authorId: 103,
    time: "1:00 PM",
    date: "Feb 24, 2025",
    community: "Tech Community"
  },
  {
    id: '4',
    title: "Dom's Attempt at Coding Goes Awry: Is It AI's Fault?",
    description: "Dom tried to write code to automate his morning coffee routine...",
    views: "897",
    upvotes: "280",
    downvotes: "30",
    author: "Dominator2025",
    authorId: 104,  
    time: "2:15 PM",
    date: "Feb 24, 2025",
    community: "Tech Community"
  },
  {
    id: '5',
    title: "AI Creates the Perfect Playlist for Rov... Except It's All 'Nyan Cat'",
    description: "Rov asked an AI for a personalized playlist...",
    views: "2,000",
    upvotes: "560",
    downvotes: "45",
    author: "RovMaster69",
    authorId: 103,
    time: "3:00 PM",
    date: "Feb 24, 2025",
    community: "Tech Community"
  },
  {
    id: '6',
    title: "Dom Gets Lost in Virtual Reality... In His Own House",
    description: "Dom put on his VR headset to escape reality...",
    views: "345",
    upvotes: "120",
    downvotes: "15",
    author: "Dominator2025",
    authorId: 104,
    time: "4:00 PM",
    date: "Feb 24, 2025",
    community: "Tech Community"
  },
  {
    id: '7',
    title: "Dom googogogo",
    description: "nyello",
    views: "345",
    upvotes: "120",
    downvotes: "15",
    author: "Dominator2025",
    authorId: 104,
    time: "4:00 PM",
    date: "Feb 24, 2025",
    community: "Gaming Quiver"
  },
];
