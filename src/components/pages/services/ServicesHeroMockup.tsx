/**
 * Hero artwork: a browser-chrome dashboard with a phone frame overlapping it.
 *
 * Inline SVG rather than a raster mockup on purpose — it is ~4KB, needs no
 * network request, stays sharp at any DPR, and keeps the hero LCP text-only.
 */
export function ServicesHeroMockup() {
  return (
    <svg
      viewBox="0 0 640 500"
      role="img"
      aria-label="Illustration of a website dashboard in a browser window with a mobile layout beside it"
      className="h-auto w-full"
    >
      <defs>
        <linearGradient id="svcScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f2f5c" />
          <stop offset="100%" stopColor="#0a2144" />
        </linearGradient>
        <linearGradient id="svcAccent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2094f3" />
          <stop offset="100%" stopColor="#17cfcf" />
        </linearGradient>
        <linearGradient id="svcWarm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f8c532" />
          <stop offset="100%" stopColor="#f78d00" />
        </linearGradient>
        <linearGradient id="svcArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#17cfcf" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#17cfcf" stopOpacity="0" />
        </linearGradient>
        <filter id="svcSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="18"
            stdDeviation="22"
            floodColor="#02132b"
            floodOpacity="0.55"
          />
        </filter>
      </defs>

      {/* Browser window */}
      <g filter="url(#svcSoft)">
        <rect
          x="24"
          y="34"
          width="560"
          height="376"
          rx="18"
          fill="url(#svcScreen)"
          stroke="rgba(255,255,255,0.14)"
        />

        {/* Title bar */}
        <path
          d="M24 52a18 18 0 0 1 18-18h524a18 18 0 0 1 18 18v22H24z"
          fill="rgba(255,255,255,0.07)"
        />
        <circle cx="50" cy="54" r="5" fill="#ff5f57" />
        <circle cx="68" cy="54" r="5" fill="#febc2e" />
        <circle cx="86" cy="54" r="5" fill="#28c840" />
        <rect
          x="112"
          y="45"
          width="220"
          height="18"
          rx="9"
          fill="rgba(255,255,255,0.10)"
        />
        <rect
          x="124"
          y="52"
          width="86"
          height="4"
          rx="2"
          fill="rgba(255,255,255,0.32)"
        />

        {/* Sidebar */}
        <rect
          x="24"
          y="74"
          width="108"
          height="336"
          fill="rgba(255,255,255,0.04)"
        />
        <rect x="44" y="98" width="52" height="8" rx="4" fill="url(#svcAccent)" />
        {[130, 156, 182, 208, 234].map((y, index) => (
          <g key={y}>
            <rect
              x="44"
              y={y}
              width="10"
              height="10"
              rx="3"
              fill={index === 1 ? "#17cfcf" : "rgba(255,255,255,0.28)"}
            />
            <rect
              x="62"
              y={y + 2}
              width={index === 1 ? 44 : 38}
              height="6"
              rx="3"
              fill={index === 1 ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.22)"}
            />
          </g>
        ))}

        {/* Header row */}
        <rect x="156" y="98" width="150" height="12" rx="6" fill="rgba(255,255,255,0.72)" />
        <rect x="156" y="118" width="96" height="7" rx="3.5" fill="rgba(255,255,255,0.26)" />
        <rect x="452" y="96" width="104" height="30" rx="15" fill="url(#svcAccent)" />

        {/* KPI tiles */}
        {[
          { x: 156, w: 122, accent: "url(#svcAccent)" },
          { x: 292, w: 122, accent: "url(#svcWarm)" },
          { x: 428, w: 128, accent: "url(#svcAccent)" },
        ].map((tile) => (
          <g key={tile.x}>
            <rect
              x={tile.x}
              y="146"
              width={tile.w}
              height="66"
              rx="12"
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.10)"
            />
            <rect x={tile.x + 14} y="162" width="44" height="6" rx="3" fill="rgba(255,255,255,0.28)" />
            <rect x={tile.x + 14} y="178" width="58" height="14" rx="4" fill="rgba(255,255,255,0.82)" />
            <rect x={tile.x + 14} y="198" width="30" height="5" rx="2.5" fill={tile.accent} />
          </g>
        ))}

        {/* Area chart */}
        <rect
          x="156"
          y="228"
          width="258"
          height="160"
          rx="12"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.10)"
        />
        <path
          d="M176 348c22-14 34-42 56-46s34 26 56 14 34-48 54-56v78H176z"
          fill="url(#svcArea)"
        />
        <path
          d="M176 348c22-14 34-42 56-46s34 26 56 14 34-48 54-56"
          fill="none"
          stroke="#17cfcf"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="342" cy="260" r="5" fill="#ffffff" />
        <circle cx="342" cy="260" r="9" fill="#17cfcf" fillOpacity="0.28" />

        {/* Bar chart */}
        <rect
          x="428"
          y="228"
          width="128"
          height="160"
          rx="12"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.10)"
        />
        {[
          { x: 446, h: 44 },
          { x: 468, h: 72 },
          { x: 490, h: 58 },
          { x: 512, h: 96 },
          { x: 534, h: 66 },
        ].map((bar, index) => (
          <rect
            key={bar.x}
            x={bar.x}
            y={368 - bar.h}
            width="12"
            height={bar.h}
            rx="6"
            fill={index === 3 ? "url(#svcWarm)" : "rgba(23,207,207,0.55)"}
          />
        ))}
      </g>

      {/* Phone frame */}
      <g filter="url(#svcSoft)">
        <rect
          x="470"
          y="250"
          width="150"
          height="228"
          rx="24"
          fill="#0a2144"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="2"
        />
        <rect x="524" y="262" width="42" height="6" rx="3" fill="rgba(255,255,255,0.25)" />
        <rect x="486" y="284" width="118" height="62" rx="12" fill="url(#svcAccent)" fillOpacity="0.85" />
        <rect x="498" y="302" width="62" height="8" rx="4" fill="rgba(255,255,255,0.85)" />
        <rect x="498" y="318" width="86" height="6" rx="3" fill="rgba(255,255,255,0.55)" />
        {[358, 382, 406].map((y) => (
          <g key={y}>
            <rect x="486" y={y} width="118" height="16" rx="8" fill="rgba(255,255,255,0.08)" />
            <rect x="494" y={y + 5} width={y === 382 ? 70 : 52} height="6" rx="3" fill="rgba(255,255,255,0.3)" />
          </g>
        ))}
        <rect x="486" y="436" width="118" height="26" rx="13" fill="url(#svcWarm)" />
      </g>
    </svg>
  );
}
