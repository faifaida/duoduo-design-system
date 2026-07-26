"use client";

import { SiteChrome } from "../components/SiteChrome";
import { AiScene } from "../components/UnifiedScenes";

export default function DuoduoOSPage() {
  return (
    <>
      <SiteChrome current="ai" hideDock contactHref="#contact" />
      <AiScene />
    </>
  );
}
