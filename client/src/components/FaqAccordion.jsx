import Icon from './Icon';

// The design's FAQ pattern: each question is its own white card wrapping a
// native <details>, with a chevron that flips when the card is open.
export default function FaqAccordion({ items }) {
  return (
    <div className="space-y-space-md">
      {items.map((item) => (
        <div key={item.q} className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-space-md text-headline-sm text-primary">
              <span>{item.q}</span>
              <Icon name="expand_more" className="shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-space-md text-body-md leading-relaxed text-on-surface-variant">{item.a}</p>
          </details>
        </div>
      ))}
    </div>
  );
}
