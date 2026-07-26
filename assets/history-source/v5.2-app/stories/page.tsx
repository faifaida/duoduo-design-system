"use client";

import { SiteChrome } from "../components/SiteChrome";
import { StoriesV5 } from "../components/V5WorldScenes";

export default function StoriesPage() {
  return <><SiteChrome current="stories" /><StoriesV5 /></>;
}
