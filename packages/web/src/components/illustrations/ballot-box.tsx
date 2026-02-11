export function BallotBoxIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Decorative circles */}
      <circle cx="160" cy="40" r="24" fill="#F42A41" opacity="0.1" />
      <circle cx="40" cy="160" r="16" fill="#D4A017" opacity="0.15" />
      <circle cx="170" cy="150" r="10" fill="#006A4E" opacity="0.12" />

      {/* Ballot box body */}
      <rect x="50" y="80" width="100" height="80" rx="8" fill="#006A4E" />
      <rect x="50" y="80" width="100" height="80" rx="8" fill="url(#boxGrad)" />

      {/* Slot */}
      <rect x="80" y="82" width="40" height="6" rx="3" fill="#004D38" />

      {/* Lid */}
      <path
        d="M44 80 C44 72 52 66 60 66 L140 66 C148 66 156 72 156 80 L150 80 L50 80 Z"
        fill="#005A42"
      />

      {/* Ballot paper going in */}
      <g>
        <rect x="85" y="30" width="30" height="44" rx="3" fill="white" />
        <rect x="85" y="30" width="30" height="44" rx="3" stroke="#006A4E" strokeWidth="1.5" fill="white" />
        {/* Checkmark on ballot */}
        <path d="M93 50 L98 56 L108 44" stroke="#F42A41" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Lines on ballot */}
        <line x1="91" y1="62" x2="109" y2="62" stroke="#006A4E" strokeWidth="1" opacity="0.3" />
        <line x1="91" y1="66" x2="105" y2="66" stroke="#006A4E" strokeWidth="1" opacity="0.3" />
      </g>

      {/* Small stars */}
      <circle cx="60" cy="45" r="3" fill="#D4A017" opacity="0.6" />
      <circle cx="145" cy="55" r="2" fill="#D4A017" opacity="0.4" />
      <circle cx="42" cy="100" r="2.5" fill="#F42A41" opacity="0.3" />

      {/* Shadow */}
      <ellipse cx="100" cy="168" rx="52" ry="6" fill="#006A4E" opacity="0.08" />

      <defs>
        <linearGradient id="boxGrad" x1="50" y1="80" x2="150" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.1" />
          <stop offset="1" stopColor="black" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
