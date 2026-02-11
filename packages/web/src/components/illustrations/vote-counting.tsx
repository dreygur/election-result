export function VoteCountingIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background accents */}
      <circle cx="190" cy="25" r="16" fill="#D4A017" opacity="0.08" />
      <circle cx="20" cy="140" r="12" fill="#F42A41" opacity="0.06" />

      {/* Table surface */}
      <rect x="30" y="105" width="160" height="6" rx="3" fill="#006A4E" opacity="0.1" />

      {/* Ballot papers stacked */}
      <g opacity="0.5">
        <rect x="40" y="72" width="36" height="30" rx="3" fill="white" stroke="#006A4E" strokeWidth="1.2" transform="rotate(-5 58 87)" />
        <rect x="44" y="68" width="36" height="30" rx="3" fill="white" stroke="#006A4E" strokeWidth="1.2" transform="rotate(2 62 83)" />
        <rect x="48" y="65" width="36" height="30" rx="3" fill="white" stroke="#006A4E" strokeWidth="1.2" />
        {/* Checkmark */}
        <path d="M56 78 L60 83 L68 73" stroke="#F42A41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Lines */}
        <line x1="54" y1="88" x2="78" y2="88" stroke="#006A4E" strokeWidth="0.8" opacity="0.3" />
      </g>

      {/* Tally chart */}
      <rect x="100" y="50" width="70" height="52" rx="4" fill="white" stroke="#006A4E" strokeWidth="1.5" strokeOpacity="0.2" />
      {/* Tally marks - row 1 (green) */}
      <g stroke="#006A4E" strokeWidth="2" strokeLinecap="round" opacity="0.5">
        <line x1="110" y1="62" x2="110" y2="72" />
        <line x1="116" y1="62" x2="116" y2="72" />
        <line x1="122" y1="62" x2="122" y2="72" />
        <line x1="128" y1="62" x2="128" y2="72" />
        <line x1="107" y1="67" x2="131" y2="65" />
      </g>
      {/* Count */}
      <text x="145" y="70" fill="#006A4E" fontSize="11" fontWeight="600" opacity="0.5">5</text>

      {/* Tally marks - row 2 (red) */}
      <g stroke="#F42A41" strokeWidth="2" strokeLinecap="round" opacity="0.4">
        <line x1="110" y1="80" x2="110" y2="90" />
        <line x1="116" y1="80" x2="116" y2="90" />
        <line x1="122" y1="80" x2="122" y2="90" />
      </g>
      <text x="145" y="88" fill="#F42A41" fontSize="11" fontWeight="600" opacity="0.4">3</text>

      {/* Magnifying glass over ballots */}
      <circle cx="60" cy="55" r="14" stroke="#D4A017" strokeWidth="2" fill="white" fillOpacity="0.5" opacity="0.4" />
      <line x1="70" y1="65" x2="80" y2="75" stroke="#D4A017" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />

      {/* Hand/stamp silhouette */}
      <circle cx="150" cy="35" r="8" fill="#006A4E" opacity="0.08" />
      <text x="150" y="39" textAnchor="middle" fill="#006A4E" fontSize="10" opacity="0.2" fontWeight="bold">OK</text>

      {/* Decorative elements */}
      <circle cx="38" cy="45" r="2" fill="#D4A017" opacity="0.4" />
      <circle cx="185" cy="85" r="2.5" fill="#F42A41" opacity="0.25" />
      <circle cx="95" cy="40" r="1.5" fill="#006A4E" opacity="0.3" />

      {/* Shadow */}
      <ellipse cx="110" cy="130" rx="60" ry="4" fill="#006A4E" opacity="0.05" />
    </svg>
  );
}
