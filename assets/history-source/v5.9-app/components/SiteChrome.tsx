"use client";

import { useState } from "react";
import { ClickSound } from "./ClickSound";
import { useLocale, type Locale } from "./LocaleProvider";

const voyage = [
  ["/", "home", "◖", "HOME", "主页"],
  ["/world#stories", "stories", "▣", "STORIES", "故事"],
  ["/world#work", "work", "⌗", "WORK", "作品"],
  ["/world#about", "about", "☾", "ABOUT", "关于"],
  ["/world#surf", "surf", "≋", "SURF & WEAR", "冲浪与穿戴"],
  ["/ai", "ai", "✦", "DUODUO OS", "｜多多AI"],
] as const;

const worldVoyage = voyage.filter(([, id]) => id !== "home" && id !== "ai");

const interfaceTranslations: Record<Locale, Record<string, string>> = {
  original: { home: "主页", stories: "故事", work: "作品", about: "关于", surf: "冲浪与穿戴", ai: "｜多多AI", subtitle: "多多的未完成实验" },
  ko: { home: "홈", stories: "이야기", work: "작업", about: "소개", surf: "서핑 & 웨어", ai: "DUODUO OS", subtitle: "두오두오의 미완성 실험" },
  ja: { home: "ホーム", stories: "物語", work: "作品", about: "紹介", surf: "サーフ & ウェア", ai: "DUODUO OS", subtitle: "多多の未完成な実験" },
  es: { home: "Inicio", stories: "Historias", work: "Obras", about: "Sobre mí", surf: "Surf y prendas", ai: "DUODUO OS", subtitle: "Los experimentos inacabados de Duoduo" },
  fr: { home: "Accueil", stories: "Récits", work: "Projets", about: "À propos", surf: "Surf & tenues", ai: "DUODUO OS", subtitle: "Les expériences inachevées de Duoduo" },
};

const localeOptions: Array<[Locale, string, string]> = [
  ["original", "ORIGINAL", "中英双语原文"],
  ["ko", "한국어", "Korean"],
  ["ja", "日本語", "Japanese"],
  ["es", "ESPAÑOL", "Spanish"],
  ["fr", "FRANÇAIS", "French"],
];

export function VoyageDock({ current, locale = "original" }: { current: string; locale?: Locale }) {
  const translated = interfaceTranslations[locale];
  return (
    <nav className="voyage-dock" aria-label="Website voyage progress">
      <span className="dock-route" aria-hidden="true" />
      {voyage.map(([href, id, symbol, en], index) => (
        <a key={id} href={href} className={current === id ? "is-current" : ""} aria-current={current === id ? "page" : undefined}>
          <span className="dock-number">0{index + 1}</span>
          <i>{symbol}</i>
          <span className="dock-label"><b>{en}</b><small>{translated[id]}</small></span>
        </a>
      ))}
    </nav>
  );
}

function GlobeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>;
}

function HomeShellIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M4.4 18.3 7 10.1l6.4-4.7 7.8 1.2 6.3 5.8-.5 8.3-5.6 6.4-8.5.8-6.7-4.3Z" />
      <path d="m10.4 18 5.7-6.3 5.7 6.3M12.3 16.5v7h7.5v-7M8.2 10.7l3.1 1.1M22.8 9.8l-2.9 2.1" />
      <circle cx="16" cy="16" r="12.5" strokeDasharray="1.2 3.5" />
    </svg>
  );
}

export function SiteChrome({ current = "", hideDock = false, contactHref }: { current?: string; hideDock?: boolean; contactHref?: string }) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);

  const changeLocale = (next: Locale) => {
    setLocale(next);
    setOpen(false);
  };

  return (
    <>
      <header className="site-chrome">
        <a className="chrome-logo" href="/" aria-label="DUODUO home">
          <img src="/brand/duoduo-symbol.png" alt="" />
          <span className="chrome-wordmark"><b>DUODUO</b><small>{interfaceTranslations[locale].subtitle}</small></span>
        </a>
        <div className="chrome-tools">
          <a className="chrome-contact" href={contactHref ?? "/ai#contact"} aria-label="Contact me">
            <span className="contact-en">CONTACT ME</span>
            <span className="contact-zh">联系</span>
          </a>
          {current !== "ai" && (
            <a className="chrome-ai-link" href="/ai" aria-label="Enter DUODUO OS｜多多AI">
              <span>DUODUO OS</span><small>｜多多AI</small>
            </a>
          )}
          <ClickSound />
          <div className={`globe-language ${open ? "is-open" : ""}`}>
            <button className="globe-trigger" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Choose interface language">
              <GlobeIcon /><span className="sr-only">{locale === "original" ? "Language" : locale.toUpperCase()}</span>
            </button>
            <div className="language-world-menu">
              <small>INTERFACE LANGUAGE · 界面语言</small>
              {localeOptions.map(([id, name, note]) => <button key={id} type="button" className={locale === id ? "is-active" : ""} onClick={() => changeLocale(id)}><b>{name}</b><span>{note}</span></button>)}
              <p>切换全站界面语言，含正文翻译。</p>
            </div>
          </div>
        </div>
      </header>
      {!hideDock && <VoyageDock current={current} locale={locale} />}
    </>
  );
}

export function VoyageRail({ current = "" }: { current?: string }) {
  const { locale } = useLocale();
  const translated = interfaceTranslations[locale];
  return (
    <nav className="voyage-rail" aria-label="Voyage">
      <div className="voyage-portals">
        <a className="portal-home" href="/" aria-label="Back to ocean map home">
          <span className="portal-icon"><HomeShellIcon /></span><span className="portal-copy"><b>HOME</b><small>{translated.home}</small></span>
        </a>
      </div>
      <div className="voyage-stripe" aria-label="Chapter progress">
        {worldVoyage.map(([_href, id, , en]) => (
          <a key={id} href={`#${id}`} className={current === id ? "is-current" : ""} aria-label={`${en} · ${translated[id]}`} aria-current={current === id ? "step" : undefined}><i /></a>
        ))}
      </div>
      <div className="voyage-menu">
        {worldVoyage.map(([_href, id, symbol, en], index) => (
          <a key={id} href={`#${id}`} className={current === id ? "is-current" : ""} aria-current={current === id ? "page" : undefined}>
            <span className="num">0{index + 1}</span>
            <span className="sym">{symbol}</span>
            <span className="label"><b>{en}</b><small>{translated[id]}</small></span>
          </a>
        ))}
      </div>
    </nav>
  );
}
