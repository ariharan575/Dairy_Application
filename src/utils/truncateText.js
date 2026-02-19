export const truncateText = (text, limit) => {
  if (!text) return "";

  if (text.length > limit) {
    return text.slice(0, limit - 2) + "...";
  }

  return text;
};

import { useEffect, useState } from "react";

const useResponsiveLimit = (
  mobile = 12,
  tablet = 18,
  desktop = 22
) => {
  const [limit, setLimit] = useState(desktop);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setLimit(mobile); // 📱 Mobile
      } else if (window.innerWidth < 1024) {
        setLimit(tablet); // 📲 Tablet
      } else {
        setLimit(desktop); // 💻 Desktop
      }
    };

    handleResize(); // run once
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [mobile, tablet, desktop]);

  return limit;
};

export default useResponsiveLimit;


