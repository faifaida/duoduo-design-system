"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { LivingOceanCanvas } from "./LivingOceanCanvas";
import { BilingualText, Entry, T, useLocale, useLocaleText } from "./LocaleProvider";
import { Highlighter, SceneShell, StatusStamp } from "./DuoduoComponents";
import { SceneIcon, type SceneIconName } from "./SceneIcons";
import { content } from "../i18n/content";

const entry = (en: string, zh: string, translated?: Partial<Omit<Entry, "en" | "zh">>): Entry => ({
  en,
  zh,
  ko: translated?.ko ?? en,
  ja: translated?.ja ?? en,
  es: translated?.es ?? en,
  fr: translated?.fr ?? en,
});

function SceneScrollCue({ en, zh }: { en: string; zh: string }) {
  return (
    <div className="scene-scroll-cue" aria-hidden="true">
      <span><i /></span>
      <b>{en}</b>
      <small>{zh}</small>
    </div>
  );
}

/* ───────────────────────── STORIES ───────────────────────── */

const storyModes = [
  { id: "roads", label: entry("ROADS & PEOPLE", "路与人"), icon: "journey" as SceneIconName, defaultObject: "passport" },
  { id: "objects", label: entry("FOUND OBJECTS", "拾得物"), icon: "objects" as SceneIconName, defaultObject: "shell" },
  { id: "field", label: entry("FIELD NOTES", "旅途手记"), icon: "thinking" as SceneIconName, defaultObject: "recorder" },
] as const;

const storyObjects = [
  { id: "passport", mode: "roads", icon: "passport" as SceneIconName, label: content.stories.objectPassport, status: content.stories.objectPassportStatus, title: content.stories.objectPassportTitle, copy: content.stories.objectPassportCopy, items: [content.stories.objectPassportItem1, content.stories.objectPassportItem2, content.stories.objectPassportItem3] },
  { id: "camera", mode: "roads", icon: "camera" as SceneIconName, label: content.stories.objectCamera, status: content.stories.objectCameraStatus, title: content.stories.objectCameraTitle, copy: content.stories.objectCameraCopy, items: [content.stories.objectCameraItem1, content.stories.objectCameraItem2, content.stories.objectCameraItem3] },
  { id: "recorder", mode: "field", icon: "recorder" as SceneIconName, label: content.stories.objectRecorder, status: content.stories.objectRecorderStatus, title: content.stories.objectRecorderTitle, copy: content.stories.objectRecorderCopy, items: [content.stories.objectRecorderItem1, content.stories.objectRecorderItem2, content.stories.objectRecorderItem3] },
  { id: "shell", mode: "objects", icon: "shell" as SceneIconName, label: content.stories.objectShell, status: content.stories.objectShellStatus, title: content.stories.objectShellTitle, copy: content.stories.objectShellCopy, items: [content.stories.objectShellItem1, content.stories.objectShellItem2, content.stories.objectShellItem3] },
] as const;

export function StoriesV5() {
  const [activeId, setActiveId] = useState<(typeof storyObjects)[number]["id"]>("passport");
  const active = storyObjects.find((item) => item.id === activeId) ?? storyObjects[0];
  const { locale } = useLocale();
  const text = useLocaleText();

  return (
    <SceneShell bare current="stories" className="stories-scene stories-v2 stories-v5" id="stories">
      <header className="immersive-scene-label light-label"><span>01</span><p><T entry={content.stories.sceneLabel} em /></p></header>
      <section className="trunk-world" aria-label="An open travel trunk filled with stories">
        <div className="trunk-world-image" aria-hidden="true" />
        <section className="mobile-story-ledger" aria-label="All travel stories">
          <header>
            <span>FIELD ARCHIVE · 01–04</span>
            <h1>STORIES <b>路上留下来的四份档案</b></h1>
            <p>不需要寻找藏在箱子里的入口。沿着这一页往下走，故事会依次展开。</p>
          </header>
          <div className="mobile-story-list">
            {storyObjects.map((item, index) => (
              <article className="mobile-story-entry paper-texture" key={item.id}>
                <div className="mobile-story-entry-mark">
                  <span>0{index + 1}</span>
                  <SceneIcon name={item.icon} />
                </div>
                <div className="mobile-story-entry-copy">
                  <StatusStamp><T entry={item.status} em /></StatusStamp>
                  <h2><BilingualText entry={item.title} primary="en" /></h2>
                  <small>{locale === "original" ? `${item.label.zh} · ${item.label.en}` : text(item.label)}</small>
                  <p><BilingualText entry={item.copy} primary="zh" /></p>
                  <ol>
                    {item.items.map((note, noteIndex) => (
                      <li key={note.en}><b>0{noteIndex + 1}</b><BilingualText entry={note} primary="zh" /></li>
                    ))}
                  </ol>
                </div>
              </article>
            ))}
          </div>
          <a className="mobile-story-wear-link" href="/world#surf"><span>✦</span><b>THE ORIGIN OF DUODUO WEAR</b><small>继续去 Surf &amp; Wear 看它如何从海边开始 →</small></a>
        </section>
        <div className="trunk-brand-tag">
          <img src="/brand/duoduo-symbol.png" alt="" />
          <b>DUODUO</b>
          <small><T entry={content.stories.brandTag} /></small>
        </div>

        <nav className="trunk-story-modes" aria-label="Story types">
          {storyModes.map((mode) => (
            <button key={mode.id} type="button" className={active.mode === mode.id ? "is-active" : ""} onClick={() => setActiveId(mode.defaultObject)}>
              <SceneIcon name={mode.icon} />
              <span><b>{text(mode.label, "en")}</b>{locale === "original" && <small>{mode.label.zh}</small>}</span>
            </button>
          ))}
        </nav>

        {storyObjects.map((item) => (
          <motion.button
            key={item.id}
            className={`trunk-hotspot hotspot-${item.id} ${activeId === item.id ? "is-active" : ""}`}
            type="button"
            onClick={() => setActiveId(item.id)}
            whileHover={{ y: -4, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            aria-label={text(item.label, "zh")}
          >
            <SceneIcon name={item.icon} />
            <span>{text(item.label, "zh")}{locale === "original" && <small>{item.label.en}</small>}</span>
          </motion.button>
        ))}

        <motion.article
          className={`story-drawer-sheet story-popup-${active.id} paper-texture`}
          key={active.id}
          initial={{ opacity: 0, y: 12, rotate: -0.35 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="story-drawer-heading">
            <span className="drawer-symbol"><SceneIcon name={active.icon} /></span>
            <div>
              <StatusStamp><T entry={active.status} em /></StatusStamp>
              <h1><BilingualText entry={active.title} primary="en" /></h1>
              <small>{locale === "original" ? `${active.label.zh} · ${active.label.en}` : text(active.label)}</small>
            </div>
          </div>
          <p><BilingualText entry={active.copy} primary="zh" /></p>
          <div className="story-drawer-items">
            {active.items.map((item, index) => <span key={item.en}><b>0{index + 1}</b><BilingualText entry={item} primary="zh" /></span>)}
          </div>
          <p className="story-drawer-foot"><Highlighter>{text(content.stories.drawerFoot, "en")}</Highlighter></p>
        </motion.article>

        <a className="wear-origin-tag paper-texture" href="/world#surf">
          <span>✦</span><b>THE ORIGIN OF DUODUO WEAR</b><small>Duoduo Wear 的起源 · 在 Surf & Wear 查看</small>
        </a>
        <p className="trunk-instruction">{text(content.stories.instruction, "zh")}{locale === "original" && <><br /><small>{content.stories.instruction.en}</small></>}</p>
        <SceneScrollCue en="SCROLL TO WORK" zh="向下滑，进入作品" />
      </section>
    </SceneShell>
  );
}

/* ───────────────────────── WORK ───────────────────────── */

const workProjects = [
  {
    id: "lazyland",
    number: "01",
    title: content.work.projectLazyland,
    status: content.work.projectLazylandStatus,
    copy: content.work.projectLazylandCopy,
    role: content.work.projectLazylandRole,
    tags: content.work.projectLazylandTags,
    image: "/photos/work-lazyland-poster.jpg",
    problem: entry("How can a hostel become a real social base rather than only a room inventory?", "怎样让青旅不只是床位库存，而是一个真实发生关系的青年基地？"),
    actions: entry("I shaped the positioning, guest journey, spatial programme, operating model and the bridge between story, community and cash flow.", "我参与定位、住客旅程、空间业态、运营测算，并把故事、社群与现金流放进同一套判断里。"),
    outcome: entry("The project moved from an atmospheric idea into a real operating proposal with measurable assumptions.", "它从一张氛围想象，推进成了带有真实测算与合作机制的运营方案。"),
    unresolved: entry("The next proof is not another deck. It is whether the first year creates repeatable community and healthy unit economics.", "下一步要证明的不是另一份方案，而是第一年能否形成可复用的社群与健康的单店模型。"),
  },
  {
    id: "hospitality",
    number: "02",
    title: content.work.projectCulturalTourism,
    status: content.work.projectCulturalTourismStatus,
    copy: content.work.projectCulturalTourismCopy,
    role: content.work.projectCulturalTourismRole,
    tags: content.work.projectCulturalTourismTags,
    image: "/photos/travel-street-man.jpg",
    problem: entry("How can a cultural space feel alive after the opening campaign ends?", "文旅空间如何在开业热度结束后，仍然持续地活着？"),
    actions: entry("I connect function, appearance, construction, operation and human behaviour instead of treating design as a surface.", "我把功能、外观、工程、运营与人的行为放在一起，而不是只把设计理解成表面风格。"),
    outcome: entry("The work produced a field-tested way to ask better questions before committing resources.", "这些实践沉淀成了一套在投入资源前先问对问题的田野方法。"),
    unresolved: entry("The long-term metric is whether the place can keep generating its own reasons to return.", "长期仍需验证：这个地方能否持续产生让人回来一次的理由。"),
  },
  {
    id: "duoduo-wear",
    number: "03",
    title: entry("DUODUO WEAR", "多多穿戴实验"),
    status: content.work.projectSwimwearStatus,
    copy: content.work.projectSwimwearCopy,
    role: content.work.projectSwimwearRole,
    tags: content.work.projectSwimwearTags,
    image: "/photos/surf-beach-board.jpeg",
    problem: entry("Can a personal need at the beach become a product that works on more bodies?", "一个人在海边的真实需要，能否变成适合更多身体的产品？"),
    actions: entry("I made the first sample batch, collected body feedback and treated fit as the first brand decision.", "我做出第一批样品，收集不同身材的反馈，并把版型舒适度作为品牌的第一项决策。"),
    outcome: entry("Twenty prototypes turned an aesthetic idea into a testable product question.", "20 件原型把一个审美想法变成了可以被身体真实检验的产品问题。"),
    unresolved: entry("Fit, comfort and repeatable production must be solved before a public launch.", "正式发布前仍需解决版型、舒适度与可重复生产。"),
  },
  {
    id: "personal-company",
    number: "04",
    title: content.work.projectPersonalCompany,
    status: content.work.projectPersonalCompanyStatus,
    copy: content.work.projectPersonalCompanyCopy,
    role: content.work.projectPersonalCompanyRole,
    tags: content.work.projectPersonalCompanyTags,
    image: "/photos/about-namecard.png",
    problem: entry("How can a moving life accumulate instead of restarting from zero in every place?", "一种流动的生活怎样持续积累，而不是每到一处都重新从零开始？"),
    actions: entry("I am connecting Context, knowledge, content, products, AI and real-world projects into one personal operating system.", "我正在把个人 Context、知识、内容、产品、AI 与真实项目接入同一个个人运营系统。"),
    outcome: entry("The system now has a public interface, clearer knowledge boundaries and several live experiments.", "它现在拥有公开界面、更清晰的知识边界，以及数个正在运行的真实实验。"),
    unresolved: entry("The next test is sustainable revenue without losing the life the system was built to protect.", "下一步要验证：如何获得可持续收入，同时不牺牲这套系统原本想保护的生活。"),
  },
] as const;

const workModes = [
  ["selected", content.work.modeSelected, "portfolio" as SceneIconName],
  ["thinking", content.work.modeThinking, "thinking" as SceneIconName],
  ["experiments", content.work.modeExperiments, "experiment" as SceneIconName],
  ["collaborate", content.work.modeCollaborate, "collaborate" as SceneIconName],
] as const;

export function WorkV5() {
  const [mode, setMode] = useState<(typeof workModes)[number][0]>("selected");
  const [projectId, setProjectId] = useState<(typeof workProjects)[number]["id"]>(() => {
    if (typeof window === "undefined") return "lazyland";
    const found = workProjects.find((item) => item.id === window.location.hash.replace("#", ""));
    return found?.id ?? "lazyland";
  });
  const [openProjectId, setOpenProjectId] = useState<(typeof workProjects)[number]["id"] | null>(() => {
    if (typeof window === "undefined") return null;
    const found = workProjects.find((item) => item.id === window.location.hash.replace("#", ""));
    return found?.id ?? null;
  });
  const project = workProjects.find((item) => item.id === projectId) ?? workProjects[0];
  const openProject = workProjects.find((item) => item.id === openProjectId) ?? null;
  const { locale } = useLocale();
  const text = useLocaleText();

  const openCase = () => {
    window.history.replaceState(null, "", `/work#${project.id}`);
    setOpenProjectId(project.id);
  };

  const closeCase = () => {
    setOpenProjectId(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <SceneShell bare current="work" className="work-scene work-v2 work-v5" id="work">
      <header className="immersive-scene-label studio-label"><span>02</span><p><T entry={content.work.sceneLabel} em /></p></header>
      <section className="field-studio-world" aria-label="A field studio beside the sea">
        <div className="field-studio-image" aria-hidden="true" />
        <p className="studio-manifesto">Work is a way<br />of <Highlighter><T entry={content.work.manifestoHi} /></Highlighter></p>
        <nav className="studio-tabs" aria-label="Field studio areas">
          {workModes.map(([id, label, icon]) => (
            <button key={id} type="button" className={mode === id ? "is-active" : ""} onClick={() => setMode(id)}>
              <SceneIcon name={icon} /><span><b>{text(label, "en")}</b>{locale === "original" && <small>{label.zh}</small>}</span>
            </button>
          ))}
        </nav>
        {mode === "selected" && (
          <section className="mobile-work-projects" aria-label="Selected work, all projects">
            <header>
              <span>SELECTED WORK · 01–04</span>
              <h1>四个项目，一页看完</h1>
              <p>每个项目都保留真实阶段、角色、行动、结果与仍未解决的问题。</p>
            </header>
            {workProjects.map((item) => (
              <article className="mobile-work-case paper-texture" id={`mobile-case-${item.id}`} key={item.id}>
                <div className="mobile-work-cover">
                  <img src={item.image} alt="" />
                  <span>{item.number}</span>
                </div>
                <div className="mobile-work-copy">
                  <StatusStamp tone={item.id === "duoduo-wear" ? "blue" : "teal"}><T entry={item.status} /></StatusStamp>
                  <h2><BilingualText entry={item.title} primary="en" /></h2>
                  <small><BilingualText entry={item.tags} primary="en" /></small>
                  <dl>
                    <div><dt>PROJECT CONTEXT｜项目背景</dt><dd><BilingualText entry={item.copy} primary="zh" /></dd></div>
                    <div><dt>THE QUESTION｜我面对的问题</dt><dd><BilingualText entry={item.problem} primary="zh" /></dd></div>
                    <div><dt>MY ROLE｜我的角色</dt><dd><BilingualText entry={item.role} primary="zh" /></dd></div>
                    <div><dt>WHAT I DID｜我做了什么</dt><dd><BilingualText entry={item.actions} primary="zh" /></dd></div>
                    <div><dt>OUTCOME｜实际成果</dt><dd><BilingualText entry={item.outcome} primary="zh" /></dd></div>
                    <div><dt>STILL OPEN｜仍未解决</dt><dd><BilingualText entry={item.unresolved} primary="zh" /></dd></div>
                  </dl>
                  <a href="/ai#contact">DISCUSS THIS WORK｜聊聊这个项目 ↗</a>
                </div>
              </article>
            ))}
          </section>
        )}
        <div className="studio-laptop" aria-live="polite">
          <span><T entry={content.work.studioLaptopLabel} /></span>
          <small>{mode === "selected" ? `${project.number} · ${text(project.status)}` : text(workModes.find(([id]) => id === mode)![1])}</small>
          <h1>{mode === "selected" ? text(project.title) : text(workModes.find(([id]) => id === mode)![1])}</h1>
        </div>
        <motion.article className={`studio-dossier mode-${mode} paper-texture`} key={`${mode}-${project.id}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {mode === "selected" && (
            <>
              <StatusStamp><T entry={project.status} /></StatusStamp>
              <h2><BilingualText entry={project.title} primary="en" /></h2>
              <small><BilingualText entry={project.tags} primary="en" /></small>
              <p><BilingualText entry={project.copy} primary="zh" /></p>
              <dl><dt><T entry={content.work.myRole} /></dt><dd><BilingualText entry={project.role} primary="zh" /></dd></dl>
              <div className="project-picker">
                {workProjects.map((item) => <button key={item.id} type="button" className={item.id === project.id ? "is-active" : ""} onClick={() => setProjectId(item.id)}>{item.number}</button>)}
              </div>
              <button className="open-full-case" type="button" onClick={openCase}>OPEN FULL CASE <span>查看完整案例</span> ↓</button>
            </>
          )}
          {mode === "thinking" && <>
            <StatusStamp><T entry={content.work.thinkingStatus} em /></StatusStamp>
            <h2><BilingualText entry={content.work.thinkingTitleZh} primary="zh" /></h2>
            <p><BilingualText entry={content.work.thinkingCopy} primary="zh" /></p>
          </>}
          {mode === "experiments" && <>
            <StatusStamp tone="blue"><T entry={content.work.experimentsStatus} /></StatusStamp>
            <h2><BilingualText entry={content.work.experimentsTitleZh} primary="zh" /></h2>
            <p><BilingualText entry={content.work.experimentsCopy} primary="zh" /></p>
          </>}
          {mode === "collaborate" && <>
            <StatusStamp tone="red"><T entry={content.work.collaborateStatus} em /></StatusStamp>
            <h2><BilingualText entry={content.work.collaborateTitleZh} primary="zh" /></h2>
            <p><BilingualText entry={content.work.collaborateCopy} primary="zh" /></p>
            <a href="/ai#contact"><T entry={content.work.collaborateLink} em /></a>
          </>}
        </motion.article>
      </section>
      <SceneScrollCue en="SCROLL TO ABOUT" zh="向下滑，进入人生航线" />

      {openProject && (
        <section className="work-case-modal" role="dialog" aria-modal="true" aria-labelledby={`case-title-${openProject.id}`} onMouseDown={(event) => event.target === event.currentTarget && closeCase()}>
          <article id={`case-${openProject.id}`} className="full-case paper-texture is-active">
            <button className="close-full-case" type="button" onClick={closeCase} aria-label="Close full case / 关闭完整案例">×</button>
            <div className="full-case-cover"><img src={openProject.image} alt="" /><span>{openProject.number}</span></div>
            <div className="full-case-copy">
              <StatusStamp tone={openProject.id === "duoduo-wear" ? "blue" : "teal"}><T entry={openProject.status} /></StatusStamp>
              <h3 id={`case-title-${openProject.id}`}><BilingualText entry={openProject.title} primary="en" /></h3>
              <ol>
                <li><b>01 PROJECT CONTEXT｜项目背景</b><BilingualText entry={openProject.copy} primary="zh" /></li>
                <li><b>02 THE QUESTION｜我面对的问题</b><BilingualText entry={openProject.problem} primary="zh" /></li>
                <li><b>03 MY ROLE｜我的角色</b><BilingualText entry={openProject.role} primary="zh" /></li>
                <li><b>04 WHAT I DID｜我做了什么</b><BilingualText entry={openProject.actions} primary="zh" /></li>
                <li><b>05 OUTCOME｜实际成果</b><BilingualText entry={openProject.outcome} primary="zh" /></li>
                <li><b>06 STILL OPEN｜仍未解决</b><BilingualText entry={openProject.unresolved} primary="zh" /></li>
                <li><b>07 NEXT｜下一步</b><BilingualText entry={openProject.unresolved} primary="zh" /></li>
              </ol>
              <a href="/ai#contact">DISCUSS THIS WORK｜聊聊这个项目 ↗</a>
            </div>
          </article>
        </section>
      )}
    </SceneShell>
  );
}

/* ───────────────────────── ABOUT ───────────────────────── */

const voyageV5 = [
  { year: "1999–2017", title: entry("HOME", "最早的世界"), place: entry("ZHENGZHOU", "郑州"), happened: entry("I grew up inside a family, a city and a set of expectations that first defined what the world could be.", "我在家庭、城市与既有期待里长大，它们最早定义了世界的边界。"), changed: entry("I learned early that many important things had to be thought through and carried by myself.", "我很早就意识到，很多重要的事必须由自己想清楚、自己承担。"), remains: entry("A strong instinct for reality, animals, family and the invisible emotional weather of a place.", "对现实、动物、家庭，以及一个地方隐形情绪气候的敏感。"), photos: ["/photos/about-namecard.png"] },
  { year: "2018–2022", title: entry("LEAVING", "第一次离开"), place: entry("MARYLAND", "马里兰"), happened: entry("Studying in the United States gave me the first real distance from the world I already knew.", "在美国读书，让我第一次真正离开熟悉的世界。"), changed: entry("Distance became a way to see myself more clearly, not only a way to escape.", "距离开始成为看清自己的方法，而不只是离开。"), remains: entry("An international lens and the courage to begin in places where no one already knows me.", "国际视角，以及在没有人认识我的地方重新开始的勇气。"), photos: ["/photos/travel-group-mountain.jpg"] },
  { year: "2022–2024", title: entry("SINGAPORE", "体面的轨道"), place: entry("SINGAPORE", "新加坡"), happened: entry("A graduate degree, finance and ESG offered a legible and respectable career path.", "研究生、金融与 ESG 给了我一条清楚、体面的职业轨道。"), changed: entry("I learned that a life can look correct and still feel increasingly absent from the inside.", "我明白了：一种生活可以看起来完全正确，内里却越来越没有生命感。"), remains: entry("Commercial discipline, analytical training and a sharper definition of the work I do not want.", "商业纪律、分析能力，以及对自己不想要的工作更清晰的判断。"), photos: ["/photos/about-namecard.png"] },
  { year: "2024–2025", title: entry("THE LONG WAY", "漫长的路"), place: entry("CENTRAL ASIA · EUROPE · NORTH AFRICA", "中亚 · 欧洲 · 北非"), happened: entry("I left the default route and travelled overland through people, borders, hostels and long uncertainty.", "我离开默认路线，沿着陆路穿过人、边境、青旅与漫长的不确定。"), changed: entry("Freedom stopped being a mood. It became a practice with cost, risk and responsibility.", "自由不再只是情绪，它变成一种有代价、有风险、也需要负责的实践。"), remains: entry("Stories, strangers, field materials and a body that knows it can keep moving.", "故事、陌生人、田野材料，以及一个知道自己能够继续移动的身体。"), photos: ["/photos/travel-desert.jpg", "/photos/travel-eagle.jpg"] },
  { year: "2025", title: entry("THE SEA", "海与身体"), place: entry("SRI LANKA", "斯里兰卡"), happened: entry("Surfing made the body, fear, rhythm and commitment impossible to keep abstract.", "冲浪让身体、恐惧、节奏与投入都无法继续停留在抽象里。"), changed: entry("I started designing life from the body outward, not only from plans and identities inward.", "我开始从身体向外设计生活，而不是只从计划与身份向内约束自己。"), remains: entry("A long practice that ties freedom to discipline and movement to presence.", "一种把自由连接到纪律、把移动连接到当下的长期练习。"), photos: ["/photos/surf-surfing.jpg", "/photos/surf-yoga-beach.jpeg"] },
  { year: "2025–2026", title: entry("RETURNING", "回到真实项目"), place: entry("LUOYANG · ZHENGZHOU", "洛阳 · 郑州"), happened: entry("I returned to family projects, construction sites, hospitality and the slow work of making ideas survive reality.", "我回到家族项目、工程现场、青旅，以及让想法在现实里活下来的慢工作。"), changed: entry("Rootedness became less about staying put and more about taking responsibility for something real.", "扎根不再只是留在一个地方，而是对某件真实的事情承担责任。"), remains: entry("Lazyland, field methods and a much more practical creative confidence.", "懒懒岛、田野方法，以及更务实的创造自信。"), photos: ["/photos/work-lazyland-poster.jpg"] },
  { year: "2026–NOW", title: entry("ROOTS IN MOTION", "流动中的根"), place: entry("NOW", "此刻"), happened: entry("I am connecting projects, content, knowledge, AI and a mobile life into one personal company.", "我正在把项目、内容、知识、AI 与流动生活连接成一间个人公司。"), changed: entry("I no longer want freedom that erases accumulation, or roots that erase movement.", "我不再想要一种抹去积累的自由，也不想要一种抹去流动的根。"), remains: entry("The unfinished experiment: grow roots that can travel without becoming weightless.", "仍在继续的实验：让根能够随身携带，却不因此失去重量。"), photos: ["/photos/about-namecard.png"] },
] as const;

type VisitorStar = {
  id: string;
  nickname: string;
  city?: string;
  message: string;
  date: string;
  reply?: string;
  x: number;
  y: number;
};

const seedStars: VisitorStar[] = [
  { id: "light-01", nickname: "M.", city: "Shanghai", message: "在这里停了一会儿。自由和扎根原来真的可以是同一个问题。", date: "2026.07", reply: "谢谢你看见了这条暗线。", x: 52, y: 8 },
  { id: "light-02", nickname: "Lina", city: "Colombo", message: "Your route feels less like a résumé and more like a living tide.", date: "2026.07", x: 67, y: 2 },
  { id: "light-03", nickname: "阿岛", city: "Luoyang", message: "希望有一天能在懒懒岛见到真正从远方回来的人。", date: "2026.07", x: 84, y: 11 },
  { id: "light-04", nickname: "N.", city: "Bali", message: "Keep the roots moving.", date: "2026.07", reply: "I will.", x: 59, y: 25 },
];

export function AboutV5() {
  const [active, setActive] = useState(3);
  const [stars, setStars] = useState<VisitorStar[]>(seedStars);
  const [openStar, setOpenStar] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [messageLength, setMessageLength] = useState(0);
  const starFieldRef = useRef<HTMLElement | null>(null);
  const lastSparkRef = useRef(0);
  const { locale } = useLocale();
  const text = useLocaleText();
  const node = voyageV5[active];

  useEffect(() => {
    fetch("/api/visitor-messages")
      .then((response) => response.ok ? response.json() : null)
      .then((data: { messages?: VisitorStar[] } | null) => data?.messages?.length && setStars(data.messages))
      .catch(() => undefined);
  }, []);

  const wakeStars = (event: React.PointerEvent<HTMLElement>) => {
    const now = performance.now();
    if (now - lastSparkRef.current < 45 || !starFieldRef.current) return;
    lastSparkRef.current = now;
    const rect = starFieldRef.current.getBoundingClientRect();
    const spark = document.createElement("span");
    spark.className = "pointer-star";
    spark.textContent = Math.random() > 0.68 ? "✦" : "·";
    spark.style.left = `${event.clientX - rect.left}px`;
    spark.style.top = `${event.clientY - rect.top}px`;
    spark.style.setProperty("--star-drift", `${(Math.random() - 0.5) * 34}px`);
    starFieldRef.current.appendChild(spark);
    window.setTimeout(() => spark.remove(), 900);
  };

  const submitMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("sending");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/visitor-messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Submission failed");
      setSubmitState("sent");
      setMessageLength(0);
      form.reset();
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <SceneShell bare current="about" className="about-scene about-v2 about-v5" id="about">
      <header className="immersive-scene-label night-label"><span>03</span><p><T entry={content.about.sceneLabel} em /></p></header>
      <section ref={starFieldRef} onPointerMove={wakeStars} onClick={(event) => event.target === event.currentTarget && setOpenStar(null)} className="life-voyage-stage">
        <div className="life-voyage-ocean" aria-hidden="true" />
        <div className="voyage-stars" aria-hidden="true">✦　·　　　✺　　　　·　☾　　✦</div>
        <p className="voyage-opening"><span>{text(content.about.openingEn, "en")}</span>{locale === "original" && <><br />{content.about.openingZh.zh}</>}</p>

        <svg className="voyage-route-svg" viewBox="0 0 1400 650" preserveAspectRatio="none" aria-hidden="true">
          <path className="voyage-route-shadow" d="M65 470 C180 468 225 410 330 430 S500 395 600 370 S770 320 875 342 S1040 275 1130 300 S1270 235 1350 175" />
          <path className="voyage-route-glow" d="M65 470 C180 468 225 410 330 430 S500 395 600 370 S770 320 875 342 S1040 275 1130 300 S1270 235 1350 175" />
        </svg>

        <div className="voyage-nodes">
          {voyageV5.map((item, index) => (
            <button key={item.year} type="button" className={`voyage-map-node node-${index + 1} ${active === index ? "is-active" : ""}`} onClick={() => setActive(index)}>
              <span className="map-node-dot">{index % 2 === 0 ? "✦" : "☾"}</span>
              <small>{item.year}</small><b>{text(item.title, "en")}</b>{locale === "original" && <em>{item.title.zh}</em>}
            </button>
          ))}
        </div>

        <motion.article className="voyage-story-note paper-texture" key={node.year} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}>
          <header>
            <span>{node.year} · STAGE {String(active + 1).padStart(2, "0")}</span>
            <h1>{text(node.title, "en")}{locale === "original" && <b>{node.title.zh}</b>}</h1>
            <small>{text(node.place, "en")}{locale === "original" && <> · {node.place.zh}</>}</small>
          </header>
          <div className={`voyage-stage-layout ${node.photos.length === 1 ? "has-one-photo" : ""}`}>
            <figure className="voyage-stage-photo primary">
              <img src={node.photos[0]} alt={`${text(node.title)} stage`} />
              {active === 3 && <figcaption>Not all those who wander<br />are lost.<br /><small>— J.R.R. Tolkien</small></figcaption>}
            </figure>
            <dl>
              <div><dt>WHAT HAPPENED · 发生了什么</dt><dd><BilingualText entry={node.happened} primary="zh" /></dd></div>
              <div><dt>WHAT CHANGED · 它改变了什么</dt><dd><BilingualText entry={node.changed} primary="zh" /></dd></div>
              <div><dt>WHAT REMAINS · 它留下了什么</dt><dd><BilingualText entry={node.remains} primary="zh" /></dd></div>
            </dl>
            {node.photos[1] ? (
              <figure className="voyage-stage-photo secondary"><img src={node.photos[1]} alt={`${text(node.title)} stage`} /></figure>
            ) : (
              <blockquote>Freedom is not the absence of roots.<br />自由不是没有根。</blockquote>
            )}
          </div>
        </motion.article>

        <div className="visitor-star-field" aria-label="Visitor constellation">
          <div className="visitor-star-legend" aria-hidden="true"><span>✦</span><b>VISITOR STARS</b><small>点击星光查看留言</small></div>
          {stars.slice(-12).map((star) => (
            <div
              key={star.id}
              className={`visitor-star ${star.reply ? "has-reply" : ""} ${openStar === star.id ? "is-open" : ""}`}
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              onMouseLeave={() => setOpenStar(null)}
            >
              <button
                className="visitor-star-trigger"
                type="button"
                onFocus={() => setOpenStar(star.id)}
                onClick={(event) => { event.stopPropagation(); setOpenStar(openStar === star.id ? null : star.id); }}
                aria-label={`${star.nickname}: ${star.message}`}
              >
                <span>✦</span>
              </button>
              <aside>
                <button type="button" aria-label="Close message" onClick={(event) => { event.stopPropagation(); setOpenStar(null); }}>×</button>
                <b>{star.nickname}{star.city ? ` · ${star.city}` : ""}</b>
                <p>{star.message}</p>
                <small>{star.date}</small>
                {star.reply && <blockquote>DUODUO · {star.reply}</blockquote>}
              </aside>
            </div>
          ))}
        </div>

        <aside className="guestbook-panel">
          <header><span>VISITOR LIGHTS · 来访星光</span><h2>LEAVE A MESSAGE <b>/ 留言</b></h2></header>
          <form onSubmit={submitMessage}>
            <textarea name="message" required minLength={5} maxLength={200} onChange={(event) => setMessageLength(event.target.value.length)} placeholder="Write at least 5 characters…&#10;至少写 5 个字…" />
            <div className="guestbook-count">{messageLength} / 200</div>
            <div className="guestbook-meta">
              <input name="nickname" required maxLength={32} placeholder="Nickname · 昵称" />
              <input name="city" maxLength={48} placeholder="City · 城市" />
              <input name="email" type="email" placeholder="Email · 邮箱（选填）" />
            </div>
            <input name="website" className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button disabled={submitState === "sending"} type="submit">SEND / 发送</button>
          </form>
          {submitState === "sent" && <p className="guestbook-feedback">感谢你留下这束光。<br />留言将在审核后成为星空中的一颗星。</p>}
          {submitState === "error" && <p className="guestbook-feedback is-error">本地预览尚未连接留言数据库。发布前会配置审核存储。</p>}
          <div className="recent-lights">
            <b>RECENT STARS / 最近的星光</b>
            {stars.slice(0, 3).map((star) => <span key={star.id}><i>{star.nickname.slice(0, 1)}</i><strong>{star.nickname}</strong><small>{star.city} · {star.date}</small><p>{star.message}</p></span>)}
            <button type="button">VIEW ALL STARS / 查看全部星光 →</button>
          </div>
        </aside>
      </section>
    </SceneShell>
  );
}

/* ───────────────────────── SURF & WEAR ───────────────────────── */

const surfLogs = [
  [entry("Sri Lanka", "斯里兰卡"), content.surf.logEntry1Copy],
  [entry("Wave Reading", "看浪"), content.surf.logEntry2Copy],
  [entry("The Body on a Board", "板上的身体"), entry("The board exposes everything the mind tries to hide: tension, hesitation, timing and trust.", "冲浪板会暴露头脑试图藏起来的一切：紧张、犹豫、时机与信任。")],
  [entry("Fear & Commitment", "恐惧与起乘"), entry("A take-off is a small contract: once the wave arrives, half a decision is no decision.", "起乘像一个很小的契约：浪到来的那一刻，半个决定就等于没有决定。")],
  [entry("No Sea Days", "没有海的时候"), entry("Balance, mobility, breath and skating keep the practice alive when the ocean is far away.", "离海很远的时候，平衡、活动度、呼吸与滑板让练习继续活着。")],
] as const;

export function SurfV5() {
  const { locale } = useLocale();
  const text = useLocaleText();
  const wearUrl = process.env.NEXT_PUBLIC_DUODU_WEAR_URL;
  const [wearOpen, setWearOpen] = useState(false);

  return (
    <SceneShell bare current="surf" className="surf-scene surf-v5" id="surf">
      <div className="surf-ocean-photo" aria-hidden="true" />
      <LivingOceanCanvas vivid />
      <div className="surf-pointer-copy" aria-hidden="true"><span>≋</span><b>MOVE WITH THE TIDE</b><small>移动鼠标，潮汐会回应</small></div>
      <SceneScrollCue en="SCROLL TO EXPLORE" zh="向下滑，继续冲浪与穿戴" />

      <section className="surf-editorial-hero">
        <div className="surf-editorial-copy">
          <small>01　SURF & WEAR</small>
          <h1>SURF & <em>WEAR</em></h1>
          <h2>冲浪与穿戴</h2>
          <p>海是我的练习场，身体是最诚实的仪器。<br /><span>The sea is my playground, and the body is the most honest instrument.</span></p>
          <i>ride with the tide</i>
        </div>
      </section>

      <div className="surf-editorial-panels">
        <motion.section className="surf-log-panel paper-texture" whileHover={{ y: -3 }} transition={{ duration: .35 }}>
          <header><h2>SURF LOG <b>冲浪日志</b></h2><a href="/ai#contact">VIEW ALL / 查看全部 →</a></header>
          <div className="surf-log-entries">
            {surfLogs.map(([title], index) => (
              <button type="button" key={title.en}>
                <SceneIcon name={index === 0 ? "journey" : index === 1 ? "camera" : index === 2 ? "wear" : index === 3 ? "experiment" : "shell"} />
                <b>{text(title, "en")}</b>{locale === "original" && <small>{title.zh}</small>}
              </button>
            ))}
          </div>
        </motion.section>

        <motion.button id="duoduo-wear" type="button" className="surf-wear-teaser paper-texture" onClick={() => setWearOpen(true)} whileHover={{ y: -3 }} transition={{ duration: .35 }}>
          <img className="surf-wear-full-logo" src="/brand/duoduo-wear-full-logo.jpeg" alt="DUODUO WEAR full brand logo" />
          <span>DUODUO WEAR <small>品牌展览</small></span>
          <p>一个从海边生活里长出的泳衣品牌实验<br /><em>A swimwear brand experiment born from coastal life.</em></p>
          <b>ENTER THE EXHIBITION / 进入品牌展览 →</b>
          <i aria-hidden="true">SWIM<br />BATCH 01</i>
        </motion.button>
      </div>

      {wearOpen && (
        <div className="wear-detail-modal" role="dialog" aria-modal="true" aria-label="DUODUO WEAR prototype exhibition" onClick={() => setWearOpen(false)}>
          <motion.article className="wear-detail-page paper-texture" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={(event) => event.stopPropagation()}>
            <button className="wear-detail-close" type="button" onClick={() => setWearOpen(false)} aria-label="Close DUODUO WEAR exhibition">×</button>
            <div className="wear-detail-copy">
              <small>DUODUO WEAR / SWIM — PROTOTYPE BATCH 01</small>
              <img className="wear-detail-logo" src="/brand/duoduo-wear-full-logo.jpeg" alt="DUODUO WEAR" />
              <h3>泳衣不是商品，而是身体与海之间的对话。</h3>
              <p>Swimwear is not just a product. It is a dialogue between the body and the sea.</p>
              <div className="wear-detail-metrics">
                <span><b>BATCH 01</b><small>FIRST SAMPLES<br />第一批样品</small></span>
                <span><b>5–8</b><small>BODY TESTERS<br />身体测试计划</small></span>
                <span><b>03</b><small>FITTING ROUNDS<br />版型迭代</small></span>
                <span><b>SRI LANKA</b><small>FIELD TESTING<br />斯里兰卡测试</small></span>
              </div>
              <div className="wear-detail-notes">
                <section><b>CURRENT FOCUS / 当前关注</b><p>提升胸部支撑与活动空间<br />优化肩带结构<br />修正版型与舒适度</p></section>
                <section><b>NEXT STEP / 下一步</b><p>完成第二轮测试<br />扩大不同身型测试<br />准备小批量生产</p></section>
              </div>
              <div className="wear-detail-actions">
                <a href="https://www.instagram.com/duoduo_wear/" target="_blank" rel="noreferrer">INSTAGRAM · @duoduo_wear ↗</a>
                {wearUrl ? (
                  <a href={wearUrl} target="_blank" rel="noreferrer">VISIT DUODUO WEAR / 进入品牌网站 ↗</a>
                ) : (
                  <a href="/ai#contact">JOIN THE BODY TEST / 加入身体测试 →</a>
                )}
              </div>
            </div>
            <figure className="wear-detail-visual">
              <img src="/photos/duoduo-wear-flatlay-v1.png" alt="Ocean-teal DUODUO WEAR prototype arranged on a travel map with shells" />
              <figcaption>POOL AT THE SEA · FOR THE BODY</figcaption>
            </figure>
          </motion.article>
        </div>
      )}
    </SceneShell>
  );
}
