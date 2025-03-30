// controller/CommunityContentController.ts
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, deleteDoc, getDocs, setDoc, collection } from "firebase/firestore";
import { firestore } from "@/model/firebase/clientApp";

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