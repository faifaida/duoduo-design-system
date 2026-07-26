import type { ReactNode } from "react";
import { SiteChrome } from "./SiteChrome";

export function SceneShell({ current, className, children, bare = false, id }: { current: string; className: string; children: ReactNode; bare?: boolean; id?: string }) {
  const inner = (
    <>
      {!bare && <SiteChrome current={current} />}
      {children}
    </>
  );
  if (bare) return <section id={id} className={`duoduo-scene ${className}`}>{inner}</section>;
  return <main className={`duoduo-scene ${className}`}>{inner}</main>;
}

export function SceneTitle({ number, en, zh, subtitle, symbol }: { number: string; en: string; zh: string; subtitle: string; symbol: string }) {
  return (
    <header className="scene-title-block">
      <div className="scene-title-meta"><span>{number}</span><b>{subtitle}</b></div>
      <h1>{en}<em>{zh}</em></h1>
      <SymbolSeal symbol={symbol} label={subtitle} />
    </header>
  );
}

export function SymbolSeal({ symbol, label, small = false }: { symbol: string; label: string; small?: boolean }) {
  return (
    <span className={`symbol-seal ${small ? "is-small" : ""}`} aria-label={label}>
      <i>{symbol}</i>
      <small>{label}</small>
    </span>
  );
}

export function PaperTag({ en, zh, active = false }: { en: string; zh: string; active?: boolean }) {
  return <span className={`paper-tag ${active ? "is-active" : ""}`}><b>{en}</b><small>{zh}</small></span>;
}

export function StatusStamp({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "red" | "blue" }) {
  return <span className={`status-stamp stamp-${tone}`}>{children}</span>;
}

export function MapNote({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <article className="map-note">
      <span className="map-note-number">{number}</span>
      <h3>{title}</h3>
      <div>{children}</div>
    </article>
  );
}

export function Highlighter({ children }: { children: ReactNode }) {
  return <span className="text-highlighter">{children}</span>;
}
