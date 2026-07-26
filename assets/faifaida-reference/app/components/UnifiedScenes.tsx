"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { LivingOceanCanvas } from "./LivingOceanCanvas";
import { Highlighter, SceneShell, SceneTitle, StatusStamp, SymbolSeal } from "./DuoduoComponents";
import { SceneIcon, type SceneIconName } from "./SceneIcons";
import { BilingualText, T, useLocale, useLocaleText } from "./LocaleProvider";
import { content } from "../i18n/content";

/* ---------- HOME (群岛地图) ---------- */
const islands = [
  { id: "stories", number: "01", entry: content.home.islandStories, href: "/world#stories", symbol: "ᚱ", meaning: content.home.islandStoriesMeaning, note: content.home.islandStoriesNote },
  { id: "work", number: "02", entry: content.home.islandWork, href: "/world#work", symbol: "ᛃ", meaning: content.home.islandWorkMeaning, note: content.home.islandWorkNote },
  { id: "about", number: "03", entry: content.home.islandAbout, href: "/world#about", symbol: "☾", meaning: content.home.islandAboutMeaning, note: content.home.islandAboutNote },
  { id: "surf", number: "04", entry: content.home.islandSurf, href: "/world#surf", symbol: "≋", meaning: content.home.islandSurfMeaning, note: content.home.islandSurfNote },
  { id: "ai", number: "05", entry: content.home.islandAi, href: "/ai", symbol: "✦", meaning: content.home.islandAiMeaning, note: content.home.islandAiNote },
] as const;

export function HomeScene() {
  const [active, setActive] = useState("work");
  const { locale } = useLocale();
  const text = useLocaleText();
  return (
    <main className="ocean-map-page" id="home">
      <div className="ocean-map-photo" aria-hidden="true" />
      <div className="ocean-map-wash" aria-hidden="true" />
      <LivingOceanCanvas />
      <motion.section
        className="map-intro"
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="map-kicker"><span>06</span> <T entry={content.home.mapKicker} /></p>
        <h1>
          <T entry={content.home.heroLead1} /> <em><T entry={content.home.heroWave} /></em><T entry={content.home.heroLead2} /><i><T entry={content.home.heroExperiments} /></i>
        </h1>
        <p className="map-intro-zh">{text(content.home.homeIntroZh, "zh")}</p>
        <div className="map-question">
          <span className="symbol-spark">✦</span>
          <p>{text(content.home.homeQuestionZh1, "zh")}<span>{text(content.home.homeQuestionZhHi, "zh")}</span>{text(content.home.homeQuestionZh2, "zh")}</p>
          <small><T entry={content.home.homeQuestionEn} /></small>
        </div>
        <div className="map-entry-invitation">
          <span aria-hidden="true">↘</span>
          <p><b>{text(content.home.homeEnterTitle, "en")}</b>{locale === "original" && <small>{content.home.homeEnterTitle.zh}</small>}</p>
          <em>{text(content.home.homeEnterHint, locale === "original" ? "zh" : undefined)}</em>
        </div>
      </motion.section>

      <section className={`island-map active-${active}`} aria-label="DUODUO archipelago">
        <div className="map-route route-a" aria-hidden="true" />
        <div className="map-route route-b" aria-hidden="true" />
        <div className="map-route route-c" aria-hidden="true" />
        <div className="route-cross cross-a" aria-hidden="true">×</div>
        <div className="route-cross cross-b" aria-hidden="true">×</div>
        <div className="map-mandala" aria-hidden="true">
          <span>✦</span>
          <i />
          <b><T entry={content.home.mapMandala} em /></b>
        </div>
        {islands.map((island, index) => (
          <motion.a
            key={island.id}
            className={`map-island map-island-${island.id} ${active === island.id ? "is-active" : ""}`}
            href={island.href}
            onHoverStart={() => setActive(island.id)}
            onFocus={() => setActive(island.id)}
            whileHover={{ y: -6, scale: 1.025 }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            aria-label={`${island.entry.en} ${island.entry.zh}: ${island.note.zh}`}
          >
            <span className="island-wake wake-one" aria-hidden="true" />
            <span className="island-wake wake-two" aria-hidden="true" />
            <span className="island-coast-shadow" aria-hidden="true" />
            <span className="island-land" aria-hidden="true">
              <span className="terrain terrain-one" />
              <span className="terrain terrain-two" />
              <span className="terrain terrain-three" />
              <span className="terrain-dots" />
            </span>
            <span className="island-index">{island.number}</span>
            <span className="island-spirit" aria-hidden="true">{island.symbol}</span>
            <span className="island-copy">
              <strong>{text(island.entry, "en")}</strong>
              {locale === "original" && <b>{island.entry.zh}</b>}
              <small><T entry={island.note} /></small>
            </span>
            <span className="symbol-meaning"><T entry={island.meaning} em /></span>
            <span className="island-enter"><T entry={content.home.islandEnter} em /></span>
            {index === 0 && <span className="map-object suitcase-object" aria-hidden="true">▣</span>}
            {index === 1 && <span className="map-object field-object" aria-hidden="true">⌗</span>}
            {index === 2 && <span className="map-object compass-object" aria-hidden="true">⊹</span>}
            {index === 3 && <span className="map-object wave-object" aria-hidden="true">∿</span>}
            {index === 4 && <span className="map-object signal-object" aria-hidden="true">⌁</span>}
          </motion.a>
        ))}
      </section>
      <aside className="ocean-symbol-column" aria-label="Meaning system">
        <span title={`${content.home.symbolMandala.en} · ${content.home.symbolMandala.zh}`}>✺</span>
        <span title={`${content.home.symbolMoon.en} · ${content.home.symbolMoon.zh}`}>☾</span>
        <span title={`${content.home.symbolRune.en} · ${content.home.symbolRune.zh}`}>ᚱ</span>
        <span title={`${content.home.symbolWave.en} · ${content.home.symbolWave.zh}`}>≋</span>
      </aside>
      <p className="map-coordinates"><T entry={content.home.mapCoordinates} /></p>
      <div className="home-mouse-cue" aria-hidden="true">
        <span><i /></span>
        <b>MOVE TO STIR THE TIDE</b>
        <small>移动鼠标，海面会回应</small>
      </div>
      <section className="home-drift-guide paper-texture" aria-labelledby="drift-guide-title">
        <span className="drift-guide-symbol" aria-hidden="true">≋</span>
        <p>THE OCEAN RESPONDS TO YOUR MOVEMENT<br /><b>移动鼠标，海面会回应</b></p>
        <h2 id="drift-guide-title"><T entry={content.home.legendTitle} em /></h2>
        <BilingualText entry={content.home.legendHint} primary="zh" />
        <div className="drift-steps">
          <span><i>01</i><b>DRIFT</b><small>在海面移动</small></span>
          <span><i>02</i><b>LISTEN</b><small>让声音开启</small></span>
          <span><i>03</i><b>LAND</b><small>选择一座岛</small></span>
        </div>
      </section>
    </main>
  );
}

/* ---------- STORIES (旅行箱) ---------- */
const drawerTabs = [
  { id: "wear", entry: content.stories.drawerWear, icon: "wear" as SceneIconName, defaultObject: "swimwear" },
  { id: "roads", entry: content.stories.drawerRoads, icon: "journey" as SceneIconName, defaultObject: "passport" },
  { id: "objects", entry: content.stories.drawerObjects, icon: "objects" as SceneIconName, defaultObject: "shell" },
] as const;

const storyObjects = [
  { id: "swimwear", drawer: "wear", icon: "wear" as SceneIconName, label: content.stories.objectSwimwear, status: content.stories.objectSwimwearStatus, title: content.stories.objectSwimwearTitle, copy: content.stories.objectSwimwearCopy, items: [content.stories.objectSwimwearItem1, content.stories.objectSwimwearItem2, content.stories.objectSwimwearItem3] },
  { id: "passport", drawer: "roads", icon: "passport" as SceneIconName, label: content.stories.objectPassport, status: content.stories.objectPassportStatus, title: content.stories.objectPassportTitle, copy: content.stories.objectPassportCopy, items: [content.stories.objectPassportItem1, content.stories.objectPassportItem2, content.stories.objectPassportItem3] },
  { id: "camera", drawer: "roads", icon: "camera" as SceneIconName, label: content.stories.objectCamera, status: content.stories.objectCameraStatus, title: content.stories.objectCameraTitle, copy: content.stories.objectCameraCopy, items: [content.stories.objectCameraItem1, content.stories.objectCameraItem2, content.stories.objectCameraItem3] },
  { id: "recorder", drawer: "objects", icon: "recorder" as SceneIconName, label: content.stories.objectRecorder, status: content.stories.objectRecorderStatus, title: content.stories.objectRecorderTitle, copy: content.stories.objectRecorderCopy, items: [content.stories.objectRecorderItem1, content.stories.objectRecorderItem2, content.stories.objectRecorderItem3] },
  { id: "shell", drawer: "objects", icon: "shell" as SceneIconName, label: content.stories.objectShell, status: content.stories.objectShellStatus, title: content.stories.objectShellTitle, copy: content.stories.objectShellCopy, items: [content.stories.objectShellItem1, content.stories.objectShellItem2, content.stories.objectShellItem3] },
] as const;

export function StoriesScene() {
  const [activeObjectId, setActiveObjectId] = useState<(typeof storyObjects)[number]["id"]>("swimwear");
  const object = storyObjects.find((item) => item.id === activeObjectId) ?? storyObjects[0];
  const { locale } = useLocale();
  const text = useLocaleText();
  return (
    <SceneShell bare current="stories" className="stories-scene stories-v2" id="stories">
      <header className="immersive-scene-label light-label">
        <span>01</span><p><T entry={content.stories.sceneLabel} em /></p>
      </header>
      <section className="trunk-world" aria-label="An open travel trunk filled with stories">
        <div className="trunk-world-image" aria-hidden="true" />
        <div className="trunk-brand-tag" aria-label="DUODUO identity label">
          <img src="/brand/duoduo-symbol.png" alt="" />
          <b>DUODUO</b>
          <small><T entry={content.stories.brandTag} /></small>
        </div>
        <nav className="trunk-drawer-tabs" aria-label="旅行箱抽屉">
          {drawerTabs.map((item) => (
            <button key={item.id} type="button" className={object.drawer === item.id ? "is-active" : ""} onClick={() => setActiveObjectId(item.defaultObject)}>
              <SceneIcon name={item.icon} />
              <span><b>{text(item.entry, "en")}</b>{locale === "original" && <small>{item.entry.zh}</small>}</span>
            </button>
          ))}
        </nav>
        {storyObjects.map((item) => (
          <button key={item.id} className={`trunk-hotspot hotspot-${item.id} ${activeObjectId === item.id ? "is-active" : ""}`} type="button" onClick={() => setActiveObjectId(item.id)} aria-label={text(item.label, "zh")}>
            <SceneIcon name={item.icon} />
            <span>{text(item.label, "zh")}{locale === "original" && <small>{item.label.en}</small>}</span>
          </button>
        ))}
        <article className={`story-drawer-sheet story-popup-${object.id}`} key={object.id}>
          <div className="story-drawer-heading">
            <span className="drawer-symbol"><SceneIcon name={object.icon} /></span>
            <div><StatusStamp tone={object.drawer === "wear" ? "blue" : "teal"}><T entry={object.status} em /></StatusStamp><h1><BilingualText entry={object.title} primary="en" /></h1><small>{locale === "original" ? `${object.label.zh} · ${object.label.en}` : text(object.label)}</small></div>
          </div>
          <p><BilingualText entry={object.copy} primary="zh" /></p>
          <div className="story-drawer-items">
            {object.items.map((item, index) => <span key={item.en}><b>0{index + 1}</b><BilingualText entry={item} primary="zh" /></span>)}
          </div>
          <p className="story-drawer-foot"><Highlighter>{text(content.stories.drawerFoot, "en")}</Highlighter></p>
        </article>
        <p className="trunk-instruction">{text(content.stories.instruction, "zh")}{locale === "original" && <><br /><small>{content.stories.instruction.en}</small></>}</p>
      </section>
    </SceneShell>
  );
}

/* ---------- WORK (田野工作站) ---------- */
const projects = [
  { number: "01", title: content.work.projectLazyland, status: content.work.projectLazylandStatus, copy: content.work.projectLazylandCopy, role: content.work.projectLazylandRole, tags: content.work.projectLazylandTags },
  { number: "02", title: content.work.projectCulturalTourism, status: content.work.projectCulturalTourismStatus, copy: content.work.projectCulturalTourismCopy, role: content.work.projectCulturalTourismRole, tags: content.work.projectCulturalTourismTags },
  { number: "03", title: content.work.projectSwimwear, status: content.work.projectSwimwearStatus, copy: content.work.projectSwimwearCopy, role: content.work.projectSwimwearRole, tags: content.work.projectSwimwearTags },
  { number: "04", title: content.work.projectPersonalCompany, status: content.work.projectPersonalCompanyStatus, copy: content.work.projectPersonalCompanyCopy, role: content.work.projectPersonalCompanyRole, tags: content.work.projectPersonalCompanyTags },
] as const;

const modes = [
  ["selected", content.work.modeSelected, "portfolio" as SceneIconName],
  ["thinking", content.work.modeThinking, "thinking" as SceneIconName],
  ["experiments", content.work.modeExperiments, "experiment" as SceneIconName],
  ["collaborate", content.work.modeCollaborate, "collaborate" as SceneIconName],
] as const;

const methodNotes = [
  { number: "01", title: content.work.methodEarthTitle, copy: content.work.methodEarthCopy },
  { number: "02", title: content.work.methodAliveTitle, copy: content.work.methodAliveCopy },
  { number: "03", title: content.work.methodAssetTitle, copy: content.work.methodAssetCopy },
] as const;

export function WorkScene() {
  const [mode, setMode] = useState<(typeof modes)[number][0]>("selected");
  const [projectIndex, setProjectIndex] = useState(0);
  const project = projects[projectIndex];
  const { locale } = useLocale();
  const text = useLocaleText();
  const nextProject = () => setProjectIndex((projectIndex + 1) % projects.length);
  return (
    <SceneShell bare current="work" className="work-scene work-v2" id="work">
      <header className="immersive-scene-label studio-label">
        <span>02</span><p><T entry={content.work.sceneLabel} em /></p>
      </header>
      <section className="field-studio-world" aria-label="A field studio beside the sea">
        <div className="field-studio-image" aria-hidden="true" />
        <p className="studio-manifesto">Work is a way<br />of <Highlighter><T entry={content.work.manifestoHi} /></Highlighter></p>
        <nav className="studio-tabs" aria-label="田野工作站区域">
          {modes.map(([id, entry, symbol]) => (
            <button key={id} type="button" className={mode === id ? "is-active" : ""} onClick={() => setMode(id)}>
              <SceneIcon name={symbol} /><span><b>{text(entry, "en")}</b>{locale === "original" && <small>{entry.zh}</small>}</span>
            </button>
          ))}
        </nav>
        <div className="studio-laptop" aria-live="polite">
          <span><T entry={content.work.studioLaptopLabel} /></span>
          {mode === "selected" && <><small>{project.number} · <T entry={project.status} /></small><h1><T entry={project.title} em /></h1></>}
          {mode === "thinking" && <><small><T entry={content.work.thinkingSmall} /></small><h1><T entry={content.work.thinkingTitle} em /></h1></>}
          {mode === "experiments" && <><small><T entry={content.work.experimentsSmall} /></small><h1><T entry={content.work.experimentsTitle} em /></h1></>}
          {mode === "collaborate" && <><small><T entry={content.work.collaborateSmall} /></small><h1><T entry={content.work.collaborateTitle} em /></h1></>}
        </div>
        <article className="studio-dossier" key={`${mode}-${projectIndex}`}>
          {mode === "selected" && <>
            <StatusStamp><T entry={project.status} /></StatusStamp><h2><BilingualText entry={project.title} primary="en" /></h2><small><BilingualText entry={project.tags} primary="en" /></small><p><BilingualText entry={project.copy} primary="zh" /></p><dl><dt><T entry={content.work.myRole} /></dt><dd><BilingualText entry={project.role} primary="zh" /></dd></dl><button type="button" onClick={nextProject}><T entry={content.work.nextProject} em /></button>
          </>}
          {mode === "thinking" && <>
            <StatusStamp><T entry={content.work.thinkingStatus} em /></StatusStamp><h2><T entry={content.work.thinkingTitleZh} em /></h2><p><BilingualText entry={content.work.thinkingCopy} primary="zh" /></p><div className="method-note-list">{methodNotes.map((method) => <article key={method.number}><span>{method.number}</span><h3><BilingualText entry={method.title} primary="en" /></h3><p><BilingualText entry={method.copy} primary="zh" /></p></article>)}</div>
          </>}
          {mode === "experiments" && <>
            <StatusStamp tone="blue"><T entry={content.work.experimentsStatus} /></StatusStamp><h2><T entry={content.work.experimentsTitleZh} em /></h2><p><BilingualText entry={content.work.experimentsCopy} primary="zh" /></p><ul><li><BilingualText entry={content.work.experimentsList1} primary="zh" /></li><li><BilingualText entry={content.work.experimentsList2} primary="zh" /></li><li><BilingualText entry={content.work.experimentsList3} primary="zh" /></li></ul>
          </>}
          {mode === "collaborate" && <>
            <StatusStamp tone="red"><T entry={content.work.collaborateStatus} em /></StatusStamp><h2><T entry={content.work.collaborateTitleZh} em /></h2><p><BilingualText entry={content.work.collaborateCopy} primary="zh" /></p><a href="/ai#contact"><T entry={content.work.collaborateLink} em /></a>
          </>}
        </article>
      </section>
    </SceneShell>
  );
}

/* ---------- ABOUT (人生航线) ---------- */
export function AboutScene() {
  const starFieldRef = useRef<HTMLElement | null>(null);
  const lastSparkRef = useRef(0);
  const voyage = [
    { number: "01", year: "1999—", title: content.about.node01, place: content.about.node01Place, happened: content.about.node01Happened, changed: content.about.node01Changed, remains: content.about.node01Remains, photo: null, photoAlt: null },
    { number: "02", year: "2018", title: content.about.node02, place: content.about.node02Place, happened: content.about.node02Happened, changed: content.about.node02Changed, remains: content.about.node02Remains, photo: null, photoAlt: null },
    { number: "03", year: "2022", title: content.about.node03, place: content.about.node03Place, happened: content.about.node03Happened, changed: content.about.node03Changed, remains: content.about.node03Remains, photo: null, photoAlt: null },
    { number: "04", year: "2024", title: content.about.node04, place: content.about.node04Place, happened: content.about.node04Happened, changed: content.about.node04Changed, remains: content.about.node04Remains, photo: "/photos/travel-desert.jpg", photoAlt: content.about.node04PhotoAlt },
    { number: "05", year: "2025", title: content.about.node05, place: content.about.node05Place, happened: content.about.node05Happened, changed: content.about.node05Changed, remains: content.about.node05Remains, photo: "/photos/work-lazyland-poster.jpg", photoAlt: content.about.node05PhotoAlt },
    { number: "06", year: "2025", title: content.about.node06, place: content.about.node06Place, happened: content.about.node06Happened, changed: content.about.node06Changed, remains: content.about.node06Remains, photo: "/photos/surf-surfing.jpg", photoAlt: content.about.node06PhotoAlt },
    { number: "07", year: "2025", title: content.about.node07, place: content.about.node07Place, happened: content.about.node07Happened, changed: content.about.node07Changed, remains: content.about.node07Remains, photo: "/photos/about-namecard.png", photoAlt: content.about.node07PhotoAlt },
  ] as const;
  const [active, setActive] = useState(3);
  const node = voyage[active];
  const { locale } = useLocale();
  const text = useLocaleText();
  const wakeStars = (event: React.PointerEvent<HTMLElement>) => {
    const now = performance.now();
    if (now - lastSparkRef.current < 42 || !starFieldRef.current) return;
    lastSparkRef.current = now;
    const rect = starFieldRef.current.getBoundingClientRect();
    const star = document.createElement("span");
    star.className = "pointer-star";
    star.textContent = Math.random() > 0.72 ? "✦" : Math.random() > 0.5 ? "·" : "✧";
    star.style.left = `${event.clientX - rect.left}px`;
    star.style.top = `${event.clientY - rect.top}px`;
    star.style.setProperty("--star-drift", `${(Math.random() - 0.5) * 34}px`);
    starFieldRef.current.appendChild(star);
    window.setTimeout(() => star.remove(), 900);
  };
  return (
    <SceneShell bare current="about" className="about-scene about-v2" id="about">
      <header className="immersive-scene-label night-label">
        <span>03</span><p><T entry={content.about.sceneLabel} em /></p>
      </header>
      <section ref={starFieldRef} onPointerMove={wakeStars} className="life-voyage-stage" aria-label="The Life Voyage · 多多的人生航线">
        <div className="life-voyage-ocean" aria-hidden="true" />
        <div className="voyage-stars" aria-hidden="true">✦　·　　　✺　　　　·　☾　　✦</div>
        <p className="voyage-opening"><span>{text(content.about.openingEn, "en")}</span>{locale === "original" && <><br />{content.about.openingZh.zh}</>}</p>
        <svg className="voyage-route-svg" viewBox="0 0 1400 650" preserveAspectRatio="none" aria-hidden="true">
          <path className="voyage-route-shadow" d="M65 470 C180 468 225 410 330 430 S500 395 600 370 S770 320 875 342 S1040 275 1130 300 S1270 235 1350 175" />
          <path className="voyage-route-glow" d="M65 470 C180 468 225 410 330 430 S500 395 600 370 S770 320 875 342 S1040 275 1130 300 S1270 235 1350 175" />
        </svg>
        <div className="voyage-nodes">
          {voyage.map((item, index) => (
            <button key={item.title.en} type="button" className={`voyage-map-node node-${index + 1} ${active === index ? "is-active" : ""}`} onClick={() => setActive(index)}>
              <span className="map-node-dot">{index % 2 === 0 ? "✦" : "☾"}</span>
              <small>{item.year}</small><b>{text(item.title, "en")}</b>{locale === "original" && <em>{item.title.zh}</em>}
            </button>
          ))}
        </div>
        <article className="voyage-story-note" key={node.title.en}>
          <span>{node.number} · {text(node.place, "en")}{locale === "original" ? ` ${node.place.zh}` : ""}</span>
          <h1>{text(node.title, "en")}{locale === "original" && <b>{node.title.zh}</b>}</h1>
          <dl><div><dt><T entry={content.about.dtHappened} /></dt><dd><BilingualText entry={node.happened} primary="zh" /></dd></div><div><dt><T entry={content.about.dtChanged} /></dt><dd><BilingualText entry={node.changed} primary="zh" /></dd></div><div><dt><T entry={content.about.dtRemains} /></dt><dd><BilingualText entry={node.remains} primary="zh" /></dd></div></dl>
        </article>
        <div className="voyage-polaroids" aria-label="人生航线照片位置">
          {node.photo ? (
            <>
              <img className="polaroid-one" src={node.photo} alt={text(node.photoAlt, "zh")} loading="lazy" />
              <span className="polaroid-caption">{text(node.place, "en").split(" · ")[0]}</span>
            </>
          ) : (
            <>
              <span className="polaroid-one"><T entry={content.about.photoLabel} /> {text(node.place, "en").split(" · ")[0]}</span>
              <span className="polaroid-two">{text(content.about.memoryToAdd, "en")}</span>
            </>
          )}
        </div>
        <blockquote className="voyage-roots-quote">{text(content.about.rootsQuoteEn1, "en")}<br /><em>{text(content.about.rootsQuoteEn2, "en")}</em>{locale === "original" && <small>{content.about.rootsQuoteZh1.zh}<Highlighter>{content.about.rootsQuoteZh2.zh}</Highlighter></small>}</blockquote>
      </section>
    </SceneShell>
  );
}

/* ---------- SURF (浪点日志) ---------- */
export function SurfScene() {
  const { locale } = useLocale();
  const text = useLocaleText();
  return (
    <SceneShell bare current="surf" className="surf-scene" id="surf">
      <div className="surf-ocean-photo" aria-hidden="true" />
      <LivingOceanCanvas calm />
      <SceneTitle number="04" en={text(content.surf.titleEn, "en")} zh={locale === "original" ? content.surf.titleEn.zh : ""} subtitle={text(content.surf.subtitleEn, "en")} symbol="≋" />
      <section className="surf-hero-copy">
        <SymbolSeal symbol="≋" label={`${content.surf.sealLabel.en} ${content.surf.sealLabel.zh}`} />
        <h1><T entry={content.surf.heroLine1} /></h1>
        <p><T entry={content.surf.heroLine2} /></p>
        {locale === "original" && <p>{content.surf.heroLineZh.zh.split(content.surf.heroHi.zh)[0]}<Highlighter>{content.surf.heroHi.zh}</Highlighter></p>}
      </section>
      <div className="surf-break" aria-hidden="true">
        <span className="surf-line line-one" />
        <span className="surf-line line-two" />
        <span className="surf-line line-three" />
        <i className="surf-board">DUODUO</i>
      </div>
      <section className="surf-log-panel">
        <header><StatusStamp><T entry={content.surf.logStatus} /></StatusStamp><h2><T entry={content.surf.logTitle} em /></h2></header>
        <div className="surf-log-entries">
          <article><span>01</span><h3><T entry={content.surf.logEntry1Title} /></h3><p><T entry={content.surf.logEntry1Copy} /></p></article>
          <article><span>02</span><h3><T entry={content.surf.logEntry2Title} /></h3><p><T entry={content.surf.logEntry2Copy} /></p></article>
          <article><span>03</span><h3><T entry={content.surf.logEntry3Title} /></h3><p><T entry={content.surf.logEntry3Copy} /></p></article>
        </div>
        <div className="lessons-note"><b>{text(content.surf.lessonsTitle, "en")}</b>{locale === "original" && <span>{content.surf.lessonsTitle.zh}</span>}</div>
      </section>
      <section className="surf-wear-lab">
        <div className="wear-lab-mark"><img src="/brand/duoduo-symbol.png" alt="" /><span>✦</span></div>
        <div className="wear-lab-copy"><StatusStamp tone="blue"><T entry={content.surf.wearStatus} /></StatusStamp><h2><BilingualText entry={content.surf.wearTitle} primary="en" /></h2><p><BilingualText entry={content.surf.wearCopy} primary="zh" /></p></div>
        <div className="wear-lab-tests"><span>01 <b><BilingualText entry={content.surf.wearTest1} primary="en" /></b></span><span>02 <b><BilingualText entry={content.surf.wearTest2} primary="en" /></b></span><span>03 <b><BilingualText entry={content.surf.wearTest3} primary="en" /></b></span></div>
        <a href="#stories"><BilingualText entry={content.surf.wearLink} primary="en" /></a>
      </section>
    </SceneShell>
  );
}

/* ---------- AI (问多多) ---------- */
const aiTabs = [
  { id: "ask", entry: content.ai.tabsAsk },
  { id: "take", entry: content.ai.tabsTake },
  { id: "now", entry: content.ai.tabsNow },
  { id: "contact", entry: content.ai.tabsContact },
] as const;

const aiRoutes = [
  { href: "/", command: "cd /home", en: "HOME", zh: "主页" },
  { href: "/world#stories", command: "cd /stories", en: "STORIES", zh: "故事" },
  { href: "/world#work", command: "cd /work", en: "WORK", zh: "作品" },
  { href: "/world#about", command: "cd /about", en: "ABOUT", zh: "关于" },
  { href: "/world#surf", command: "cd /surf", en: "SURF", zh: "冲浪" },
] as const;

type PublicAiMessage = { role: "user" | "assistant"; content: string };

const publicTools = [
  {
    id: "company",
    number: "01",
    symbol: "⌘",
    kind: "PROMPT",
    extension: ".PROMPT",
    title: "PERSONAL COMPANY INVENTORY",
    zh: "个人公司自我盘点",
    path: "/tools/personal-company-inventory.md",
    copy: content.ai.tool1Copy,
  },
  {
    id: "travel",
    number: "02",
    symbol: "≋",
    kind: "WORKFLOW",
    extension: "DIR",
    title: "TRAVEL LEARNING NOTE",
    zh: "旅行学习记录模板",
    path: "/tools/travel-learning-note.md",
    copy: content.ai.tool2Copy,
  },
  {
    id: "experiment",
    number: "03",
    symbol: "✦",
    kind: "TEMPLATE",
    extension: ".CARD",
    title: "UNFINISHED EXPERIMENT REVIEW",
    zh: "未完成实验复盘卡",
    path: "/tools/unfinished-experiment-review.md",
    copy: content.ai.tool3Copy,
  },
  {
    id: "design-system",
    number: "04",
    symbol: "DS",
    kind: "SKILL",
    extension: ".ZIP",
    title: "DUODUO DESIGN SYSTEM",
    zh: "多多完整设计系统",
    path: "https://raw.githubusercontent.com/faifaida/duoduo-design-system/main/duoduo-design-system.zip",
    downloadOnly: true,
    copy: {
      en: "The complete reusable design skill behind faifaida.com, including rules, templates, approved assets and version references.",
      zh: "faifaida.com 背后的完整可复用设计 Skill，包含规则、模板、正式素材与历史版本参考。",
      ko: "faifaida.com의 전체 재사용 가능 디자인 스킬입니다.",
      ja: "faifaida.com の完全な再利用可能デザイン Skill です。",
      es: "El Skill de diseño reutilizable completo detrás de faifaida.com.",
      fr: "Le Skill de design réutilisable complet derrière faifaida.com.",
    },
  },
] as const;

export function AiScene() {
  const [tab, setTab] = useState<(typeof aiTabs)[number]["id"]>("ask");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<PublicAiMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [toolPreview, setToolPreview] = useState<(typeof publicTools)[number] | null>(null);
  const [toolPreviewContent, setToolPreviewContent] = useState("");
  const { locale } = useLocale();
  const text = useLocaleText();
  const exampleQuestions = [
    { zh: "为什么多多把旅行、青旅、泳衣和 AI 放在同一个世界里？", en: "Why do travel, hostels, swimwear and AI belong in Duoduo’s same world?" },
    { zh: "多多现在正在做什么？", en: "What is Duoduo building now?" },
    { zh: "我可以如何与多多合作？", en: "How can I work with Duoduo?" },
    { zh: "Duoduo Wear 目前进行到哪一步？", en: "What stage is Duoduo Wear at?" },
  ];

  useEffect(() => {
    const scrollToAi = () => {
      if (typeof window !== "undefined" && window.location.hash === "#contact") {
        setTab("contact");
        document.getElementById("ai")?.scrollIntoView({ behavior: "smooth" });
      }
    };
    scrollToAi();
  }, []);

  const ask = async () => {
    const prompt = question.trim();
    if (!prompt || pending) return;
    const nextHistory: PublicAiMessage[] = [...history, { role: "user", content: prompt }].slice(-8);
    setQuestion("");
    setPending(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 18000);
    try {
      const response = await fetch("/api/duoduo-ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: nextHistory }),
        signal: controller.signal,
      });
      const data = await response.json() as { answer?: string; error?: string };
      if (!response.ok || !data.answer) throw new Error(data.error || "Workers AI request failed");
      setAnswer(data.answer);
      setHistory([...nextHistory, { role: "assistant", content: data.answer }].slice(-8));
    } catch {
      setAnswer(text(content.ai.askError, locale === "original" ? "zh" : "en"));
    } finally {
      window.clearTimeout(timeout);
      setPending(false);
    }
  };

  const openTool = async (tool: (typeof publicTools)[number]) => {
    setToolPreview(tool);
    setToolPreviewContent("Loading file… / 正在打开文件…");
    try {
      const response = await fetch(tool.path);
      if (!response.ok) throw new Error("Unable to open tool");
      setToolPreviewContent(await response.text());
    } catch {
      setToolPreviewContent("This file is temporarily unavailable. / 文件暂时无法打开。");
    }
  };

  const activeTab = aiTabs.find((t) => t.id === tab)!;
  return (
    <SceneShell bare current="ai" className="ai-scene" id="ai">
      <div className="os-stars" aria-hidden="true">✦　·　☾　　　✺　　·　✦</div>
      <section className="os-shell">
        <div className="os-machine-rail" aria-hidden="true"><span>●</span><span>●</span><b><T entry={content.ai.machineRail} /></b><i><T entry={content.ai.machineStatus} /></i></div>
        <header className="os-header">
          <SymbolSeal symbol="⌁" label={`${content.ai.sealLabel.en} ${content.ai.sealLabel.zh}`} />
          <div><StatusStamp tone="blue"><T entry={content.ai.statusOnline} /></StatusStamp><h1><T entry={content.ai.titleEn} em /></h1></div>
        </header>
        <nav className="os-route-console" aria-label={`${content.ai.routeLabel.en} · ${content.ai.routeLabel.zh}`}>
          <span className="route-console-prompt">duoduo@ocean:~$ <b>nav --world</b><i>_</i></span>
          <div>
            {aiRoutes.map((route) => (
              <a href={route.href} key={route.href}>
                <code>{route.command}</code>
                <span>{route.en}<small>{route.zh}</small></span>
              </a>
            ))}
          </div>
        </nav>
        <nav className="os-tabs" aria-label="DUODUO OS sections">
          {aiTabs.map((t) => <button type="button" key={t.id} className={tab === t.id ? "is-active" : ""} onClick={() => setTab(t.id)}>{text(t.entry, "en")}{locale === "original" && <small>{t.entry.zh}</small>}</button>)}
        </nav>
        <div className="os-content">
          <div className="os-command-line"><span>duoduo@ocean:~$</span> open /{activeTab.entry.en.toLowerCase().replaceAll(" ", "-")}<i>_</i></div>
          {tab === "ask" && (
            <section className="ask-panel">
              <div className="ai-answer" aria-live="polite"><span><T entry={content.ai.askProvider} /></span><p>{pending ? <BilingualText entry={content.ai.askThinking} primary="zh" /> : answer || <BilingualText entry={content.ai.askDefaultAnswer} primary="zh" />}</p></div>
              {!history.length && (
                <div className="ai-example-questions" aria-label="Example questions">
                  <small>TRY A SIGNAL｜试着问</small>
                  {exampleQuestions.map((example, index) => (
                    <button key={example.en} type="button" onClick={() => setQuestion(example.zh)}>
                      <span>0{index + 1}</span><b>{example.zh}</b><em>{example.en}</em>
                    </button>
                  ))}
                </div>
              )}
              <label className="ai-question-label" htmlFor="duoduo-ai-question"><BilingualText entry={content.ai.askPromptLabel} primary="en" /></label>
              <div className="ai-question"><input id="duoduo-ai-question" value={question} disabled={pending} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void ask()} placeholder={locale === "original" ? "向多多提问：旅行、项目、思考或未完成实验… / Ask Duoduo about her work and world…" : text(content.ai.askPlaceholder)} aria-label={`${content.ai.askPromptLabel.en} · ${content.ai.askPromptLabel.zh}`} /><button type="button" disabled={pending} onClick={() => void ask()}>{pending ? "···" : <BilingualText entry={content.ai.askSend} primary="en" />}</button></div>
              <small>Based on approved public materials only. · 只基于已批准公开的资料回答。</small>
            </section>
          )}
          {tab === "take" && (
            <section className="tool-desktop" aria-label="Take something desktop">
              <header>
                <span><i /> <i /> <i /></span>
                <b>DUODUO://PUBLIC_LIBRARY</b>
                <small>TAKE SOMETHING · 带走一些东西</small>
              </header>
              <div className="tool-desktop-grid">
                {publicTools.map((tool) => {
                  const contents = <><span className="tool-file-shape" aria-hidden="true"><i>{tool.symbol}</i><small>{tool.extension}</small></span><b>{tool.title}</b><em>{tool.zh}</em><small>{tool.kind} · {tool.number}</small></>;
                  return "downloadOnly" in tool ? (
                    <a className={`tool-desktop-icon tool-kind-${tool.kind.toLowerCase()}`} href={tool.path} download key={tool.id} aria-label={`${tool.title} download`}>{contents}</a>
                  ) : (
                    <button type="button" className={`tool-desktop-icon tool-kind-${tool.kind.toLowerCase()}`} key={tool.id} onClick={() => void openTool(tool)}>{contents}</button>
                  );
                })}
                <span className="tool-desktop-empty is-folder"><i>＋</i><b>SKILLS</b><small>为未来技能文件夹预留</small></span>
                <span className="tool-desktop-empty is-document"><i>＋</i><b>PROMPTS</b><small>更多公开提示词文档</small></span>
                <span className="tool-desktop-empty is-app"><i>＋</i><b>WORKFLOWS</b><small>持续生长的工作流应用</small></span>
              </div>
              <footer><span>04 OBJECTS ONLINE</span><b>OPEN OR DOWNLOAD · 打开或下载</b><i>SPACE RESERVED FOR MORE ↓</i></footer>

              {toolPreview && (
                <motion.div className="tool-preview-window" role="dialog" aria-modal="true" aria-label={`${toolPreview.title} preview`} initial={{ opacity: 0, scale: .97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}>
                  <header>
                    <span><i /> <i /> <i /></span>
                    <b>{toolPreview.title}.md</b>
                    <button type="button" onClick={() => setToolPreview(null)} aria-label="Close tool preview">×</button>
                  </header>
                  <div className="tool-preview-meta">
                    <span>{toolPreview.kind} / {toolPreview.number}</span>
                    <p><BilingualText entry={toolPreview.copy} primary="zh" /></p>
                  </div>
                  <pre>{toolPreviewContent}</pre>
                  <footer>
                    <a href={toolPreview.path} target="_blank" rel="noreferrer">OPEN IN NEW TAB / 新窗口打开 ↗</a>
                    <a href={toolPreview.path} download>DOWNLOAD / 下载 ↓</a>
                  </footer>
                </motion.div>
              )}
            </section>
          )}
          {tab === "now" && (
            <section className="now-panel"><span className="now-symbol">☾</span><div><small><BilingualText entry={content.ai.nowLocation} primary="en" /></small><h2><BilingualText entry={content.ai.nowLocationVal} primary="en" /></h2></div><div><small><BilingualText entry={content.ai.nowBuilding} primary="en" /></small><h2><BilingualText entry={content.ai.nowBuildingVal} primary="en" /></h2></div><div><small><BilingualText entry={content.ai.nowOpen} primary="en" /></small><h2><BilingualText entry={content.ai.nowOpenVal} primary="en" /></h2></div></section>
          )}
          {tab === "contact" && (
            <section className="contact-panel" id="contact">
              <p><BilingualText entry={content.ai.contactCopy} primary="zh" /></p>
              <a className="contact-email" href="mailto:sshiyuanz@outlook.com"><BilingualText entry={content.ai.contactLink} primary="en" /></a>
              <small><BilingualText entry={content.ai.contactEmail} primary="en" /></small>
              <div className="contact-channels" aria-label="Social channels">
                <div className="contact-channel-static">
                  <span>WECHAT · 01</span><img src="/contact/duoduo-wechat.jpg" alt="多多OS微信二维码" /><b>微信</b><small>多多OS · duoduo-os</small>
                </div>
                <div className="contact-channel-static">
                  <span>WECHAT OA · 02</span><img src="/contact/duoduo-wechat-official.jpg" alt="多多OS微信公众号二维码" /><b>微信公众号</b><small>多多OS</small>
                </div>
                <a href="https://www.xiaohongshu.com/user/profile/672866e7000000001c01afde" target="_blank" rel="noreferrer">
                  <span>XHS · 03</span><img src="/contact/duoduo-xiaohongshu.jpg" alt="多多OS小红书二维码" /><b>小红书</b><small>多多OS ↗</small>
                </a>
                <a href="https://www.instagram.com/faifaida_/" target="_blank" rel="noreferrer">
                  <span>IG · 04</span><b>Instagram</b><small>@faifaida_ ↗</small>
                </a>
              </div>
            </section>
          )}
        </div>
      </section>
    </SceneShell>
  );
}
