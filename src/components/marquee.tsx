const DEFAULT_ITEMS = [
  "Contrats",
  "Analyse de risques",
  "Mises en demeure",
  "Clauses sur mesure",
  "Droit français",
  "Code civil référencé",
  "Confidentialité absolue",
  "Hébergement européen",
];

export default function Marquee({
  items = DEFAULT_ITEMS,
}: {
  items?: string[];
}) {
  // Render the list twice so the loop is seamless when translateX(-50%) loops.
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden whitespace-nowrap border-y border-ink bg-ink py-4">
      <div className="marquee-track">
        {loop.map((item, i) => (
          <span
            key={i}
            className="px-12 font-sans text-xs font-bold uppercase tracking-[0.18em] text-creme/70"
          >
            <span className="mr-3 text-accent">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
