export function PersonCardIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background accents */}
      <circle cx="155" cy="20" r="14" fill="#D4A017" opacity="0.08" />
      <circle cx="20" cy="120" r="10" fill="#F42A41" opacity="0.06" />

      {/* ID Card body */}
      <rect x="30" y="30" width="120" height="90" rx="8" fill="white" stroke="#006A4E" strokeWidth="1.5" strokeOpacity="0.2" />

      {/* Green header stripe on card */}
      <rect x="30" y="30" width="120" height="20" rx="8" fill="#006A4E" opacity="0.12" />
      <rect x="30" y="42" width="120" height="8" fill="#006A4E" opacity="0.12" />

      {/* Flag badge on header */}
      <rect x="40" y="34" width="14" height="9" rx="1.5" fill="#006A4E" opacity="0.4" />
      <circle cx="46" cy="38.5" r="2.5" fill="#F42A41" opacity="0.5" />

      {/* Title text placeholder */}
      <rect x="60" y="36" width="50" height="4" rx="2" fill="white" opacity="0.5" />

      {/* Photo placeholder */}
      <rect x="40" y="58" width="32" height="40" rx="4" fill="#006A4E" fillOpacity="0.06" stroke="#006A4E" strokeWidth="1" strokeOpacity="0.12" />
      {/* Person silhouette */}
      <circle cx="56" cy="70" r="8" fill="#006A4E" opacity="0.12" />
      <path d="M44 92 Q44 82 56 82 Q68 82 68 92" fill="#006A4E" opacity="0.08" />

      {/* Info lines */}
      <rect x="82" y="60" width="56" height="4" rx="2" fill="#006A4E" opacity="0.15" />
      <rect x="82" y="70" width="42" height="3" rx="1.5" fill="#006A4E" opacity="0.1" />
      <rect x="82" y="80" width="48" height="3" rx="1.5" fill="#006A4E" opacity="0.1" />

      {/* Vote/check symbol */}
      <circle cx="130" cy="98" r="8" fill="#006A4E" opacity="0.08" />
      <path d="M125 98 L128 101 L135 94" stroke="#006A4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" fill="none" />

      {/* Party symbol badge */}
      <rect x="82" y="90" width="30" height="12" rx="6" fill="#D4A017" opacity="0.12" />
      <rect x="86" y="94" width="22" height="4" rx="2" fill="#D4A017" opacity="0.15" />

      {/* Decorative elements around card */}
      <circle cx="25" cy="55" r="2" fill="#D4A017" opacity="0.4" />
      <circle cx="165" cy="80" r="2.5" fill="#F42A41" opacity="0.25" />
      <circle cx="155" cy="50" r="2" fill="#006A4E" opacity="0.3" />

      {/* Small medal/ribbon */}
      <circle cx="30" cy="90" r="5" fill="#D4A017" opacity="0.15" stroke="#D4A017" strokeWidth="1" strokeOpacity="0.2" />
      <path d="M27 95 L25 105" stroke="#F42A41" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      <path d="M33 95 L35 105" stroke="#006A4E" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />

      {/* Shadow */}
      <ellipse cx="90" cy="140" rx="50" ry="4" fill="#006A4E" opacity="0.05" />
    </svg>
  );
}
