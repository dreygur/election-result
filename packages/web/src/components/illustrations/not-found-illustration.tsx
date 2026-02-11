export function NotFoundIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background shapes */}
      <circle cx="200" cy="30" r="20" fill="#F42A41" opacity="0.08" />
      <circle cx="30" cy="50" r="14" fill="#D4A017" opacity="0.1" />
      <circle cx="210" cy="170" r="12" fill="#006A4E" opacity="0.08" />

      {/* Magnifying glass */}
      <circle cx="100" cy="85" r="40" stroke="#006A4E" strokeWidth="5" fill="#006A4E" fillOpacity="0.05" />
      <line x1="128" y1="113" x2="158" y2="143" stroke="#006A4E" strokeWidth="6" strokeLinecap="round" />

      {/* Question mark inside glass */}
      <path
        d="M92 72 C92 64 100 58 108 58 C116 58 120 64 116 72 L108 80"
        stroke="#F42A41"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="108" cy="92" r="2.5" fill="#F42A41" />

      {/* Scattered papers */}
      <g opacity="0.6">
        <rect x="160" y="60" width="28" height="36" rx="3" fill="white" stroke="#006A4E" strokeWidth="1.5" transform="rotate(12 174 78)" />
        <line x1="166" y1="72" x2="180" y2="72" stroke="#006A4E" strokeWidth="1" opacity="0.3" transform="rotate(12 174 78)" />
        <line x1="166" y1="78" x2="176" y2="78" stroke="#006A4E" strokeWidth="1" opacity="0.3" transform="rotate(12 174 78)" />
      </g>

      <g opacity="0.4">
        <rect x="36" y="105" width="24" height="32" rx="3" fill="white" stroke="#D4A017" strokeWidth="1.5" transform="rotate(-8 48 121)" />
      </g>

      {/* Stars */}
      <circle cx="70" cy="150" r="3" fill="#D4A017" opacity="0.5" />
      <circle cx="180" cy="45" r="2" fill="#F42A41" opacity="0.4" />
      <circle cx="145" cy="160" r="2.5" fill="#006A4E" opacity="0.3" />

      {/* Shadow */}
      <ellipse cx="120" cy="178" rx="60" ry="5" fill="#006A4E" opacity="0.06" />
    </svg>
  );
}
