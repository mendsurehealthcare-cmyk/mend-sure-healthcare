import Icon from './Icon';

/*
  Card image area. Most seeded records have no `image_url` yet, so this falls
  back to a tinted panel carrying the record's icon and label rather than a
  broken image. `children` renders over the top for badges.
*/
export default function CardMedia({
  image,
  alt,
  label,
  icon = 'medical_services',
  className = 'h-48',
  children,
}) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {image ? (
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${image}')` }}
          role="img"
          aria-label={alt || label}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-space-xs bg-primary-fixed text-primary">
          <Icon name={icon} className="!text-[32px]" />
          {label && <span className="px-space-md text-center text-label-sm">{label}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
