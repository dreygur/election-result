export function CandidatePodiumIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background shapes */}
      <circle cx="170" cy="25" r="14" fill="#D4A017" opacity="0.1" />
      <circle cx="25" cy="110" r="10" fill="#F42A41" opacity="0.08" />

      {/* Podium - 1st place (center, tallest) */}
      <rect x="75" y="65" width="50" height="55" rx="4" fill="#006A4E" opacity="0.15" />
      <rect x="75" y="65" width="50" height="55" rx="4" stroke="#006A4E" strokeWidth="1.5" strokeOpacity="0.2" fill="none" />
      <text x="100" y="98" textAnchor="middle" fill="#006A4E" fontSize="18" fontWeight="bold" opacity="0.3">1</text>

      {/* Podium - 2nd place (left) */}
      <rect x="25" y="82" width="50" height="38" rx="4" fill="#F42A41" opacity="0.1" />
      <rect x="25" y="82" width="50" height="38" rx="4" stroke="#F42A41" strokeWidth="1.5" strokeOpacity="0.15" fill="none" />
      <text x="50" y="108" textAnchor="middle" fill="#F42A41" fontSize="16" fontWeight="bold" opacity="0.3">2</text>

      {/* Podium - 3rd place (right) */}
      <rect x="125" y="90" width="50" height="30" rx="4" fill="#D4A017" opacity="0.1" />
      <rect x="125" y="90" width="50" height="30" rx="4" stroke="#D4A017" strokeWidth="1.5" strokeOpacity="0.15" fill="none" />
      <text x="150" y="112" textAnchor="middle" fill="#D4A017" fontSize="14" fontWeight="bold" opacity="0.3">3</text>

      {/* Person silhouettes */}
      {/* 1st place */}
      <circle cx="100" cy="45" r="10" fill="#006A4E" opacity="0.2" />
      <rect x="93" y="55" width="14" height="8" rx="4" fill="#006A4E" opacity="0.15" />

      {/* 2nd place */}
      <circle cx="50" cy="65" r="8" fill="#F42A41" opacity="0.15" />
      <rect x="44" y="73" width="12" height="7" rx="3.5" fill="#F42A41" opacity="0.1" />

      {/* 3rd place */}
      <circle cx="150" cy="72" r="8" fill="#D4A017" opacity="0.15" />
      <rect x="144" y="80" width="12" height="7" rx="3.5" fill="#D4A017" opacity="0.1" />

      {/* Trophy/star above winner */}
      <path
        d="M100 25 L102 31 L108 31 L103 35 L105 41 L100 37 L95 41 L97 35 L92 31 L98 31 Z"
        fill="#D4A017"
        opacity="0.5"
      />

      {/* Confetti dots */}
      <circle cx="65" cy="35" r="2" fill="#F42A41" opacity="0.3" />
      <circle cx="135" cy="40" r="1.5" fill="#006A4E" opacity="0.3" />
      <circle cx="80" cy="28" r="1.5" fill="#D4A017" opacity="0.4" />
      <circle cx="120" cy="30" r="2" fill="#F42A41" opacity="0.25" />
      <circle cx="40" cy="45" r="1.5" fill="#D4A017" opacity="0.3" />
      <circle cx="160" cy="50" r="2" fill="#006A4E" opacity="0.25" />

      {/* Base line */}
      <rect x="20" y="120" width="160" height="3" rx="1.5" fill="#006A4E" opacity="0.08" />

      {/* Shadow */}
      <ellipse cx="100" cy="138" rx="55" ry="4" fill="#006A4E" opacity="0.05" />
    </svg>
  );
}
