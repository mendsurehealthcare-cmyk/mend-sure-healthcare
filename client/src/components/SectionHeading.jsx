/*
  Eyebrow + headline + supporting line. The design uses this above nearly
  every content section — centered on the homepage, left-aligned on list
  sections that carry an action on the right.
*/
export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const centered = align === 'center';

  return (
    <div className={centered ? 'mx-auto mb-space-2xl max-w-2xl text-center' : 'mb-space-2xl'}>
      {eyebrow && (
        <span className="mb-space-xs block text-label-sm font-bold tracking-widest text-secondary uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="mb-space-sm text-headline-lg font-bold text-primary">{title}</h2>
      {subtitle && <p className="text-body-lg text-on-surface-variant">{subtitle}</p>}
    </div>
  );
}
