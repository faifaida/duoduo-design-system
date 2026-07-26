type ScenePlaceholderProps = {
  number: string;
  title: string;
  zh: string;
  scene: string;
  note: string;
};

export function ScenePlaceholder({ number, title, zh, scene, note }: ScenePlaceholderProps) {
  return (
    <main className="scene-placeholder">
      <div className="scene-ocean" aria-hidden="true" />
      <a href="/" className="scene-back">← THE LIVING OCEAN｜返回海面</a>
      <section>
        <span className="scene-number">{number}</span>
        <p>{scene}</p>
        <h1>{title}<b>{zh}</b></h1>
        <div className="scene-rule" />
        <p className="scene-note">{note}</p>
        <small>NEXT SCENE · 将在下一阶段与你一起展开</small>
      </section>
    </main>
  );
}
