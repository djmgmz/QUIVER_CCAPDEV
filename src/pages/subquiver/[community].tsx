import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { firestore } from "@/model/firebase/clientApp";
import { collection, query, where, getDocs } from "firebase/firestore";
import CommunityContent from "@/model/Communities/CommunityContentModel";

const CommunityPage: React.FC = () => {
  const router = useRouter();
  const { community } = router.query;
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCommunityByName = async (communityName: string) => {
    try {
      const q = query(
        collection(firestore, "subquivers"),
        where("name", "==", communityName)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() }; 
      } else {
        return null; 
      }
    } catch (error) {
      console.error("Error fetching community:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!community) return;

    const getCommunity = async () => {
      const foundCommunity = await fetchCommunityByName(community as string);
      setSelectedCommunity(foundCommunity);
      setLoading(false);
    };

    getCommunity();
  }, [community]);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!selectedCommunity) {
    return (
      <Box textAlign="center" mt={10}>
        <Text fontSize="2xl" fontWeight="bold" color="brand.100">
          Community not found.
        </Text>
      </Box>
    );
  }

  return (
    <CommunityContent
      name={selectedCommunity.name}
      subquiverId={selectedCommunity.id}
    />
  );
};

export default CommunityPage;
