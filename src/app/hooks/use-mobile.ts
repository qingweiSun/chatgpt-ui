import { createContext, useCallback, useEffect, useState } from "react";

const RESPONSIVE_MOBILE = 890;
/*判断是不是手机*/
export default function useMobile() {
  const [isMobile, setMobileMode] = useState(false);
  const updateSiteConfig = useCallback((props: { isMobile: boolean }) => {
    setMobileMode(props.isMobile);
  }, []);
  const updateMobileMode = () => {
    updateSiteConfig({ isMobile: window.innerWidth < RESPONSIVE_MOBILE });
  };

  useEffect(() => {
    updateMobileMode();
    window.addEventListener("resize", updateMobileMode);
    return () => {
      window.removeEventListener("resize", updateMobileMode);
    };
  }, []);
  return { isMobile };
}
