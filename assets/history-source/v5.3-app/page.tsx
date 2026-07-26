"use client";

import { SiteChrome } from "./components/SiteChrome";
import { HomeScene } from "./components/UnifiedScenes";

export default function HomePage() {
  return (
    <>
      <SiteChrome current="home" hideDock contactHref="/ai#contact" />
      <HomeScene />
    </>
  );
}
