/**
 * Scroll-linked "ink fill" for the biography (Figma: about-biography-line-*-reveal).
 * The fill is read from a `--p` (0..1) CSS variable set on an ancestor, so whatever drives the
 * scroll (the About timeline) writes one property and React never re-renders; each word derives
 * its own colour from `--p` in CSS.
 */
export function ScrollRevealText({ paragraphs, className = "" }: { paragraphs: string[]; className?: string }) {
  const words = paragraphs.map((p) => p.split(" "));
  const total = words.reduce((n, w) => n + w.length, 0);
  let index = 0;

  return (
    <div className={className} style={{ "--n": total } as React.CSSProperties}>
      {words.map((paragraph, pi) => (
        <p key={pi}>
          {paragraph.map((word, wi) => {
            const i = index++;
            return (
              <span
                key={wi}
                style={
                  {
                    "--i": i,
                    color:
                      "color-mix(in srgb, var(--color-ink) calc(clamp(0, var(--p, 0) * var(--n) - var(--i), 1) * 100%), var(--color-muted-dark))",
                  } as React.CSSProperties
                }
              >
                {word}
                {wi < paragraph.length - 1 ? " " : ""}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
