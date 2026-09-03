import Icon from './Icon';

/*
  Three stat treatments from the design:
    card   — white tile with an icon box (hospitals page stats banner)
    plain  — number over label, on a light surface
    onDark — number over label, sitting on a navy band
*/
export default function StatBadge({ value, label, icon, tone = 'card' }) {
  if (tone === 'onDark') {
    return (
      <div className="text-center">
        <div className="mb-space-2xs text-headline-xl font-bold text-on-primary">{value}</div>
        <div className="text-body-sm text-primary-fixed-dim">{label}</div>
      </div>
    );
  }

  if (tone === 'plain') {
    return (
      <div>
        <div className="text-headline-lg font-bold text-primary">{value}</div>
        <div className="mt-space-3xs text-body-sm text-on-surface-variant">{label}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-space-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      {icon && (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
          <Icon name={icon} className="!text-[24px]" />
        </div>
      )}
      <div>
        <div className="text-headline-lg font-bold text-primary">{value}</div>
        <div className="text-body-sm text-on-surface-variant">{label}</div>
      </div>
    </div>
  );
}
