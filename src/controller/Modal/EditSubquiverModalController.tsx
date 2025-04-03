import { useState, useEffect } from "react";
import { uploadFile, updateSubquiver } from "@/model/Modal/EditSubquiverModalModel";
import { useToast } from "@chakra-ui/react";

export const useEditSubquiverController = (
  communityId: string,
  communityName: string,
  communityDescription: string,
  bannerImageURL?: string,
  iconImageURL?: string,
  onEdit?: (
    communityId: string,
    newName: string,
    newDescription: string,
    bannerUrl: string,
    iconUrl: string
  ) => void,
  onClose?: () => void
) => {
  const [newName, setNewName] = useState(communityName);
  const [newDescription, setNewDescription] = useState(communityDescription);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>(bannerImageURL || "");
  const [iconPreview, setIconPreview] = useState<string>(iconImageURL || "");
  const toast = useToast();

  useEffect(() => {
    setNewName(communityName);
    setNewDescription(communityDescription);
    setBannerPreview(bannerImageURL || "");
    setIconPreview(iconImageURL || "");
    setBannerFile(null);
    setIconFile(null);
  }, [communityId, communityName, communityDescription, bannerImageURL, iconImageURL]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "banner" | "icon") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);

    if (type === "banner") {
      setBannerFile(file);
      setBannerPreview(url);
    } else {
      setIconFile(file);
      setIconPreview(url);
    }
  };

  const handleSaveChanges = async () => {
    let finalBannerUrl = bannerPreview;
    let finalIconUrl = iconPreview;

    try {
      if (bannerFile) finalBannerUrl = await uploadFile(bannerFile, `subquivers/${communityId}/banner`);
      if (iconFile) finalIconUrl = await uploadFile(iconFile, `subquivers/${communityId}/icon`);

      await updateSubquiver(communityId, newName, newDescription, finalBannerUrl, finalIconUrl);

      toast({
        title: "Subquiver updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (onEdit) onEdit(communityId, newName, newDescription, finalBannerUrl, finalIconUrl);
      if (onClose) onClose();
    } catch (error: any) {
      toast({
        title: "Error saving changes.",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return {
    newName,
    setNewName,
    newDescription,
    setNewDescription,
    bannerPreview,
    iconPreview,
    handleFileChange,
    handleSaveChanges,
  };
};
