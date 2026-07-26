export type SceneIconName =
  | "wear"
  | "journey"
  | "objects"
  | "passport"
  | "camera"
  | "recorder"
  | "shell"
  | "portfolio"
  | "thinking"
  | "experiment"
  | "collaborate";

export function SceneIcon({ name, className = "" }: { name: SceneIconName; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg className={`scene-icon ${className}`} viewBox="0 0 32 32" aria-hidden="true">
      {name === "wear" && <g {...common}><path d="M6 7.5h20v17H6z" /><path d="M6 12c4-3 7 3 11 0s6 2 9-1" /><path d="M9 21c4-4 8 2 14-3" /><path d="M23 5v4M21 7h4" /></g>}
      {name === "journey" && <g {...common}><circle cx="16" cy="16" r="11" /><path d="m20.5 10.5-3 7-7 3 3-7z" /><path d="M16 2.5V5M16 27v2.5M2.5 16H5M27 16h2.5" /></g>}
      {name === "objects" && <g {...common}><path d="M6 24c1-10 4-16 10-18 6 2 9 8 10 18" /><path d="M16 7v17M11 9l3 15M21 9l-3 15M7.5 15 12 25M24.5 15 20 25" /><path d="M5 25h22" /></g>}
      {name === "passport" && <g {...common}><rect x="7" y="4.5" width="18" height="23" rx="1.5" /><path d="M11 4.5v23" /><circle cx="18" cy="14" r="4" /><path d="M14 14h8M18 10c-1.8 2.6-1.8 5.4 0 8M18 10c1.8 2.6 1.8 5.4 0 8M15 22h6" /></g>}
      {name === "camera" && <g {...common}><path d="M5 10h5l2-3h8l2 3h5v15H5z" /><circle cx="16" cy="17.5" r="5.5" /><circle cx="16" cy="17.5" r="2.5" /><path d="M23 13h1" /></g>}
      {name === "recorder" && <g {...common}><rect x="7" y="4" width="18" height="24" rx="2" /><rect x="10" y="7" width="12" height="6" rx="1" /><circle cx="13" cy="10" r="1.5" /><circle cx="19" cy="10" r="1.5" /><path d="M10 17h12M10 20h12M10 23h8" /></g>}
      {name === "shell" && <g {...common}><path d="M5 24c1-10 4.5-16 11-18 6.5 2 10 8 11 18" /><path d="M16 7v17M10 10l4 14M22 10l-4 14M6.5 16 11 25M25.5 16 21 25" /><path d="M4 25h24" /></g>}
      {name === "portfolio" && <g {...common}><path d="M4.5 9h8l2-3h6l2 3h5v17h-23z" /><path d="M4.5 14h23M13 14v3h6v-3" /></g>}
      {name === "thinking" && <g {...common}><path d="M7 5h16a2 2 0 0 1 2 2v20H9a2 2 0 0 1-2-2z" /><path d="M11 10h9M11 14h9M11 18h6" /><path d="m24 3 .8 1.8L27 5.5l-2.2.8L24 8l-.8-1.7-2.2-.8 2.2-.7z" /></g>}
      {name === "experiment" && <g {...common}><path d="M12 4h8M14 4v7L7.5 24A2 2 0 0 0 9.3 27h13.4a2 2 0 0 0 1.8-3L18 11V4" /><path d="M10 21h12M12.5 17h7" /><circle cx="14" cy="23" r="1" /></g>}
      {name === "collaborate" && <g {...common}><path d="M12.5 11 9 8l-5 5 6 6 4-4" /><path d="m19.5 11 3.5-3 5 5-6 6-4-4" /><path d="m12 13 4-4 7 7-7 7-7-7 3-3" /><path d="m13 20 2 2M17 12l-5 5" /></g>}
    </svg>
  );
}
