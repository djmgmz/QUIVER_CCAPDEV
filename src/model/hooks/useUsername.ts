import { useEffect, useState } from "react";
import { firestore } from "@/model/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";

const useUsername = (userId: string | null) => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!userId) {
        setUsername(null);
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(firestore, "users", userId));
      setUsername(userDoc.exists() ? userDoc.data()?.username || "anonymous" : "anonymous");
      setLoading(false);
    };

    fetchUsername();
  }, [userId]);

  return username;
};

export default useUsername;
