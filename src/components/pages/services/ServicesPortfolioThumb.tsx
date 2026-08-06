import type { ServicesPortfolioVariant } from "@/utils/constant";

type ServicesPortfolioThumbProps = {
  variant: ServicesPortfolioVariant;
  /** Also announced by the surrounding card heading, so keep it descriptive. */
  label: string;
};

type Palette = {
  from: string;
  via: string;
  to: string;
  accent: string;
  accent2: string;
};

/**
 * One colour story per project so the grid reads as six distinct pieces of work
 * rather than six recolours of the same wireframe.
 */
const PALETTE: Record<ServicesPortfolioVariant, Palette> = {
  storefront: { from: "#161a4d", via: "#241a63", to: "#3b1a5c", accent: "#22d3ee", accent2: "#c084fc" },
  corporate: { from: "#05203f", via: "#093358", to: "#0b4d86", accent: "#38bdf8", accent2: "#818cf8" },
  healthcare: { from: "#04262f", via: "#065547", to: "#07684f", accent: "#34d399", accent2: "#22d3ee" },
  restaurant: { from: "#2a1309", via: "#4d2610", to: "#6b3410", accent: "#fbbf24", accent2: "#fb923c" },
  dashboard: { from: "#0a0f2e", via: "#221055", to: "#3a1163", accent: "#a78bfa", accent2: "#22d3ee" },
  education: { from: "#04203c", via: "#0a4260", to: "#0d5c73", accent: "#38bdf8", accent2: "#5eead4" },
};

/**
 * Variant-driven project artwork. Inline SVG keeps the portfolio grid at zero
 * image requests, which is what actually protects the page weight here — six
 * raster screenshots would dominate it.
 */
export function ServicesPortfolioThumb({
  variant,
  label,
}: ServicesPortfolioThumbProps) {
  const { from, via, to, accent, accent2 } = PALETTE[variant];

  // Per-variant ids: six of these render on one page and must not collide.
  const id = (name: string) => `svc-${variant}-${name}`;
  const bg = id("bg");
  const sheen = id("sheen");
  const brand = id("brand");
  const photo = id("photo");
  const glow = id("glow");
  const blur = id("blur");
  const fade = id("fade");

  return (
    <svg
      viewBox="0 0 480 300"
      role="img"
      aria-label={label}
      className="svc-scale-target h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="52%" stopColor={via} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <linearGradient id={brand} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={accent2} />
        </linearGradient>
        <linearGradient id={photo} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent2} stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={sheen} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={fade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
        </linearGradient>
        <filter id={blur} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="38" />
        </filter>
        <filter id={glow} x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="480" height="300" fill={`url(#${bg})`} />

      {/* Ambient bloom — gives the flat panels some atmosphere. */}
      <g filter={`url(#${blur})`} opacity="0.5">
        <ellipse cx="70" cy="40" rx="130" ry="90" fill={accent} />
        <ellipse cx="430" cy="270" rx="140" ry="100" fill={accent2} />
      </g>

      {/* Browser chrome */}
      <g>
        <rect width="480" height="26" fill="rgba(255,255,255,0.07)" />
        <rect y="25" width="480" height="1" fill="rgba(255,255,255,0.10)" />
        <circle cx="18" cy="13" r="3.4" fill="rgba(255,255,255,0.34)" />
        <circle cx="30" cy="13" r="3.4" fill="rgba(255,255,255,0.20)" />
        <circle cx="42" cy="13" r="3.4" fill="rgba(255,255,255,0.20)" />
        <rect x="60" y="6" width="150" height="14" rx="7" fill="rgba(255,255,255,0.09)" />
        <rect x="68" y="11" width="6" height="4" rx="2" fill={accent} opacity="0.85" />
        <rect x="80" y="11.5" width="70" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
      </g>

      {variant === "storefront" ? (
        <g>
          {/* Store header */}
          <circle cx="34" cy="48" r="9" fill={`url(#${brand})`} />
          <rect x="50" y="44" width="52" height="8" rx="4" fill="rgba(255,255,255,0.65)" />
          <rect x="196" y="40" width="150" height="17" rx="8.5" fill="rgba(255,255,255,0.08)" />
          <circle cx="424" cy="48" r="13" fill="rgba(255,255,255,0.08)" />
          <path d="M419 45h9l-1.4 7h-6.2z" fill="rgba(255,255,255,0.6)" />
          <circle cx="433" cy="40" r="6" fill={accent} filter={`url(#${glow})`} />

          {/* Promo banner */}
          <rect x="22" y="70" width="436" height="72" rx="14" fill={`url(#${brand})`} opacity="0.9" />
          <rect x="22" y="70" width="436" height="72" rx="14" fill={`url(#${sheen})`} />
          <rect x="42" y="88" width="128" height="12" rx="6" fill="rgba(255,255,255,0.92)" />
          <rect x="42" y="108" width="182" height="7" rx="3.5" fill="rgba(255,255,255,0.6)" />
          <rect x="42" y="124" width="66" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
          <rect x="366" y="94" width="72" height="26" rx="13" fill="rgba(255,255,255,0.95)" />
          <rect x="382" y="105" width="40" height="4" rx="2" fill={via} />

          {/* Product cards */}
          {[22, 167, 312].map((x, index) => (
            <g key={x}>
              <rect x={x} y="158" width="146" height="126" rx="14" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.12)" />
              <rect x={x + 12} y="170" width="122" height="62" rx="10" fill={`url(#${photo})`} />
              <rect x={x + 12} y="170" width="122" height="62" rx="10" fill={`url(#${sheen})`} />
              {index === 1 ? (
                <g>
                  <rect x={x + 88} y="178" width="38" height="14" rx="7" fill={accent} />
                  <rect x={x + 96} y="184" width="22" height="3" rx="1.5" fill={via} />
                </g>
              ) : null}
              <rect x={x + 12} y="242" width="84" height="7" rx="3.5" fill="rgba(255,255,255,0.5)" />
              <rect x={x + 12} y="256" width="52" height="6" rx="3" fill="rgba(255,255,255,0.22)" />
              {[0, 1, 2, 3, 4].map((star) => (
                <circle key={star} cx={x + 16 + star * 9} cy="272" r="3" fill={star < 4 ? accent : "rgba(255,255,255,0.2)"} />
              ))}
              <rect x={x + 100} y="250" width="34" height="16" rx="8" fill={`url(#${brand})`} />
            </g>
          ))}
        </g>
      ) : null}

      {variant === "corporate" ? (
        <g>
          {/* Nav */}
          <rect x="22" y="42" width="60" height="9" rx="4.5" fill="rgba(255,255,255,0.7)" />
          {[220, 268, 316].map((x) => (
            <rect key={x} x={x} y="44" width="34" height="5" rx="2.5" fill="rgba(255,255,255,0.28)" />
          ))}
          <rect x="386" y="38" width="72" height="20" rx="10" fill={`url(#${brand})`} />

          {/* Hero */}
          <rect x="22" y="74" width="262" height="126" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.10)" />
          <rect x="42" y="94" width="200" height="15" rx="7.5" fill="rgba(255,255,255,0.85)" />
          <rect x="42" y="117" width="158" height="15" rx="7.5" fill="rgba(255,255,255,0.5)" />
          <rect x="42" y="146" width="216" height="6" rx="3" fill="rgba(255,255,255,0.22)" />
          <rect x="42" y="158" width="180" height="6" rx="3" fill="rgba(255,255,255,0.22)" />
          <rect x="42" y="176" width="86" height="14" rx="7" fill={accent} />

          {/* Globe / regions */}
          <rect x="298" y="74" width="160" height="126" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.10)" />
          <circle cx="378" cy="137" r="44" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
          <ellipse cx="378" cy="137" rx="18" ry="44" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <path d="M334 137h88M340 115h76M340 159h76" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          {[
            [356, 118],
            [396, 128],
            [370, 152],
            [404, 158],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" fill={accent} filter={`url(#${glow})`} />
          ))}

          {/* Stat row */}
          {[22, 172, 322].map((x, index) => (
            <g key={x}>
              <rect x={x} y="216" width="136" height="66" rx="12" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.10)" />
              <rect x={x + 16} y="232" width={48 - index * 6} height="14" rx="4" fill="rgba(255,255,255,0.88)" />
              <rect x={x + 16} y="255" width="72" height="6" rx="3" fill="rgba(255,255,255,0.26)" />
              <rect x={x + 16} y="267" width="30" height="4" rx="2" fill={accent} />
            </g>
          ))}
        </g>
      ) : null}

      {variant === "healthcare" ? (
        <g>
          <rect x="22" y="40" width="96" height="9" rx="4.5" fill="rgba(255,255,255,0.7)" />
          <rect x="380" y="36" width="78" height="20" rx="10" fill={`url(#${brand})`} />

          {/* Calendar */}
          <rect x="22" y="68" width="252" height="212" rx="14" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.12)" />
          <rect x="40" y="84" width="72" height="8" rx="4" fill="rgba(255,255,255,0.6)" />
          <circle cx="238" cy="88" r="9" fill="rgba(255,255,255,0.08)" />
          {[0, 1, 2, 3, 4, 5, 6].map((column) => (
            <rect key={column} x={40 + column * 32} y="104" width="14" height="4" rx="2" fill="rgba(255,255,255,0.22)" />
          ))}
          {[0, 1, 2, 3, 4].map((row) =>
            [0, 1, 2, 3, 4, 5, 6].map((column) => {
              const isSelected = row === 2 && column === 3;
              const isBooked = (row * 7 + column) % 6 === 2;
              return (
                <g key={`${row}-${column}`}>
                  <rect
                    x={38 + column * 32}
                    y={118 + row * 32}
                    width="26"
                    height="26"
                    rx="8"
                    fill={
                      isSelected
                        ? accent
                        : isBooked
                          ? "rgba(52,211,153,0.20)"
                          : "rgba(255,255,255,0.06)"
                    }
                  />
                  {isBooked && !isSelected ? (
                    <circle cx={51 + column * 32} cy={137 + row * 32} r="2" fill={accent} />
                  ) : null}
                </g>
              );
            }),
          )}

          {/* Appointment panel */}
          <rect x="290" y="68" width="168" height="212" rx="14" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.12)" />
          {[86, 148].map((y, index) => (
            <g key={y}>
              <rect x="304" y={y} width="140" height="52" rx="11" fill="rgba(255,255,255,0.06)" />
              <circle cx="326" cy={y + 26} r="14" fill={`url(#${brand})`} opacity={index === 0 ? 1 : 0.6} />
              <rect x="348" y={y + 16} width="66" height="7" rx="3.5" fill="rgba(255,255,255,0.55)" />
              <rect x="348" y={y + 30} width="44" height="5" rx="2.5" fill="rgba(255,255,255,0.25)" />
              <circle cx="430" cy={y + 14} r="4" fill={index === 0 ? accent : "rgba(255,255,255,0.2)"} />
            </g>
          ))}
          {/* Vitals sparkline */}
          <rect x="304" y="214" width="140" height="52" rx="11" fill="rgba(255,255,255,0.06)" />
          <path
            d="M316 250l14-12 12 8 14-20 12 14 14-18 14 10 14-6"
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${glow})`}
          />
        </g>
      ) : null}

      {variant === "restaurant" ? (
        <g>
          {/* Hero plate */}
          <rect x="22" y="40" width="436" height="112" rx="14" fill={`url(#${photo})`} />
          <rect x="22" y="40" width="436" height="112" rx="14" fill={`url(#${sheen})`} />
          <circle cx="366" cy="96" r="44" fill={accent} opacity="0.22" />
          <circle cx="366" cy="96" r="30" fill={accent2} opacity="0.28" />
          <circle cx="366" cy="96" r="16" fill={accent} opacity="0.4" />
          <rect x="44" y="66" width="150" height="16" rx="8" fill="rgba(255,255,255,0.92)" />
          <rect x="44" y="92" width="106" height="8" rx="4" fill="rgba(255,255,255,0.55)" />
          <rect x="44" y="114" width="94" height="22" rx="11" fill={accent} />
          <rect x="60" y="123" width="62" height="4" rx="2" fill="#2a1309" />

          {/* Menu rows */}
          {[168, 208, 248].map((y, index) => (
            <g key={y}>
              <rect x="22" y={y} width="52" height="32" rx="9" fill={`url(#${photo})`} opacity={1 - index * 0.15} />
              <rect x="86" y={y + 5} width={128 - index * 16} height="8" rx="4" fill="rgba(255,255,255,0.6)" />
              <rect x="86" y={y + 19} width={168 - index * 12} height="5" rx="2.5" fill="rgba(255,255,255,0.24)" />
              <path
                d={`M${266 - index * 12} ${y + 11}h${140 + index * 12}`}
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
              <rect x="418" y={y + 4} width="40" height="18" rx="9" fill="rgba(255,255,255,0.10)" />
              <rect x="428" y={y + 11} width="20" height="4" rx="2" fill={accent} />
            </g>
          ))}
        </g>
      ) : null}

      {variant === "dashboard" ? (
        <g>
          {/* Sidebar */}
          <rect x="0" y="26" width="76" height="274" fill="rgba(255,255,255,0.05)" />
          <circle cx="26" cy="50" r="9" fill={`url(#${brand})`} />
          {[76, 104, 132, 160, 188].map((y, index) => (
            <g key={y}>
              <rect x="16" y={y} width="9" height="9" rx="3" fill={index === 1 ? accent : "rgba(255,255,255,0.26)"} />
              <rect x="31" y={y + 2} width={index === 1 ? 30 : 24} height="5" rx="2.5" fill={index === 1 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)"} />
            </g>
          ))}

          {/* KPI tiles */}
          {[90, 218, 346].map((x, index) => (
            <g key={x}>
              <rect x={x} y="42" width="118" height="60" rx="12" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.11)" />
              <rect x={x + 14} y="56" width="38" height="5" rx="2.5" fill="rgba(255,255,255,0.28)" />
              <rect x={x + 14} y="68" width="52" height="13" rx="4" fill="rgba(255,255,255,0.88)" />
              <rect x={x + 14} y="88" width="26" height="4" rx="2" fill={index === 1 ? accent2 : accent} />
              <path
                d={`M${x + 74} 84l10-10 8 6 12-14`}
                fill="none"
                stroke={index === 1 ? accent2 : accent}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          ))}

          {/* Area chart */}
          <rect x="90" y="116" width="246" height="168" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.11)" />
          {[160, 196, 232].map((y) => (
            <path key={y} d={`M104 ${y}h218`} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          ))}
          <path
            d="M106 258c26-8 40-46 66-54s44 30 68 16 40-52 62-62v100H106z"
            fill={accent}
            opacity="0.16"
          />
          <path
            d="M106 258c26-8 40-46 66-54s44 30 68 16 40-52 62-62"
            fill="none"
            stroke={accent}
            strokeWidth="2.8"
            strokeLinecap="round"
            filter={`url(#${glow})`}
          />
          <circle cx="302" cy="158" r="4.5" fill="#ffffff" />

          {/* Donut + legend */}
          <rect x="346" y="116" width="118" height="168" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.11)" />
          <circle cx="405" cy="176" r="34" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="13" />
          <circle
            cx="405"
            cy="176"
            r="34"
            fill="none"
            stroke={accent}
            strokeWidth="13"
            strokeDasharray="112 214"
            strokeLinecap="round"
            transform="rotate(-90 405 176)"
          />
          <circle
            cx="405"
            cy="176"
            r="34"
            fill="none"
            stroke={accent2}
            strokeWidth="13"
            strokeDasharray="58 214"
            strokeDashoffset="-118"
            strokeLinecap="round"
            transform="rotate(-90 405 176)"
          />
          {[232, 250, 268].map((y, index) => (
            <g key={y}>
              <circle cx="366" cy={y} r="4" fill={index === 0 ? accent : index === 1 ? accent2 : "rgba(255,255,255,0.28)"} />
              <rect x="378" y={y - 2.5} width={index === 0 ? 62 : 46} height="5" rx="2.5" fill="rgba(255,255,255,0.24)" />
            </g>
          ))}
        </g>
      ) : null}

      {variant === "education" ? (
        <g>
          {/* Player */}
          <rect x="22" y="42" width="288" height="164" rx="14" fill={`url(#${photo})`} />
          <rect x="22" y="42" width="288" height="164" rx="14" fill={`url(#${sheen})`} />
          <circle cx="166" cy="116" r="30" fill="rgba(0,0,0,0.35)" />
          <circle cx="166" cy="116" r="30" fill="none" stroke={accent} strokeWidth="2" filter={`url(#${glow})`} />
          <path d="M158 104l22 12-22 12z" fill="#ffffff" />
          <rect x="38" y="182" width="256" height="5" rx="2.5" fill="rgba(255,255,255,0.22)" />
          <rect x="38" y="182" width="148" height="5" rx="2.5" fill={accent} />
          <circle cx="186" cy="184.5" r="5" fill="#ffffff" />

          {/* Lesson list */}
          <rect x="326" y="42" width="132" height="164" rx="14" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.12)" />
          {[0, 1, 2, 3].map((row) => {
            const isDone = row < 2;
            const isCurrent = row === 2;
            return (
              <g key={row}>
                {isCurrent ? (
                  <rect x="336" y={60 + row * 36 - 12} width="112" height="30" rx="9" fill="rgba(255,255,255,0.07)" />
                ) : null}
                <circle
                  cx="352"
                  cy={60 + row * 36}
                  r="9"
                  fill={isDone ? accent : "rgba(255,255,255,0.10)"}
                  stroke={isCurrent ? accent : "none"}
                  strokeWidth="1.5"
                />
                {isDone ? (
                  <path
                    d={`M348 ${60 + row * 36}l3 3 5-6`}
                    fill="none"
                    stroke="#04203c"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : null}
                <rect x="370" y={56 + row * 36} width={isCurrent ? 66 : 52} height="6" rx="3" fill="rgba(255,255,255,0.4)" />
                <rect x="370" y={66 + row * 36} width="34" height="4" rx="2" fill="rgba(255,255,255,0.18)" />
              </g>
            );
          })}

          {/* Progress footer */}
          <rect x="22" y="222" width="436" height="58" rx="14" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.11)" />
          <circle cx="54" cy="251" r="18" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="6" />
          <circle
            cx="54"
            cy="251"
            r="18"
            fill="none"
            stroke={accent2}
            strokeWidth="6"
            strokeDasharray="74 113"
            strokeLinecap="round"
            transform="rotate(-90 54 251)"
          />
          <rect x="88" y="238" width="120" height="8" rx="4" fill="rgba(255,255,255,0.5)" />
          <rect x="88" y="254" width="176" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
          <rect x="368" y="240" width="74" height="22" rx="11" fill={`url(#${brand})`} />
        </g>
      ) : null}

      {/* Bottom fade keeps the card footer visually anchored to the artwork. */}
      <rect y="200" width="480" height="100" fill={`url(#${fade})`} />
    </svg>
  );
}
