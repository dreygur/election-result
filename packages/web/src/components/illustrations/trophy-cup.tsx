export function TrophyCupIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background accents */}
      <circle cx="150" cy="30" r="18" fill="#F42A41" opacity="0.06" />
      <circle cx="25" cy="130" r="12" fill="#006A4E" opacity="0.06" />

      {/* Trophy cup body */}
      <path
        d="M60 50 L60 90 Q60 115 90 120 Q120 115 120 90 L120 50 Z"
        fill="#D4A017"
        fillOpacity="0.15"
        stroke="#D4A017"
        strokeWidth="2"
        strokeOpacity="0.3"
      />

      {/* Trophy cup shine */}
      <path
        d="M70 55 L70 85 Q70 105 85 110"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Left handle */}
      <path
        d="M60 58 C40 58 32 70 32 82 C32 94 42 100 60 98"
        stroke="#D4A017"
        strokeWidth="2"
        strokeOpacity="0.3"
        fill="none"
      />

      {/* Right handle */}
      <path
        d="M120 58 C140 58 148 70 148 82 C148 94 138 100 120 98"
        stroke="#D4A017"
        strokeWidth="2"
        strokeOpacity="0.3"
        fill="none"
      />

      {/* Stem */}
      <rect x="84" y="120" width="12" height="16" rx="2" fill="#D4A017" opacity="0.2" />

      {/* Base */}
      <rect x="68" y="136" width="44" height="8" rx="4" fill="#D4A017" opacity="0.15" />
      <rect x="62" y="144" width="56" height="6" rx="3" fill="#D4A017" opacity="0.1" />

      {/* Star on trophy */}
      <path
        d="M90 65 L93 75 L103 75 L95 81 L98 91 L90 85 L82 91 L85 81 L77 75 L87 75 Z"
        fill="#D4A017"
        opacity="0.4"
      />

      {/* Number 1 on trophy */}
      <text x="90" y="108" textAnchor="middle" fill="#D4A017" fontSize="14" fontWeight="bold" opacity="0.35">1</text>

      {/* Confetti / celebration elements */}
      <circle cx="45" cy="35" r="3" fill="#006A4E" opacity="0.3" />
      <circle cx="135" cy="32" r="2.5" fill="#F42A41" opacity="0.35" />
      <circle cx="55" cy="25" r="2" fill="#D4A017" opacity="0.4" />
      <circle cx="125" cy="22" r="2" fill="#006A4E" opacity="0.25" />
      <circle cx="160" cy="65" r="2" fill="#D4A017" opacity="0.3" />
      <circle cx="20" cy="70" r="2.5" fill="#F42A41" opacity="0.2" />

      {/* Small ribbons */}
      <path d="M42 40 L48 48" stroke="#F42A41" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <path d="M130 38 L138 45" stroke="#006A4E" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <path d="M52 30 L50 40" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />

      {/* Shadow */}
      <ellipse cx="90" cy="162" rx="38" ry="4" fill="#D4A017" opacity="0.08" />
    </svg>
  );
}
