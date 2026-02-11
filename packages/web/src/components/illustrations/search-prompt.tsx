export function SearchPromptIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background shapes */}
      <circle cx="170" cy="30" r="18" fill="#006A4E" opacity="0.06" />
      <circle cx="25" cy="100" r="12" fill="#D4A017" opacity="0.08" />

      {/* Parliament dome outline */}
      <path
        d="M60 95 L60 70 Q60 45 100 35 Q140 45 140 70 L140 95"
        stroke="#006A4E"
        strokeWidth="2"
        fill="#006A4E"
        fillOpacity="0.04"
        strokeLinecap="round"
      />
      {/* Pillars */}
      <rect x="70" y="70" width="4" height="25" rx="2" fill="#006A4E" opacity="0.2" />
      <rect x="86" y="65" width="4" height="30" rx="2" fill="#006A4E" opacity="0.2" />
      <rect x="110" y="65" width="4" height="30" rx="2" fill="#006A4E" opacity="0.2" />
      <rect x="126" y="70" width="4" height="25" rx="2" fill="#006A4E" opacity="0.2" />
      {/* Base */}
      <rect x="55" y="95" width="90" height="6" rx="3" fill="#006A4E" opacity="0.12" />

      {/* Flag on top */}
      <line x1="100" y1="35" x2="100" y2="15" stroke="#006A4E" strokeWidth="1.5" />
      <rect x="100" y="15" width="16" height="10" rx="1" fill="#006A4E" />
      <circle cx="107" cy="20" r="3" fill="#F42A41" />

      {/* Floating search elements */}
      <circle cx="160" cy="70" r="10" stroke="#D4A017" strokeWidth="2" fill="none" opacity="0.4" />
      <line x1="167" y1="77" x2="174" y2="84" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

      {/* Decorative dots */}
      <circle cx="42" cy="60" r="2" fill="#F42A41" opacity="0.3" />
      <circle cx="165" cy="110" r="2.5" fill="#006A4E" opacity="0.2" />
      <circle cx="50" cy="30" r="3" fill="#D4A017" opacity="0.25" />

      {/* Shadow */}
      <ellipse cx="100" cy="118" rx="48" ry="4" fill="#006A4E" opacity="0.06" />
    </svg>
  );
}
