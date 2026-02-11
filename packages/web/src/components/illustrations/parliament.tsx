export function ParliamentIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background shapes */}
      <circle cx="185" cy="30" r="18" fill="#F42A41" opacity="0.07" />
      <circle cx="25" cy="140" r="12" fill="#D4A017" opacity="0.1" />

      {/* Main dome */}
      <path
        d="M50 120 L50 85 Q50 45 110 30 Q170 45 170 85 L170 120"
        fill="#006A4E"
        fillOpacity="0.06"
        stroke="#006A4E"
        strokeWidth="2"
        strokeOpacity="0.2"
      />

      {/* Inner dome detail */}
      <path
        d="M70 120 L70 90 Q70 60 110 48 Q150 60 150 90 L150 120"
        fill="#006A4E"
        fillOpacity="0.04"
        stroke="#006A4E"
        strokeWidth="1"
        strokeOpacity="0.12"
      />

      {/* Pillars */}
      <rect x="62" y="88" width="5" height="32" rx="2.5" fill="#006A4E" opacity="0.2" />
      <rect x="82" y="78" width="5" height="42" rx="2.5" fill="#006A4E" opacity="0.25" />
      <rect x="97" y="72" width="5" height="48" rx="2.5" fill="#006A4E" opacity="0.2" />
      <rect x="118" y="72" width="5" height="48" rx="2.5" fill="#006A4E" opacity="0.2" />
      <rect x="133" y="78" width="5" height="42" rx="2.5" fill="#006A4E" opacity="0.25" />
      <rect x="153" y="88" width="5" height="32" rx="2.5" fill="#006A4E" opacity="0.2" />

      {/* Base platform */}
      <rect x="42" y="120" width="136" height="8" rx="4" fill="#006A4E" opacity="0.12" />
      <rect x="36" y="128" width="148" height="5" rx="2.5" fill="#006A4E" opacity="0.08" />

      {/* Flag on top */}
      <line x1="110" y1="30" x2="110" y2="8" stroke="#006A4E" strokeWidth="1.5" opacity="0.3" />
      <g>
        <rect x="111" y="8" width="18" height="12" rx="1.5" fill="#006A4E" />
        <circle cx="119" cy="14" r="3.5" fill="#F42A41" />
      </g>

      {/* Decorative stars */}
      <g fill="#D4A017">
        <circle cx="60" cy="50" r="2" opacity="0.4" />
        <circle cx="160" cy="50" r="2" opacity="0.4" />
        <circle cx="110" cy="22" r="1.5" opacity="0.5" />
      </g>

      {/* Podium/entrance */}
      <rect x="100" y="112" width="20" height="8" rx="2" fill="#F42A41" opacity="0.1" />

      {/* People silhouettes (abstract dots) */}
      <g fill="#006A4E" opacity="0.15">
        <circle cx="80" cy="145" r="3" />
        <circle cx="92" cy="143" r="3" />
        <circle cx="104" cy="144" r="3" />
        <circle cx="116" cy="143" r="3" />
        <circle cx="128" cy="145" r="3" />
        <circle cx="140" cy="144" r="3" />
      </g>

      {/* Shadow */}
      <ellipse cx="110" cy="155" rx="60" ry="4" fill="#006A4E" opacity="0.05" />
    </svg>
  );
}
