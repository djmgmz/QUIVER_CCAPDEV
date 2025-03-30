export const handleCloseAuthModal = (
    setModalState: (updater: (prev: any) => any) => void
  ) => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };
  