import { firestore } from "@/model/firebase/clientApp";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, deleteDoc, getDocs, setDoc, collection, writeBatch } from "firebase/firestore";
import router, { NextRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import useCommunities from "@/model/hooks/useCommunities"; // Import the correct hook

export const handleJoin = async (user: any, subquiverId: string) => {
  if (!user) throw new Error("User not authenticated");
  await updateDoc(doc(firestore, "users", user.uid), {
    joinedCommunities: arrayUnion(subquiverId),
  });
};

export const handleLeave = async (user: any, subquiverId: string) => {
  if (!user) throw new Error("User not authenticated");
  await updateDoc(doc(firestore, "users", user.uid), {
    joinedCommunities: arrayRemove(subquiverId),
  });
};

export const handleCreatePost = (user: any, name: string, router: any) => {
  if (!user) throw new Error("User not authenticated");
  router.push(`/subquiver/${encodeURIComponent(name)}/createpost`);
};

export const handleConfirmDelete = async (subquiverId: string, postId: string) => {
  const commentsRef = collection(firestore, "subquivers", subquiverId, "posts", postId, "comments");
  const commentsSnapshot = await getDocs(commentsRef);

  for (const commentDoc of commentsSnapshot.docs) {
    const commentId = commentDoc.id;
    const votesRef = collection(firestore, "subquivers", subquiverId, "posts", postId, "comments", commentId, "votes");
    const votesSnapshot = await getDocs(votesRef);
    for (const voteDoc of votesSnapshot.docs) {
      await deleteDoc(doc(votesRef, voteDoc.id));
    }
    await deleteDoc(doc(commentsRef, commentId));
  }

  const postVotesRef = collection(firestore, "subquivers", subquiverId, "posts", postId, "votes");
  const postVotesSnapshot = await getDocs(postVotesRef);
  for (const voteDoc of postVotesSnapshot.docs) {
    await deleteDoc(doc(postVotesRef, voteDoc.id));
  }

  await deleteDoc(doc(firestore, "subquivers", subquiverId, "posts", postId));
};

export const handleVote = async (
  user: any,
  subquiverId: string,
  postId: string,
  type: "upvote" | "downvote"
): Promise<"added" | "removed" | "switched"> => {
  if (!user) throw new Error("User not authenticated");

  const voteRef = doc(firestore, `subquivers/${subquiverId}/posts/${postId}/votes/${user.uid}`);
  const voteDoc = await getDoc(voteRef);

  if (voteDoc.exists()) {
    const currentVote = voteDoc.data().type;
    if (currentVote === type) {
      await deleteDoc(voteRef);
      return "removed";
    } else {
      await setDoc(voteRef, { type });
      return "switched";
    }
  } else {
    await setDoc(voteRef, { type });
    return "added";
  }
};

// Refactored editSubquiver function
export const handleEditSubquiver = async (
  communityId: string, 
  newName: string, 
  newDescription: string,
  toastCallback: (options: { title: string; status: string; duration: number; isClosable: boolean }) => void,
  fetchPosts: () => Promise<void>,
  router: NextRouter,
) => {
  try {
    // Update the community name and description in Firestore
    const communityRef = doc(firestore, "subquivers", communityId);
    await updateDoc(communityRef, {
      name: newName,
      description: newDescription,
    });

    // Call the toastCallback with a success message
    toastCallback({
      title: "Community updated successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Reload posts or perform any other necessary action
    await fetchPosts();

    // Reload the page first, then navigate to home after a short delay
    router.reload();
    setTimeout(() => {
      router.replace("/"); // Ensure smooth transition back to home
    }, 100);

  } catch (error) {
    console.error("Error updating community:", error);
    // Call the toastCallback with an error message
    toastCallback({
      title: "Failed to update community",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

export const handleDeleteSubquiver = async (
  subquiverId: string, 
  toast: (options: { title: string; status: string; duration: number; isClosable: boolean }) => void,
  router: NextRouter // Add router as a parameter here
) => {
  try {
    // Delete all posts within the community
    const postsQuery = collection(firestore, "subquivers", subquiverId, "posts");
    const postsSnapshot = await getDocs(postsQuery);
    const batch = writeBatch(firestore);

    postsSnapshot.docs.forEach((postDoc) => {
      batch.delete(doc(firestore, "subquivers", subquiverId, "posts", postDoc.id));
    });

    await batch.commit();

    // Now delete the community
    await deleteDoc(doc(firestore, "subquivers", subquiverId));
    
    toast({
      title: "Community deleted successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

   // Reload the page first, then navigate to home after a short delay
    router.reload();
    setTimeout(() => {
      router.replace("/"); // Ensure smooth transition back to home
    }, 100);
    
  } catch (error) {
    console.error("Error deleting community:", error);
    toast({
      title: "Failed to delete community",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

function fetchPosts() {
  throw new Error("Function not implemented.");
}
function toast(arg0: { title: string; status: string; duration: number; isClosable: boolean; }) {
  throw new Error("Function not implemented.");
}