import { atom } from "recoil";

export const deletePostModalState = atom<{
  open: boolean;
  postId: string | null;
}>({
  key: "deletePostModalState",
  default: {
    open: false,
    postId: null,
  },
});
