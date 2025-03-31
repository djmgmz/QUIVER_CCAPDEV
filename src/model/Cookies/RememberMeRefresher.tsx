import { useEffect } from "react";

const RememberMeRefresher = () => {
  useEffect(() => {
    const cookie = document.cookie;

    if (cookie.includes("rememberMe=true")) {
      const THREE_WEEKS_MS = 1000 * 60 * 60 * 24 * 21;
      document.cookie = `rememberMe=true; max-age=${THREE_WEEKS_MS / 1000}; path=/`;
    }
  }, []);

  return null;
};

export default RememberMeRefresher;
