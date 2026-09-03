import { Link } from 'react-router-dom';
import { priceRange, savingsPercent } from '../lib/format';
import { specialtyIcon } from '../lib/specialtyIcons';
import CardMedia from './CardMedia';
import Icon from './Icon';

export default function TreatmentCard({ treatment }) {
  const savings = savingsPercent(treatment.price_min_usd, treatment.avg_price_usa_usd);

  return (
    <Link
      to={`/treatments/${treatment.slug}`}
      className="group flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-all hover:shadow-xl"
    >
      <div>
        <div className="mb-space-md">
          <CardMedia
            image={treatment.image_url}
            alt={treatment.name}
            label={treatment.specialty}
            icon={specialtyIcon(treatment.specialty)}
          >
            {savings && (
              <div className="absolute top-space-sm left-space-sm rounded-full bg-primary/80 px-space-sm py-space-3xs text-label-sm text-on-primary backdrop-blur-md">
                Save up to {savings}%
              </div>
            )}
          </CardMedia>
        </div>

        <div className="mb-space-xs flex items-center gap-space-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
            <Icon name={specialtyIcon(treatment.specialty)} className="!text-[24px]" />
          </div>
          <div>
            <h3 className="text-headline-sm text-on-surface">{treatment.name}</h3>
            <p className="text-body-sm text-on-surface-variant">{treatment.specialty}</p>
          </div>
        </div>

        <p className="mb-space-md line-clamp-2 text-body-md text-on-surface-variant">
          {treatment.description}
        </p>

        <div className="mb-space-lg space-y-space-xs rounded-lg bg-surface-container-low p-space-md">
          <div className="flex items-center justify-between text-body-sm">
            <span className="font-medium text-on-surface-variant">In India:</span>
            <span className="font-semibold text-on-surface">
              {priceRange(treatment.price_min_usd, treatment.price_max_usd)}
            </span>
          </div>
          {treatment.avg_price_usa_usd && (
            <div className="flex items-center justify-between text-body-sm">
              <span className="font-medium text-on-surface-variant">Average in the USA:</span>
              <span className="text-on-surface-variant line-through">
                ${Number(treatment.avg_price_usa_usd).toLocaleString('en-US')}
              </span>
            </div>
          )}
        </div>
      </div>

      <span className="flex w-full items-center justify-center gap-space-xs rounded-lg bg-secondary px-space-md py-space-sm text-label-md text-on-secondary shadow-sm transition-colors group-hover:bg-secondary-fixed-dim group-hover:text-on-secondary-fixed">
        View Treatment &amp; Pricing
        <Icon name="arrow_forward" className="!text-[18px]" />
      </span>
    </Link>
  );
}
