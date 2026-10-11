// Drawn arrows: iOS renders text arrows such as ↗ as colour emoji.
const paths = {
  "up-right": "M4.5 11.5 11.5 4.5M5.5 4.5h6v6",
  right: "M3 8h10M9 4l4 4-4 4",
  left: "M13 8H3M7 4 3 8l4 4",
  down: "M8 3v10M4 9l4 4 4-4",
} as const;

export function Arrow({ direction = "up-right", className = "" }: {
  direction?: keyof typeof paths;
  className?: string;
}) {
  return (
    <svg aria-hidden="true" className={`arrow-icon ${className}`.trim()} fill="none" focusable="false"
      stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} viewBox="0 0 16 16">
      <path d={paths[direction]} />
    </svg>
  );
}
