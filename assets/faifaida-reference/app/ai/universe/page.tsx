import type { Metadata } from "next";
import { SiteChrome } from "../../components/SiteChrome";
import { DivergentUniverse } from "../DivergentUniverse";

export const metadata: Metadata = {
  title: "发散宇宙 — DUODUO OS",
  description: "从一个中心念头出发，沿着 AI 生成的联想节点继续发散。",
};

export default function DivergentUniversePage() {
  return (
    <>
      <SiteChrome current="ai" hideDock contactHref="/ai#contact" />
      <DivergentUniverse />
    </>
  );
}

