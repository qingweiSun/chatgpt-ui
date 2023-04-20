import { MutableRefObject, useEffect, useRef } from "react";

export const useScroll = (scrollRef: MutableRefObject<null>) => {
  const canScroll = useRef(true);
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (canScroll.current) {
        for (const entry of entries) {
          if (canScroll.current) {
            document.getElementById("home_end")?.scrollIntoView(false);
          }
        }
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

  return { canScroll };
};
