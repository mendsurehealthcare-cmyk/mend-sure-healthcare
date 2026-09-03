import Icon from './Icon';

/*
  The dark navy banner that opens every inner page in the design system.

  - `eyebrow` + `eyebrowIcon` render the small pill above the headline
  - `aside` is the optional right-hand card (stats strip, search box, ...)
  - `backgroundImage` paints a low-opacity photo behind the whole band
  - children render below the copy, for CTA buttons
*/
export default function PageHero({
  eyebrow,
  eyebrowIcon = 'verified',
  title,
  subtitle,
  backgroundImage,
  backgroundAlt,
  gradient = false,
  aside,
  children,
}) {
  return (
    <section
      className={`relative w-full overflow-hidden px-space-md py-space-3xl text-on-primary sm:px-space-xl ${
        gradient ? 'bg-gradient-to-br from-primary via-primary-container to-secondary' : 'bg-primary'
      }`}
    >
      {backgroundImage && (
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-10"
          role="presentation"
          aria-label={backgroundAlt}
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
      )}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-between gap-space-2xl md:flex-row md:items-end">
        <div className="max-w-2xl">
          {eyebrow && (
            <div className="mb-space-md inline-flex items-center gap-space-xs rounded-full bg-primary-container px-space-md py-space-2xs text-label-sm font-semibold tracking-wide text-on-primary-container uppercase">
              <Icon name={eyebrowIcon} className="!text-[16px]" />
              <span>{eyebrow}</span>
            </div>
          )}
          <h1 className="mb-space-md text-headline-xl tracking-tight text-on-primary">{title}</h1>
          {subtitle && (
            <p className="text-body-lg leading-relaxed text-primary-fixed-dim">{subtitle}</p>
          )}
          {children && <div className="mt-space-lg flex flex-wrap gap-space-md">{children}</div>}
        </div>

        {aside && <div className="w-full md:w-auto md:shrink-0">{aside}</div>}
      </div>
    </section>
  );
}
