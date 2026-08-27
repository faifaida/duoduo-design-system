import type { Metadata } from "next";
import { SiteChrome } from "../../../components/SiteChrome";
import { SixStepUniverse } from "../../SixStepUniverse";

export const metadata: Metadata = {
  title: "六步宇宙 — Six Degrees of Thought",
  description: "给出两个看似无关的念头，用六步走出只属于你的思维路径。",
};

export default async function SixStepUniversePage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const query = await searchParams;
  return (
    <>
      <SiteChrome current="ai" hideDock contactHref="/ai#contact" />
      <SixStepUniverse initialStart={query.from} initialTarget={query.to} />
    </>
  );
}
