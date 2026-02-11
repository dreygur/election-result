export function MapDotsIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Bangladesh map silhouette (simplified) */}
      <path
        d="M90 20 C95 18 105 22 110 20 C118 18 125 25 128 30 C133 35 140 38 142 45 C145 52 148 58 145 65 C143 70 148 78 150 85 C152 92 148 100 145 108 C142 115 138 122 132 128 C126 134 118 138 110 140 C102 142 95 148 88 150 C80 152 72 148 65 145 C58 142 52 135 48 128 C44 120 40 112 42 105 C44 98 42 90 45 82 C48 75 45 68 48 60 C50 52 55 45 60 38 C65 32 72 28 78 24 C82 22 86 21 90 20Z"
        fill="#006A4E"
        fillOpacity="0.06"
        stroke="#006A4E"
        strokeWidth="1.5"
        strokeOpacity="0.15"
      />

      {/* Constituency dots scattered across the map shape */}
      <circle cx="85" cy="40" r="2.5" fill="#006A4E" opacity="0.5" />
      <circle cx="100" cy="35" r="2" fill="#F42A41" opacity="0.5" />
      <circle cx="115" cy="42" r="2.5" fill="#006A4E" opacity="0.4" />
      <circle cx="75" cy="55" r="2" fill="#D4A017" opacity="0.5" />
      <circle cx="95" cy="52" r="3" fill="#F42A41" opacity="0.35" />
      <circle cx="110" cy="55" r="2" fill="#006A4E" opacity="0.5" />
      <circle cx="130" cy="50" r="2.5" fill="#D4A017" opacity="0.4" />
      <circle cx="60" cy="70" r="2" fill="#006A4E" opacity="0.4" />
      <circle cx="80" cy="68" r="2.5" fill="#F42A41" opacity="0.4" />
      <circle cx="100" cy="70" r="3" fill="#006A4E" opacity="0.5" />
      <circle cx="120" cy="65" r="2" fill="#D4A017" opacity="0.5" />
      <circle cx="135" cy="72" r="2.5" fill="#006A4E" opacity="0.35" />
      <circle cx="55" cy="88" r="2" fill="#D4A017" opacity="0.4" />
      <circle cx="75" cy="85" r="2.5" fill="#006A4E" opacity="0.5" />
      <circle cx="95" cy="88" r="2" fill="#F42A41" opacity="0.45" />
      <circle cx="115" cy="82" r="3" fill="#006A4E" opacity="0.4" />
      <circle cx="140" cy="88" r="2" fill="#F42A41" opacity="0.35" />
      <circle cx="65" cy="105" r="2.5" fill="#006A4E" opacity="0.4" />
      <circle cx="85" cy="100" r="2" fill="#D4A017" opacity="0.5" />
      <circle cx="105" cy="105" r="2.5" fill="#006A4E" opacity="0.5" />
      <circle cx="125" cy="100" r="2" fill="#F42A41" opacity="0.4" />
      <circle cx="80" cy="118" r="2" fill="#F42A41" opacity="0.4" />
      <circle cx="100" cy="122" r="2.5" fill="#006A4E" opacity="0.45" />
      <circle cx="118" cy="115" r="2" fill="#D4A017" opacity="0.4" />
      <circle cx="90" cy="135" r="2.5" fill="#006A4E" opacity="0.35" />
      <circle cx="105" cy="138" r="2" fill="#F42A41" opacity="0.35" />

      {/* Connecting lines (subtle network) */}
      <g stroke="#006A4E" strokeWidth="0.5" opacity="0.08">
        <line x1="85" y1="40" x2="100" y2="35" />
        <line x1="100" y1="35" x2="115" y2="42" />
        <line x1="95" y1="52" x2="110" y2="55" />
        <line x1="80" y1="68" x2="100" y2="70" />
        <line x1="100" y1="70" x2="120" y2="65" />
        <line x1="75" y1="85" x2="95" y2="88" />
        <line x1="95" y1="88" x2="115" y2="82" />
        <line x1="85" y1="100" x2="105" y2="105" />
        <line x1="100" y1="122" x2="118" y2="115" />
      </g>

      {/* Flag accent */}
      <circle cx="165" cy="25" r="12" fill="#F42A41" opacity="0.08" />
      <circle cx="30" cy="145" r="8" fill="#D4A017" opacity="0.1" />
    </svg>
  );
}
