export function EmptyBoxIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background shapes */}
      <circle cx="155" cy="20" r="14" fill="#D4A017" opacity="0.1" />
      <circle cx="35" cy="110" r="9" fill="#F42A41" opacity="0.08" />

      {/* Open box - back flap */}
      <path d="M60 55 L100 38 L140 55" stroke="#006A4E" strokeWidth="1.5" opacity="0.3" fill="#006A4E" fillOpacity="0.05" />

      {/* Box body */}
      <rect x="60" y="55" width="80" height="55" rx="3" fill="white" stroke="#006A4E" strokeWidth="2" />

      {/* Box front divider */}
      <line x1="100" y1="55" x2="100" y2="110" stroke="#006A4E" strokeWidth="1" opacity="0.15" />

      {/* Left flap open */}
      <path d="M60 55 L55 42 L100 38" fill="white" stroke="#006A4E" strokeWidth="1.5" />

      {/* Right flap open */}
      <path d="M140 55 L145 42 L100 38" fill="white" stroke="#006A4E" strokeWidth="1.5" />

      {/* Dashed lines inside box = emptiness */}
      <line x1="75" y1="72" x2="125" y2="72" stroke="#006A4E" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.15" />
      <line x1="80" y1="82" x2="120" y2="82" stroke="#006A4E" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.1" />
      <line x1="85" y1="92" x2="115" y2="92" stroke="#006A4E" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.08" />

      {/* Sparkle/question marks floating out */}
      <circle cx="80" cy="32" r="2" fill="#D4A017" opacity="0.4" />
      <circle cx="120" cy="28" r="1.5" fill="#006A4E" opacity="0.3" />
      <circle cx="105" cy="22" r="2.5" fill="#F42A41" opacity="0.2" />

      {/* Shadow */}
      <ellipse cx="100" cy="125" rx="45" ry="4" fill="#006A4E" opacity="0.06" />
    </svg>
  );
}
