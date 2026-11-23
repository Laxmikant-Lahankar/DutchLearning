/** Renders English text where *asterisks* mark Dutch words: they get lang="nl-BE" and the Dutch typeface. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="nl-inline" lang="nl-BE">{part}</span>
        ) : (
          part
        ),
      )}
    </>
  );
}
