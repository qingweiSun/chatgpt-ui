import { MutableRefObject, useEffect } from "react";

export const useScroll = (scrollRef: MutableRefObject<null>) => {
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        document.getElementById("home_end")?.scrollIntoView(false);
      }
    });
    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }
    return () => {
      if (scrollRef.current) {
        observer.unobserve(scrollRef.current);
      }
    };
  }, []);
};
