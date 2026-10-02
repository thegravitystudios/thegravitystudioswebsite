"use client";

import { useEffect } from "react";

export function TabBlinker() {
  useEffect(() => {
    let originalTitle = "";
    let interval: NodeJS.Timeout | null = null;
    let toggleState = false;

    const setFavicon = (href: string) => {
      const existingIcons = document.querySelectorAll("link[rel*='icon']");
      existingIcons.forEach((el) => el.remove());

      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      link.href = href;
      document.head.appendChild(link);
    };

    const startFaviconBlinking = () => {
      if (!interval) {
        interval = setInterval(() => {
          toggleState = !toggleState;
          setFavicon(toggleState ? "/favicon-withbg.png" : "/favicon-nobg.png");
        }, 700);
      }
    };

    const stopFaviconBlinking = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      setFavicon("/favicon-nobg.png");
    };

    const handleVisibilityChange = () => {
      const host = typeof window !== "undefined" ? window.location.hostname : "";
      const path = typeof window !== "undefined" ? window.location.pathname : "";
      const isPortal = host.startsWith("portal.") || host.includes("portal") || path.startsWith("/portal") || path.startsWith("/admin");

      if (document.hidden) {
        if (document.title && !document.title.includes("Come Back!")) {
          originalTitle = document.title;
        }

        if (isPortal) {
          document.title = "Portal - The Gravity Studios";
        } else {
          document.title = "Come Back! The Gravity Studios";
        }

        startFaviconBlinking();
      } else {
        stopFaviconBlinking();
        if (isPortal) {
          document.title = "Portal - The Gravity Studios";
        } else if (originalTitle) {
          document.title = originalTitle;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
