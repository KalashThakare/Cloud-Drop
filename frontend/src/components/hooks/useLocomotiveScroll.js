import { useEffect, useRef } from "react";
import "locomotive-scroll/dist/locomotive-scroll.css"; // <-- Make sure this is imported

function isDesktop() {
  if (typeof window === "undefined") return false;
  return window.innerWidth === 1920 || window.innerWidth === 2560 || window.innerWidth === 2880 || window.innerWidth === 1680 || window.innerWidth === 1440 || window.innerWidth === 1536 || window.innerWidth === 1366;
}

export function useLocomotiveScroll() {
  const scrollRef = useRef(null);
  const locoInstance = useRef(null);

  useEffect(() => {
    let scroll;
    let timeout;
    if (typeof window !== "undefined" && scrollRef.current && isDesktop()) {
      import("locomotive-scroll").then((module) => {
        const LocomotiveScroll = module.default;
        scroll = new LocomotiveScroll({
          el: scrollRef.current,
          smooth: true,
        });
        locoInstance.current = scroll;
        console.log("Locomotive Scroll initialized", scroll);

        // Update after images/content load to fix footer issue
        timeout = setTimeout(() => {
          scroll.update();
        }, 800);
      });
    }
    return () => {
      if (scroll) scroll.destroy();
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return [scrollRef, locoInstance];
}
