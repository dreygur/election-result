export function PollingStationIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background shapes */}
      <circle cx="175" cy="20" r="14" fill="#F42A41" opacity="0.07" />
      <circle cx="20" cy="130" r="10" fill="#D4A017" opacity="0.08" />

      {/* Building */}
      <rect x="45" y="50" width="110" height="70" rx="4" fill="#006A4E" fillOpacity="0.06" stroke="#006A4E" strokeWidth="1.5" strokeOpacity="0.15" />

      {/* Roof */}
      <path
        d="M38 50 L100 20 L162 50"
        stroke="#006A4E"
        strokeWidth="2"
        strokeOpacity="0.2"
        strokeLinecap="round"
        fill="#006A4E"
        fillOpacity="0.04"
      />

      {/* Flag on roof */}
      <line x1="100" y1="20" x2="100" y2="6" stroke="#006A4E" strokeWidth="1.5" opacity="0.3" />
      <rect x="101" y="6" width="14" height="9" rx="1" fill="#006A4E" />
      <circle cx="107" cy="10.5" r="2.5" fill="#F42A41" />

      {/* Door */}
      <rect x="85" y="85" width="30" height="35" rx="3" fill="#006A4E" fillOpacity="0.1" stroke="#006A4E" strokeWidth="1" strokeOpacity="0.15" />
      <circle cx="110" cy="103" r="2" fill="#D4A017" opacity="0.4" />

      {/* Windows */}
      <rect x="55" y="60" width="18" height="16" rx="2" fill="white" stroke="#006A4E" strokeWidth="1" strokeOpacity="0.15" />
      <line x1="64" y1="60" x2="64" y2="76" stroke="#006A4E" strokeWidth="0.5" opacity="0.15" />
      <line x1="55" y1="68" x2="73" y2="68" stroke="#006A4E" strokeWidth="0.5" opacity="0.15" />

      <rect x="127" y="60" width="18" height="16" rx="2" fill="white" stroke="#006A4E" strokeWidth="1" strokeOpacity="0.15" />
      <line x1="136" y1="60" x2="136" y2="76" stroke="#006A4E" strokeWidth="0.5" opacity="0.15" />
      <line x1="127" y1="68" x2="145" y2="68" stroke="#006A4E" strokeWidth="0.5" opacity="0.15" />

      {/* Queue of voters (abstract) */}
      <g opacity="0.2">
        <circle cx="55" cy="132" r="4" fill="#006A4E" />
        <rect x="52" y="136" width="6" height="3" rx="2" fill="#006A4E" />

        <circle cx="42" cy="134" r="3.5" fill="#F42A41" />
        <rect x="39.5" y="137.5" width="5" height="3" rx="2" fill="#F42A41" />

        <circle cx="30" cy="133" r="3.5" fill="#D4A017" />
        <rect x="27.5" y="136.5" width="5" height="3" rx="2" fill="#D4A017" />

        <circle cx="18" cy="135" r="3" fill="#006A4E" />
        <rect x="15.5" y="138" width="5" height="3" rx="2" fill="#006A4E" />
      </g>

      {/* Ballot symbol next to door */}
      <rect x="120" y="92" width="8" height="10" rx="1" fill="white" stroke="#006A4E" strokeWidth="0.8" opacity="0.4" />
      <path d="M122 97 L124 99 L127 95" stroke="#F42A41" strokeWidth="1" strokeLinecap="round" opacity="0.5" fill="none" />

      {/* Ground line */}
      <rect x="30" y="120" width="140" height="2" rx="1" fill="#006A4E" opacity="0.08" />

      {/* Shadow */}
      <ellipse cx="100" cy="145" rx="55" ry="4" fill="#006A4E" opacity="0.04" />
    </svg>
  );
}
