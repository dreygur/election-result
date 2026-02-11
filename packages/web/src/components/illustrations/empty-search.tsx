export function EmptySearchIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background shapes */}
      <circle cx="160" cy="25" r="16" fill="#D4A017" opacity="0.1" />
      <circle cx="30" cy="120" r="10" fill="#F42A41" opacity="0.08" />

      {/* Document stack */}
      <g opacity="0.2" transform="rotate(-3 80 70)">
        <rect x="55" y="38" width="50" height="64" rx="4" fill="#006A4E" fillOpacity="0.3" stroke="#006A4E" strokeWidth="1.5" />
      </g>
      <rect x="60" y="34" width="50" height="64" rx="4" fill="white" stroke="#006A4E" strokeWidth="1.5" />

      {/* Lines on document */}
      <line x1="68" y1="48" x2="102" y2="48" stroke="#006A4E" strokeWidth="1.5" opacity="0.2" />
      <line x1="68" y1="56" x2="98" y2="56" stroke="#006A4E" strokeWidth="1.5" opacity="0.15" />
      <line x1="68" y1="64" x2="94" y2="64" stroke="#006A4E" strokeWidth="1.5" opacity="0.1" />

      {/* Magnifying glass */}
      <circle cx="130" cy="75" r="26" stroke="#006A4E" strokeWidth="3.5" fill="white" />
      <line x1="149" y1="94" x2="168" y2="113" stroke="#006A4E" strokeWidth="4.5" strokeLinecap="round" />

      {/* X inside magnifying glass */}
      <path d="M122 67 L138 83" stroke="#F42A41" strokeWidth="3" strokeLinecap="round" />
      <path d="M138 67 L122 83" stroke="#F42A41" strokeWidth="3" strokeLinecap="round" />

      {/* Decorative dots */}
      <circle cx="45" cy="50" r="2.5" fill="#D4A017" opacity="0.5" />
      <circle cx="155" cy="35" r="2" fill="#006A4E" opacity="0.3" />
      <circle cx="170" cy="100" r="3" fill="#F42A41" opacity="0.15" />

      {/* Shadow */}
      <ellipse cx="110" cy="140" rx="50" ry="4" fill="#006A4E" opacity="0.06" />
    </svg>
  );
}
