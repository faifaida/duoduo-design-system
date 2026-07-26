"use client";

import { useEffect, useRef, useState } from "react";
import { SiteChrome, VoyageRail } from "../components/SiteChrome";
import { StoriesV5, WorkV5, AboutV5, SurfV5 } from "../components/V5WorldScenes";

const sections = ["stories", "work", "about", "surf"] as const;

export default function DuoduoWorldPage() {
  const [active, setActive] = useState<string>("stories");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { root, rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    const scrollToHash = (behavior: ScrollBehavior = "auto") => {
      const target = window.location.hash.slice(1);
      if (!sections.includes(target as (typeof sections)[number])) return;
      setActive(target);
      const element = document.getElementById(target);
      if (!element) return;
      root.scrollTo({ top: element.offsetTop, behavior });
    };
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToHash("auto")));
    const settle = window.setTimeout(() => scrollToHash("auto"), 650);
    const onHashChange = () => scrollToHash("smooth");
    window.addEventListener("hashchange", onHashChange);
    return () => {
      observer.disconnect();
      window.clearTimeout(settle);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return (
    <>
      <SiteChrome current={active} hideDock contactHref="/ai#contact" />
      <VoyageRail current={active} />
      <div className="scroll-universe world-scroll" ref={scrollRef}>
        <StoriesV5 />
        <WorkV5 />
        <AboutV5 />
        <SurfV5 />
      </div>
    </>
  );
}
