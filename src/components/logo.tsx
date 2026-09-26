export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 60"
      fill="none"
      className={className}
      aria-label="Root Campus"
      role="img"
    >
      <g transform="translate(4, 6)">
        <path
          d="M18 37L15 44M24 38V45M30 37L33 43"
          stroke="#164A3A"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path d="M24 6L44 16L24 26L4 16L24 6Z" fill="#164A3A" />
        <path
          d="M12 21V32C12 37 17 38 24 38C31 38 36 37 36 32V21"
          stroke="#164A3A"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M40 18.5V32"
          stroke="#FF7043"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="40" cy="34" r="2.5" fill="#FF7043" />
        <circle cx="15" cy="45" r="2.5" fill="#5FAF72" />
        <circle cx="24" cy="47" r="2.5" fill="#FF7043" />
        <circle cx="33" cy="44" r="2.5" fill="#5FAF72" />
      </g>
      <text
        x="64"
        y="27"
        fontFamily="Sora, sans-serif"
        fontSize="20"
        fontWeight="800"
        fill="#164A3A"
        letterSpacing="-0.5px"
      >
        root
      </text>
      <text
        x="64"
        y="46"
        fontFamily="Sora, sans-serif"
        fontSize="20"
        fontWeight="800"
        fill="#164A3A"
        letterSpacing="-0.5px"
      >
        campus
      </text>
    </svg>
  );
}

export function NodeGraph({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 450 240"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M440 20C360 40 310 110 240 100C170 90 140 180 30 190"
        stroke="#5FAF72"
        strokeDasharray="3 3"
        strokeWidth="1.75"
      />
      <path
        d="M420 180C340 170 290 90 200 130C130 160 80 140 0 160"
        stroke="#5FAF72"
        strokeWidth="1.75"
      />
      <path d="M310 110C350 150 400 140 450 170" stroke="#5FAF72" strokeWidth="1.5" />
      <path d="M240 100C260 40 330 30 380 10" stroke="#5FAF72" strokeWidth="1.5" />
      <circle cx="240" cy="100" fill="#5FAF72" r="5" />
      <circle cx="310" cy="110" fill="#C84B22" r="4.5" />
      <circle cx="200" cy="130" fill="#5FAF72" r="4" />
      <circle cx="140" cy="180" fill="#164A3A" r="3.5" />
      <circle cx="380" cy="10" fill="#5FAF72" r="4" />
      <circle cx="420" cy="180" fill="#5FAF72" r="5" />
      <circle cx="360" cy="155" fill="#C84B22" r="3.5" />
    </svg>
  );
}