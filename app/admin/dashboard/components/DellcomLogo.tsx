export default function DellcomLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="#ff0000" strokeWidth="3" fill="none" opacity="0.85" />
      <circle cx="50" cy="50" r="43" fill="#000000" />
      <path
        d="M 48 20 C 40 20, 36 24, 36 28 C 30 28, 27 33, 29 39 C 24 41, 23 48, 26 53 C 21 57, 21 64, 25 68 C 23 74, 28 80, 35 80 C 38 80, 42 78, 44 76 C 46 78, 48 80, 48 80 Z"
        stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <path
        d="M 48 32 C 40 32, 38 38, 44 42 C 34 46, 38 56, 44 56 C 36 60, 40 70, 48 70"
        stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <line x1="50" y1="18" x2="50" y2="82" stroke="#ff0000" strokeWidth="2.5" strokeDasharray="3 3" />
      <path
        d="M 52 24 L 66 24 L 66 32 M 52 38 L 74 38 L 74 46 M 52 50 L 64 50 L 72 58 M 52 64 L 72 64 M 52 74 L 64 74 L 64 68"
        stroke="#ff0000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <circle cx="66" cy="32" r="3" fill="#ff0000" />
      <circle cx="74" cy="46" r="3" fill="#ff0000" />
      <circle cx="72" cy="58" r="3" fill="#ff0000" />
      <circle cx="72" cy="64" r="3" fill="#ff0000" />
      <circle cx="64" cy="68" r="3" fill="#ff0000" />
    </svg>
  );
}
