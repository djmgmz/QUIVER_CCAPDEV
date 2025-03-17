import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/clientApp"; 

export interface Community {
  id: string;
  name: string;
  description: string;
  bannerImageURL?: string;
  iconImageURL?: string;
  memberCount?: number;
  creatorId?: string;
}

const useCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "subquivers"));
        const communitiesList: Community[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Community[];
        setCommunities(communitiesList);
      } catch (err) {
        setError("Failed to fetch communities.");
        console.error("Error fetching communities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  return { communities, loading, error };
};

export default useCommunities;
